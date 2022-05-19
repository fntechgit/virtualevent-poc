import React from "react"
import classNames from 'classnames';

import styles from './index.module.scss';

export const TicketListItem = ({ ticket, className }) => {
    return (
        <li className={classNames(styles.ticketListItem, className)}>
            {/* Add ticket info here... */}
        </li>
    )
}