import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { getUserInfo } from "openstack-uicore-foundation/lib/security/actions";
import { OrderList } from './OrderList/OrderList';
import { OrderListContextProvider } from './OrderList/OrderList.helpers';
import { TicketList } from './TicketList/TicketList';

export const MyOrdersTickets = ({ className }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Note: This will make sure to set the `member` data on the `loggedUserState`.
        dispatch(getUserInfo());
    }, [dispatch]);

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