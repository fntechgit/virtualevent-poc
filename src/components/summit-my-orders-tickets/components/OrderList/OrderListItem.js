import React from "react"
import classNames from 'classnames';
import { OrderDetails } from '../OrderDetails/OrderDetails';
import { OrderSummary } from '../OrderSummary/OrderSummary';
import { TicketList } from '../TicketList/TicketList';

import styles from './index.module.scss';

export const OrderListItem = ({ order, className }) => {
    return (
        <li className={classNames(styles.orderListItem, className)}>
            <div className="row">
                <div className="col-md-8">
                    <OrderDetails order={order} />
                    <TicketList tickets={order.tickets} />
                </div>

                <div className="col-md-4">
                    <OrderSummary order={order} />
                </div>
            </div>
        </li>
    );
};