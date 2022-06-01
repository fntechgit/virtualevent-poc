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

import {
    authErrorHandler,
    getRequest,
    deleteRequest,
    createAction,
    stopLoading,
    startLoading
} from 'openstack-uicore-foundation/lib/utils/actions';
import history from '../history';
import { getUserSummits } from './summit-actions';

export const RESET_ORDER = 'RESET_ORDER';
export const RECEIVE_ORDER = 'RECEIVE_ORDER';
export const CHANGE_ORDER = 'CHANGE_ORDER';
export const VALIDATE_STRIPE = 'VALIDATE_STRIPE';
export const CREATE_RESERVATION = 'CREATE_RESERVATION';
export const CREATE_RESERVATION_SUCCESS = 'CREATE_RESERVATION_SUCCESS';
export const CREATE_RESERVATION_ERROR = 'CREATE_RESERVATION_ERROR';
export const DELETE_RESERVATION = 'DELETE_RESERVATION';
export const DELETE_RESERVATION_SUCCESS = 'DELETE_RESERVATION_SUCCESS';
export const DELETE_RESERVATION_ERROR = 'DELETE_RESERVATION_ERROR';
export const PAY_RESERVATION = 'PAY_RESERVATION';
export const GET_USER_ORDERS = 'GET_ORDERS';
export const SELECT_ORDER = 'SELECT_ORDER';
export const REFUND_ORDER = 'REFUND_ORDER';
export const CLEAR_RESERVATION = 'CLEAR_RESERVATION';

export const getUserOrders = (updateId, page = 1, per_page = 5) => async (dispatch, getState, { getAccessToken, apiBaseUrl, loginUrl }) => {
    const { summitState: { summit } } = getState();

    const accessToken = await getAccessToken().catch(_ => history.replace(loginUrl));

    if (!accessToken) return;

    dispatch(startLoading());


    const params = {
        access_token: accessToken,
        expand: 'extra_questions, tickets, tickets.refund_requests, tickets.owner, tickets.owner.extra_questions, tickets.badge, tickets.badge.features',
        order: '-id',
        filter: 'status==Confirmed,status==Paid,status==Error',
        page: page,
        per_page: per_page
    };

    return getRequest(
        null,
        createAction(GET_USER_ORDERS),
        `${apiBaseUrl}/api/v1/summits/${summit.id}/orders/me`,
        authErrorHandler
    )(params)(dispatch).then(() => {
        if (updateId) {
            dispatch(selectOrder({}, updateId))
        } else {
            dispatch(getUserSummits('orders'));
        }
    }
    ).catch(e => {
        dispatch(stopLoading());
        return (e);
    });
}

export const selectOrder = (order, updateId = null) => (dispatch, getState) => {
    dispatch(startLoading());

    if (updateId) {
        let { orderState: { memberOrders } } = getState();
        let updatedOrder = memberOrders.find(o => o.id === updateId);
        dispatch(createAction(SELECT_ORDER)(updatedOrder));
        dispatch(stopLoading());
    } else {
        dispatch(createAction(SELECT_ORDER)(order));
        dispatch(stopLoading());
    }

    return Promise.resolve();
}

export const cancelOrder = ({ order }) => async (dispatch, getState, { getAccessToken, apiBaseUrl, loginUrl }) => {
    const { orderState: { current_page } } = getState();

    const accessToken = await getAccessToken().catch(_ => history.replace(loginUrl));

    if (!accessToken) return;

    dispatch(startLoading());

    const params = {
        access_token: accessToken
    };

    return deleteRequest(
        null,
        createAction(REFUND_ORDER),
        `${apiBaseUrl}/api/v1/summits/all/orders/${order.id}/refund`,
        {},
        authErrorHandler
    )(params)(dispatch).then((payload) => {
        dispatch(getUserOrders(order.id, current_page));
        dispatch(stopLoading());
    }).catch(e => {
        dispatch(stopLoading());
        throw (e);
    });
};