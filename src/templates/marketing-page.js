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
import { getDisqusSSO } from '../actions/user-actions'

import settings from '../content/settings';

import styles from "../styles/marketing.module.scss"
import '../styles/style.scss'


export const MarketingPageTemplate = class extends React.Component {

  componentWillMount() {
    const {siteSettings} = this.props;
    if (siteSettings.leftColumn.disqus && this.props.isLoggedUser) {
      this.props.getDisqusSSO();
    }
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
          <div className="column is-half px-6 pt-6 pb-0" style={{ position: 'relative' }}>
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
                <DisqusComponent page="marketing-site" disqusSSO={user?.disqusSSO} summit={summit} />
              </React.Fragment>
            }
            {siteSettings.leftColumn.image.display &&
              <React.Fragment>
                <h2><b>{siteSettings.leftColumn.image.title}</b></h2>
                <br />
                <img alt={siteSettings.leftColumn.image.alt} src={siteSettings.leftColumn.image.src} />
              </React.Fragment>
            }
          </div>
          <div className="column is-half px-0 pb-0">
            <Masonry
              breakpointCols={2}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {siteSettings.sponsors.map((item, index) => {
                if (item.images && item.images.length === 1) {
                  return (
                    <div className={'single'} key={index}>
                      {item.images[0].link ?
                        <Link to={item.images[0].link}>
                          <img alt={item.images[0].alt} src={item.images[0].image} />
                        </Link>
                        :
                        <img alt={item.images[0].alt} src={item.images[0].image} />
                      }
                    </div>
                  )
                } else if (item.images && item.images.length > 1) {
                  return (
                    <Slider {...sliderSettings} key={index}>
                      {item.images.map((img, indexSlide) => {
                        return (
                          <div className={styles.imageSlider} key={indexSlide}>
                            {img.link ?
                              <Link to={img.link}>
                                <img alt={img.alt} src={img.image} />
                              </Link>
                              :
                              <img alt={img.alt} src={img.image} />
                            }
                          </div>
                        )
                      })}
                    </Slider>
                  )
                } else {
                  return (
                    <div className="single" key={index} />
                  )
                }
              })}
            </Masonry>
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

const MarketingPage = ({ summit, location, data, summit_phase, user, isLoggedUser, getDisqusSSO, syncData, lastBuild, siteSettings }) => {
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
        getDisqusSSO={getDisqusSSO}
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
  getSummitData: PropTypes.func,
  getDisqusSSO: PropTypes.func,
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
  getDisqusSSO,
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