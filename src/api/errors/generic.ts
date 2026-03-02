import { HTTPError } from 'ky';
import type { KyResponse } from 'ky';

//
//

export class ZidderError<T = unknown> extends HTTPError<T> {
  name = 'ZidderError';

  constructor(err: HTTPError, message?: string) {
    super(err.response, err.request, err.options);
    this.message = message || err?.message;
    this.stack = err?.stack;
    this.cause = err?.cause;
  }
}

export class ZidderBadRequest extends ZidderError {
  name = 'ZidderBadRequest';
}

export class ZidderErrorNotFound extends ZidderError {
  name = 'ZidderErrorNotFound';
}

export class ZidderErrorUnauthorized extends ZidderError {
  name = 'ZidderErrorUnauthorized';
}

export class ZidderErrorForbidden extends ZidderError {
  name = 'ZidderErrorForbidden';
}

export class ZidderErrorTooManyRequests extends ZidderError {
  name = 'ZidderErrorTooManyRequests';
}

export class ZidderErrorTimeout extends ZidderError {
  name = 'ZidderErrorTimeout';
}

export class ZidderErrorUnexpectedResponse extends ZidderError {
  name = 'ZidderErrorUnexpectedResponse';

  static createFromResponse(response: KyResponse) {
    return new ZidderErrorUnexpectedResponse(
      new HTTPError(
        response,
        {} as unknown as Request,
        {} as unknown as import('ky').NormalizedOptions,
      ),
      'UnexpectedResponse',
    );
  }
}

export class ZidderErrorServer extends ZidderError {
  name = 'ZidderErrorServer';
}
