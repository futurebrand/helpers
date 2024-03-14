export interface BlockData {
  id: number
  __component: string
  [key: string]: any
}

export type BlockHandle = (
  block: BlockData,
  locale?: string
) => Promise<BlockData | null | false>

export type BlockHandleList = Record<string, BlockHandle>
