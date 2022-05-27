import React, { useRef } from "react"
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from 'classnames';
import { getNow } from "../../store/actions/timer-actions";
import {
    checkSummitPast,
    getDocumentOffset,
    getFormattedDate,
    getOrderStatusData,
    getOrderTicketQuantities,
    getSummitFormattedDate
} from "../../util";
import { useOrderListContext } from "../OrderList/OrderList.helpers";

import './order-details.scss';

export const OrderDetails = ({ order, summit, className }) => {
    const elementRef = useRef(null);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { state, actions } = useOrderListContext();

    const ticketQuantities = getOrderTicketQuantities(order, summit);
    const isSummitPast = checkSummitPast(summit, dispatch(getNow()));
    const statusData = getOrderStatusData(order, isSummitPast);

    const handleClick = (event) => {
        if (state.activeOrderId === order.id) return actions.setActiveOrderId(null);
        actions.setActiveOrderId(order.id);

        setTimeout(() => {
            const offset = getDocumentOffset(elementRef.current);

            console.log('offset', offset);

            window.scroll({
                top: offset.top - 30,
                behavior: 'smooth'
            });
        }, 50);
    };

    return (
        <div ref={elementRef} className="order-details" onClick={handleClick}>
            <div className="col-sm-1">
                <i className={classNames(
                    'order-details-icon',
                    `fa fa-2x ${statusData.icon}`,
                    `order-${statusData.className}`
                )} />
            </div>

            <div className="col-sm-5">
                <h4>
                    {summit.name}
                    <br />
                    {getSummitFormattedDate(summit)}
                </h4>

                <p className={classNames(
                    'status',
                    `order-${statusData.className}`,
                )}>
                    {statusData.text}
                </p>
            </div>

            <div className="col-sm-4">
                <h5>{t("orders.purchased")} {getFormattedDate(order.created)}</h5>

                <ul>
                    {Object.values(ticketQuantities).map(ticket => (
                        <li key={ticket.ticket_type_id}>
                            x{ticket.quantity} {ticket.name}
                        </li>
                    ))}
                </ul>

                <ul>
                    {order.number}
                </ul>
            </div>

            <div className="col-sm-2">
                <h4>${order.amount}</h4>
            </div>
        </div>
    );
};