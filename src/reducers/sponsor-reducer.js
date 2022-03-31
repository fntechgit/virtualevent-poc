import sponsorData from '../content/sponsors';
import tierData from '../content/sponsors-tiers';

import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/utils/actions";
import {RESET_STATE, SYNC_DATA} from "../actions/base-actions";

const DEFAULT_STATE = {
  sponsors: sponsorData.tierSponsors,
  tiers: tierData.tiers,
  imageHeader: tierData.imageHeader,
  lobbyButton: tierData.lobbyButton
};

const sponsorReducer = (state = DEFAULT_STATE, action) => {
  const { type } = action;

  switch (type) {
    case RESET_STATE:
    case SYNC_DATA:
    case LOGOUT_USER:
      return DEFAULT_STATE;
    case START_LOADING:
      return { ...state, loading: true };
    case STOP_LOADING:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default sponsorReducer
