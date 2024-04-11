export interface IWithSlugAndPathAttributes {
  id: number
  path: string
  slug: string
}

export interface IWithSlugParentCollection extends IWithSlugAndPathAttributes {
  parent?: IWithSlugParentCollection
  children: IWithSlugParentCollection[]
}

export interface IWithSlugParentEvent extends IWithSlugAndPathAttributes {
  parent?: {
    connect?: any[]
    disconnect?: any[]
  }
  children: {
    connect?: any[]
    disconnect?: any[]
  }
}