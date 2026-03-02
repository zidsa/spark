import { HTTPError } from 'ky';
import type { KyResponse, NormalizedOptions } from 'ky';

//
//

export const throwUnexpectedResponse = (response: KyResponse) => {
  throw new HTTPError(response, {} as unknown as Request, {} as unknown as NormalizedOptions);
};
