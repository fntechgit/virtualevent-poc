import React, { createContext, useContext, useReducer } from 'react';
import { createReducer } from '../util/helpers/createReducer';

const initialState = {
    orders: []
};

const actions = ({ state, dispatch }) => ({
    setOrders: (orders) => dispatch({ type: 'setOrders', payload: orders }),
    setLoading: (loading) => dispatch({ type: 'setLoading', payload: loading })
});

const actionHandlers = {
    setOrders: (state, orders) => ({ ...state, orders }),
    setLoading: (state, loading) => ({ ...state, loading })
};

const reducer = createReducer({ actionHandlers });

export const OrdersTicketsContext = createContext(null);

export const OrdersTicketsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, {}, () => initialState);

    return (
        <OrdersTicketsContext.Provider value={{ state, dispatch }}>
            {children}
        </OrdersTicketsContext.Provider>
    );
};

export const useOrdersTicketsContext = () => {
    const context = useContext(OrdersTicketsContext);

    if (!context) throw new Error('useOrdersTicketsContext must be used within a OrdersTicketsProvider');

    return { ...context, actions: actions(context) };
};