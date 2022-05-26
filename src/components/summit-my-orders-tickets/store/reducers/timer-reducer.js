/**
 * Copyright 2020
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

import {
    TIMER_INIT,
    TIMER_UPDATE,
    TIMER_INIT_ERROR,
    defaultCurrentTime
} from "../actions/timer-actions";

const DEFAULT_STATE = {
    now: null,
};

const timerReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action;

    switch (type) {
        case TIMER_INIT:
            let { response } = payload;
            return { ...state, now: Math.round(response.timestamp) };
        case TIMER_INIT_ERROR:
            return { ...state, now: defaultCurrentTime() };
        case TIMER_UPDATE:
            return { ...state, now: state.now + 1 };
        default:
            return state;
    }
};

export default timerReducer;
