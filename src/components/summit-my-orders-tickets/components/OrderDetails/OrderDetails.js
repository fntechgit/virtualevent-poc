import React from "react"
import classNames from 'classnames';

import styles from './index.module.scss';

export const OrderDetails = ({ order, className }) => {
    return (
        <div className={classNames(styles.orderDetails, className)}>
            {/* Add order details here... */}
        </div>
    )
}