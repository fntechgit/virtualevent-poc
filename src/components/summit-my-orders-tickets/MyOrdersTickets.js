import React from "react"
import classNames from 'classnames';
import { Pagination } from 'react-bootstrap';
import { OrderList } from './components/OrderList/OrderList';

import styles from './index.module.scss';

export const MyOrdersTickets = ({ orders, className }) => {
    return (
        <div classNames={classNames(styles.myOrdersTickets, className)}>
            <OrderList orders={orders} />

            <Pagination
                bsSize="medium"
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={10}
                items={lastPage}
                activePage={currentPage}
                onSelect={this.handlePageChange}
            />
        </div>
    );
};