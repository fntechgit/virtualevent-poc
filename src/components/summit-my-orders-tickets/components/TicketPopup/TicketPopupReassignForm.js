import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from 'openstack-uicore-foundation/lib/components'
import { removeAttendee } from "../../store/actions/ticket-actions";
import { getSummitFormattedReassignDate } from "../../util";
import { ConfirmPopup, CONFIRM_POPUP_CASE } from "../ConfirmPopup/ConfirmPopup";

const initialValues = {
    attendee_email: '',
}

const validationSchema = Yup.object().shape({
    attendee_email: Yup.string().email('Please enter a valid email.').required('Email is required.'),
});

export const TicketPopupReassignForm = ({ ticket, summit, order, closePopup }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.userState.userProfile);
    const [showConfirm, setShowConfirm] = useState(false);
    const [newAttendeeEmail, setNewAttendeeEmail] = useState('');

    const isUserTicketOwner = userProfile.email === ticket.owner?.email;

    const handleSubmit = (values, formikHelpers) => {
        setNewAttendeeEmail(values.attendee_email);
        setShowConfirm(true);
    };

    const assignTicketToSelf = () => {
        setNewAttendeeEmail(userProfile.email);
        setShowConfirm(true);
    };

    const formik = useFormik({
        initialValues,
        onSubmit: handleSubmit,
        validationSchema
    });

    const handleConfirmAccept = async () => {
        setShowConfirm(false);
        formik.resetForm();
        setNewAttendeeEmail('');

        dispatch(removeAttendee({
            ticket,
            order,
            data: { attendee_email: newAttendeeEmail }
        }));
    };

    const handleConfirmReject = () => {
        setShowConfirm(false);
        formik.resetForm();
        setNewAttendeeEmail('')
    };

    return (
        <>
            <form className="ticket-reassign-form" onSubmit={formik.handleSubmit}>
                {!isUserTicketOwner && (
                    <>
                        <p>
                            {t("ticket_popup.reassign_text")}
                            <br />
                            <b>{ticket.owner.email}</b>
                        </p>
                        <button className="btn btn-primary" onClick={assignTicketToSelf}>{t("ticket_popup.reassign_me")}</button>

                        <div className="ticket-popup-separator">
                            <div><hr /></div>
                            <span>{t("ticket_popup.assign_or")}</span>
                            <div><hr /></div>
                        </div>
                    </>
                )}

                <p>{t("ticket_popup.reassign_want_text")}</p>
                <span>{t("ticket_popup.reassign_enter_email")}</span>

                <Input
                    id="attendee_email"
                    name="attendee_email"
                    className="form-control"
                    placeholder="Email"
                    error={formik.errors.attendee_email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.attendee_email}
                />


                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
                >
                    {t("ticket_popup.reassign_someone")}
                </button>
            </form>

            <ConfirmPopup
                isOpen={showConfirm}
                popupCase={CONFIRM_POPUP_CASE.REASSIGN_TICKET}
                onAccept={handleConfirmAccept}
                onReject={handleConfirmReject}
            />
        </>
    )
};