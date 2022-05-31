import React, { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import classNames from 'classnames';
import { getUserOrders } from "../../store/actions/order-actions";
import { OrderListItem } from './OrderListItem';

import './order-list.scss';

export const OrderList = ({ className }) => {
    const { t } = useTranslation();
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
    const hasMultiplePages = orders.length > perPage;


    return (
        <>
            <h2 className="order-list-title">My Purchase Orders</h2>

            {/* TODO: Replace with inline `Loading` component. */}
            {(isLoading) && (
                <div className="order-list-loading">{t("orders.loading")}</div>
            )}

            {/* TODO: Replace with `Empty` component. */}
            {(!isLoading && (!hasOrders || !hasSummits)) && (
                <div className="order-list-empty">{t("orders.empty")}</div>
            )}

            {(hasOrders && hasSummits) && (
                <>
                    <ul className={classNames('order-list', className)}>
                        {orders.map(order => (
                            <OrderListItem key={order.id} order={order} />
                        ))}
                    </ul>

                    {hasMultiplePages && (
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
                    )}
                </>
            )}
        </>
    );
};