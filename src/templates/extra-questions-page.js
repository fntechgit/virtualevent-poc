import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'
import { AjaxLoader, Input, Dropdown, RadioList, CheckboxList } from 'openstack-uicore-foundation/lib/components'

import Layout from '../components/Layout'
import withOrchestra from "../utils/widgetOrchestra";

import { saveExtraQuestions } from '../actions/user-actions'

import SummitObject from '../content/summit.json';

import styles from '../styles/extra-questions.module.scss'

export const ExtraQuestionsPageTemplate = ({ user, loading, saveExtraQuestions }) => {

    const [answers, setAnswers] = useState([]);

    const extraQuestions = SummitObject.summit.order_extra_questions.sort((a, b) => (a.order > b.order) ? 1 : -1);

    useState(() => {
        const userAnswers = user.summit_tickets[0].owner.extra_questions;
        extraQuestions.map(question => {
            const userAnswer = userAnswers.filter(a => a.question_id === question.id);
            let newAnswer = { name: question.name, id: question.id, value: '' };
            if (userAnswer.length > 0) {
                newAnswer = { ...newAnswer, value: userAnswer[0].value };
            }
            setAnswers(answers => [...answers, newAnswer])
        });

    }, [])

    const handleChange = (ev) => {
        let { value, id } = ev.target;

        if (ev.target.type === 'checkbox') {
            value = ev.target.checked ? "true" : "false";
        }

        if (ev.target.type === 'checkboxlist') {
            value = ev.target.value.join(',');
        }

        let newAnswer = answers.find(a => a.id === parseInt(id));
        newAnswer.value = value;

        setAnswers(answers => [...answers.filter(a => a.id !== parseInt(id)), newAnswer]);
    }

    const getAnswer = (question) => answers.find(a => a.id === question.id).value;

    const getInput = (question) => {
        let questionValues = question.values;

        switch (question.type) {
            case 'Text':
                return (
                    <div key={question.id} className={`${styles.questionWrapper} columns`}>
                        <div className="column is-one-third" style={{ paddingTop: '10px' }}>{question.label} <b>{question.mandatory ? '*' : ''}</b></div>
                        <div className="column is-two-thirds">
                            <Input
                                id={question.id}
                                value={getAnswer(question)}
                                onChange={handleChange}
                                placeholder={question.placeholder}
                                className="form-control"
                            />
                        </div>
                    </div>
                );
            case 'TextArea':
                return (
                    <div key={question.id} className={`${styles.questionWrapper} columns`}>
                        <div className="column is-one-third" style={{ paddingTop: '10px' }}>{question.label} <b>{question.mandatory ? '*' : ''}</b></div>
                        <div className="column is-two-thirds">
                            <textarea
                                id={question.id}
                                value={getAnswer(question)}
                                onChange={handleChange}
                                placeholder={question.placeholder}
                                className="form-control"
                                rows="4"
                            />
                        </div>
                    </div>
                );
            case 'CheckBox':
                return (
                    <div key={question.id} className={`${styles.questionWrapper} columns`}>
                        <div className="column is-one-third">{question.label} <b>{question.mandatory ? '*' : ''}</b></div>
                        <div className="column is-two-thirds">
                            <input type="checkbox" id={`${question.id}`} checked={(getAnswer(question) === "true")}
                                onChange={handleChange} />
                        </div>
                    </div>

                );
            case 'ComboBox':
                questionValues = questionValues.map(val => ({ ...val, value: val.id }));
                return (
                    <div key={question.id} className={`${styles.questionWrapper} columns`}>
                        <div className="column is-one-third">{question.label} <b>{question.mandatory ? '*' : ''}</b></div>
                        <div className="column is-two-thirds">
                            <Dropdown
                                id={question.id}
                                value={getAnswer(question)}
                                options={questionValues}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                );
            case 'CheckBoxList':
                questionValues = questionValues.map(val => ({ ...val, value: val.id }));
                const answerValue = getAnswer(question) ? getAnswer(question).split(',').map(ansVal => parseInt(ansVal)) : [];
                return (
                    <div key={question.id} className={`${styles.questionWrapper} columns`}>
                        <div className="column is-one-third">{question.label} <b>{question.mandatory ? '*' : ''}</b></div>
                        <div className="column is-two-thirds">
                            <CheckboxList
                                id={`${question.id}`}
                                value={answerValue}
                                options={questionValues}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                );
            case 'RadioButtonList':
                questionValues = questionValues.map(val => ({ ...val, value: val.id }));
                return (
                    <div key={question.id} className={`${styles.questionWrapper} columns`}>
                        <div className="column is-one-third">{question.label} <b>{question.mandatory ? '*' : ''}</b></div>
                        <div className="column is-two-thirds">
                            <RadioList
                                id={`${question.id}`}
                                value={getAnswer(question)}
                                options={questionValues}
                                onChange={handleChange}
                                inline
                            />
                        </div>
                    </div>
                );
        }
    }

    return (
        <React.Fragment>
            <div className="columns">
                <div className="column px-6 py-6 mb-6 is-half is-offset-one-quarter">
                    <h2>Additional Information</h2>
                    <span>
                        These extra questions are required before enter the event.
                    </span>
                    <div>
                        {answers.length === extraQuestions.length && extraQuestions.map(question => {
                            return getInput(question)
                        })}
                    </div>
                    <button className={`${styles.buttonSave} button is-large`} onClick={() => saveExtraQuestions(answers)}>
                        Save and Continue
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
};

const OrchestedTemplate = withOrchestra(ExtraQuestionsPageTemplate);

const ExtraQuestionsPage = (
    {
        location,
        user,
        saveExtraQuestions,
    }
) => {
    return (
        <Layout location={location}>
            <OrchestedTemplate
                user={user}
                saveExtraQuestions={saveExtraQuestions} />
        </Layout>
    )
}

ExtraQuestionsPage.propTypes = {
    user: PropTypes.object,
    saveExtraQuestions: PropTypes.func,
}

ExtraQuestionsPageTemplate.propTypes = {
    user: PropTypes.object,
    saveExtraQuestions: PropTypes.func,
}

const mapStateToProps = ({ userState }) => ({
    user: userState.userProfile,
    loading: userState.loading,
})

export default connect(mapStateToProps,
    {
        saveExtraQuestions,
    }
)(ExtraQuestionsPage);