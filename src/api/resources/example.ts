import type { Input, Options } from 'ky';
import { z } from 'zod/v4';

import { mainKyClient } from '~/api/client/main';
import { getResponseJSON } from '~/api/utils/get-response-json';

import type { Locale } from '~/libraries/i18next/resource';

//
//

const pathBase = 'v1/example/';

export const exampleResponseSchema = z.object({
  code: z.literal('SUCCESS_WITH_LIST_PAYLOAD_OBJECTS'),
  message: z.null(),
  payload: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.enum(['active', 'inactive', 'draft']),
      createdAt: z.iso.datetime(),
    }),
  ),
});

export type ExampleItem = z.infer<typeof exampleResponseSchema>['payload'][number];
export interface ExampleListVariables {
  locale: Locale;
}

const exampleItems: ExampleItem[] = [
  {
    id: '1',
    title: 'First Example',
    description: 'This is a demonstration of the data fetching pattern',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Second Example',
    description: 'Another item showing the card component',
    status: 'draft',
    createdAt: '2024-02-20T14:45:00Z',
  },
  {
    id: '3',
    title: 'Third Example',
    description: 'Inactive item for status demonstration',
    status: 'inactive',
    createdAt: '2024-03-10T09:15:00Z',
  },
];

const exampleResponse = {
  code: 'SUCCESS_WITH_LIST_PAYLOAD_OBJECTS',
  message: null,
  payload: exampleItems,
} satisfies z.infer<typeof exampleResponseSchema>;

export const exampleFetch = async (input: Input, init?: RequestInit) => {
  const request = new Request(input, init);
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.pathname !== '/v1/example/') {
    return new Response(null, { status: 404, statusText: 'Not Found' });
  }

  return Response.json(exampleResponse);
};

const exampleKyClient = mainKyClient.extend({
  prefix: 'https://example.invalid/',
  fetch: exampleFetch,
});

const getList = async (variables: ExampleListVariables, options?: Options) => {
  const response = await exampleKyClient.extend(options ?? {}).get(pathBase, {
    headers: { 'accept-language': variables.locale },
  });

  const result = exampleResponseSchema.parse(await getResponseJSON<unknown>(response));
  return result.payload;
};

export const exampleResource = {
  getList,
};
