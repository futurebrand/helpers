import { type UID } from "@strapi/strapi";
import { type IModalPopulateResponse } from "./types";

export function getModelAttributes(modelUid: UID.Schema) {
  const model = strapi.getModel(modelUid);

  if (model.uid === "plugin::upload.file") {
    const { related, ...attributes } = model.attributes;
    return attributes;
  }

  return {
    options: model.options ?? {},
    attributes: model.attributes,
    localized: (model.pluginOptions?.i18n as any)?.localized ?? false,
  };
}

export function isEmptyObject(obj: any) {
  return (
    typeof obj !== "object" ||
    Object.keys(obj as Record<string, any>).length === 0
  );
}

export function handlePopulateResponse(response: IModalPopulateResponse) {
  if (response.populate === false) {
    return false;
  }

  if (response.populate === true || isEmptyObject(response.populate)) {
    return true;
  }

  if (response.populate == null) {
    return undefined;
  }

  return response;
}
