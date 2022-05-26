import React from 'react';
import classNames from 'classnames';
import { useTicketDetails } from "../../util";
import { TicketPopup } from '../TicketPopup/TicketPopup';

export const TicketDetails = ({ ticket, summit, className }) => {
    const {
        status,
        type,
        isActive,
        isUnassigned,
        handleClick,
        showPopup,
        handlePopupClose,
        isReassignable,
        formattedDate
    } = useTicketDetails({ ticket, summit });

    return (
        <>
            <div
                className={classNames('ticket-details', {
                    'disabled': isUnassigned && !isReassignable,
                    [status.className]: isReassignable,
                }, className)}
                onClick={handleClick}
            >
                <div className="col-sm-1">
                    <i
                        className={classNames(
                            'ticket-details-icon',
                            `ticket-${status.className}`,
                            status.icon,
                            `fa fa-2x`
                        )}
                    />
                </div>

                <div className="col-sm-5">
                    <h4>{type.name}</h4>

                    <h5>{formattedDate}</h5>

                    <p className={`status ticket-${status.className}`}>
                        {status.text}
                    </p>
                </div>

                <div className="col-sm-6">
                    <h4>{type.name}</h4>

                    <h5 style={{ fontSize: 10 }}>{ticket.number}</h5>

                    <p>Purchased By {ticket.order.owner_first_name} {ticket.order.owner_last_name} ({ticket.order.owner_email})</p>
                </div>

                <div className="arrow col-sm-1">
                    {isActive && (
                        <i className="fa fa-angle-right" />
                    )}
                </div>
            </div>

            {showPopup && (
                <TicketPopup
                    ticket={ticket}
                    summit={summit}
                    order={ticket.order}
                    fromTicketList={true}
                    onClose={handlePopupClose}
                />
            )}
        </>
    );
};