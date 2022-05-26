import React from 'react';
import { useSelector } from 'react-redux';
import { TicketDetails } from '../TicketDetails/TicketDetails';

export const TicketListItem = ({ ticket, className }) => {
    const summit = useSelector(state => state.summitState.summits.find(summit => summit.id === ticket.owner.summit_id));

    if (!ticket || !summit) return null;

    return (
        <li className="ticket-list-item">
            <div className="ticket-list-item-content row">
                <div className="col-md-8">
                    <TicketDetails ticket={ticket} summit={summit} className={className} />
                </div>
            </div>
        </li>
    );
};