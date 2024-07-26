import FetcherClient from "./fetcher.interface";
import { IFetchConfig, IFetchResponse } from "./types";

class FetcherMock extends FetcherClient {
  private responseData: any = {};
  private responseStatus: number = 200;

  public setResponseData(data: any) {
    this.responseData = data;
  }

  public setResponseStatus(status: number) {
    this.responseStatus = status;
  }

  public async post<T = any>(path: string, config?: IFetchConfig) {
    return {
      data: this.responseData,
      headers: new Headers(),
      request: {
        url: this.getApiUrl(path),
        ...config,
      } as any,
      response: {
        status: this.responseStatus,
      } as any,
    } as IFetchResponse<T>;
  }

  public async put<T = any>(path: string, config?: IFetchConfig) {
    return {
      data: this.responseData,
      headers: new Headers(),
      request: {
        url: this.getApiUrl(path),
        ...config,
      } as any,
      response: {
        status: this.responseStatus,
      } as any,
    } as IFetchResponse<T>;
  }

  public async get<T = any>(path: string, config?: IFetchConfig) {
    return {
      data: this.responseData,
      headers: new Headers(),
      request: {
        url: this.getApiUrl(path),
        ...config,
      } as any,
      response: {
        status: this.responseStatus,
      } as any,
    } as IFetchResponse<T>;
  }

  public async delete<T = any>(path: string, config?: IFetchConfig) {
    return {
      data: this.responseData,
      headers: new Headers(),
      request: {
        url: this.getApiUrl(path),
        ...config,
      } as any,
      response: {
        status: this.responseStatus,
      } as any,
    } as IFetchResponse<T>;
  }
}

export default FetcherMock;
