import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetchClient, useNotification } from "@strapi/strapi/admin";

import * as REDUCER from "../reducers";
import useLocale from "./use-locale";
import { PLUGIN_ID } from "../constants";

interface IReducerState {
  links: {
    live: string | null;
    preview: string | null;
  };
  isLoading: boolean;
  isLoaded: boolean;
}

const usePreviewLinks = (api?: string, isDraft?: boolean, id?: any) => {
  const dispatch = useDispatch();
  const fetchClient = useFetchClient();
  const toggleNotification = useNotification();
  const { links, isLoading, isLoaded } = useSelector(
    (state: any) => state[PLUGIN_ID] as IReducerState
  );
  const locale = useLocale();

  const loadData = useCallback(async () => {
    try {
      dispatch({
        type: REDUCER.PREVIEW_LOADING,
      });

      const response = await fetchClient.get(
        "/futurebrand-strapi-helpers/preview",
        {
          params: {
            id,
            api,
            draft: isDraft,
            locale,
          },
        }
      );

      if (response && response.data) {
        dispatch({
          type: REDUCER.PREVIEW_SET,
          data: response.data,
        });
      } else {
        dispatch({
          type: REDUCER.PREVIEW_ERROR,
        });
      }
    } catch (err) {
      dispatch({
        type: REDUCER.PREVIEW_ERROR,
      });
    }
  }, [dispatch, fetchClient, toggleNotification, id, isDraft, api]);

  useEffect(() => {
    if (isLoaded) {
      return () => {
        dispatch({
          type: REDUCER.PREVIEW_RESET,
        });
      };
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoading || isLoaded || !id) {
      return;
    }
    loadData();
  }, [isLoading, isLoaded, loadData, id]);

  if (isLoading && !isLoaded) {
    return null;
  }

  return links;
};

export default usePreviewLinks;
