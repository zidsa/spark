import ky from 'ky';

import {
  authTokenInterceptor,
  authTokenResponseHandler,
  errorHandler,
  parseErrorHandler,
} from '~/api/client/interceptors';

//
//

export const mainKyClient = ky.create({
  prefix: String(import.meta.env.VITE_API_URL),
  timeout: 90000, // 90 seconds
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeError: [errorHandler, parseErrorHandler],
    beforeRequest: [authTokenInterceptor],
    afterResponse: [authTokenResponseHandler],
  },
  retry: {
    limit: 1,
    delay: attemptCount => 2 ** (attemptCount - 1) * 2000,
  },
  credentials: 'include',
});
