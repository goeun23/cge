import { http } from './client';
import { Address, BusinessCategory, Contract, ValidateMerchantRequest } from '../models';

export const searchAddresses = async (keyword: string): Promise<Address[]> => {
  return await http.get(`/api/addresses?search=${keyword}`);
};

export const validateMerchant = async (data: ValidateMerchantRequest) => {
  return await http.post('/api/merchants/validation', { json: data });
};

export const createContract = async (data: Contract) => {
  return await http.post('/api/contracts', { json: data });
};

export const getBusinessCategories = async (): Promise<BusinessCategory[]> => {
  return await http.get('/api/business-categories');
};

export { type ValidateMerchantRequest, type BusinessCategory };
