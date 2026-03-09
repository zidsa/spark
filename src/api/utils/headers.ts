import type { ZidderHeaders } from '~/api/types/headers';

//
//

export const zidderGetHeaders = (headers?: ZidderHeaders) => {
  const data: Record<string, string | undefined> = {};

  if (!headers || !Object.keys(headers).length) return data;

  for (const [key, value] of Object.entries(headers)) {
    const mappedKey = mappedHeaders[key as keyof ZidderHeaders];

    if (!mappedKey) continue; // unknown header

    if (!value) {
      data[mappedKey] = undefined;
      continue;
    } // remove header

    if (key === 'authorizationToken') {
      data[mappedKey] = `Bearer ${value}`;
    } else if (key === 'role') {
      data[mappedKey] = mappedRoles?.[value] || undefined;
    } else {
      data[mappedKey] = value;
    }
  }

  return data;
};

//
//

const mappedHeaders = {
  authorizationToken: 'authorization',
  managerToken: 'x-manager-token',
  customerToken: 'x-customer-token',
  officerToken: 'x-officer-token',
  cartToken: 'cart-session-id',
  storeId: 'store-id',
  currency: 'currency',
  acceptLanguage: 'accept-language',
  customerIp: 'customer-ip',
  customerIpCountry: 'customer-ip-country',
  merchantIp: 'merchant-ip',
  merchantIpCountry: 'merchant-ip-country',
  requestId: 'x-request-id',
  role: 'role',
};

const mappedRoles: Record<string, string> = {
  manager: 'Manager',
  customer: 'Customer',
};
