import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer, type IncomingMessage } from 'node:http';
import type { AddressInfo } from 'node:net';

import { expect, it, vi } from 'vitest';

import { ZidderBadRequest, ZidderErrorUnauthorized } from '~/api/errors/generic';

it('preserves authenticated requests, login tokens, retries and typed API errors', async () => {
  const requests: IncomingMessage[] = [];
  let attempts = 0;
  const server = createServer((request, response) => {
    requests.push(request);
    request.resume();
    response.setHeader('Content-Type', 'application/json');
    switch (request.url) {
      case '/v1/example/':
        attempts += 1;
        response.statusCode = attempts === 1 ? 503 : 200;
        response.end(JSON.stringify({ items: [] }));
        break;
      case '/v1/managers/login':
        response.end(JSON.stringify({ user: { access_token: 'new-token' } }));
        break;
      case '/invalid':
        response.statusCode = 422;
        response.end(JSON.stringify({ message: 'Invalid input' }));
        break;
      default:
        response.statusCode = 401;
        response.end();
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const reload = vi.fn();
  const storage = window.localStorage;
  vi.stubGlobal('window', { localStorage: storage, location: { pathname: '/en-sa/', reload } });
  vi.stubEnv('VITE_API_URL', `http://127.0.0.1:${(server.address() as AddressInfo).port}/`);

  try {
    const { mainKyClient } = await import('~/api/client/main');
    storage.setItem('_t', 'old-token');
    storage.setItem('storeId', '123');
    await expect(
      mainKyClient.get('v1/example/', { retry: { delay: () => 0 } }).json(),
    ).resolves.toEqual({ items: [] });
    expect(attempts).toBe(2);
    expect(requests[0].url).toBe('/v1/example/');
    expect(requests[0].headers).toMatchObject({
      'x-manager-token': 'old-token',
      'store-id': '123',
      role: 'Manager',
      'accept-language': 'en-sa',
    });
    await mainKyClient.post('v1/managers/login', { json: {} });
    expect(storage.getItem('_t')).toBe('new-token');
    expect(requests[2].headers['x-manager-token']).toBeUndefined();
    expect(requests[2].headers['store-id']).toBeUndefined();

    const invalid = await mainKyClient.get('invalid').catch((error: unknown) => error);
    assert(invalid instanceof ZidderBadRequest);
    expect(invalid.name === 'ZidderBadRequest').toBe(true);
    expect(invalid.data).toEqual({ message: 'Invalid input' });
    expect(invalid.response.status).toBe(422);
    await expect(mainKyClient.get('unauthorized')).rejects.toBeInstanceOf(ZidderErrorUnauthorized);
    expect(storage.getItem('_t')).toBeNull();
    expect(reload).toHaveBeenCalledOnce();

    const failure = new Error('Transport failed');
    await expect(
      mainKyClient.get('network', { retry: 0, fetch: () => Promise.reject(failure) }),
    ).rejects.toBe(failure);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    });
    storage.clear();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  }
});
