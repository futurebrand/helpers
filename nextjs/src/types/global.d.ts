import PathModule from '../modules/path'
import { IPathCache } from '../modules/path/types'

declare global {
  // eslint-disable-next-line no-var
  var __pathModule: PathModule
  var __pathCache: IPathCache
}
