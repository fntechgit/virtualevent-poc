// import {
//     authErrorHandler,
//     getAccessToken,
//     getRequest,
//     putRequest,
//     postRequest,
//     deleteRequest,
//     createAction,
//     stopLoading,
//     startLoading,
//     getIdToken
// } from 'openstack-uicore-foundation/lib/methods';

// export const getUserOrders = (updateId, page = 1, per_page = 5) => async (dispatch, getState) => {
//     const accessToken = await getAccessToken().catch(_ => dispatch(openWillLogoutModal()));
//     if (!accessToken) return;

//     dispatch(startLoading());

//     let params = {
//         access_token: accessToken,
//         expand: 'extra_questions, tickets, tickets.refund_requests, tickets.owner, tickets.owner.extra_questions, tickets.badge, tickets.badge.features',
//         order: '-id',
//         filter: 'status==Confirmed,status==Paid,status==Error',
//         page: page,
//         per_page: per_page
//     };

//     return getRequest(
//         null,
//         createAction(GET_USER_ORDERS),
//         `${window.API_BASE_URL}/api/v1/summits/all/orders/me`,
//         authErrorHandler
//     )(params)(dispatch).then(() => {
//         if (updateId) {
//             dispatch(selectOrder({}, updateId))
//         } else {
//             dispatch(getUserSummits('orders'));
//         }
//     }
//     ).catch(e => {
//         dispatch(stopLoading());
//         return (e);
//     });
// }