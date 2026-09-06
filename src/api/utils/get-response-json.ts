import type { KyResponse } from 'ky';

import { throwUnexpectedResponse } from '~/api/utils/errors';

//
//

export const getResponseJSON = async <T>(response: KyResponse) => {
  try {
    return await response.json<T>();
  } catch {
    throwUnexpectedResponse(response);
  }
};
