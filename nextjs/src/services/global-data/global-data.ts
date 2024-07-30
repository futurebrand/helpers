
import GlobalDataClient from './global-data.interface';
import { IGlobalData, IGlobalSEO } from '@futurebrand/types/global-options';
import { IGlobalDataServiceConfigs } from './types';

class GlobalData extends GlobalDataClient {
  constructor(configs: IGlobalDataServiceConfigs = {}) {
    super(configs)
  }

  public async get(locale?: string): Promise<IGlobalData> {
    const response = await this.api.get<IGlobalData>(this.path.data, {
      params: {
        locale,
      },
    })
    return response.data
  }

  public async seo(locale?: string): Promise<IGlobalSEO> {
    const response = await this.api.get<IGlobalSEO>(this.path.seo, {
      params: {
        locale,
      },
    })
    return response.data
  }
}

export default GlobalData
