import {
    authErrorHandler,
    putRequest,
    createAction,
    stopLoading,
    startLoading,
} from 'openstack-uicore-foundation/lib/utils/actions';
import { getAccessToken } from 'openstack-uicore-foundation/lib/security/methods';
import { openWillLogoutModal } from "./auth-actions";

export const START_LOADING_IDP_PROFILE = 'START_LOADING_IDP_PROFILE';
export const STOP_LOADING_IDP_PROFILE = 'STOP_LOADING_IDP_PROFILE';
export const UPDATE_IDP_PROFILE = 'UPDATE_IDP_PROFILE';

export const updateProfile = (profile) => async (dispatch, getState) => {
    const accessToken = await getAccessToken().catch(_ => dispatch(openWillLogoutModal()));

    if (!accessToken) return;

    dispatch(startLoading());

    let params = {
        access_token: accessToken,
    };

    dispatch(createAction(START_LOADING_IDP_PROFILE)());

    putRequest(
        null,
        createAction(UPDATE_IDP_PROFILE),
        `${window.IDP_BASE_URL}/api/v1/users/me`,
        profile,
        authErrorHandler
    )(params)(dispatch)
        .then(() => dispatch(stopLoading()))
        .catch(() => {
            dispatch(createAction(STOP_LOADING_IDP_PROFILE)())
            dispatch(stopLoading());
        });
}