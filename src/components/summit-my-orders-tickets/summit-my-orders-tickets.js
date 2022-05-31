import React from "react"
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import './i18n';
import { useInitStore } from './store';
import { RESET_STATE } from './store/actions/base-actions';
import { MyOrdersTickets } from "./components/MyOrdersTickets";

import './styles/general.scss';

export const MyOrdersTicketsWidget = ({ className, ...props }) => {
    const { store, persistor } = useInitStore({
        clientId: props.clientId,
        apiBaseUrl: props.apiBaseUrl,
        getAccessToken: props.getAccessToken,
        summitId: props.summitId,
        user: props.user
    });

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

MyOrdersTicketsWidget.defaultProps = {
    summitId: 'all'
};