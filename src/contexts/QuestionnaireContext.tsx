import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { WizardStep, AssetType, TradingExperience, FeePreference, TradingFrequency, DepositAmount } from '@/types/wizard'
import type { UserPreferences } from '@/types/wizard'
import type { Broker } from '@/types/brokerTypes'
import { BrokerFilterService } from '@/services/BrokerFilterService'

// Action types for the questionnaire reducer
type QuestionnaireAction =
  | { type: 'SET_STEP'; payload: WizardStep }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SET_FILTERED_BROKERS'; payload: Broker[] }
  | { type: 'SET_BROKER_DATA'; payload: Broker[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_QUESTIONNAIRE' }
  | { type: 'RESTORE_SESSION'; payload: QuestionnaireState }

// State interface for the questionnaire
interface QuestionnaireState {
  currentStep: WizardStep
  userPreferences: UserPreferences
  filteredBrokers: Broker[]
  allBrokers: Broker[]
  isLoading: boolean
  error: string | null
  isCompleted: boolean
  sessionId: string
}

// Context interface
interface QuestionnaireContextType {
  state: QuestionnaireState
  dispatch: React.Dispatch<QuestionnaireAction>
  // Helper functions
  nextStep: () => void
  previousStep: () => void
  updatePreferences: (updates: Partial<UserPreferences>) => void
  setBrokerData: (brokers: Broker[]) => void
  resetQuestionnaire: () => void
  saveSession: () => void
  restoreSession: () => boolean
}

// Initial state
const initialState: QuestionnaireState = {
  currentStep: WizardStep.COUNTRY,
  userPreferences: {
    country: '',
    assets: [],
    experience: '',
    feePreference: '',
    frequency: '',
    depositAmount: ''
  },
  filteredBrokers: [],
  allBrokers: [],
  isLoading: false,
  error: null,
  isCompleted: false,
  sessionId: `questionnaire_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Reducer function
function questionnaireReducer(state: QuestionnaireState, action: QuestionnaireAction): QuestionnaireState {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
        isCompleted: action.payload === WizardStep.RESULTS
      }
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          ...action.payload
        }
      }
    case 'SET_FILTERED_BROKERS':
      return {
        ...state,
        filteredBrokers: action.payload,
        isLoading: false
      }
    case 'SET_BROKER_DATA':
      return {
        ...state,
        allBrokers: action.payload
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case 'RESET_QUESTIONNAIRE':
      return {
        ...initialState,
        sessionId: `questionnaire_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    case 'RESTORE_SESSION':
      return {
        ...action.payload,
        sessionId: state.sessionId // Keep current session ID
      }
    default:
      return state
  }
}

// Create context
const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined)

// Session storage utilities
const SESSION_STORAGE_KEY = 'broker_questionnaire_session'
const SESSION_EXPIRY_HOURS = 24

interface StoredSession {
  state: QuestionnaireState
  timestamp: number
  expiryTime: number
}

function saveToSessionStorage(state: QuestionnaireState): void {
  try {
    const now = Date.now()
    const expiryTime = now + (SESSION_EXPIRY_HOURS * 60 * 60 * 1000)
    
    const sessionData: StoredSession = {
      state,
      timestamp: now,
      expiryTime
    }
    
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData))
  } catch (error) {
    console.warn('Failed to save questionnaire session:', error)
  }
}

function loadFromSessionStorage(): QuestionnaireState | null {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!stored) return null
    
    const sessionData: StoredSession = JSON.parse(stored)
    const now = Date.now()
    
    // Check if session has expired
    if (now > sessionData.expiryTime) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
      return null
    }
    
    return sessionData.state
  } catch (error) {
    console.warn('Failed to load questionnaire session:', error)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

function clearSessionStorage(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear questionnaire session:', error)
  }
}

// Provider component
interface QuestionnaireProviderProps {
  children: ReactNode
}

export function QuestionnaireProvider({ children }: QuestionnaireProviderProps) {
  const [state, dispatch] = useReducer(questionnaireReducer, initialState)
  const filterService = BrokerFilterService.getInstance()

  // Load state from session storage on mount
  useEffect(() => {
    const savedState = loadFromSessionStorage()
    if (savedState) {
      dispatch({ type: 'RESTORE_SESSION', payload: savedState })
    }
  }, [])

  // Auto-save session on state changes
  useEffect(() => {
    if (state.currentStep !== WizardStep.COUNTRY || Object.values(state.userPreferences).some(val => val && val.length > 0)) {
      saveToSessionStorage(state)
    }
  }, [state])

  // Initialize broker data in filter service when allBrokers changes
  useEffect(() => {
    if (state.allBrokers.length > 0) {
      filterService.setBrokers(state.allBrokers)
    }
  }, [state.allBrokers, filterService])

  // Real-time broker filtering when preferences change
  useEffect(() => {
    if (state.userPreferences.country || state.userPreferences.assets.length > 0) {
      filterService.filterBrokers(state.userPreferences, (filteredBrokers) => {
        dispatch({ type: 'SET_FILTERED_BROKERS', payload: filteredBrokers })
      })
    }
  }, [state.userPreferences, filterService])

  // Helper functions
  const nextStep = () => {
    const totalSteps = 6 // DEPOSIT is step 6, RESULTS is step 7
    if (state.currentStep < totalSteps) {
      dispatch({ type: 'SET_STEP', payload: (state.currentStep + 1) as WizardStep })
    } else if (state.currentStep === totalSteps) {
      dispatch({ type: 'SET_STEP', payload: WizardStep.RESULTS })
    }
  }

  const previousStep = () => {
    if (state.currentStep > WizardStep.COUNTRY) {
      dispatch({ type: 'SET_STEP', payload: (state.currentStep - 1) as WizardStep })
    }
  }

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: updates })
  }

  const setBrokerData = (brokers: Broker[]) => {
    dispatch({ type: 'SET_BROKER_DATA', payload: brokers })
  }

  const resetQuestionnaire = () => {
    dispatch({ type: 'RESET_QUESTIONNAIRE' })
    clearSessionStorage()
  }

  const saveSession = () => {
    saveToSessionStorage(state)
  }

  const restoreSession = (): boolean => {
    const savedState = loadFromSessionStorage()
    if (savedState) {
      dispatch({ type: 'RESTORE_SESSION', payload: savedState })
      return true
    }
    return false
  }

  const contextValue: QuestionnaireContextType = {
    state,
    dispatch,
    nextStep,
    previousStep,
    updatePreferences,
    setBrokerData,
    resetQuestionnaire,
    saveSession,
    restoreSession
  }

  return (
    <QuestionnaireContext.Provider value={contextValue}>
      {children}
    </QuestionnaireContext.Provider>
  )
}

// Custom hook to use the questionnaire context
export function useQuestionnaire(): QuestionnaireContextType {
  const context = useContext(QuestionnaireContext)
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider')
  }
  return context
}

// Export types for external use
export type { QuestionnaireState, QuestionnaireAction, QuestionnaireContextType }