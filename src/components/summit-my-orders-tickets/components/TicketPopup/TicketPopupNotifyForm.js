import React from 'react';
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { resendNotification } from '../../store/actions/ticket-actions';
import { getSummitFormattedReassignDate } from '../../util';

export const TicketPopupNotifyForm = ({ ticket, summit, order, closePopup }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleNotifyButtonClick = () => {
        dispatch(resendNotification(ticket));
    };

    return (
        <div className="ticket-notify-form">
            <p>{t("ticket_popup.notify_text_1")} {getSummitFormattedReassignDate(summit)}.</p>
            <p>{t("ticket_popup.notify_text_2")} <b>{ticket.owner.email}</b></p>
            <button className="btn btn-primary" onClick={handleNotifyButtonClick}>
                {t("ticket_popup.notify_button")}
            </button>
        </div>
    );
};