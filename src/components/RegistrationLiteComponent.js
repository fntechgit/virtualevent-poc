import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { connect } from "react-redux";
import URI from "urijs"

import {
    getAccessToken
} from 'openstack-uicore-foundation/lib/methods';

// these two libraries are client-side only
import RegistrationLiteWidget from 'summit-registration-lite/dist';

import { FragmentParser } from "openstack-uicore-foundation/lib/components";
import { doLogin, passwordlessStart, doLogout } from 'openstack-uicore-foundation/lib/methods'

import { getEnvVariable, SUMMIT_API_BASE_URL, OAUTH2_CLIENT_ID, REGISTRATION_BASE_URL, AUTHORIZED_DEFAULT_PATH } from '../utils/envVariables'

import { getUserProfile, setPasswordlessLogin, setUserOrder, checkOrderData } from "../actions/user-actions";
import { getThirdPartyProviders } from "../actions/base-actions";

import 'summit-registration-lite/dist/index.css';
import styles from '../styles/marketing-hero.module.scss'
import Swal from "sweetalert2";

const RegistrationLiteComponent = ({
    registrationProfile,
    userProfile,
    getThirdPartyProviders,
    thirdPartyProviders,
    getUserProfile,
    setPasswordlessLogin,
    setUserOrder,
    checkOrderData,
    loadingProfile,
    loadingIDP,
    summit,
    colorSettings,
    siteSettings , 
    allowsNativeAuth,
    allowsOtpAuth,
}) => {

    const [isActive, setIsActive] = useState(false);
    // this variable let to know to the widget that should not show
    // the message with already have a ticket if its a recent purchase.
    const [isRecentPurchase, setIsRecentPurchase] = useState(false);

    useEffect(() => {
        const fragmentParser = new FragmentParser();
        setIsActive(fragmentParser.getParam('registration'));
        getThirdPartyProviders();
    }, []);


    const getBackURL = () => {
        let backUrl = '/#registration=1';
        return URI.encode(backUrl);
    };

    const onClickLogin = (provider) => {
        doLogin(getBackURL(), provider);
    };

    const handleCompanyError = () => {
        console.log('company error...')
        Swal.fire("ERROR", "Hold on. Your session expired!.", "error").then(() => {
            // save current location and summit slug, for further redirect logic
            window.localStorage.setItem('post_logout_redirect_path', new URI(window.location.href).pathname());
            doLogout();
        });
    }

    const formatThirdPartyProviders = (providers_array) => {
        const providers = [
            { button_color: '#082238', provider_label: 'Continue with FNid', provider_param: '', provider_logo: '../img/logo_fn.svg', provider_logo_size: 35 },
        ];

        const thirdPartyProviders = [
            { button_color: '#1877F2', provider_label: 'Continue with Facebook', provider_param: 'facebook', provider_logo: '../img/third-party-idp/logo_facebook.svg', provider_logo_size: 22 },
            { button_color: '#0A66C2', provider_label: 'Sign in with LinkedIn', provider_param: 'linkedin', provider_logo: '../img/third-party-idp/logo_linkedin.svg', provider_logo_size: 21 },
            { button_color: '#000000', provider_label: 'Continue with Apple', provider_param: 'apple', provider_logo: '../img/third-party-idp/logo_apple.svg', provider_logo_size: 19 }
        ];

        return [...providers, ...thirdPartyProviders.filter(p => providers_array?.includes(p.provider_param))];
    };

    const getPasswordlessCode = (email) => {
        const params = {
            connection: "email",
            send: "code",
            email
        };

        return passwordlessStart(params)
    };

    const loginPasswordless = (code, email) => {
        const params = {
            connection: "email",
            otp: code,
            email
        };

        navigate('/#registration=1');

        return setPasswordlessLogin(params);
    };

    const widgetProps = {
        apiBaseUrl: getEnvVariable(SUMMIT_API_BASE_URL),
        clientId: getEnvVariable(OAUTH2_CLIENT_ID),
        summitData: summit,
        profileData: registrationProfile,
        marketingData: colorSettings,
        loginOptions: formatThirdPartyProviders(thirdPartyProviders),
        loading: loadingProfile || loadingIDP,
        // only show info if its not a recent purchase
        ticketOwned: !isRecentPurchase && userProfile?.summit_tickets?.length > 0,
        authUser: (provider) => onClickLogin(provider),
        getPasswordlessCode: getPasswordlessCode,
        loginWithCode: async (code, email) => await loginPasswordless(code, email),
        getAccessToken: getAccessToken,
        closeWidget: async () => {
            // reload user profile
            try {
                await getUserProfile();
            } catch (error) {
                console.log('Access Token error', error);
            }
            setIsActive(false)
        },
        goToExtraQuestions: async () => {
            // reload user profile
            await getUserProfile();
            navigate('/a/extra-questions')
        },
        goToEvent: () => navigate(getEnvVariable(AUTHORIZED_DEFAULT_PATH) || '/a/'),
        goToRegistration: () => navigate(`${getEnvVariable(REGISTRATION_BASE_URL)}/a/${summit.slug}`),
        onPurchaseComplete: (order) => {
            // we are informing that we did a purchase recently to widget
            setIsRecentPurchase(true);
            // check if it's necesary to update profile
            setUserOrder(order).then(_ => checkOrderData(order));
        },
        inPersonDisclaimer: siteSettings?.registration_in_person_disclaimer,
        handleCompanyError: () => handleCompanyError,
        allowsNativeAuth: allowsNativeAuth,
        allowsOtpAuth: allowsOtpAuth,
    };

    const { registerButton } = siteSettings.heroBanner.buttons;

    return (
        <>
            {!userProfile?.summit_tickets?.length > 0 &&
                <button className={`${styles.button} button is-large`} onClick={() => setIsActive(true)}>
                    <i className={`fa fa-2x fa-edit icon is-large`} />
                    <b>{registerButton.text}</b>
                </button>
            }
            <div>
                {isActive && !summit.invite_only_registration && <RegistrationLiteWidget {...widgetProps} />}
            </div>
        </>
    )
};


const mapStateToProps = ({ userState, summitState, settingState }) => ({
    registrationProfile: userState.idpProfile,
    userProfile: userState.userProfile,
    loadingProfile: userState.loading,
    loadingIDP: userState.loadingIDP,
    thirdPartyProviders: summitState.third_party_providers,
    allowsNativeAuth: summitState.allows_native_auth,
    allowsOtpAuth: summitState.allows_otp_auth,
    summit: summitState.summit,
    colorSettings: settingState.colorSettings,
    siteSettings: settingState.siteSettings,
});

export default connect(mapStateToProps, {
    getThirdPartyProviders,
    getUserProfile,
    setPasswordlessLogin,
    setUserOrder,
    checkOrderData
})(RegistrationLiteComponent)
