import React from "react"
import classNames from 'classnames';

import styles from './index.module.scss';

export const TicketDetails = ({ order, className }) => {
    return (
        <div className={classNames(styles.ticketDetails, className)}>
            {/* Add order details here... */}
        </div>
    )
}