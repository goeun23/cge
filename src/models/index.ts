export interface Address {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  details?: string;
}

export interface BusinessCategory {
  name: string;
  value: string;
}

export interface BasicInfo {
  name: string;
  phone: string;
  email: string;
}

export interface MerchantContractInfo {
  name: string;
  businessNumber: string;
  address: Address;
}

export interface Contract {
  basic: BasicInfo;
  merchant: MerchantContractInfo;
  businessCategory: string;
}

export interface ValidateMerchantRequest {
  name: string;
  businessNumber: string;
  address: Address;
}
