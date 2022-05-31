import React from 'react';
import classNames from 'classnames';
import { OrderList } from './OrderList/OrderList';
import { OrderListContextProvider } from './OrderList/OrderList.helpers';
import { TicketList } from './TicketList/TicketList';

export const MyOrdersTickets = ({ className }) => {
    return (
        <div className={classNames('my-orders-tickets', className)}>
            <OrderListContextProvider>
                <OrderList />
            </OrderListContextProvider>

            <hr className="orders-tickets-divider" />

            <TicketList />
        </div>
    );
};