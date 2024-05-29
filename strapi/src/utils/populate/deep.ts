import { type Common } from '@strapi/strapi'

import { getModelPopulate } from './model-populate'
import { type IPopulateData } from './types'
import { LibraryList } from '../library'

const populateCache = new LibraryList<string, IPopulateData>()

function getPopulateInModel(
  modelUid: Common.UID.Schema,
  layers: number,
  showPrivateFields: boolean = false
) {
  const populateResponse = getModelPopulate(modelUid, layers, showPrivateFields)

  if (!populateResponse.populate) {
    return false
  }

  return populateResponse.populate
}

export function populateCollection(
  modelUid: Common.UID.Schema,
  layers = 10,
  showPrivateFields = false
) {
  const cacheKey = `${modelUid}-${layers}-${showPrivateFields}`
  // Check if the populate is already in the cache
  let populate = populateCache.get(cacheKey)
  if (populate == null) {
    // Get the populate object
    populate = getPopulateInModel(modelUid, layers, showPrivateFields)
    if (typeof populate === 'boolean') {
      populate = {}
    }
    // Save the populate object in the cache if it's not in development
    if (process.env.NODE_ENV !== 'development') {
      populateCache.push(cacheKey, populate)
    }
  }
  // Return the populate object
  return populate
}
