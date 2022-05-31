import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { useTranslation } from "react-i18next";
import classNames from 'classnames';
import { getTicketPDF } from '../../store/actions/ticket-actions';
import { getWindowScroll, useTicketDetails } from '../../util';
import { TicketPopupReassignForm } from './TicketPopupReassignForm';
import { TicketPopupAssignForm } from './TicketPopupAssignForm';
import { TicketPopupNotifyForm } from './TicketPopupNotifyForm';
import { TicketPopupRefundForm } from './TicketPopupRefundForm';
import { TicketPopupEditDetailsForm } from './TicketPopupEditDetailsForm/TicketPopupEditDetailsForm';

import './ticket-popup.scss';


// const defaultTemporaryTicket = {
//     id: 0,
//     attendee_email: '',
//     attendee_first_name: '',
//     attendee_last_name: '',
//     attendee_company: '',
//     reassign_email: '',
//     disclaimer_accepted: null,
//     extra_questions: [],
//     errors: {
//         reassign_email: '',
//         attendee_email: ''
//     }
// };

export const TicketPopup = ({ ticket, order, summit, onClose, fromTicketList, fromOrderList, className }) => {
    const previousScrollPosition = useRef(getWindowScroll());
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.userState.userProfile);
    const isLoading = useSelector(state => state.summitState.loading || state.orderState.loading || state.summitState.loading);

    const {
        isSummitPast,
        isSummitStarted,
        type: ticketType,
        role: ticketRole,
        status: statusData,
        reassignDate,
        isActive,
        isUnassigned,
        isReassignable,
        isRefundable
    } = useTicketDetails({ ticket, summit });

    const ticketName = ticketType.name;
    const isUserTicketOwner = order.owner_id === userProfile.id;
    // If the user is purchasing a ticket, allow to edit the extra questions (fromTicketList === undefined && fromOrderList === undefined)
    const allowExtraQuestionsEdit = (fromTicketList === undefined && fromOrderList === undefined) || isUserTicketOwner && summit.allow_update_attendee_extra_questions;


    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'visible';

            window.scrollTo({
                top: previousScrollPosition.current.top
            });
        };
    }, []);


    const closePopup = () => {
        if (onClose) onClose();
    };

    const handleDownloadClick = () => {
        dispatch(getTicketPDF(ticket));
    };

    const handleCloseClick = () => {
        closePopup();
    };

    return (
        <div className={classNames('ticket-popup', className)}>
            <div className="ticket-popup-content">
                <header className="ticket-popup-header">
                    <div className="ticket-popup-title">
                        <h4>{ticketName}</h4>

                        <h5>
                            {ticket.number}
                        </h5>

                        <p>
                            Purchased By {order.owner_first_name} {order.owner_last_name} ({order.owner_email})
                        </p>

                        <p>
                            {ticketRole}
                        </p>

                        <p className={`status status-${statusData.className}`}>
                            {statusData.text}
                        </p>
                    </div>


                    <div className="ticket-popup-icons">
                        {!summit.is_virtual && (
                            <i onClick={handleDownloadClick} className="fa fa-file-pdf-o" />
                        )}

                        <i onClick={handleCloseClick} className="fa fa-times" />
                    </div>
                </header>

                <section className="ticket-popup-body">
                    <Tabs selectedTabClassName="ticket-popup-tabs--active">
                        <TabList className="ticket-popup-tabs">
                            {isUnassigned && (
                                <Tab>{t("ticket_popup.tab_assign")}</Tab>
                            )}

                            <Tab>{t("ticket_popup.tab_edit")}</Tab>

                            {!isUnassigned && isReassignable && (!fromTicketList || (fromTicketList && isUserTicketOwner)) && (
                                <Tab>{t("ticket_popup.tab_reassign")}</Tab>
                            )}

                            {!isUnassigned && (!fromTicketList && !isUserTicketOwner && isReassignable) && (
                                <Tab>{t("ticket_popup.tab_notify")}</Tab>
                            )}

                            {isUserTicketOwner && !isSummitStarted && isRefundable && (
                                <Tab>{t("ticket_popup.tab_refund")}</Tab>
                            )}
                        </TabList>

                        {isUnassigned && (
                            <TabPanel className="ticket-popup-panel ticket-popup-panel--assign">
                                <div className="ticket-popup-scroll">
                                    <TicketPopupAssignForm ticket={ticket} summit={summit} order={order} closePopup={closePopup} />
                                </div>
                            </TabPanel>
                        )}

                        <TabPanel className="ticket-popup-panel ticket-popup-panel--edit">
                            <div className="ticket-popup-scroll">
                                <TicketPopupEditDetailsForm
                                    ticket={ticket}
                                    summit={summit}
                                    order={order}
                                    closePopup={closePopup}
                                    allowExtraQuestionsEdit={allowExtraQuestionsEdit} />
                            </div>
                        </TabPanel>

                        {!isUnassigned && isReassignable && (!fromTicketList || (fromTicketList && isUserTicketOwner)) && (
                            <TabPanel className="ticket-popup-panel ticket-popup-panel--reassign">
                                <div className="ticket-popup-scroll">
                                    <TicketPopupReassignForm ticket={ticket} summit={summit} order={order} closePopup={closePopup} />
                                </div>
                            </TabPanel>
                        )}

                        {!isUnassigned && (!fromTicketList && !isUserTicketOwner && isReassignable) && (
                            <TabPanel className="ticket-popup-panel ticket-popup-panel--notify">
                                <div className="ticket-popup-scroll">
                                    <TicketPopupNotifyForm ticket={ticket} summit={summit} order={order} closePopup={closePopup} />
                                </div>
                            </TabPanel>
                        )}

                        {isUserTicketOwner && !isSummitStarted && isRefundable && (
                            <TabPanel className="ticket-popup-panel ticket-popup-panel--refund">
                                <div className="ticket-popup-scroll">
                                    <TicketPopupRefundForm ticket={ticket} summit={summit} order={order} closePopup={closePopup} />
                                </div>
                            </TabPanel>
                        )}
                    </Tabs>
                </section>
            </div>
        </div>
    )
};