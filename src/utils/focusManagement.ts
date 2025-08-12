/**
 * Focus Management Utilities
 * Provides utilities for managing focus states and keyboard navigation
 */

/**
 * Focus trap for modal dialogs and overlays
 */
export class FocusTrap {
  private element: HTMLElement
  private focusableElements: HTMLElement[]
  private firstFocusableElement: HTMLElement | null = null
  private lastFocusableElement: HTMLElement | null = null
  private previousActiveElement: Element | null = null

  constructor(element: HTMLElement) {
    this.element = element
    this.focusableElements = []
    this.updateFocusableElements()
  }

  /**
   * Get all focusable elements within the container
   */
  private updateFocusableElements(): void {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    this.focusableElements = Array.from(
      this.element.querySelectorAll(focusableSelectors)
    ).filter((el) => {
      const element = el as HTMLElement
      return (
        element.offsetWidth > 0 &&
        element.offsetHeight > 0 &&
        !element.hidden &&
        window.getComputedStyle(element).visibility !== 'hidden'
      )
    }) as HTMLElement[]

    this.firstFocusableElement = this.focusableElements[0] || null
    this.lastFocusableElement = 
      this.focusableElements[this.focusableElements.length - 1] || null
  }

  /**
   * Activate the focus trap
   */
  activate(): void {
    this.previousActiveElement = document.activeElement
    this.updateFocusableElements()
    
    // Focus the first focusable element
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus()
    }

    // Add event listener for tab key
    this.element.addEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Deactivate the focus trap
   */
  deactivate(): void {
    this.element.removeEventListener('keydown', this.handleKeyDown)
    
    // Restore focus to the previously active element
    if (this.previousActiveElement && 'focus' in this.previousActiveElement) {
      (this.previousActiveElement as HTMLElement).focus()
    }
  }

  /**
   * Handle keydown events for focus trapping
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return

    this.updateFocusableElements()

    if (this.focusableElements.length === 0) {
      event.preventDefault()
      return
    }

    if (this.focusableElements.length === 1) {
      event.preventDefault()
      this.focusableElements[0].focus()
      return
    }

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (document.activeElement === this.firstFocusableElement) {
        event.preventDefault()
        this.lastFocusableElement?.focus()
      }
    } else {
      // Tab (forward)
      if (document.activeElement === this.lastFocusableElement) {
        event.preventDefault()
        this.firstFocusableElement?.focus()
      }
    }
  }
}

/**
 * Skip link functionality
 */
export const skipLinks = {
  /**
   * Create a skip link element
   */
  create: (target: string, text: string): HTMLAnchorElement => {
    const skipLink = document.createElement('a')
    skipLink.href = `#${target}`
    skipLink.textContent = text
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-professional-black focus:text-pure-white focus:px-4 focus:py-2 focus:rounded-md focus:m-2'
    
    skipLink.addEventListener('click', (e) => {
      e.preventDefault()
      const targetElement = document.getElementById(target)
      if (targetElement) {
        targetElement.focus()
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    })

    return skipLink
  },

  /**
   * Add skip links to the page
   */
  addToPage: (links: Array<{ target: string; text: string }>): void => {
    const container = document.createElement('div')
    container.className = 'skip-links'
    
    links.forEach(({ target, text }) => {
      const skipLink = skipLinks.create(target, text)
      container.appendChild(skipLink)
    })

    document.body.insertBefore(container, document.body.firstChild)
  }
}

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Set focus to an element by ID with error handling
   */
  setFocus: (elementId: string, options?: { preventScroll?: boolean }): boolean => {
    try {
      const element = document.getElementById(elementId)
      if (element) {
        // Check if element is focusable and visible
        const isVisible = element.offsetWidth > 0 && 
                         element.offsetHeight > 0 && 
                         !element.hidden &&
                         window.getComputedStyle(element).visibility !== 'hidden'
        
        if (isVisible) {
          element.focus(options)
          return true
        }
      }
    } catch (error) {
      // Silently handle focus errors
      console.debug(`Focus management: Unable to focus element "${elementId}"`, error)
    }
    
    // Only log warning for main-content as it's expected to exist
    if (elementId === 'main-content') {
      console.debug(`Focus target element with ID "${elementId}" not found or not focusable`)
    }
    
    return false
  },

  /**
   * Set focus to the first focusable element within a container
   */
  setFocusToFirst: (container: HTMLElement): boolean => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')

    const firstFocusable = container.querySelector(focusableSelectors) as HTMLElement
    if (firstFocusable) {
      firstFocusable.focus()
      return true
    }
    return false
  },

  /**
   * Check if an element is focusable
   */
  isFocusable: (element: HTMLElement): boolean => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ]

    return focusableSelectors.some(selector => element.matches(selector)) &&
           element.offsetWidth > 0 &&
           element.offsetHeight > 0 &&
           !element.hidden &&
           window.getComputedStyle(element).visibility !== 'hidden'
  },

  /**
   * Get all focusable elements within a container
   */
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter((el) => focusUtils.isFocusable(el as HTMLElement)) as HTMLElement[]
  },

  /**
   * Create a roving tabindex system for a group of elements
   */
  createRovingTabindex: (elements: HTMLElement[], initialIndex = 0): {
    setActive: (index: number) => void
    handleKeyDown: (event: KeyboardEvent) => void
    destroy: () => void
  } => {
    let activeIndex = initialIndex

    const setActive = (index: number) => {
      if (index < 0 || index >= elements.length) return
      
      elements.forEach((el, i) => {
        el.tabIndex = i === index ? 0 : -1
      })
      activeIndex = index
      elements[index].focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      let newIndex = activeIndex

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault()
          newIndex = (activeIndex + 1) % elements.length
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault()
          newIndex = activeIndex === 0 ? elements.length - 1 : activeIndex - 1
          break
        case 'Home':
          event.preventDefault()
          newIndex = 0
          break
        case 'End':
          event.preventDefault()
          newIndex = elements.length - 1
          break
        default:
          return
      }

      setActive(newIndex)
    }

    const destroy = () => {
      elements.forEach(el => {
        el.removeEventListener('keydown', handleKeyDown)
      })
    }

    // Initialize
    setActive(initialIndex)
    elements.forEach(el => {
      el.addEventListener('keydown', handleKeyDown)
    })

    return { setActive, handleKeyDown, destroy }
  }
}

/**
 * Keyboard navigation helpers
 */
export const keyboardNavigation = {
  /**
   * Handle escape key to close modals/overlays
   */
  handleEscape: (callback: () => void) => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  },

  /**
   * Handle arrow key navigation for lists/grids
   */
  handleArrowKeys: (
    elements: HTMLElement[],
    options: {
      orientation?: 'horizontal' | 'vertical' | 'both'
      wrap?: boolean
      columns?: number
    } = {}
  ) => {
    const { orientation = 'both', wrap = true, columns = 1 } = options

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentIndex = elements.findIndex(el => el === document.activeElement)
      if (currentIndex === -1) return

      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            event.preventDefault()
            newIndex = wrap 
              ? (currentIndex + 1) % elements.length
              : Math.min(currentIndex + 1, elements.length - 1)
          }
          break
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            event.preventDefault()
            newIndex = wrap
              ? currentIndex === 0 ? elements.length - 1 : currentIndex - 1
              : Math.max(currentIndex - 1, 0)
          }
          break
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            event.preventDefault()
            if (columns > 1) {
              newIndex = Math.min(currentIndex + columns, elements.length - 1)
            } else {
              newIndex = wrap
                ? (currentIndex + 1) % elements.length
                : Math.min(currentIndex + 1, elements.length - 1)
            }
          }
          break
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            event.preventDefault()
            if (columns > 1) {
              newIndex = Math.max(currentIndex - columns, 0)
            } else {
              newIndex = wrap
                ? currentIndex === 0 ? elements.length - 1 : currentIndex - 1
                : Math.max(currentIndex - 1, 0)
            }
          }
          break
        case 'Home':
          event.preventDefault()
          newIndex = 0
          break
        case 'End':
          event.preventDefault()
          newIndex = elements.length - 1
          break
        default:
          return
      }

      if (newIndex !== currentIndex && elements[newIndex]) {
        elements[newIndex].focus()
      }
    }

    elements.forEach(el => {
      el.addEventListener('keydown', handleKeyDown)
    })

    return () => {
      elements.forEach(el => {
        el.removeEventListener('keydown', handleKeyDown)
      })
    }
  }
}
