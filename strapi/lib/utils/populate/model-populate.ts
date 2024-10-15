import type { UID } from "@strapi/strapi";
import { IPopulateObject, type IModalPopulateResponse } from "./types";
import {
  getModelAttributes,
  handlePopulateResponse,
  isEmptyObject,
} from "./utils";

export function getModelPopulate(
  modelUid: UID.Schema,
  numberOfLayers: number = 10,
  showPrivateFields: boolean = false,
  layer: number = 0,
  parents: string[] = []
): IModalPopulateResponse {
  if (layer + 1 >= numberOfLayers) {
    return {
      populate: true,
    };
  }

  if (modelUid === "admin::user") {
    return {
      populate: undefined,
    };
  }

  if (parents.includes(modelUid)) {
    return {
      populate: false,
    };
  }

  const populate: any = {};
  const parentsUid = [...parents, modelUid];

  const { attributes, localized } = getModelAttributes(modelUid);
  const attributeEntries = Object.entries(attributes) as [string, any][];

  for (const [key, value] of attributeEntries) {
    if (!value || ((value as any).private && !showPrivateFields)) {
      continue;
    }

    const populateSettings = (value.pluginOptions as any)?.populate as
      | Boolean
      | undefined
      | IPopulateObject;

    if (typeof populateSettings === "object") {
      populate[key] = populateSettings;
      continue;
    }

    if (populateSettings === false) {
      populate[key] = false;
      continue;
    }

    /** @COMPONENT */
    if (value.type === "component") {
      const componentPopulate = getModelPopulate(
        value.component,
        numberOfLayers,
        showPrivateFields,
        layer + 1,
        parentsUid
      );
      populate[key] = handlePopulateResponse(componentPopulate);
      continue;
    }

    /** @DYNAMIC_ZONE */
    if (value.type === "dynamiczone") {
      if (
        !value.components ||
        (layer > 0 && key !== "fields" && !populateSettings)
      ) {
        populate[key] = false;
        continue;
      }

      const dynamicPopulate = value.components.reduce(
        (prev: IPopulateObject, currentComponent) => {
          const currentPopulate = getModelPopulate(
            currentComponent,
            numberOfLayers,
            showPrivateFields,
            layer + 1
          );
          return {
            ...prev,
            [currentComponent]: handlePopulateResponse(currentPopulate),
          } as IPopulateObject;
        },
        {} as IPopulateObject
      );
      populate[key] = { on: dynamicPopulate };
      continue;
    }

    /** @RELATION */
    if (value.type === "relation") {
      const relationLayer =
        key === "localizations" && layer > 0 ? numberOfLayers : layer + 1;

      const relationPopulate = getModelPopulate(
        (value as any).target,
        numberOfLayers,
        showPrivateFields,
        relationLayer,
        parentsUid
      );
      populate[key] = handlePopulateResponse(relationPopulate);
    }

    /** @MEDIA */
    if (value.type === "media") {
      populate[key] = true;
    }
  }

  if (localized) {
    populate.localizations = true;
  }

  return isEmptyObject(populate) ? { populate: true } : { populate };
}
