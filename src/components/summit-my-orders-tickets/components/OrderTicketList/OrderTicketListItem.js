import React from "react"
import classNames from 'classnames';
import { OrderTicketDetails } from "../OrderTicketDetails/OrderTicketDetails";

export const OrderTicketListItem = ({ ticket, summit, order, className }) => {
    if (!ticket || !summit || !order) return null;

    return (
        <li className={classNames('order-ticket-list-item', className)}>
            <OrderTicketDetails ticket={ticket} summit={summit} order={order} />
        </li>
    );
};