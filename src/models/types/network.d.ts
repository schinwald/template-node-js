import { Request as NodeFetchCommonJSRequest, Response as NodeFetchCommonJSResponse } from 'node-fetch-commonjs'
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNext } from 'express'

export namespace ExternalAPI {
  export class Request extends NodeFetchCommonJSRequest {}
  export class Response extends NodeFetchCommonJSResponse {}
}

export namespace InternalAPI {
  export interface Request extends ExpressRequest {}
  export interface Response extends ExpressResponse {}
  export interface Next extends ExpressNext {}
}

export namespace JSON {
  export interface Meta {
    [key: string]: object | string | number | null | undefined
  }

  export interface Data {
    [key: string]: object | string | number | null | undefined
  }

  export interface Error {
    id: string
    status: string
    title: string
    code: string
    detail: string
  }

  export type Response = {
    meta?: Meta
    data: Data | Data[]
  } | {
    meta?: Meta
    errors: Error[]
  }
}
