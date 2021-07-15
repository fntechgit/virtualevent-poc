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

import { doLogin, passwordlessStart } from 'openstack-uicore-foundation/lib/methods'
import { getEnvVariable, SUMMIT_API_BASE_URL } from '../utils/envVariables'

import styles from '../styles/lobby-hero.module.scss'
import { getUserProfile, setPasswordlessLogin } from "../actions/user-actions";
import { getThirdPartyProviders } from "../actions/summit-actions";

const RegistrationLiteComponent = ({ registrationProfile, getThirdPartyProviders, thirdPartyProviders, getUserProfile, setPasswordlessLogin, location, loadingProfile, loadingIDP }) => {

    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(getUrlParam('registration'))
        getThirdPartyProviders();
    }, [])


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
        if (providers_array?.length > 0) {
            providers_array.map(p => {
                switch (p) {
                    case 'facebook': {
                        const provider = { button_color: '#0370C5', provider_label: 'Facebook', provider_param: p };
                        providers.push(provider);
                        break;
                    }
                    case 'google': {
                        const provider = { button_color: '#DD4437', provider_label: 'Google', provider_param: p };
                        providers.push(provider);
                        break;
                    }
                    case 'apple': {
                        const provider = { button_color: '#000000', provider_label: 'Apple ID', provider_param: p };
                        providers.push(provider);
                        break;
                    }
                    case 'linkedin': {
                        const provider = { button_color: '#3FA2F7', provider_label: 'LinkedIn', provider_param: p };
                        providers.push(provider);
                        break;
                    }
                    case 'microsoft': {
                        const provider = { button_color: '#2272E7', provider_label: 'Microsoft', provider_param: p };
                        providers.push(provider);
                        break;
                    }
                }
            })
        }
        return providers;
    }

    const getPasswordlessCode = (email) => {
        const params = {
            connection: "email",
            send: "code",
            email
        }

        return passwordlessStart(params)
    };

    const loginPasswordless = (code, email) => {
        const params = {
            connection: "email",
            otp: code,
            email
        }

        navigate('/#registration=1');

        return setPasswordlessLogin(params);
    };

    const widgetProps = {
        apiBaseUrl: getEnvVariable(SUMMIT_API_BASE_URL),
        summitData: SummitData.summit,
        profileData: registrationProfile,
        marketingData: MarketingData.colors,
        loginOptions: formatThirdPartyProviders(thirdPartyProviders),
        loading: loadingProfile || loadingIDP,
        authUser: (provider) => onClickLogin(provider),
        getPasswordlessCode: async (email) => await getPasswordlessCode(email),
        loginWithCode: async (code, email) => await loginPasswordless(code, email),
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
    loadingProfile: userState.loading,
    loadingIDP: userState.loadingIDP,
    thirdPartyProviders: summitState.third_party_providers
})

export default connect(mapStateToProps, { getThirdPartyProviders, getUserProfile, setPasswordlessLogin })(RegistrationLiteComponent)
