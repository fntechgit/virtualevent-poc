import React from "react"
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'
import './i18n';
import { useInitStore } from './store';
import { RESET_STATE } from './store/actions/base-actions';
import { MyOrdersTickets } from "./components/MyOrdersTickets";

import './styles/general.scss';

export const MyOrdersTicketsWidget = ({ className, clientId, apiBaseUrl, getAccessToken, summit, user, loginUrl, ...props }) => {
    const { store, persistor } = useInitStore({ clientId, apiBaseUrl, getAccessToken, summit, user, loginUrl });

    const handleBeforeLift = () => {
        const params = new URLSearchParams(window.location.search);
        const flush = params.has("flushState");

        if (flush) store.dispatch({ type: RESET_STATE, payload: null });
    };

    return (
        <Provider store={store}>
            <PersistGate onBeforeLift={handleBeforeLift} loading={null} persistor={persistor}>
                <MyOrdersTickets {...props} />
            </PersistGate>
        </Provider>
    );
};

MyOrdersTicketsWidget.propTypes = {
    clientId: PropTypes.string.isRequired,
    apiBaseUrl: PropTypes.string.isRequired,
    getAccessToken: PropTypes.func.isRequired,
    summit: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    loginUrl: PropTypes.string.isRequired
};

// TODO: Move this to the consuming code.
MyOrdersTicketsWidget.defaultProps = {
    loginUrl: '/'
};