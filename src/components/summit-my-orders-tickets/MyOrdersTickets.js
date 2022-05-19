import React from "react"
import classNames from 'classnames';
import { OrderList } from './components/OrderList/OrderList';

import styles from './index.module.scss';

export const MyOrdersTickets = ({ orders, className }) => {
    return (
        <OrdersTicketsProvider>
            <div classNames={classNames(styles.myOrdersTickets, className)}>
                <OrderList orders={orders} />
            </div>
        </OrdersTicketsProvider>
    );
};