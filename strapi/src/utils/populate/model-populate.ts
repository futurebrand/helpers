import { type Common } from '@strapi/strapi'
import { type IModalPopulateResponse } from './types'

function getModelAttributes(modelUid: Common.UID.Schema) {
  const model = strapi.getModel(modelUid)

  if (model.uid === 'plugin::upload.file') {
    const { related, ...attributes } = model.attributes
    return attributes
  }

  return {
    options: model.options ?? {},
    attributes: model.attributes,
    localized: model.pluginOptions?.i18n?.localized ?? false,
  }
}

function isEmptyObject(obj: any) {
  return (
    typeof obj !== 'object' ||
    Object.keys(obj as Record<string, any>).length === 0
  )
}

function handlePopulateResponse(response: IModalPopulateResponse) {
  if (response.populate === true || isEmptyObject(response.populate)) {
    return true
  }

  if (response.populate === undefined) {
    return undefined
  }

  return response
}

export function getModelPopulate(
  modelUid: Common.UID.Schema,
  layer: number,
  showPrivateFields: boolean = false
): IModalPopulateResponse {
  if (layer <= 0) {
    return {
      populate: true,
    }
  }

  if (modelUid === 'admin::user') {
    return {
      populate: undefined,
    }
  }

  const populate: any = {}

  const { attributes, localized } = getModelAttributes(modelUid)

  for (const [key, value] of Object.entries(attributes)) {
    if (!value || ((value as any).private && !showPrivateFields)) {
      continue
    }

    if (value.type === 'component') {
      const componentPopulate = getModelPopulate(
        value.component as Common.UID.Schema,
        layer - 1,
        showPrivateFields
      )
      populate[key] = handlePopulateResponse(componentPopulate)
    } else if (value.type === 'dynamiczone') {
      const dynamicPopulate = value.components.reduce((prev, cur) => {
        const curPopulate = getModelPopulate(cur, layer - 1, showPrivateFields)
        return { ...prev, [cur]: handlePopulateResponse(curPopulate) }
      }, {})
      populate[key] = { on: dynamicPopulate }
    } else if (value.type === 'relation') {
      const relationPopulate = getModelPopulate(
        (value as any).target as Common.UID.Schema,
        key === 'localizations' && layer > 2 ? 1 : layer - 1,
        showPrivateFields
      )
      populate[key] = handlePopulateResponse(relationPopulate)
    } else if (value.type === 'media') {
      populate[key] = true
    }
  }

  if (localized) {
    populate.localizations = true
  }

  return isEmptyObject(populate) ? { populate: true } : { populate }
}
