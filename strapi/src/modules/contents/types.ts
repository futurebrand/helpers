export type IPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
export type IPublicationState = 'live' | 'preview'
export type IOrder = Record<string, 'desc' | 'asc'>

export type IContentKey = "default" | string