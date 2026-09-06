import { isHTTPError } from 'ky';
import type { AfterResponseHook, BeforeErrorHook, BeforeRequestHook } from 'ky';

import { parseErrors } from '~/api/utils/interceptors';

import { getSupportedLanguageFromPathname, localeDefault } from '~/libraries/i18next/resource';

//
// Token Helpers
//
export const getToken = () =>
  typeof window === 'undefined' ? null : window.localStorage.getItem('_t');

export const saveToken = (token: string) => {
  if (typeof window !== 'undefined') window.localStorage.setItem('_t', token);
};

export const removeToken = () => {
  if (typeof window !== 'undefined') window.localStorage.removeItem('_t');
};

//

//
// AUTH TOKEN INTERCEPTOR
//
export const authTokenInterceptor: BeforeRequestHook = ({ request: req }) => {
  if (!req?.url) return;

  try {
    if (!req.headers.has('accept-language')) {
      const locale =
        typeof window === 'undefined'
          ? localeDefault
          : (getSupportedLanguageFromPathname(window.location.pathname) ?? localeDefault);
      req.headers.set('accept-language', locale);
    }

    const url = new URL(req.url);
    if (typeof window === 'undefined' || guestEndpoints.includes(url.pathname)) return;

    const token = getToken();
    const storeId = window?.localStorage?.getItem('storeId');

    if (token) {
      req.headers.set('x-manager-token', token);
    }

    if (storeId) {
      req.headers.set('role', 'Manager');
      req.headers.set('store-id', storeId);
    }
  } catch {
    // Silently handle interceptor errors
  }
};

//
// RESPONSE HANDLER
//
export const authTokenResponseHandler: AfterResponseHook = async ({ response: res }) => {
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
export const errorHandler: BeforeErrorHook = ({ error }) => {
  if (isHTTPError(error) && error.response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') window.location.reload();
  }

  return error;
};

export const parseErrorHandler: BeforeErrorHook = ({ error }) => {
  return isHTTPError(error) ? parseErrors(error) : error;
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
