import {
    getAccessToken,
    getRequest,
    createAction,
    startLoading,
    stopLoading,
    clearAccessToken,
} from 'openstack-uicore-foundation/lib/methods';

import URI from "urijs";

import { customErrorHandler } from '../utils/customErrorHandler';

export const GET_EXTRA_QUESTIONS = 'GET_EXTRA_QUESTIONS';

export const getExtraQuestions = () => async (dispatch, getState) => {

    dispatch(startLoading());

    let accessToken;
    try {
        accessToken = await getAccessToken();
    } catch (e) {
        console.log('getAccessToken error: ', e);
        return Promise.reject(e);
    }

    let apiUrl = URI(`${window.API_BASE_URL}/api/v1/summits/${window.SUMMIT_ID}/order-extra-questions`);
    apiUrl.addQuery('filter[]', 'class==MainQuestion');
    apiUrl.addQuery('filter[]', 'usage==Ticket');
    apiUrl.addQuery('expand', '*sub_question_rules,*sub_question,*values')
    apiUrl.addQuery('access_token', accessToken);
    apiUrl.addQuery('order', 'order');

    return getRequest(
        null,
        createAction(GET_EXTRA_QUESTIONS),
        `${apiUrl}`,
        customErrorHandler
    )({})(dispatch).then(() => {
        dispatch(stopLoading());
    }).catch(e => {
        console.log('ERROR: ', e);
        clearAccessToken();
        dispatch(stopLoading());
        return Promise.reject(e);
    });
}