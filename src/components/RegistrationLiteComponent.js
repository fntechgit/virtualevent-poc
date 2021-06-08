import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { connect } from "react-redux";
import URI from "urijs"

import {
    getAccessToken
} from 'openstack-uicore-foundation/lib/methods';

// these two libraries are client-side only
import RegistrationLiteWidget from 'summit-registration-lite/dist';
import 'summit-registration-lite/dist/index.css';

import SummitData from '../content/summit.json'
import MarketingData from '../content/colors.json'
import MarketingSite from '../content/marketing-site.json'
import { getUrlParam } from "../utils/fragmentParser";

import { doLogin } from 'openstack-uicore-foundation/lib/methods'
import { getEnvVariable, SUMMIT_API_BASE_URL } from '../utils/envVariables'

import styles from '../styles/lobby-hero.module.scss'

const RegistrationLiteComponent = ({ userProfile, showPopup, location }) => {

    useEffect(() => {
        setIsActive(getUrlParam('registration'))
    }, [])

    const [isActive, setIsActive] = useState(showPopup);

    const getBackURL = () => {
        let backUrl = '/#registration=1';
        return URI.encode(backUrl);
    }

    const onClickLogin = (provider) => {
        doLogin(getBackURL(), provider);
    }

    const widgetProps = {
        apiBaseUrl: getEnvVariable(SUMMIT_API_BASE_URL),
        summitData: SummitData.summit,
        profileData: userProfile,
        marketingData: MarketingData.colors,
        loginOptions: [
            { button_color: '#082238', provider_label: 'FNid', provider_param: 'fnid' },
            { button_color: '#0370C5', provider_label: 'Facebook', provider_param: 'facebook' }
        ],
        authUser: (provider) => onClickLogin(provider),
        getAccessToken: async () => await getAccessToken(),
        closeWidget: () => setIsActive(false),
        goToExtraQuestions: () => navigate('/a/extra-questions'),
        goToEvent: () => navigate('/a/'),
    };

    return (
        <React.Fragment>
            <button className={`${styles.button} button is-large`} onClick={() => setIsActive(true)}>
                <i className={`fa fa-2x fa-edit icon is-large`}></i>
                <b>{MarketingSite.heroBanner.buttons.registerButton.text}</b>
            </button>
            <div>
                {isActive && <RegistrationLiteWidget {...widgetProps} />}
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = ({ userState }) => ({
    userProfile: userState.idpProfile
})

export default connect(mapStateToProps, {})(RegistrationLiteComponent)
