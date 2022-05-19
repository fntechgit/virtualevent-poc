import React from "react"
import classNames from 'classnames';

import styles from './index.module.scss';

export const OrderSummary = ({ order, className }) => {
    return (
        <div className={classNames(styles.orderSummary, className)}>
            {/* Add order summary here... */}
        </div>
    )
}