export type IPopulateObject = Record<string, any>;
export type IPopulateData = boolean | IPopulateObject;

export interface IModalPopulateResponse {
  populate?: IPopulateData;
}
