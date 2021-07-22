import React from 'react'
import PropTypes from 'prop-types'
import { Input, Dropdown, RadioList, CheckboxList } from 'openstack-uicore-foundation/lib/components'
import styles from '../styles/extra-questions.module.scss'

const ExtraQuestions = ({ question, handleChange, getAnswer }) => {    

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


export default ExtraQuestions
