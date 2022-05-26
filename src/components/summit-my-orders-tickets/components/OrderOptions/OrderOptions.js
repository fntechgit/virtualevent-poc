import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import classNames from 'classnames';
import { CSSTransition } from "react-transition-group";
import Alert from 'react-bootstrap/lib/Alert';
import { getSummitFormattedDate, getSummitLocation, getTicketRole, getTicketType } from '../../util';
import { cancelOrder } from '../../store/actions/order-actions';
import { getNow } from '../../store/actions/timer-actions';
import { ConfirmPopup, CONFIRM_POPUP_CASE } from '../ConfirmPopup/ConfirmPopup';

import './order-options.scss';

export const OrderOptions = ({ order, summit, ticket, guest, className }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [showConfirm, setShowConfirm] = useState(false);
    const [showRefundSuccess, setShowRefundSuccess] = useState(false);
    const now = dispatch(getNow());

    const handleCancelClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmAccept = () => {
        dispatch(cancelOrder({ order })).then(() => {
            setTimeout(() => setShowRefundSuccess(true), 500);
            setTimeout(() => setShowRefundSuccess(false), 5000);
        }).catch(() => { });

        setShowConfirm(false);
    };

    const handleConfirmReject = () => {
        setShowConfirm(false);
    };

    if (!summit) return null;

    if (guest && !ticket) return null;

    return (
        <>
            <div className={classNames('order-options', className)}>
                <CSSTransition
                    unmountOnExit
                    in={showRefundSuccess}
                    timeout={2000}
                    classNames="fade-in-out"
                >
                    <>
                        <br />
                        <Alert bsStyle="success">
                            {t("tickets.refund_request_success_message")}
                        </Alert>
                    </>
                </CSSTransition>

                {guest && (
                    <div className="order-info-wrapper">
                        <div className="row">
                            <div className="col-md-12 info">
                                <h4>{summit.name}</h4>
                                <p>{getSummitFormattedDate(summit)} <br />{getSummitLocation(summit)} </p>
                                <p>{getTicketType(ticket).name}</p>
                                <p className="role-badge">{getTicketRole(ticket)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!guest && summit.start_date > now && order && order?.status === 'Paid' && order?.amount > 0 && order?.amount > order?.refunded_amount && (
                    <button onClick={handleCancelClick} className="order-option cancel">
                        {t("order_info.cancel_order")}
                    </button>
                )}

                {/* TODO: Need to make sure we have the `REGISTRATION_EMAIL` in place. */}
                <a className="order-option cancel" target="_blank" href={`mailto:${window.REGISTRATION_EMAIL}`}>
                    {t("order_info.email_support")}
                </a>
            </div>

            <ConfirmPopup
                isOpen={showConfirm}
                popupCase={CONFIRM_POPUP_CASE.CANCEL_ORDER}
                onAccept={handleConfirmAccept}
                onReject={handleConfirmReject}
            />
        </>
    );
};