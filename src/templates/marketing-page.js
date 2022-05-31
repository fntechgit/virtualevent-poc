import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, navigate } from 'gatsby'

import Masonry from 'react-masonry-css'
import Slider from "react-slick"

import Layout from '../components/Layout'
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'
import MarketingHeroComponent from '../components/MarketingHeroComponent'
import LiteScheduleComponent from '../components/LiteScheduleComponent'
import DisqusComponent from '../components/DisqusComponent'
import {syncData} from '../actions/base-actions';

import Content, { HTMLContent } from '../components/Content'
import Countdown from '../components/Countdown'
import Link from '../components/Link'
import { PHASES } from '../utils/phasesUtils'

import settings from '../content/settings';

import styles from "../styles/marketing.module.scss"
import '../styles/style.scss'


export const MarketingPageTemplate = class extends React.Component {

  componentWillMount() {
    const {siteSettings} = this.props;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {lastBuild, syncData} = this.props;
    if (!lastBuild || settings.lastBuild > lastBuild) {
      syncData();
    }
  }

  render() {
    const { content, contentComponent, summit_phase, user, isLoggedUser, location, summit, siteSettings } = this.props;
    const PageContent = contentComponent || Content;

    let scheduleProps = {};
    if (siteSettings.leftColumn.schedule && isLoggedUser && summit_phase !== PHASES.BEFORE) {
      scheduleProps = {
        ...scheduleProps,
        onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
      }
    }

    const sliderSettings = {
      autoplay: true,
      autoplaySpeed: 5000,
      infinite: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <React.Fragment>
        <AttendanceTrackerComponent />
        <MarketingHeroComponent summit={summit} isLoggedUser={isLoggedUser} location={location} />
        {summit && siteSettings?.countdown?.display && <Countdown summit={summit} text={siteSettings?.countdown?.text} />}
        <div className="columns" id="marketing-columns">
          <div className="column is-full px-6 pt-0 pb-6" style={{ position: 'relative' }}>
            {siteSettings.leftColumn.schedule.display &&
              <React.Fragment>
                <h2><b>{siteSettings.leftColumn.schedule.title}</b></h2>
                <LiteScheduleComponent
                  {...scheduleProps}
                  page="marketing-site"
                  showAllEvents={true}
                  showSearch={false}
                  showNav={true}
                />
              </React.Fragment>
            }
            {siteSettings.leftColumn.disqus.display &&
              <React.Fragment>
                <h2><b>{siteSettings.leftColumn.disqus.title}</b></h2>
                <DisqusComponent page="marketing-site"/>
              </React.Fragment>
            }
            {siteSettings.leftColumn.image.display &&
              <React.Fragment>
                <h2><b>{siteSettings.leftColumn.image.title}</b></h2>
                <br />
                <img className="image-page" alt={siteSettings.leftColumn.image.alt} src={siteSettings.leftColumn.image.src} />
                <img className="mobile-image-page" alt={siteSettings.leftColumn.image.altMobile} src={siteSettings.leftColumn.image.srcMobile} />
              </React.Fragment>
            }
          </div>
          <div className="column ads-column is-full px-0 pb-0">
                {siteSettings.sponsors.map((item, index) => {
                    return (
                        <div className="ad-container" key={index}>
                            {item.images[0].link ?
                                <Link to={item.images[0].link}>
                                    <img alt="" src={item.images[0].image} />
                                </Link>
                                :
                                <img alt="" src={item.images[0].image} />
                            }
                        </div>
                    )
                })}
            </div>
        </div>
        <PageContent content={content} />
      </React.Fragment>
    )
  }
}

MarketingPageTemplate.propTypes = {
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  summit_phase: PropTypes.number,
  user: PropTypes.object,
  isLoggedUser: PropTypes.bool,
}

const MarketingPage = ({ summit, location, data, summit_phase, user, isLoggedUser, syncData, lastBuild, siteSettings }) => {
  const { html } = data.markdownRemark;

  return (
    <Layout marketing={true} location={location}>
      <MarketingPageTemplate
        contentComponent={HTMLContent}
        content={html}
        location={location}
        summit_phase={summit_phase}
        summit={summit}
        user={user}
        isLoggedUser={isLoggedUser}
        syncData={syncData}
        lastBuild={lastBuild}
        siteSettings={siteSettings}
      />
    </Layout>
  )
}

MarketingPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
  summit_phase: PropTypes.number,
  user: PropTypes.object,
  isLoggedUser: PropTypes.bool,
  getSummitData: PropTypes.func
}

const mapStateToProps = ({ clockState, loggedUserState, userState, summitState, settingState }) => ({
  summit_phase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
  user: userState,
  summit: summitState.summit,
  lastBuild: settingState.lastBuild,
  siteSettings: settingState.siteSettings
});

export default connect(mapStateToProps, {
  syncData
})(MarketingPage)

export const marketingPageQuery = graphql`
  query MarketingPageTemplate($id: String!) {    
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {        
        title
      }
    }
  }
`;