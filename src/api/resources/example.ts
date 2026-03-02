import { mainKyClient } from '~/api/client/main';
import type { Options } from 'ky';
import { getResponseJSON } from '~/api/utils/get-response-json';

//
//

const pathBase = 'v1/example/';

const getList = async (options?: Options) => {
  const response = await mainKyClient.get(pathBase, options);

  return getResponseJSON(response);
};

const getById = async (id: string, options?: Options) => {
  const response = await mainKyClient.get(pathBase + id, options);

  return getResponseJSON(response);
};

export const exampleResource = {
  getList,
  getById,
};
