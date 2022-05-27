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

import T from "i18n-react/dist/i18n-react";
import IdTokenVerifier from 'idtoken-verifier';
import Swal from 'sweetalert2';
import {
    authErrorHandler,
    getRequest,
    putRequest,
    deleteRequest,
    createAction,
    stopLoading,
    startLoading,
    objectToQueryString
} from 'openstack-uicore-foundation/lib/utils/actions';
import { getAccessToken, getIdToken } from 'openstack-uicore-foundation/lib/security/methods';
import { getUserSummits, selectSummitById } from "./summit-actions";
import { getUserOrders } from "./order-actions";
import { openWillLogoutModal } from "./auth-actions";
import { updateProfile } from "./user-actions";

export const RESET_TICKET = 'RESET_TICKET';
export const GET_TICKETS = 'GET_TICKETS';
export const SELECT_TICKET = 'SELECT_TICKET';
export const CHANGE_TICKET = 'CHANGE_TICKET';
export const ASSIGN_TICKET = 'ASSIGN_TICKET';
export const REMOVE_TICKET_ATTENDEE = 'REMOVE_TICKET_ATTENDEE';
export const REFUND_TICKET = 'REFUND_TICKET';
export const GET_TICKET_BY_HASH = 'GET_TICKET_BY_HASH';
export const GET_TICKET_BY_HASH_ERROR = 'GET_TICKET_BY_HASH_ERROR';
export const ASSIGN_TICKET_BY_HASH = 'ASSIGN_TICKET_BY_HASH';
export const GUEST_TICKET_COMPLETED = 'GUEST_TICKET_COMPLETED';
export const REGENERATE_TICKET_HASH = 'REGENERATE_TICKET_HASH';
export const RESEND_NOTIFICATION = 'RESEND_NOTIFICATION';

const customFetchErrorHandler = (response) => {
    let code = response.status;
    let msg = response.statusText;

    switch (code) {
        case 403:
            Swal.fire("ERROR", T.translate("errors.user_not_authz"), "warning");
            break;
        case 401:
            Swal.fire("ERROR", T.translate("errors.session_expired"), "error");
            break;
        case 412:
            msg = '';
            for (var [key, value] of Object.entries(response.errors)) {
                if (isNaN(key)) {
                    msg += key + ': ';
                }

                msg += value + '<br>';
            }
            Swal.fire("Validation error", msg, "warning");
            break;
        case 500:
            Swal.fire("ERROR", T.translate("errors.server_error"), "error");
    }
};

export const handleResetTicket = () => (dispatch, getState) => {
    dispatch(createAction(RESET_TICKET)({}));
};

export const getUserTickets = (ticketRefresh, page = 1, per_page = 5) => async (dispatch, getState, { apiBaseUrl, summitId }) => {
    const accessToken = await getAccessToken().catch(_ => dispatch(openWillLogoutModal()));
    const { loggedUserState: { member } } = getState();

    if (!accessToken) return;

    dispatch(startLoading());

    const params = {
        access_token: accessToken,
        expand: 'order, owner, owner.extra_questions, order, badge, badge.features, refund_requests',
        order: '-id',
        'filter[]': [`status==Confirmed,status==Paid,status==Error`, `order_owner_id<>${member.id}`],
        page: page,
        per_page: per_page,
    };

    return getRequest(
        null,
        createAction(GET_TICKETS),
        `${apiBaseUrl}/api/v1/summits/${summitId}/orders/all/tickets/me`,
        authErrorHandler
    )(params)(dispatch).then(() => {
        if (ticketRefresh) {
            dispatch(selectTicket({}, false, ticketRefresh))
        } else {
            dispatch(getUserSummits('tickets'));
        }
    }
    ).catch(e => {
        dispatch(stopLoading());
        return (e);
    });
};

export const selectTicket = (ticket, ticketList = false, ticketRefresh) => (dispatch, getState) => {
    dispatch(startLoading());

    if (ticketList) {
        dispatch(selectSummitById(ticket.order.summit_id));
        if (ticketRefresh) {
            let { ticketState: { memberTickets } } = getState();
            let memberTicket = memberTickets.find(t => t.id === ticketRefresh);
            dispatch(createAction(SELECT_TICKET)(memberTicket));
        }
        dispatch(createAction(SELECT_TICKET)(ticket));
    } else if (Object.entries(ticket).length === 0 && ticket.constructor === Object) {
        dispatch(stopLoading());
    } else {
        dispatch(createAction(SELECT_TICKET)(ticket));
        dispatch(stopLoading());
    }
};

export const handleTicketChange = (ticket, errors = {}) => (dispatch, getState) => {

    // if (validator.isEmpty(ticket.attendee_first_name)) errors.attendee_first_name = 'Please enter your First Name.';
    // if (validator.isEmpty(ticket.attendee_last_name)) errors.attendee_last_name = 'Please enter your Last Name.';
    // if (!validator.isEmail(ticket.attendee_email)) errors.attendee_email = 'Please enter a valid Email.';

    /*ticket.tickets.forEach(tix => {
        if (tix.coupon && tix.coupon.code == 'NOTACOUPON') errors[`tix_coupon_${tix.id}`] = 'Coupon not valid.';
        else delete(errors[`tix_coupon_${tix.id}`]);

        if (tix.email && !validator.isEmail(tix.email)) errors[`tix_email_${tix.id}`] = 'Please enter a valid Email.';
        else delete(errors[`tix_email_${tix.id}`]);
    });*/
    dispatch(createAction(CHANGE_TICKET)({ ticket, errors }));

}

export const assignAttendee = ({
    ticket,
    order,
    data: {
        attendee_email,
        attendee_first_name,
        attendee_last_name,
        attendee_company,
        disclaimer_accepted,
        extra_questions,
        reassignOrderId = null,
        refreshTickets = false
    }
}) => async (dispatch, getState, { apiBaseUrl, summitId }) => {
    const accessToken = await getAccessToken().catch(_ => dispatch(openWillLogoutModal()));

    if (!accessToken) return;

    dispatch(startLoading());

    const {
        orderState: {
            selectedOrder,
            current_page: orderPage
        },
        ticketState: {
            selectedTicket,
            current_page: ticketPage
        }
    } = getState();

    // NOTE: Allows consumer to pass in a specific ticket and order.
    // TODO: Consider removing `selectedTicket` and `selectedOrder`  altogether.
    ticket = ticket || selectedTicket;
    order = order || selectedOrder;

    const params = {
        access_token: accessToken,
        expand: 'owner, owner.extra_questions'
    };

    const normalizedEntity =
        (!attendee_first_name & !attendee_last_name)
            ? { attendee_email }
            : {
                attendee_email,
                attendee_first_name,
                attendee_last_name,
                attendee_company,
                extra_questions,
                disclaimer_accepted
            }

    const orderId = reassignOrderId ? reassignOrderId : order.id;

    return putRequest(
        null,
        createAction(ASSIGN_TICKET),
        `${apiBaseUrl}/api/v1/summits/all/orders/${orderId}/tickets/${ticket.id}/attendee`,
        normalizedEntity,
        authErrorHandler
    )(params)(dispatch).then(() => {
        if (reassignOrderId) {
            refreshTickets ? dispatch(getUserTickets(ticket.id, ticketPage)) : dispatch(getUserOrders(order.id, orderPage));
            dispatch(getUserTickets(ticket.id, ticketPage))
        } else {
            dispatch(getUserOrders(order.id, orderPage));
        }
    }
    ).catch(e => {
        dispatch(stopLoading());
        return (e);
    });
}


export const editOwnedTicket = ({
    ticket,
    order,
    data: {
        attendee_email,
        attendee_first_name,
        attendee_last_name,
        attendee_company,
        disclaimer_accepted,
        extra_questions,
        updateOrder = false
    }
}) => async (dispatch, getState, { apiBaseUrl, summitId }) => {
    const accessToken = await getAccessToken().catch(_ => dispatch(openWillLogoutModal()));

    if (!accessToken) return;

    dispatch(startLoading());

    const {
        loggedUserState: { member },
        orderState: {
            selectedOrder,
            current_page: orderPage
        },
        ticketState: {
            selectedTicket,
            current_page: ticketPage
        },
    } = getState();

    // NOTE: Allows consumer to pass in a specific ticket and order.
    // TODO: Consider removing `selectedTicket` and `selectedOrder`  altogether.
    ticket = ticket || selectedTicket;
    order = order || selectedOrder;

    const params = {
        access_token: accessToken,
        expand: 'owner, owner.extra_questions'
    };

    const idToken = getIdToken();
    let company = '';
    if (idToken) {
        try {
            const verifier = new IdTokenVerifier();
            let jwt = verifier.decode(idToken);
            company = jwt.payload.company;
        }
        catch (e) {
            console.log('error', e);
        }
    }

    const normalizedEntity = {
        attendee_email,
        attendee_first_name,
        attendee_last_name,
        attendee_company,
        disclaimer_accepted,
        extra_questions
    };

    return putRequest(
        null,
        createAction(ASSIGN_TICKET),
        `${apiBaseUrl}/api/v1/summits/all/orders/all/tickets/${ticket.id}`,
        normalizedEntity,
        authErrorHandler
    )(params)(dispatch).then(() => {
        // Check if there's changes in the ticket data to update the profile
        if (attendee_company !== company || attendee_first_name !== member.first_name || attendee_last_name !== member.last_name) {
            const newProfile = {
                first_name: attendee_first_name,
                last_name: attendee_last_name,
                company: attendee_company
            };
            dispatch(updateProfile(newProfile));
        }
        updateOrder ? dispatch(getUserOrders(order.id, orderPage)) : dispatch(getUserTickets(null, ticketPage));
    }
    ).catch(e => {
        dispatch(stopLoading());
        return (e);
    });
};

export const resendNotification = ({ ticket }) => async (dispatch, getState, { apiBaseUrl, summitId }) => {
    const accessToken = await getAccessToken().catch(_ => dispatch(openWillLogoutModal()));

    if (!accessToken) return;

    dispatch(startLoading());

    const { ticketState: { selectedTicket } } = getState();

    // NOTE: Allows consumer to pass in a specific ticket.
    // TODO: Consider removing `selectedTicket`  altogether.
    ticket = ticket || selectedTicket;

    const orderId = ticket.order ? ticket.order.id : ticket.order_id;

    const params = {
        access_token: accessToken
    };

    return putRequest(
        null,
        createAction(RESEND_NOTIFICATION),
        `${apiBaseUrl}/api/v1/summits/all/orders/${orderId}/tickets/${ticket.id}/attendee/reinvite`,
        authErrorHandler
    )(params)(dispatch).then(() => {
        dispatch(stopLoading());
    }).catch(e => {
        dispatch(stopLoading());
        return (e);
    });
};

export const removeAttendee = ({
    ticket,
    order,
    data: { attendee_email, fromTicket = false }
}) => async (dispatch, getState, { apiBaseUrl, summitId }) => {
    const accessToken = await getAccessToken().catch(_ => dispatch(openWillLogoutModal()));

    if (!accessToken) return;

    dispatch(startLoading());

    const { ticketState: { selectedTicket } } = getState();

    // NOTE: Allows consumer to pass in a specific ticket.
    // TODO: Consider removing `selectedTicket`  altogether.
    ticket = ticket || selectedTicket;

    const params = {
        access_token: accessToken,
        expand: 'order, owner, owner.extra_questions, order.summit'
    };

    const orderId = ticket.order ? ticket.order.id : ticket.order_id;

    return deleteRequest(
        null,
        createAction(REMOVE_TICKET_ATTENDEE),
        `${apiBaseUrl}/api/v1/summits/all/orders/${orderId}/tickets/${ticket.id}/attendee`,
        {},
        authErrorHandler
    )(params)(dispatch).then(() => {
        dispatch(assignAttendee({
            ticket,
            order,
            data: {
                attendee_email,
                attendee_first_name: '',
                attendee_last_name: '',
                attendee_company: '',
                disclaimer_accepted: false,
                extra_questions: [],
                reassignOrderId: orderId,
                refreshTickets: fromTicket
            }
        }));
    }).catch((e) => {
        console.log('error', e)
        dispatch(stopLoading());
        return (e);
    });
};

export const getTicketPDF = (ticket) => async (dispatch, getState, { apiBaseUrl, summitId }) => {
    const accessToken = await getAccessToken().catch(_ => dispatch(openWillLogoutModal()));

    if (!accessToken) return;

    dispatch(startLoading());

    const { ticketState: { selectedTicket } } = getState();

    // NOTE: Allows consumer to pass in a specific ticket.
    // TODO: Consider removing `selectedTicket`  altogether.
    ticket = ticket || selectedTicket;

    const params = {
        access_token: accessToken
    };

    const orderId = ticket.order ? ticket.order.id : ticket.order_id;

    const queryString = objectToQueryString(params);
    const apiUrl = `${apiBaseUrl}/api/v1/summits/all/orders/${orderId}/tickets/${ticket.id}/pdf?${queryString}`;

    return fetch(apiUrl, { responseType: 'Blob', headers: { 'Content-Type': 'application/pdf' } })
        .then((response) => {
            if (!response.ok) {
                dispatch(stopLoading());
                throw response;
            } else {
                return response.blob();
            }
        })
        .then((pdf) => {
            dispatch(stopLoading());
            let link = document.createElement('a');
            const url = window.URL.createObjectURL(pdf);
            link.href = url;
            link.download = 'ticket.pdf';
            link.dispatchEvent(new MouseEvent('click'));
        })
        .catch(customFetchErrorHandler);
};

export const refundTicket = ({ ticket, order }) => async (dispatch, getState, { apiBaseUrl, summitId }) => {
    const accessToken = await getAccessToken().catch(_ => dispatch(openWillLogoutModal()));

    if (!accessToken) return;

    dispatch(startLoading());

    const {
        orderState: {
            selectedOrder,
            current_page: orderPage
        },
        ticketState: {
            selectedTicket,
            current_page: ticketPage
        }
    } = getState();

    // NOTE: Allows consumer to pass in a specific ticket and order.
    // TODO: Consider removing `selectedTicket` and `selectedOrder`  altogether.
    ticket = ticket || selectedTicket;
    order = order || selectedOrder;

    const orderId = ticket.order ? ticket.order.id : ticket.order_id;

    const params = {
        access_token: accessToken
    };

    return deleteRequest(
        null,
        createAction(REFUND_TICKET),
        `${apiBaseUrl}/api/v1/summits/all/orders/${orderId}/tickets/${ticket.id}/refund`,
        {},
        authErrorHandler
    )(params)(dispatch).then((payload) => {
        dispatch(stopLoading());
        if (ticket.order_id) {
            dispatch(getUserOrders(order.id, orderPage));
        } else {
            dispatch(getUserTickets(ticket.id, ticketPage));
        }
    }
    ).catch(e => {
        dispatch(stopLoading());
        throw (e);
    });
};

export const getTicketByHash = (hash) => (dispatch, getState, { apiBaseUrl }) => {
    dispatch(startLoading());

    const params = {
        expand: 'order_extra_questions.values, owner, owner.extra_questions, badge, badge.features'
    };

    return getRequest(
        null,
        createAction(GET_TICKET_BY_HASH),
        `${apiBaseUrl}/api/public/v1/summits/all/orders/all/tickets/${hash}`,
        null,
    )(params)(dispatch).then((ticket) => {
        dispatch(selectSummitById(ticket.response.owner.summit_id, true));
    }).catch((err) => {
        dispatch(createAction(GET_TICKET_BY_HASH_ERROR)(err.res));
        //dispatch(handleResetTicket());
        dispatch(stopLoading());
    });
};

export const assignTicketByHash = (
    attendee_first_name,
    attendee_last_name,
    attendee_company,
    disclaimer_accepted,
    share_contact_info,
    extra_questions,
    hash
) => (dispatch, getState, { apiBaseUrl }) => {
    dispatch(startLoading());

    const params = {
        expand: 'order_extra_questions.values, owner, owner.extra_questions, badge, badge.features'
    };

    const normalizedEntity = {
        attendee_first_name,
        attendee_last_name,
        attendee_company,
        disclaimer_accepted,
        share_contact_info,
        extra_questions
    };

    return putRequest(
        null,
        createAction(ASSIGN_TICKET_BY_HASH),
        `${apiBaseUrl}/api/public/v1/summits/all/orders/all/tickets/${hash}`,
        normalizedEntity,
        authErrorHandler
    )(params)(dispatch).then(() => {
        dispatch(createAction(GUEST_TICKET_COMPLETED)({}));
        dispatch(stopLoading());
    }).catch(e => {
        dispatch(stopLoading());
        return (e);
    });
};

export const regenerateTicketHash = (formerHash) => (dispatch, getState, { apiBaseUrl }) => {
    dispatch(startLoading());

    return putRequest(
        null,
        createAction(REGENERATE_TICKET_HASH),
        `${apiBaseUrl}/api/public/v1/summits/all/orders/all/tickets/${formerHash}/regenerate`,
        authErrorHandler
    )()(dispatch).then(() => {
        Swal.fire("SUCCESS", T.translate("guests.hash_regenerated"), "success");
        dispatch(stopLoading());
    }
    ).catch(e => {
        dispatch(stopLoading());
        return (e);
    });
};

export const getTicketPDFByHash = (hash) => (dispatch, getState, { apiBaseUrl }) => {
    dispatch(startLoading());

    const apiUrl = `${apiBaseUrl}/api/public/v1/summits/all/orders/all/tickets/${hash}/pdf`;

    const link = document.createElement('a');
    link.href = apiUrl;
    link.download = 'ticket.pdf';
    link.dispatchEvent(new MouseEvent('click'));

    dispatch(stopLoading());
};