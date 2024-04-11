import { Common } from "@strapi/strapi";
import GeneratePathQueryService from "./query";
import { IWithSlugAndPathAttributes, IWithSlugParentCollection, IWithSlugParentEvent } from "./types";

class SlugPathGenerator {
  queryService: GeneratePathQueryService

  constructor(private uid: Common.UID.ContentType) {
    this.queryService = new GeneratePathQueryService(uid)
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
  
      const path = child.slug
  
      await strapi.db.query('api::page.page').update({
        where: { id: child.id },
        data: { path },
      })
  
      processed.push(child.id)
  
      if (child.children && child.children.length > 0) {
        await this.updateChildrensPaths(child, path, child.children, processed)
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
      const path = `${parentPath}${child.slug}`
  
      await strapi.db.query('api::page.page').update({
        where: { id: child.id },
        data: { path },
      })
  
      processed.push(child.id)
  
      const children = await this.queryService.getChildren(child.id)
      if (children && children.length > 0) {
        await this.updateChildrensPaths(child, path, children, processed)
      }
    }
  }

  private async handleParentSlug(path: string) {
    let parentPath = path === '/' ? '' : path
    if (parentPath.endsWith('/')) {
      parentPath = parentPath.slice(0, -1)
    }
    return parentPath
  }

  public async execute(data?: IWithSlugParentEvent) {
    if (!data?.slug) {
      return false
    }

    let parent: IWithSlugParentCollection | null = await this.queryService.getParent(Number(data.id))
    let children: IWithSlugParentCollection[] = await this.queryService.getChildren(Number(data.id))

    const disconnectChildren: IWithSlugParentCollection[] = []

    // Update current PATH
    let path = ''

    if (data.parent?.connect && data.parent.connect.length > 0) {
      const id = Number(data.parent.connect[0].id)
      parent = await this.queryService.getByID(id)
    } else if (data.parent?.disconnect && data.parent.disconnect.length > 0) {
      parent = null
    }

    if (parent) {
      if (parent.id === data.id) {
        path = data.slug
      } else {
        const parentPath = this.handleParentSlug(parent.path)
        if (data.slug === '/') {
          path = `${parentPath}${parentPath}`
        } else {
          path = `${parentPath}${data.slug}`
        }
      }
    } else {
      path = String(data.slug)
    }

    // Update children PATH

    if (data.children?.connect && data.children.connect.length > 0) {
      const childrenIds = data.children.connect.map((c) => c.id)
      for (const id of childrenIds) {
        const child = await this.queryService.getByID(Number(id))
        if (child) {
          children.push(child)
        }
      }
    }

    if (data.children?.disconnect && data.children.disconnect?.length > 0) {
      const childrenIds = data.children.disconnect.map((c) => c.id)
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

    return path
  }


}

export default SlugPathGenerator