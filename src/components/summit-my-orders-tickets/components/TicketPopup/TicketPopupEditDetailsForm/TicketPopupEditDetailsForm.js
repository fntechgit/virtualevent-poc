import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import Alert from 'react-bootstrap/lib/Alert';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input, RawHTML } from 'openstack-uicore-foundation/lib/components';
import ExtraQuestionsForm from 'openstack-uicore-foundation/lib/components/extra-questions';
import QuestionsSet from 'openstack-uicore-foundation/lib/utils/questions-set';
import { getMainOrderExtraQuestions } from '../../../store/actions/summit-actions';
import { useTicketDetails } from '../../../util';

import './ticket-popup-edit-details-form.scss';
import { editOwnedTicket, removeAttendee } from '../../../store/actions/ticket-actions';

const validationSchema = Yup.object().shape({
    attendee_email: Yup.string().email('Please enter a valid email.').required('Email is required.'),
    attendee_first_name: Yup.string().required('First name is required.'),
    attendee_last_name: Yup.string().required('Last name is required.'),
    attendee_company: Yup.string().required('Company is required.'),
});

const getInitialValues = (ticket) => {
    const {
        email,
        first_name,
        last_name,
        company,
        disclaimer_accepted_date,
        extra_questions
    } = ticket.owner || {};

    const formattedExtraQuestions = extra_questions.map(({ question_id, value }) => (
        { question_id: question_id, value }
    ));

    return {
        attendee_email: email,
        attendee_first_name: first_name,
        attendee_last_name: last_name,
        attendee_company: company,
        disclaimer_accepted: !!disclaimer_accepted_date,
        extra_questions: formattedExtraQuestions
    };
};

export const TicketPopupEditDetailsForm = ({ ticket, summit, order, allowExtraQuestionsEdit, shouldEditBasicInfo = true }) => {
    const formRef = useRef(null);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.userState.userProfile);
    const extraQuestions = useSelector(state => state.summitState.extra_questions || []);
    const isLoading = useSelector(state => state.orderState.loading || state.summitState.loading);
    const [inputEmail, setInputEmail] = useState(false);
    const [showSaveMessage, setShowSaveMessage] = useState(false);
    const { isUnassigned, isReassignable } = useTicketDetails({ ticket, summit });

    const readOnly = !isReassignable;
    const hasExtraQuestions = extraQuestions.length > 0;
    const isUserTicketOwner = order.owner_id === userProfile.id;

    const initialValues = getInitialValues(ticket);

    useEffect(() => {
        dispatch(getMainOrderExtraQuestions({ summit }));
    }, []);

    const toggleSaveMessage = () => {
        setTimeout(() => setShowSaveMessage(true), 50);
        setTimeout(() => setShowSaveMessage(false), 5000);
    };

    const updateTicket = (values, formikHelpers) => {
        formikHelpers.setSubmitting(true);

        const params = {
            ticket,
            order,
            data: values
        };

        if (ticket.owner?.email !== values.attendee_email)
            return dispatch(removeAttendee(params))
                .then(() => {
                    toggleSaveMessage();
                })
                .catch((error) => {
                    console.log(error);
                }).then(() => {
                    formikHelpers.setSubmitting(false);
                });

        dispatch(editOwnedTicket(params))
            .then(() => {
                toggleSaveMessage();
            })
            .catch((error) => {
                console.log(error)
            }).then(() => {
                formikHelpers.setSubmitting(false);
            });
    };

    const handleSubmit = (values, formikHelpers) => updateTicket(values, formikHelpers);

    const formik = useFormik({
        initialValues,
        onSubmit: handleSubmit,
        validationSchema
    });

    // This simply triggers the submit for the `ExtraQuestionsForm`.
    const triggerSubmit = () => {
        // TODO: We should have to do this to get the changes from the `ExtraQuestionsForm`.
        // We should be able to pass an `onChange` event handler to the `ExtraQuestionsForm`.
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    };

    const handleExtraQuestionsSubmit = (answersForm) => {
        const questionSet = new QuestionsSet(extraQuestions);

        const newAnswers = Object.keys(answersForm).reduce((acc, name) => {
            let question = questionSet.getQuestionByName(name);

            if (!question) {
                console.log(`missing question for answer ${name}.`);
                return acc;
            }

            if (answersForm[name] || answersForm[name].length > 0) {
                acc.push({ question_id: question.id, answer: `${answersForm[name]}` });
            }

            return acc;
        }, []);

        // Set the extra question answers on the formik state.
        formik.setFieldValue('extra_questions', newAnswers);

        // Submit the formik form only after setting the extra_questions field values.
        formik.handleSubmit();
    };

    return (
        <div className="ticket-popup-edit-details-form">
            {showSaveMessage && (
                <CSSTransition
                    unmountOnExit
                    in={showSaveMessage}
                    timeout={2000}
                    classNames="fade-in-out"
                >
                    <Alert bsStyle="success" className="text-center">
                        {t("tickets.save_message")}
                    </Alert>
                </CSSTransition>
            )}

            {(isLoading && !hasExtraQuestions) && <>Loading ticket information...</>}

            {(hasExtraQuestions) && (
                <>
                    <div className="row ticket-popup-basic-info">
                        <div className="col-sm-6">
                            {t("ticket_popup.edit_basic_info")}
                        </div>
                        <div className="col-sm-6">
                            {!readOnly && t("ticket_popup.edit_required")}
                        </div>
                    </div>

                    <div className="row field-wrapper">
                        <div className="col-sm-4">
                            {t("ticket_popup.edit_email")}
                            {!readOnly && t("ticket_popup.edit_required_star")}
                        </div>

                        <div className="col-sm-8">
                            {isUnassigned && (
                                <span>
                                    {inputEmail && (
                                        <Input
                                            id="attendee_email"
                                            name="attendee_email"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleblur}
                                            value={formik.values.attendee_email}
                                            error={formik.errors.attendee_email}
                                        />
                                    )}

                                    {!inputEmail && (
                                        <>
                                            <button className="btn btn-primary" onClick={() => setInputEmail(true)}>
                                                {t("ticket_popup.assign_this")}
                                            </button>

                                            <p>
                                                {t("ticket_popup.assign_expire")}{` `}
                                                {this.handleFormatReassignDate(true)}{` `}
                                                {t("ticket_popup.assign_days")}{` `}
                                                ({this.handleFormatReassignDate(false)})
                                            </p>
                                        </>
                                    )}
                                </span>
                            )}

                            {!isUnassigned && (
                                <>
                                    {inputEmail && (
                                        <Input
                                            id="attendee_email"
                                            name="attendee_email"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleblur}
                                            value={formik.values.attendee_email}
                                            error={formik.errors.attendee_email}
                                        />
                                    )}

                                    {!inputEmail && (
                                        <span>
                                            {ticket.owner?.email}

                                            {(shouldEditBasicInfo && isUserTicketOwner) && (
                                                <>
                                                    {` `}|{` `}
                                                    <span onClick={() => setInputEmail(true)}>
                                                        <u>Change</u>
                                                    </span>
                                                </>
                                            )}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="field-wrapper-mobile">
                        <div>
                            {t("ticket_popup.edit_email")}
                            {!readOnly && t("ticket_popup.edit_required_star")}
                        </div>

                        <div>
                            {isUnassigned && (
                                <span>
                                    {inputEmail && (
                                        <Input
                                            id="attendee_email"
                                            name="attendee_email"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleblur}
                                            value={formik.values.attendee_email}
                                            error={formik.errors.attendee_email}
                                        />
                                    )}

                                    {!inputEmail && (
                                        <>
                                            <button className="btn btn-primary" onClick={() => setInputEmail(true)}>
                                                {t("ticket_popup.assign_this")}
                                            </button>

                                            <p>
                                                {t("ticket_popup.assign_expire")}{` `}
                                                {this.handleFormatReassignDate(true)}{` `}
                                                {t("ticket_popup.assign_days")}{` `}
                                                ({this.handleFormatReassignDate(false)})
                                            </p>
                                        </>
                                    )}
                                </span>
                            )}

                            {!isUnassigned && (
                                <>
                                    {inputEmail && (
                                        <Input
                                            id="attendee_email"
                                            name="attendee_email"
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleblur}
                                            value={formik.values.attendee_email}
                                            error={formik.errors.attendee_email}
                                        />
                                    )}

                                    {!inputEmail && (
                                        <span>
                                            {ticket.owner?.email}

                                            {shouldEditBasicInfo && (
                                                <>
                                                    {` `}|{` `}
                                                    <span onClick={() => setInputEmail(true)}>
                                                        <u>Change</u>
                                                    </span>
                                                </>
                                            )}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="row field-wrapper">
                        <div className="col-sm-4">
                            {t("ticket_popup.edit_first_name")}
                            {t("ticket_popup.edit_required_star")}
                        </div>
                        <div className="col-sm-8">
                            {(readOnly || !shouldEditBasicInfo) && (
                                <span>{ticket.owner?.first_name}</span>
                            )}

                            {(!readOnly && shouldEditBasicInfo) && (
                                <Input
                                    id="attendee_first_name"
                                    name="attendee_first_name"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleblur}
                                    value={formik.values.attendee_first_name}
                                    error={formik.errors.attendee_first_name}
                                />
                            )}
                        </div>
                    </div>

                    <div className="field-wrapper-mobile">
                        <div>
                            {t("ticket_popup.edit_first_name")}
                            {t("ticket_popup.edit_required_star")}
                        </div>
                        <div>
                            {(readOnly || !shouldEditBasicInfo) && (
                                <span>{ticket.owner?.first_name}</span>
                            )}

                            {(!readOnly && shouldEditBasicInfo) && (
                                <Input
                                    id="attendee_first_name"
                                    name="attendee_first_name"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleblur}
                                    value={formik.values.attendee_first_name}
                                    error={formik.errors.attendee_first_name}
                                />
                            )}
                        </div>
                    </div>

                    <div className="row field-wrapper">
                        <div className="col-sm-4">
                            {t("ticket_popup.edit_last_name")}
                            {t("ticket_popup.edit_required_star")}
                        </div>
                        <div className="col-sm-8">
                            {(readOnly || !shouldEditBasicInfo) && (
                                <span>{ticket.owner?.last_name}</span>
                            )}

                            {(!readOnly && shouldEditBasicInfo) && (
                                <Input
                                    id="attendee_last_name"
                                    name="attendee_last_name"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleblur}
                                    value={formik.values.attendee_last_name}
                                    error={formik.errors.attendee_last_name}
                                />
                            )}
                        </div>
                    </div>

                    <div className="field-wrapper-mobile">
                        <div>
                            {t("ticket_popup.edit_last_name")}
                            {t("ticket_popup.edit_required_star")}
                        </div>
                        <div>
                            {(readOnly || !shouldEditBasicInfo) && (
                                <span>{ticket.owner?.last_name}</span>
                            )}

                            {(!readOnly && shouldEditBasicInfo) && (
                                <Input
                                    id="attendee_last_name"
                                    name="attendee_last_name"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleblur}
                                    value={formik.values.attendee_last_name}
                                    error={formik.errors.attendee_last_name}
                                />
                            )}
                        </div>
                    </div>

                    <div className="row field-wrapper">
                        <div className="col-sm-4">
                            {t("ticket_popup.edit_company")}
                            {t("ticket_popup.edit_required_star")}
                        </div>
                        <div className="col-sm-8">
                            {(readOnly || !shouldEditBasicInfo) && (
                                <span>{ticket.owner?.company}</span>
                            )}

                            {(!readOnly && shouldEditBasicInfo) && (
                                <Input
                                    id="attendee_company"
                                    name="attendee_company"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleblur}
                                    value={formik.values.attendee_company}
                                    error={formik.errors.attendee_company}
                                />
                            )}
                        </div>
                    </div>

                    <div className="field-wrapper-mobile">
                        <div>{t("ticket_popup.edit_company")}{t("ticket_popup.edit_required_star")}</div>
                        <div>
                            {(readOnly || !shouldEditBasicInfo) && (
                                <span>{ticket.owner?.company}</span>
                            )}

                            {(!readOnly && shouldEditBasicInfo) && (
                                <Input
                                    id="attendee_company"
                                    name="attendee_company"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleblur}
                                    value={formik.values.attendee_company}
                                    error={formik.errors.attendee_company}
                                />
                            )}
                        </div>
                    </div>

                    {hasExtraQuestions && (
                        <>
                            <hr />
                            <div className="row ticket-popup-basic-info">
                                <div className="col-sm-6">
                                    {t("ticket_popup.edit_preferences")}
                                </div>
                                <div className="col-sm-6"></div>
                            </div>

                            <ExtraQuestionsForm
                                ref={formRef}
                                readOnly={readOnly}
                                extraQuestions={extraQuestions}
                                userAnswers={formik.values.extra_questions}
                                onAnswerChanges={handleExtraQuestionsSubmit}
                                allowExtraQuestionsEdit={allowExtraQuestionsEdit}
                                questionContainerClassName="row form-group"
                                questionLabelContainerClassName="col-sm-4"
                                questionControlContainerClassName="col-sm-8 question-control-container"
                            />
                        </>
                    )}

                    {(summit.registration_disclaimer_content) && (
                        <>
                            <hr />
                            <div className="row field-wrapper">
                                <div className="col-md-12">
                                    <div className="form-check abc-checkbox">
                                        <input
                                            type="checkbox"
                                            id="disclaimer_accepted"
                                            name="disclaimer_accepted"
                                            className="form-check-input"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleblur}
                                            checked={formik.values.disclaimer_accepted}
                                        />
                                        <label className="form-check-label" htmlFor="disclaimer_accepted">
                                            {summit.registration_disclaimer_mandatory && <>*</>}
                                        </label>
                                        <div className="disclaimer">
                                            <RawHTML>
                                                {summit.registration_disclaimer_content}
                                            </RawHTML>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="field-wrapper-mobile">
                                <div>
                                    <div className="form-check abc-checkbox">
                                        <input
                                            type="checkbox"
                                            id="disclaimer_accepted"
                                            name="disclaimer_accepted"
                                            className="form-check-input"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleblur}
                                            checked={formik.values.disclaimer_accepted}
                                        />
                                        <label className="form-check-label" htmlFor="disclaimer_accepted">
                                            {summit.registration_disclaimer_mandatory && <>*</>}
                                        </label>
                                        <div className="disclaimer">
                                            <RawHTML>
                                                {summit.registration_disclaimer_content}
                                            </RawHTML>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="ticket-popup-footer-save">
                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={formik.isSubmitting}
                            onClick={triggerSubmit}
                        >
                            {!formik.isSubmitting && <>{t("ticket_popup.save_changes")}</>}
                            {formik.isSubmitting && <>{t("ticket_popup.saving_changes")}...</>}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};