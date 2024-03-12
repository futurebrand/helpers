export type ContentsType = 'modals' | 'pages' | 'posts' | 'tags'

export type IFilter = Record<string, string | number | boolean>

export type FilterEvent = (filters: IFilter) => Record<string, any>
