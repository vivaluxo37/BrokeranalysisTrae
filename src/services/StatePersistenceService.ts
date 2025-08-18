export interface PersistableState {
  [key: string]: any;
}

export class StatePersistenceService {
  private prefix = 'broker_analysis_';

  async saveState(key: string, state: PersistableState): Promise<void> {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(`${this.prefix}${key}`, serialized);
    } catch (error) {
      console.error('Failed to save state:', error);
      throw error;
    }
  }

  async loadState(key: string): Promise<PersistableState | null> {
    try {
      const serialized = localStorage.getItem(`${this.prefix}${key}`);
      if (!serialized) return null;
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load state:', error);
      return null;
    }
  }

  async clearState(key: string): Promise<void> {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.error('Failed to clear state:', error);
      throw error;
    }
  }

  async clearAllState(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.prefix)
      );
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear all state:', error);
      throw error;
    }
  }
}

export const statePersistenceService = new StatePersistenceService();
