import { Contract } from '../models';

export type ContractData = Contract;

const STORAGE_KEY = 'ishopcare_contract_data';

export const contractSession = {
  save: (data: Partial<ContractData>) => {
    try {
      // 입력 항목의 공백 제거
      const deepTrim = (obj: any): any => {
        if (typeof obj === 'string') return obj.trim();
        if (Array.isArray(obj)) return obj.map(deepTrim);
        if (typeof obj === 'object' && obj !== null) {
          return Object.keys(obj).reduce((acc, key) => {
            acc[key] = deepTrim(obj[key]);
            return acc;
          }, {} as any);
        }
        return obj;
      };

      const trimmedData = deepTrim(data);
      const current = contractSession.load();
      const updated = { ...current, ...trimmedData };
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
