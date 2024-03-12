import { ApiResponse } from '~/types/strapi';
import { IGlobalOptions, IGlobalStructure } from '~/types/global-options';
import GlobalClient from './options.interface';

class OptionsService extends GlobalClient {
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

  public static async instantiate(locale: string) {
    const options = new OptionsService(locale)
    await options.initialize()

    return options
  }

  // GETTERS
  
  private get options() {
    if (!this.initialized) {
      throw new Error('Options not initialized')
    }
    return this.optionsState as IGlobalOptions
  }

  private get structure() {
    if (!this.initialized) {
      throw new Error('Options not initialized')
    }
    return this.structureState as IGlobalStructure
  }

  public get header() {
    return this.structure.header
  }

  public get footer() {
    return this.structure.footer
  }

  public get menu() {
    return this.structure.menu
  }

  public get notFound() {
    return this.options.notFound
  }
  
  public get dictionary() {
    return this.options.dictionary
  }

  public get globalSEO() {
    return this.options.globalSEO
  }

}

export default OptionsService
