import type { KyResponse } from 'ky';

import { throwUnexpectedResponse } from './errors';

//
//

export const getResponseJSON = async <T>(response: KyResponse) => {
  try {
    return await response.json<T>();
  } catch {
    throwUnexpectedResponse(response);
  }
};
