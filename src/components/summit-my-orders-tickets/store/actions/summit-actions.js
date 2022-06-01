/**
 * Copyright 2019
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import URI from "urijs";
import {
    getRequest,
    createAction,
    stopLoading,
    startLoading,
    authErrorHandler,
} from 'openstack-uicore-foundation/lib/utils/actions';

export const GET_MAIN_EXTRA_QUESTIONS = 'GET_MAIN_EXTRA_QUESTIONS';

export const getMainOrderExtraQuestions = ({ summit }) => async (dispatch, getState, { apiBaseUrl }) => {
    dispatch(startLoading());

    if (!summit) return;

    const apiUrl = URI(`${apiBaseUrl}/api/public/v1/summits/${summit.id}/order-extra-questions`);

    apiUrl.addQuery('filter[]', 'class==MainQuestion');
    apiUrl.addQuery('filter[]', 'usage==Ticket');
    apiUrl.addQuery('expand', '*sub_question_rules,*sub_question,*values')
    apiUrl.addQuery('order', 'order');
    apiUrl.addQuery('page', 1);
    apiUrl.addQuery('per_page', 100);

    return getRequest(
        null,
        createAction(GET_MAIN_EXTRA_QUESTIONS),
        `${apiUrl}`,
        authErrorHandler
    )({})(dispatch).then(() => {
        dispatch(stopLoading());
    }).catch(e => {
        console.log('ERROR: ', e);
        dispatch(stopLoading());
        return Promise.reject(e);
    });
};
