import React from "react"
import classNames from 'classnames';
import { TicketListItem } from './TicketListItem';

import styles from './index.module.scss';

export const TicketList = ({ tickets, className }) => {
    return (
        <ul className={classNames(styles.ticketList, className)}>
            {tickets.map((ticket) => (
                <TicketListItem key={ticket.id} ticket={ticket} />
            ))}
        </ul>
    );
};