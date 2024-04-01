"use server"

import { PathModule } from '@futurebrand/modules';
import { IPathCache } from '@futurebrand/modules/path/types';
import useCache from '../use-cache';

const initialData: IPathCache = {}

async function usePathInstance () : Promise<PathModule> {
  const [getPathData, setPathData] = useCache<IPathCache>(initialData)

  const cacheData = getPathData()
  const instance = await PathModule.instantialize(cacheData)

  setPathData(instance.toPathCache())
  instance.onChange(() => {
    setPathData(instance.toPathCache())
  })

  return instance
}

export default usePathInstance
