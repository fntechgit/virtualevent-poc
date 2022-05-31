import React from "react"
import classNames from 'classnames';
import { useTicketDetails } from "../../util";
import { TicketPopup } from "../TicketPopup/TicketPopup";

import './order-ticket-details.scss';

export const OrderTicketDetails = ({ ticket, summit, order, className }) => {
    const {
        status,
        role,
        isActive,
        isUnassigned,
        handleClick,
        showPopup,
        handlePopupClose,
        isReassignable
    } = useTicketDetails({ ticket, summit });

    return (
        <>
            <div
                className={classNames('order-ticket-details', {
                    'disabled': isUnassigned && !isReassignable,
                    [status.className]: isReassignable,
                }, className)}
                onClick={handleClick}
            >
                <div className="col-sm-1">
                    <i
                        className={classNames(
                            'order-ticket-details-icon',
                            `ticket-${status.className}`,
                            status.icon,
                            `fa fa-2x`
                        )}
                    />
                </div>

                <div className="col-sm-5">
                    <h4>{role}</h4>

                    {ticket.discount > 0 && (
                        <>
                            {(ticket.discount * 100) / ticket.raw_cost}% discount
                        </>
                    )}

                    <p className={`status ticket-${status.className}`}>
                        {status.text}
                    </p>

                    <h5><br />{ticket.number}</h5>
                </div>

                <div className="col-sm-5">
                    <h5>{ticket.owner?.email || ''}</h5>
                </div>

                <div className="col-sm-1">
                    {isActive && (
                        <i className="fa fa-angle-right" />
                    )}
                </div>
            </div>

            {showPopup && (
                <TicketPopup
                    ticket={ticket}
                    summit={summit}
                    order={order}
                    onClose={handlePopupClose}
                />
            )}
        </>
    )
}