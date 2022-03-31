import React from 'react'
import PropTypes from 'prop-types'
import Input from 'openstack-uicore-foundation/lib/components/inputs/text-input'
import Dropdown from 'openstack-uicore-foundation/lib/components/inputs/dropdown'
import RadioList from 'openstack-uicore-foundation/lib/components/inputs/radio-list'
import CheckboxList from 'openstack-uicore-foundation/lib/components/inputs/checkbox-list'
import RawHTML from 'openstack-uicore-foundation/lib/components/raw-html'

import styles from '../styles/extra-questions.module.scss'

const ExtraQuestions = ({ question, handleChange, getAnswer }) => {

    let questionValues = question.values;

    let htmlLabel = question.label;
    if (question.mandatory) {
        //Assuming that labels generated as html are wrapped in <p> bc the react-rte component generates them that way (defaultBlockTag: 'p')
        htmlLabel = htmlLabel?.endsWith('</p>') ? htmlLabel.replace(/<\/p>$/g, " <b>*</b></p>") : `${htmlLabel} <b>*</b>`;
    }

    switch (question.type) {
        case 'Text':
            return (
                <div key={question.id} className={`${styles.questionWrapper} columns`}>
                    <div className="column is-one-third" style={{ paddingTop: '10px' }}><RawHTML>{htmlLabel}</RawHTML></div>
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
                    <div className="column is-one-third" style={{ paddingTop: '10px' }}><RawHTML>{htmlLabel}</RawHTML></div>
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
                    <div className="column is-1">
                        <input type="checkbox" id={`${question.id}`} checked={(getAnswer(question) === "true")}
                            onChange={handleChange} />
                    </div>
                    <div className="column is-11">
                        <RawHTML className={styles.questionCheckbox}>{htmlLabel}</RawHTML>
                    </div>
                </div>

            );
        case 'ComboBox':
            questionValues = questionValues.map(val => ({ ...val, value: val.id }));
            return (
                <div key={question.id} className={`${styles.questionWrapper} columns`}>
                    <div className="column is-one-third"><RawHTML>{htmlLabel}</RawHTML></div>
                    <div className="column is-two-thirds">
                        <Dropdown
                            id={question.id}
                            overrideCSS={true}
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
                    <div className="column is-one-third"><RawHTML>{htmlLabel}</RawHTML></div>
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
                    <div className="column is-one-third"><RawHTML>{htmlLabel}</RawHTML></div>
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
        default:
            return null;
    }
};


ExtraQuestions.propTypes = {
    question: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    getAnswer: PropTypes.func.isRequired
};

export default ExtraQuestions
