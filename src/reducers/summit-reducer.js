import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";

import { GET_SUMMIT_DATA, GET_THIRD_PARTY_PROVIDERS } from '../actions/summit-actions'

const DEFAULT_STATE = {
  loading: false,
  third_party_providers: null,
  summit: null,
}

const summitReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case START_LOADING:
      return { ...state, loading: true };
    case STOP_LOADING:
      return { ...state, loading: false };
    case GET_SUMMIT_DATA:
      const summit = payload.response;
      return { ...state, loading: false, summit: summit };
    case GET_THIRD_PARTY_PROVIDERS:
      const providers = payload.response.third_party_identity_providers;
      return { ...state, loading: false, third_party_providers: providers }
    default:
      return state;
  }
}

export default summitReducer
