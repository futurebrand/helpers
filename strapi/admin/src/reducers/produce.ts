import produce from 'immer';
import * as REDUCER from './configs'

const initialState = {
  isLoading: false,
  isLoaded: false,
  links: {
    live: null,
    preview: null
  }
};


export default {
  [REDUCER.ID]: produce((previousState, action) => {
    let state = previousState ?? initialState

    if (action.type === REDUCER.PREVIEW_LOADING) {
      state = {
        ...state,
        isLoading: true,
      }
    }

    if (action.type === REDUCER.PREVIEW_SET) {
      state = {
        ...state,
        isLoaded: true,
        isLoading: false,
        links: action.data,
      }
    }

    if (action.type === REDUCER.PREVIEW_RESET) {
      state = {
        ...state,
        isLoaded: false,
        isLoading: false,
        links: initialState.links,
      }
    }

    if (action.type === REDUCER.PREVIEW_ERROR) {
      state = {
        ...state,
        isLoaded: true,
        isLoading: false,
        links: initialState.links,
      }
    }

    return state;
  })
}