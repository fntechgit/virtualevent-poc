import React from "react"
import classNames from 'classnames';
import { OrderListItem } from './OrderListItem';

import styles from './index.module.scss';

export const OrderList = ({ orders, className }) => {
    return (
        <ul className={classNames(styles.orderList, className)}>
            {orders.map((order) =>
                <OrderListItem key={order.id} order={order} />
            )}
        </ul>
    );
};