
import { cache } from 'react';
import { ICurrentPath, PathModule } from '@futurebrand/modules';
import { IPathData } from '@futurebrand/modules/path/types';


const dataRef = cache(() => ({
  current: {
    locales: [],
    defaultLocale: '',
    slugs: {},
    currentPath: {
      locale: '',
      slug: '/',
      type: 'pages',
    } as ICurrentPath,
  }
}))

function usePathModule () : [PathModule, (newData: IPathData) => void] {
  let data = dataRef()
  const pathModule = PathModule.fromCache(data.current)

  const setValues = (newData: IPathData) => {
    pathModule.locales = newData.locales
    pathModule.defaultLocale = newData.defaultLocale
    pathModule.currentPath = newData.currentPath
    pathModule.slugs = newData.slugs
    dataRef().current = newData
    data.current = newData
  }

  return [
    pathModule,
    setValues
  ]
}

export default usePathModule
