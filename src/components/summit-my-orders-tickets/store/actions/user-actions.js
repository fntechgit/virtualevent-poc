import {
    authErrorHandler,
    putRequest,
    getRequest,
    createAction,
    stopLoading,
    startLoading,
} from 'openstack-uicore-foundation/lib/utils/actions';
import { getAccessToken } from 'openstack-uicore-foundation/lib/security/methods';
import { openWillLogoutModal } from "./auth-actions";

export const START_LOADING_IDP_PROFILE = 'START_LOADING_IDP_PROFILE';
export const STOP_LOADING_IDP_PROFILE = 'STOP_LOADING_IDP_PROFILE';
export const UPDATE_IDP_PROFILE = 'UPDATE_IDP_PROFILE';
export const GET_ATTENDEE_PROFILE = 'GET_ATTENDEE_PROFILE';

export const updateProfile = (profile) => async (dispatch, getState, { apiBaseUrl }) => {
    const accessToken = await getAccessToken().catch(_ => dispatch(openWillLogoutModal()));

    if (!accessToken) return;

    dispatch(startLoading());

    const params = {
        access_token: accessToken,
    };

    dispatch(createAction(START_LOADING_IDP_PROFILE)());

    putRequest(
        null,
        createAction(UPDATE_IDP_PROFILE),
        // TODO: Need to make sure we include this URL as a prop/option for the widget and replace it here.
        `${window.IDP_BASE_URL}/api/v1/users/me`,
        profile,
        authErrorHandler
    )(params)(dispatch)
        .then(() => dispatch(stopLoading()))
        .catch(() => {
            dispatch(createAction(STOP_LOADING_IDP_PROFILE)())
            dispatch(stopLoading());
        });
};

export const getAttendeeProfileForSummit = (summitId) => async (dispatch, getState, { apiBaseUrl }) => {
    let accessToken;

    try {
        accessToken = await getAccessToken();
    } catch (e) {
        console.log('getAccessToken error: ', e);
        dispatch(stopLoading());
        return Promise.reject();
    }

    const params = {
        access_token: accessToken,
        expand: 'attendee, attendee.extra_questions',
        relations: 'attendee',
        fields: 'none',
    };

    return getRequest(
        null,
        createAction(GET_ATTENDEE_PROFILE),
        `${apiBaseUrl}/api/v1/summits/${summitId}/members/me`,
        authErrorHandler
    )(params)(dispatch)
        .catch((e) => {
            console.log('ERROR: ', e);
            return (e);
        });
}