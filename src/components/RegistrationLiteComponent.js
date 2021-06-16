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
import { requireExtraQuestions } from '../utils/userUtils'

import styles from '../styles/lobby-hero.module.scss'
import { getUserProfile } from "../actions/user-actions";
import { getThirdPartyProviders } from "../actions/summit-actions";

const RegistrationLiteComponent = ({ userProfile, registrationProfile, showPopup, getThirdPartyProviders, thirdPartyProviders, location }) => {

    useEffect(() => {
        setIsActive(getUrlParam('registration'))
        getThirdPartyProviders();
    }, [])

    const [isActive, setIsActive] = useState(showPopup);

    const getBackURL = () => {
        let backUrl = '/#registration=1';
        return URI.encode(backUrl);
    }

    const onClickLogin = (provider) => {
        doLogin(getBackURL(), provider);
    }

    const formatThirdPartyProviders = (providers_array) => {
        const providers = [
            { button_color: '#082238', provider_label: 'FNid' },
        ]
        providers_array.map(p => {
            switch (p) {
                case 'facebook': {
                    const provider = { button_color: '#0370C5', provider_label: 'Facebook', provider_param: 'facebook' };
                    providers.push(provider);
                    break;
                }
                case 'google': {
                    const provider = { button_color: '#DD4437', provider_label: 'Google', provider_param: 'google' };
                    providers.push(provider);
                    break;
                }
                case 'apple': {
                    const provider = { button_color: '#000000', provider_label: 'Apple ID', provider_param: 'apple' };
                    providers.push(provider);
                    break;
                }
                case 'microsoft': {
                    const provider = { button_color: '#2272E7', provider_label: 'Microsoft', provider_param: 'microsoft' };
                    providers.push(provider);
                    break;
                }
            }
        })
        return providers;
    }

    const widgetProps = {
        apiBaseUrl: getEnvVariable(SUMMIT_API_BASE_URL),
        summitData: SummitData.summit,
        profileData: registrationProfile,
        marketingData: MarketingData.colors,
        loginOptions: formatThirdPartyProviders(thirdPartyProviders),
        requireExtraQuestions: userProfile?.summit_tickets?.length > 0 && requireExtraQuestions(userProfile),
        authUser: (provider) => onClickLogin(provider),
        getAccessToken: async () => await getAccessToken(),
        closeWidget: () => setIsActive(false),
        goToExtraQuestions: async () => {
            await getUserProfile();
            navigate('/a/extra-questions')
        },
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


const mapStateToProps = ({ userState, summitState }) => ({
    registrationProfile: userState.idpProfile,
    userProfile: userState.userProfile,
    thirdPartyProviders: summitState.third_party_providers
})

export default connect(mapStateToProps, { getThirdPartyProviders })(RegistrationLiteComponent)
