import { http } from './client';
import { Address, ValidateMerchantRequest } from '../models';

export const searchAddresses = async (keyword: string): Promise<Address[]> => {
  return await http.get(`/api/addresses?search=${keyword}`);
};

export const validateMerchant = async (data: ValidateMerchantRequest) => {
  return await http.post('/api/merchants/validation', { json: data });
};

export { type ValidateMerchantRequest };
