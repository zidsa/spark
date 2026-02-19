import type { Options } from 'ky';

//
//

export type ZidderRequestOptions = Omit<Options, 'searchParams'> & {
  searchParams?: Record<string, string | number | boolean>;
  json?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};
