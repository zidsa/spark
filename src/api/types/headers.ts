export type ZidderHeaders = {
  authorizationToken?: string | undefined;
  managerToken?: string | undefined;
  customerToken?: string | undefined;
  officerToken?: string | undefined;
  cartToken?: string | undefined;
  storeId?: string | undefined;
  currency?: string | undefined;
  acceptLanguage?: string | undefined;
  customerIp?: string | undefined;
  customerIpCountry?: string | undefined;
  merchantIp?: string | undefined;
  merchantIpCountry?: string | undefined;
  requestId?: string | undefined;
  role?: 'manager' | 'customer' | undefined;
};
