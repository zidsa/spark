import { HTTPError } from 'ky';

import * as ZidderErrors from '~/api/errors/generic';

//
//

export const parseErrors = (err: HTTPError) => {
  if (!err?.response?.status) return err;

  if (err.response.status >= 500) {
    return new ZidderErrors.ZidderErrorServer(err);
  }

  switch (err.response.status) {
    case 400:
    case 422:
      return new ZidderErrors.ZidderBadRequest(err);
    case 401:
      return new ZidderErrors.ZidderErrorUnauthorized(err);
    case 403:
      return new ZidderErrors.ZidderErrorForbidden(err);
    case 404:
      return new ZidderErrors.ZidderErrorNotFound(err);
    case 408:
      return new ZidderErrors.ZidderErrorTimeout(err);
    case 429:
      return new ZidderErrors.ZidderErrorTooManyRequests(err);
    default:
      return err;
  }
};
