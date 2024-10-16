import { errors } from '@strapi/utils';
import { Common } from "@strapi/strapi";
import GeneratePathQueryService from "./query";
import { IGeneratorFields, IWithSlugAndPathAttributes, IWithSlugParentCollection, IWithSlugParentEvent } from "./types";

class SlugPathGenerator {
  queryService: GeneratePathQueryService

  constructor(uid: Common.UID.ContentType, private fields: IGeneratorFields) {
    this.queryService = new GeneratePathQueryService(uid, fields)
  }

  private async updateDisconectedChildrens(
    children: IWithSlugParentCollection[],
    processed: number[]
  ) {
    // for
    for (const child of children) {
      if (processed.includes(child.id)) {
        continue
      }
  
      const path = child[this.fields.slug]
  
      await this.queryService.updatePath(child.id, path)
  
      processed.push(child.id)

      const nextChildren = child[this.fields.children]
      if (nextChildren && nextChildren.length > 0) {
        await this.updateChildrensPaths(child, path, nextChildren, processed)
      }
    }
  }

  private async updateChildrensPaths(
    parent: IWithSlugAndPathAttributes,
    currentPath: string,
    children: IWithSlugParentCollection[],
    processed: number[]
  ) {
    // for
    for (const child of children) {
      if (processed.includes(child.id) || child.id === parent.id) {
        continue
      }
  
      const parentPath = this.handleParentSlug(currentPath)
      const path = `${parentPath}${child[this.fields.slug]}`

      await this.queryService.updatePath(child.id, path)
  
      processed.push(child.id)
  
      const children = await this.queryService.getChildren(child.id)
      if (children && children.length > 0) {
        await this.updateChildrensPaths(child, path, children, processed)
      }
    }
  }

  private handleParentSlug(path: string) {
    let parentPath = path === '/' ? '' : path
    if (parentPath.endsWith('/')) {
      parentPath = parentPath.slice(0, -1)
    }
    return parentPath
  }

  private async getElementParent(data: any) {
    let parent = data.id ? await this.queryService.getParent(data.id) : null

    const connect = data[this.fields.parent]?.connect
    const disconnect = data[this.fields.parent]?.disconnect

    if (connect && connect.length > 0) {
      const id = Number(connect[0].id)
      parent = await this.queryService.getByID(id)
    } else if (disconnect && disconnect.length > 0) {
      parent = null
    }

    return parent
  }

  private async getElementPath(data: any, parent?: any) {
    // Update current PATH
    const slug = String(data[this.fields.slug])
    let path = slug

    if (parent) {
      if (parent.id === data.id) {
        path = slug
      } else {
        const parentPath = this.handleParentSlug(parent[this.fields.path])
        if (slug === '/') {
          const ramdomChars = Math.random().toString(36).substring(2, 15)
          path = `${parentPath}-${ramdomChars}`
        } else {
          path = `${parentPath}${slug}`
        }
      }
    }

    return path
  }

  private async updateElementChildren(data: any, path: string, parent?: any) {
    let children = data.id ? await this.queryService.getChildren(data.id) : []
    const disconnectChildren: IWithSlugParentCollection[] = []

    // Update children PATH
    const connect = data[this.fields.children]?.connect
    const disconnect = data[this.fields.children]?.disconnect

    if (connect && connect.length > 0) {
      const childrenIds = connect.map((c) => c.id)
      for (const id of childrenIds) {
        const child = await this.queryService.getByID(Number(id))
        if (child) {
          children.push(child)
        }
      }
    }

    if (disconnect && disconnect?.length > 0) {
      const childrenIds = disconnect.map((c) => c.id)
      children = children.filter((c) => {
        if (childrenIds.includes(c.id)) {
          disconnectChildren.push(c)
          return false
        }
        return true
      })
    }

    if (children && children.length > 0) {
      const processed: number[] = [data.id]
      if (parent) {
        processed.push(parent.id)
      }
      await this.updateChildrensPaths(data, path, children, processed)
    }

    // Update Disconnected Children
    if (disconnectChildren.length > 0) {
      await this.updateDisconectedChildrens(disconnectChildren, [])
    }
  }

  public async execute(data?: any) {
    if (!data?.[this.fields.slug]) {
      return false
    }

    try {
      const parent = await this.getElementParent(data)
      const path = await this.getElementPath(data, parent)
      await this.updateElementChildren(data, path, parent)
      
      return path
    } catch (error) {
      console.error(error)
      throw new errors.ApplicationError('Error updating path', error)
    }
  }

}

export default SlugPathGenerator