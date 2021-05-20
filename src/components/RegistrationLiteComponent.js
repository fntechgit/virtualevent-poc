import React, { useEffect, useState } from "react"
import { Helmet } from 'react-helmet'
import { connect } from "react-redux";

// these two libraries are client-side only
import RegistrationLiteWidget from 'summit-registration-lite/dist';
import 'summit-registration-lite/dist/index.css';

import SummitData from '../content/summit.json'
import MarketingData from '../content/colors.json'
import { getUrlParam } from "../utils/fragmentParser";

const RegistrationLiteComponent = ({ userProfile, showPopup }) => {

    useEffect(() => {
        setIsActive(getUrlParam('registration'))
    }, [])

    const [isActive, setIsActive] = useState(showPopup);

    //const { userProfile } = this.props;

    console.log('user profile', userProfile)

    const widgetProps = {
        summitData: SummitData.summit,
        profileData: userProfile,
        marketingData: MarketingData.colors,
        loginOptions: [
            { button_color: '#082238', provider_label: 'FNid', provider_param: 'fnid' },
            { button_color: '#0370C5', provider_label: 'Facebook', provider_param: 'facebook' }
        ],
        authUser: (provider) => console.log('login with ', provider),
        getAccessToken: () => console.log('access token request'),
        closeWidget: () => setIsActive(false),
        goToExtraQuestions: () => console.log('extra questions required')
    };

    return (
        <React.Fragment>
            <Helmet>
            </Helmet>
            <button onClick={() => setIsActive(true)}>
                <b>Open popup</b>
            </button>
            <div>
                {isActive && <RegistrationLiteWidget {...widgetProps} />}
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = ({ userState }) => ({
    userProfile: userState.userProfile
})

export default connect(mapStateToProps, {})(RegistrationLiteComponent)
