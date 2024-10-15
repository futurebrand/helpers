import { UID } from "@strapi/strapi";

export interface BlockData {
  id: number;
  __component: string;
  [key: string]: any;
}

export interface IBlockHandlerConfigs {
  field?: string;
  category?: UID.ComponentCategory;
  syncDynamicZone?: boolean;
}

export type BlockHandle = (
  block: BlockData,
  locale?: string
) => Promise<BlockData | null | false>;

export type BlockHandleList = Partial<Record<UID.Component, BlockHandle>>;
