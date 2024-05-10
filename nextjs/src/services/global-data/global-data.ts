import { ApiResponse } from '@futurebrand/types/strapi';
import { IGlobalOptions, IGlobalStructure } from '@futurebrand/types/global-options';
import GlobalDataClient from './global-data.interface';
import { IGlobalData } from './types';

class GlobalData extends GlobalDataClient {
  private optionsState: IGlobalOptions | null = null
  private structureState: IGlobalStructure | null = null

  public async initialize() {
    if (!this.initialized) {
      await Promise.all([
        this.loadOptions(),
        this.loadStructure(),
      ])
      this.initialized = true
    }
  }

  private async loadOptions () {
    const response: ApiResponse<IGlobalOptions> = await this.api.get('/global-option', {
      params: {
        populate: 'deep',
        locale: this.locale,
      }
    })

    const data = response.data.data.attributes
  
    if (!response.data?.data?.attributes) {
      throw new Error('Global Options data not found')
    }

    this.optionsState = data
  }

  private async loadStructure () {
    const response: ApiResponse<IGlobalStructure> = await this.api.get('/global-structure', {
      params: {
        populate: 'deep',
        locale: this.locale,
      }
    })

    const data = response.data.data.attributes
  
    if (!response.data?.data?.attributes) {
      throw new Error('Global Options data not found')
    }

    this.structureState = data
  }

  public static async load(locale: string) : Promise<IGlobalData> {
    const instance = new GlobalData(locale)
    await instance.initialize()
    return {
      options: instance.options,
      structure: instance.structure,
    } 
  }

  // GETTERS
  
  public get options() {
    if (!this.initialized) {
      throw new Error('Options not initialized')
    }
    return this.optionsState as IGlobalOptions
  }

  public get structure() {
    if (!this.initialized) {
      throw new Error('Options not initialized')
    }
    return this.structureState as IGlobalStructure
  }
}

export default GlobalData
