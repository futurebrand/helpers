import { ContentType } from '@strapi/helper-plugin'
import type { BlockHandleList,  BlockData, IBlockHandlerConfigs } from './types'
import { Common } from '@strapi/strapi'

class ContentBlockHandler {
  public fieldKey: string
  public category: Common.UID.ComponentCategory
  public syncDynamicZone: boolean

  constructor (private handles: BlockHandleList, configs: IBlockHandlerConfigs = {} ) {
    this.fieldKey = configs.field ?? 'blocks'
    this.category = configs.category ?? 'blocks'
    this.syncDynamicZone = configs.syncDynamicZone ?? true
  }

  public equal(otherHandle: ContentBlockHandler) {
    return this.fieldKey === otherHandle.fieldKey && this.category === otherHandle.category
  }

  public async updateContentType(contentType: ContentType) {
    const dynamicZone = contentType.attributes[this.fieldKey]
    if (dynamicZone && this.syncDynamicZone) {
      const components = strapi.components
      const uids = Object.keys(components)

      const addedComponents = uids.filter((componentUid) => {
        const componentFolder = componentUid.split('.')[0]
        return componentFolder === this.category
      })
      const currentComponents = dynamicZone.components ?? []

      const newComponents = [...new Set([...currentComponents, ...addedComponents])]
        .sort((a, b) => components[a].info.displayName.localeCompare(components[b].info.displayName))

      dynamicZone.components = newComponents
    }
  }

  public async sanitizeData(data: any, locale?: string) {
    const sanitizedBlocks: BlockData[] = []

    const blocks: any = data[this.fieldKey]

    if (!blocks || !Array.isArray(blocks)) {
      return
    }

    for (const block of blocks) {
      const handleBlockData = this.handles[block.__component]
      if (handleBlockData) {
        const sanitizedBlock = await handleBlockData(block, locale)
        if (sanitizedBlock) {
          sanitizedBlocks.push(sanitizedBlock)
        }
      } else {
        sanitizedBlocks.push(block)
      }
    }

    data[this.fieldKey] = sanitizedBlocks
  }
}

export default ContentBlockHandler
