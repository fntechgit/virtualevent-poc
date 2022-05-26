import React, { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from 'react-bootstrap';
import classNames from 'classnames';
import { getUserOrders } from "../../store/actions/order-actions";
import { OrderListItem } from './OrderListItem';

import './order-list.scss';

export const OrderList = ({ className }) => {
    const dispatch = useDispatch();

    const {
        memberOrders: orders,
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPage,
        loading: orderLoading
    } = useSelector(state => state.orderState || {});

    const {
        summits,
        loading: summitLoading
    } = useSelector(state => state.summitState || {});

    useEffect(() => {
        dispatch(getUserOrders(null, currentPage, perPage));
    }, [dispatch]);

    const handlePageChange = (page) => dispatch(getUserOrders(null, page, perPage));

    const isLoading = orderLoading || summitLoading;
    const hasOrders = orders.length > 0;
    const hasSummits = summits.length > 0;

    return (
        <>
            <h2 className="order-list-title">My Purchase Orders</h2>

            {/* TODO: Replace with `Loading` component. */}
            {(isLoading) && (
                <div className="order-list-loading">Loading...</div>
            )}

            {/* TODO: Replace with `Empty` component. */}
            {(!isLoading && (!hasOrders || !hasSummits)) && (
                <div className="order-list-empty">You have no orders.</div>
            )}

            {(hasOrders && hasSummits) && (
                <>
                    <ul className={classNames('order-list', className)}>
                        {orders.map(order => (
                            <OrderListItem key={order.id} order={order} />
                        ))}
                    </ul>

                    <div className="order-list-pagination">
                        <div className="row">
                            <div className="col-md-8">
                                <Pagination
                                    bsSize="medium"
                                    prev
                                    next
                                    first
                                    last
                                    ellipsis
                                    boundaryLinks
                                    maxButtons={5}
                                    items={lastPage}
                                    activePage={currentPage}
                                    onSelect={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};