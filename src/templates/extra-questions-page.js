import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from '../components/Layout'
import ExtraQuestions from '../components/ExtraQuestions'
import withOrchestra from "../utils/widgetOrchestra";

import { saveExtraQuestions } from '../actions/user-actions'

import styles from '../styles/extra-questions.module.scss'

export const ExtraQuestionsPageTemplate = ({ user, loading, summit, saveExtraQuestions }) => {

    const [answers, setAnswers] = useState([]);
    const [disclaimer, setDisclaimer] = useState();

    const extraQuestions = summit.order_extra_questions.sort((a, b) => (a.order > b.order) ? 1 : -1);

    useEffect(() => {
        const userAnswers = user.summit_tickets[0].owner.extra_questions;
        const userDisclaimer = user.summit_tickets[0].owner.disclaimer_accepted;
        setDisclaimer(userDisclaimer);
        extraQuestions.map(question => {
            const userAnswer = userAnswers.filter(a => a.question_id === question.id);
            let newAnswer = { name: question.name, id: question.id, value: '' };
            if (userAnswer.length > 0) {
                newAnswer = { ...newAnswer, value: userAnswer[0].value };
            }
            setAnswers(answers => [...answers, newAnswer])
        });

    }, [])

    const mandatoryQuestionsAnswered = () => {
        const mandatoryQuestions = extraQuestions.filter(question => question.mandatory === true);
        const mandatoryAnswers = mandatoryQuestions.every(question => {
            const answer = answers.find(a => a.id === question.id);
            return answer && answer.value;
        });
        if (summit.registration_disclaimer_mandatory) {
            return disclaimer && mandatoryAnswers;
        } else {
            return mandatoryAnswers;
        }
    }

    const toggleDisclaimer = () => setDisclaimer(!disclaimer);

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

    return (
        <>
            <div className="columns">
                <div className="column px-6 py-6 mb-6 is-half is-offset-one-quarter">
                    <h2>Additional Information</h2>
                    <span>
                        These extra questions are required before enter the event.
                    </span>
                    <div>
                        {answers.length === extraQuestions.length && extraQuestions.map(question => {
                            return <ExtraQuestions question={question} handleChange={handleChange} getAnswer={getAnswer} />
                        })}
                    </div>
                    <div className={`columns ${styles.disclaimer}`}>
                        <div className="column is-1">
                            <input type="checkbox" checked={disclaimer} onChange={toggleDisclaimer} />
                            <b>{summit.registration_disclaimer_mandatory ? '*' : ''}</b>
                        </div>
                        <div className="column is-11">
                            <span dangerouslySetInnerHTML={{ __html: summit.registration_disclaimer_content }} />
                        </div>
                    </div>
                    <button className={`${styles.buttonSave} button is-large`} disabled={!mandatoryQuestionsAnswered()} onClick={() => saveExtraQuestions(answers, disclaimer)}>
                        Save and Continue
                    </button>
                </div>
            </div>
        </>
    )
};

const ExtraQuestionsPage = (
    {
        location,
        user,
        summit,
        saveExtraQuestions,
    }
) => {
    return (
        <Layout location={location}>
            <ExtraQuestionsPageTemplate
                user={user}
                summit={summit}
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

const mapStateToProps = ({ userState, summitState }) => ({
    user: userState.userProfile,
    loading: userState.loading,
    summit: summitState.summit
})

export default connect(mapStateToProps,
    {
        saveExtraQuestions,
    }
)(ExtraQuestionsPage);