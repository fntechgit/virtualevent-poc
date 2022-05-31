import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { AjaxLoader } from "openstack-uicore-foundation/lib/components";
import { OrderList } from './OrderList/OrderList';
import { OrderListContextProvider } from './OrderList/OrderList.helpers';
import { TicketList } from './TicketList/TicketList';

export const MyOrdersTickets = ({ className }) => {
    const isLoading = useSelector(state => state.orderState.loading || state.ticketState.loading || state.summitState.loading);

    return (
        <>
            <AjaxLoader show={isLoading} size={120} />

            <div className={classNames('my-orders-tickets', className)}>
                <OrderListContextProvider>
                    <OrderList />
                </OrderListContextProvider>

                <hr className="orders-tickets-divider" />

                <TicketList />
            </div>
        </>
    );
};