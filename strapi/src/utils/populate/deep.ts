import { type Common } from '@strapi/strapi'

import { getModelPopulate } from './model-populate'
import MemoryCache from '../../utils/memory-cache'
import { type IPopulateData } from './types'

const deepPopulateCache = new MemoryCache<IPopulateData>()

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
  // Check if the populate is already in the cache
  let populate = deepPopulateCache.get(modelUid)
  if (!populate) {
    // Get the populate object
    populate = getPopulateInModel(modelUid, layers, showPrivateFields)
    // Save the populate object in the cache
    deepPopulateCache.set(modelUid, populate)
  }
  // Return the populate object
  return populate
}
