import { HTTPError } from 'ky';
import type { KyRequest, KyResponse, Options } from 'ky';

import { parseErrors } from '~/zidderjs/utils/interceptors';

//
// Token Helpers
//
export const getToken = () => window?.localStorage?.getItem('_t');

export const saveToken = (token: string) => window?.localStorage?.setItem('_t', token);

export const removeToken = () => window?.localStorage?.removeItem('_t');

//

//
// AUTH TOKEN INTERCEPTOR
//
export const authTokenInterceptor = (req: KyRequest) => {
  if (!req?.url) return;

  try {
    const url = new URL(req.url);
    if (!url?.pathname || guestEndpoints.includes(url.pathname)) return;

    const token = getToken();
    const storeId = window?.localStorage?.getItem('storeId');
    const acceptLanguage = window?.localStorage?.getItem('acceptLanguage');

    if (token) {
      req.headers.set('x-manager-token', token);
    }

    if (storeId) {
      req.headers.set('role', 'Manager');
      req.headers.set('store-id', storeId);
    }

    if (acceptLanguage) {
      req.headers.set('accept-language', acceptLanguage);
    }
  } catch {
    // Silently handle interceptor errors
  }
};

//
// RESPONSE HANDLER
//
export const authTokenResponseHandler = async (
  _req: KyRequest,
  _options: Options,
  res: KyResponse,
) => {
  try {
    const url = new URL(res?.url);

    if (!loginEndpoints.includes(url?.pathname)) return res;

    const result = (await res.clone().json()) as { user?: { access_token?: string } };

    if (result?.user?.access_token) {
      saveToken(result.user.access_token);
    }
  } catch {
    // Silently handle response handler errors
  }

  return res;
};

//
// ERROR HANDLER
//
export const errorHandler = (error: HTTPError) => {
  if (error?.response?.status === 401) {
    removeToken();
    window.location.reload();
  }

  return error;
};

export const parseErrorHandler = (error: HTTPError) => {
  throw parseErrors(error);
};

//
//

const guestEndpoints = ['/v1/managers/login'];

const loginEndpoints = [
  '/v1/managers/login',
  '/v1/managers/otp-auth/register',
  '/v1/managers/otp-auth/login',
  '/v1/managers/social-login',
  '/v1/managers/registration/social-register',
  '/v1/managers/user-impersonations/login-by-token',
];
