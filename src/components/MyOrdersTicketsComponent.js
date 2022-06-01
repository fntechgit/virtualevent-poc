import React from 'react';
import { useSelector } from 'react-redux';
import { getAccessToken } from 'openstack-uicore-foundation/lib/security/methods'
import { getEnvVariable, SUMMIT_API_BASE_URL, OAUTH2_CLIENT_ID } from '../utils/envVariables'

import { MyOrdersTicketsWidget } from './summit-my-orders-tickets';

export const MyOrdersTicketsComponent = () => {
    const user = useSelector(state => state.userState);
    const summit = useSelector(state => state.summitState.summit);

    if (!summit) return null;

    const widgetProps = {
        apiBaseUrl: getEnvVariable(SUMMIT_API_BASE_URL),
        clientId: getEnvVariable(OAUTH2_CLIENT_ID),
        loginUrl: '/',
        getAccessToken,
        summit,
        user
    };

    return (
        <MyOrdersTicketsWidget {...widgetProps} />
    );
};