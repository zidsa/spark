export enum ZidderPayloadCodes {
  SINGLE = 'SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT',
  LIST = 'SUCCESS_WITH_LIST_PAYLOAD_OBJECTS',
  EMPTY = 'SUCCESS_WITHOUT_PAYLOAD',
}

export interface ZidderPayload<P = unknown, C = ZidderPayloadCodes> {
  code: C;
  message: null;
  payload: P;
}

export type ZidderPayloadSingle<P> = ZidderPayload<P, ZidderPayloadCodes.SINGLE>;
export type ZidderPayloadList<P> = ZidderPayload<P, ZidderPayloadCodes.LIST>;
export type ZidderPayloadListPagination<P> = ZidderPayloadList<P> & ZidderResponsePagination;
export type ZidderPayloadEmpty<P> = ZidderPayload<P, ZidderPayloadCodes.EMPTY>;

export type ZidderPayloadError = ZidderResponse<'error', 'error'>;
export type ZidderResponsePagination = { pagination: ZidderPayloadPagination };
export type ZidderPayloadPagination = {
  page: number;
  page_size: number;
  next_page: number;
  last_page: number;
  result_count: number;
};

//
//

export type ZidderResponseStatus = 'success' | 'object' | 'error' | 'validation_error';
export type ZidderMessageType = 'success' | 'object' | 'error' | 'validation_errors';

export interface ZidderResponse<S extends ZidderResponseStatus, T extends ZidderMessageType> {
  status: S;
  message: ZidderPayloadMessage<T>;
}

export interface ZidderPayloadMessage<T extends ZidderMessageType> {
  type: T;
  code: string | null;
  name: string | null;
  description: string | null;
}

export interface ZidderPayloadValidationErrors extends ZidderPayloadMessage<'validation_errors'> {
  validations?: {
    field?: string;
    errors?: string[];
  }[];
}
