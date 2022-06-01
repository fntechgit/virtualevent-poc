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

import { START_LOADING, STOP_LOADING, LOGOUT_USER } from "openstack-uicore-foundation/lib/utils/actions";
import {
    GET_TICKETS,
    SELECT_TICKET,
    REMOVE_TICKET_ATTENDEE,
    ASSIGN_TICKET
} from "../actions/ticket-actions";

const DEFAULT_STATE = {
    loading: false,
    memberTickets: [],
    errors: {},
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0,
}

const ticketReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action

    switch (type) {
        case LOGOUT_USER:
            return DEFAULT_STATE;
        case START_LOADING:
            return { ...state, loading: true };
        case STOP_LOADING:
            return { ...state, loading: false };
        case GET_TICKETS:
            let { data, current_page, total, last_page } = payload.response;
            return { ...state, memberTickets: data, current_page, total, last_page };
        case ASSIGN_TICKET:
            return { ...state, selectedTicket: payload.response };
        case REMOVE_TICKET_ATTENDEE:
            return { ...state, selectedTicket: payload.response };
        default:
            return state;
    }
}

export default ticketReducer;
