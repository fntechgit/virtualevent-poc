import summit from '../content/summit.json';
import extraQuestions from '../content/extra-questions.json';

import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/actions";
import { RESET_STATE, GET_THIRD_PARTY_PROVIDERS, SYNC_DATA } from "../actions/base-actions";
import { GET_EXTRA_QUESTIONS } from '../actions/user-actions';

const DEFAULT_STATE = {
  loading: false,
  third_party_providers: null,
  summit: summit.summit,
  extra_questions: extraQuestions
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
      const providers = payload.response.third_party_identity_providers;
      return { ...state, loading: false, third_party_providers: providers }
    case GET_EXTRA_QUESTIONS: {
      const extraQuestions = payload.response.data;
      return { ...state, loading: false, extra_questions: extraQuestions }
    }
    default:
      return state;
  }
};

export default summitReducer
