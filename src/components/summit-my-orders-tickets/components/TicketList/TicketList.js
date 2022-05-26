import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from 'react-bootstrap';
import classNames from 'classnames';
import { getUserTickets } from "../../store/actions/ticket-actions";
import { TicketListItem } from './TicketListItem';

import './ticket-list.scss';

export const TicketList = ({ className }) => {
    const dispatch = useDispatch();

    const {
        memberTickets: tickets,
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPage,
        loading: ticketLoading
    } = useSelector(state => state.ticketState || {});

    const {
        summits,
        loading: summitLoading
    } = useSelector(state => state.summitState || {});

    useEffect(() => {
        dispatch(getUserTickets(null, currentPage, perPage));
    }, [dispatch]);

    const handlePageChange = (page) => dispatch(getUserTickets(null, page, perPage));

    const isLoading = ticketLoading || summitLoading;
    const hasTickets = tickets.length > 0;
    const hasSummits = summits.length > 0;

    return (
        <>
            <h2 className="ticket-list-title">Other Tickets Assigned to Me</h2>

            {/* TODO: Replace with `Loading` component. */}
            {(isLoading) && (
                <div className="ticket-list-loading">Loading...</div>
            )}

            {/* TODO: Replace with `Empty` component. */}
            {(!isLoading && (!hasTickets || !hasSummits)) && (
                <div className="ticket-list-empty">You have no tickets.</div>
            )}

            {(hasTickets && hasSummits) && (
                <>
                    <ul className={classNames('ticket-list', className)}>
                        {tickets.map(ticket => (
                            <TicketListItem key={ticket.id} ticket={ticket} />
                        ))}
                    </ul>

                    <div className="ticket-list-pagination">
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
}