import { Contract } from '../models';

export function isContract(data: Partial<Contract>): data is Contract {
  return (
    !!data.basic &&
    typeof data.basic.name === 'string' &&
    typeof data.basic.phone === 'string' &&
    typeof data.basic.email === 'string' &&
    !!data.merchant &&
    typeof data.merchant.name === 'string' &&
    typeof data.merchant.businessNumber === 'string' &&
    !!data.merchant.address &&
    typeof data.merchant.address.street === 'string' &&
    typeof data.merchant.address.city === 'string' &&
    typeof data.merchant.address.state === 'string' &&
    typeof data.merchant.address.zipcode === 'string' &&
    typeof data.businessCategory === 'string'
  );
}
