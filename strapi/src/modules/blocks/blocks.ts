import type { BlockHandleList,  BlockData } from './types'

class ContentBlockHandler {
  constructor (private handles: BlockHandleList, public fieldName = 'blocks') {}

  async sanitize(blocks: BlockData[], locale?: string) {
    const sanitizedBlocks: BlockData[] = []

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

    return sanitizedBlocks
  }
}

export default ContentBlockHandler
