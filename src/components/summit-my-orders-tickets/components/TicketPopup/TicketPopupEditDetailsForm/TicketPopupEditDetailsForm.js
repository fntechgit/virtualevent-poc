import React from 'react';
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from 'openstack-uicore-foundation/lib/components'

const validationSchema = Yup.object().shape({
    reassign_email: Yup.string().email('Please enter a valid email.').required('Email is required.'),
});

export const TicketPopupEditDetailsForm = ({ ticket, summit, closePopup }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const initialValues = {
        reassign_email: '',
    }

    const handleSubmit = (values, formikHelpers) => {
        // dispatch();
        closePopup();
    };

    const formik = useFormik({
        initialValues,
        onSubmit: handleSubmit,
        validationSchema
    });

    return (
        <form className="ticket-edit-details-form" onSubmit={formik.handleSubmit}>

        </form>
    );
};