import React, { createContext, useContext, useReducer } from "react";
import { createReducer } from '../../util/helpers/createReducer';

const initialState = {
    activeOrderId: null,
};

const actions = ({ state, dispatch }) => ({
    setActiveOrderId: (orderId) => dispatch({ type: 'setActiveOrderId', payload: orderId }),
});

const actionHandlers = {
    setActiveOrderId: (state, orderId) => ({ ...state, activeOrderId: orderId })
};

const reducer = createReducer({ actionHandlers });

export const OrderListContext = createContext(null);

export const OrderListContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, {}, () => initialState);

    return (
        <OrderListContext.Provider value={{ state, dispatch }}>
            {children}
        </OrderListContext.Provider>
    )
};

export const useOrderListContext = () => {
    const context = useContext(OrderListContext);

    if (!context) throw new Error('useOrderListContext must be used within a OrderListContextProvider');

    return { ...context, actions: actions(context) };
};