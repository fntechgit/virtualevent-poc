/**
 * Copyright 2022
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

import { createAction, getRequest } from 'openstack-uicore-foundation/lib/utils/actions';

export const TIMER_UPDATE = 'TIMER_UPDATE';
export const TIMER_INIT = 'TIMER_INIT';
export const TIMER_INIT_ERROR = 'TIMER_INIT_ERROR';

export const defaultCurrentTime = () => {
    // fallback, depends on user clock better than nothing
    return Math.round(+new Date() / 1000);
};

export const timerErrorHandler = (err, res) => (dispatch, state) => {

};

export const getCurrentTime = () => (dispatch, getState) => {
    return getRequest(
        null,
        createAction(TIMER_INIT),
        `https://timeintervalsince1970.appspot.com/`,
        timerErrorHandler
    )({})(dispatch)
        .catch(e => {
            console.log(e);
            dispatch(createAction(TIMER_INIT_ERROR)({}));
            return (e);
        });
};

export const tickTime = () => (dispatch, getState) => {
    dispatch(createAction(TIMER_UPDATE)({}));
};

export const getNow = () => (dispatch, getState) => {
    let { timerState } = getState();
    return timerState.now == null ? defaultCurrentTime() : timerState.now;
};