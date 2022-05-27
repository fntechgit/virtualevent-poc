import React from "react";
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { OrderDetails } from '../OrderDetails/OrderDetails';
import { OrderSummary } from '../OrderSummary/OrderSummary';
import { OrderTicketList } from '../OrderTicketList/OrderTicketList';
import { OrderOptions } from "../OrderOptions/OrderOptions";
import { useOrderListContext } from "./OrderList.helpers";

export const OrderListItem = ({ order, className }) => {
    const summit = useSelector(state => state.summitState.summits.find(summit => summit.id == order.summit_id));
    const { state } = useOrderListContext();

    const isActive = state.activeOrderId === order.id;

    return (
        <li className={classNames('order-list-item', { active: isActive }, className)}>
            <div className="order-list-item-content row">
                <div className="col-md-8">
                    <OrderDetails order={order} summit={summit} />

                    {isActive && (
                        <>
                            <OrderSummary type="mobile" order={order} summit={summit} />

                            {summit.ticket_types.map((ticketType, index) => {
                                const tickets = order.tickets.filter(t => t.ticket_type_id == ticketType.id);

                                if (tickets.length < 1) return null;

                                return (
                                    <OrderTicketList
                                        key={index}
                                        ticketType={ticketType}
                                        tickets={tickets}
                                        summit={summit}
                                        order={order}
                                    />
                                )
                            })}
                        </>
                    )}
                </div>

                <div className="col-md-4">
                    {isActive && (
                        <div className="order-list-item-sidebar">
                            <OrderSummary order={order} summit={summit} />
                            <OrderOptions order={order} summit={summit} />
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};