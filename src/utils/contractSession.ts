import { Contract } from '../models';

export type ContractData = Contract;

const STORAGE_KEY = 'ishopcare_contract_data';

export const contractSession = {
  save: (data: Partial<ContractData>) => {
    try {
      const current = contractSession.load();
      const updated = { ...current, ...data };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Session save failed', e);
    }
  },

  load: (): Partial<ContractData> => {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  clear: () => {
    sessionStorage.removeItem(STORAGE_KEY);
  },
};
