import summit from '../content/summit.json';

import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";
import {RESET_STATE, GET_THIRD_PARTY_PROVIDERS, SYNC_DATA} from "../actions/base-actions";

const DEFAULT_STATE = {
  loading: false,
  third_party_providers: null,
  summit: summit.summit,
  allows_native_auth: true,
  allows_otp_auth: true,
};

const summitReducer = (state = DEFAULT_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case RESET_STATE:
    case SYNC_DATA:
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case START_LOADING:
      return { ...state, loading: true };
    case STOP_LOADING:
      return { ...state, loading: false };    
    case GET_THIRD_PARTY_PROVIDERS:
      const { third_party_identity_providers : third_party_providers, allows_native_auth, allows_otp_auth } = payload.response;
      return { ...state,
                  loading: false,
                  third_party_providers,
                  allows_native_auth,
                  allows_otp_auth
            };
    default:
      return state;
  }
};

export default summitReducer
