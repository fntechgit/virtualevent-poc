import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import Alert from 'react-bootstrap/lib/Alert';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from 'openstack-uicore-foundation/lib/components'
import { assignAttendee } from "../../store/actions/ticket-actions";
import { getSummitFormattedReassignDate } from "../../util";

const initialValues = {
    reassign_email: '',
}

const validationSchema = Yup.object().shape({
    reassign_email: Yup.string().email('Please enter a valid email.').required('Email is required.'),
});

const emptyAttendee = {
    attendee_email: '',
    attendee_first_name: '',
    attendee_last_name: '',
    attendee_company: ''
};

export const TicketPopupAssignForm = ({ ticket, summit, order }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.userState.userProfile);
    const [showSaveMessage, setShowSaveMessage] = useState(false);

    const toggleSaveMessage = () => {
        setTimeout(() => setShowSaveMessage(true), 50);
        setTimeout(() => setShowSaveMessage(false), 5000);
    };

    const handleSubmit = (values, formikHelpers) => {
        dispatch(assignAttendee({
            ticket,
            order,
            data: {
                ...emptyAttendee,
                attendee_email: values.reassign_email
            }
        })).then(() => {
            toggleSaveMessage();
        });
    };

    const formik = useFormik({
        initialValues,
        onSubmit: handleSubmit,
        validationSchema
    });

    const assignTicketToSelf = () => {
        dispatch(assignAttendee({
            ticket,
            order,
            data: {
                attendee_email: userProfile.email,
                attendee_first_name: userProfile.first_name,
                attendee_last_name: userProfile.last_name
            }
        })).then(() => {
            toggleSaveMessage();
        });
    };

    return (
        <form className="ticket-assign-form" onSubmit={formik.handleSubmit}>
            {showSaveMessage && (
                <CSSTransition
                    unmountOnExit
                    in={showSaveMessage}
                    timeout={2000}
                    classNames="fade-in-out"
                >
                    <Alert bsStyle="success" className="text-center">
                        {t("tickets.assign_success_message")}
                    </Alert>
                </CSSTransition>
            )}

            <p>
                {t("ticket_popup.assign_text")}{` `}
                {getSummitFormattedReassignDate(summit)}
            </p>
            <button className="btn btn-primary" onClick={assignTicketToSelf} type="button">
                {t("ticket_popup.assign_me")}
            </button>

            <div className="ticket-popup-separator">
                <div><hr /></div>
                <span>{t("ticket_popup.assign_or")}</span>
                <div><hr /></div>
            </div>

            <p>{t("ticket_popup.assign_want_text")}</p>
            <span>{t("ticket_popup.reassign_enter_email")}</span>

            <Input
                id="reassign_email"
                name="reassign_email"
                className="form-control"
                placeholder="Email"
                error={formik.errors.reassign_email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.reassign_email}
            />

            <button
                type="submit"
                className="btn btn-primary"
                disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
            >
                {t("ticket_popup.assign_someone")}
            </button>
        </form>
    )
};