import { type UID } from "@strapi/strapi";

import { getModelPopulate } from "./model-populate";
import type { IPopulateObject } from "./types";
import { LibraryCache } from "../cache";

let __cachePopulate: LibraryCache<IPopulateObject>;

function getPopulateInModel(
  modelUid: UID.Schema,
  layers: number,
  showPrivateFields: boolean = false
): IPopulateObject {
  const populateResponse = getModelPopulate(
    modelUid,
    layers,
    showPrivateFields
  );

  if (
    !populateResponse.populate ||
    typeof populateResponse.populate === "boolean"
  ) {
    return {};
  }

  return populateResponse.populate;
}

export function populateCollection(
  modelUid: UID.Schema,
  layers = 10,
  showPrivateFields = false
) {
  if (!__cachePopulate) {
    __cachePopulate = new LibraryCache<IPopulateObject>("populate-cache");
  }

  const cache = __cachePopulate.fromObject({
    modelUid,
    layers,
    showPrivateFields,
  });

  return cache.memorize(() => {
    return getPopulateInModel(modelUid, layers, showPrivateFields);
  });
}
