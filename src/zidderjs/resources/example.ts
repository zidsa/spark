import { mainKyClient } from '~/zidderjs/client/main';
import type { ZidderRequestOptions } from '~/zidderjs/types/request-options';
import { getResponseJSON } from '~/zidderjs/utils/get-response-json';

//
//

const pathBase = 'v1/example/';

const getList = async (options?: ZidderRequestOptions) => {
  const response = await mainKyClient.get(pathBase, options);

  return getResponseJSON(response);
};

const getById = async (id: string, options?: ZidderRequestOptions) => {
  const response = await mainKyClient.get(pathBase + id, options);

  return getResponseJSON(response);
};

export const exampleResource = {
  getList,
  getById,
};
