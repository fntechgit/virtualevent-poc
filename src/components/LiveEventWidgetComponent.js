import React from "react"
import {connect} from "react-redux";
import { Helmet } from 'react-helmet'

// these two libraries are client-side only
import LiveEventWidget from 'live-event-widget/dist/index.js';
import 'live-event-widget/dist/index.css';

const LiveEventWidgetComponent = ({allEvents, summit, colorSettings, homeSettings, className = 'live-event-container', ...rest}) => {

    const widgetProps = {
        title: "",
        defaultImage: homeSettings.schedule_default_image,
        eventsData: allEvents,
        summitData: summit,
        marketingData: colorSettings,
        ...rest
    };

    return (
        <>
            <Helmet>
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
            </Helmet>
            <div className={className}>
                <LiveEventWidget {...widgetProps} />
            </div>
        </>
    )
};

const mapStateToProps = ({ summitState, allSchedulesState, settingState }) => ({
    summit: summitState.summit,
    allEvents: allSchedulesState.allEvents,
    colorSettings: settingState.colorSettings,
    homeSettings: settingState.homeSettings,
});

export default connect(mapStateToProps, { })(LiveEventWidgetComponent)