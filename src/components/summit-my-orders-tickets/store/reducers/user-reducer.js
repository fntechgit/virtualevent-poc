import { LOGOUT_USER } from "openstack-uicore-foundation/lib/utils/actions";
import { GET_ATTENDEE_PROFILE } from "../actions/user-actions";
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

const DEFAULT_STATE = {
    currentAttendee: null
}

const userReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action
    switch (type) {
        case LOGOUT_USER:
            return DEFAULT_STATE;
        case GET_ATTENDEE_PROFILE:
            const { response: member } = payload;
            const { attendee } = member;
            return { ...state, currentAttendee: attendee }
        default:
            return state;
    }
}

export default userReducer