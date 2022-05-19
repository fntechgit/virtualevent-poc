import React from "react"
import classNames from 'classnames';
import { Pagination } from 'react-bootstrap';
import { OrderListItem } from './OrderListItem';

import styles from './index.module.scss';

export const OrderList = ({ orders, className }) => {
    const { state, actions } = useOrdersTicketsContext();

    console.log(state);

    return (
        <>

            <ul className={classNames(styles.orderList, className)}>
                {orders.map((order) =>
                    <OrderListItem key={order.id} order={order} />
                )}
            </ul>

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
        </>
    );
};