export interface IFetchConfig {
  params?: Record<string, any>
  headers?: Record<string, any>
  body?: Record<string, any>
  revalidate?: number
}

export interface IRequestProperties extends globalThis.RequestInit {
  url: string
}

export interface IFetchResponse<T> {
  data: T
  headers: Headers
  request: IRequestProperties
  response: Response
}
