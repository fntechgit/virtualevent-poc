import React from 'react'

import { connect } from "react-redux";
import Slider from "react-slick";
import URI from "urijs";
import { doLogin } from "openstack-uicore-foundation/lib/methods";

import RegistrationLiteComponent from './RegistrationLiteComponent';

import MarketingSite from '../content/marketing-site.json'
import { PHASES } from '../utils/phasesUtils';
import styles from '../styles/lobby-hero.module.scss'

import { getEnvVariable, AUTHORIZED_DEFAULT_PATH, REGISTRATION_BASE_URL } from '../utils/envVariables'

import { requireExtraQuestions } from '../utils/userUtils';

import Link from '../components/Link'

class MarketingHeroComponent extends React.Component {

  getBackURL = () => {
    let { location } = this.props;
    let defaultLocation = getEnvVariable(AUTHORIZED_DEFAULT_PATH) ? getEnvVariable(AUTHORIZED_DEFAULT_PATH) : '/a/';
    let backUrl = location.state?.backUrl ? location.state.backUrl : defaultLocation;
    return URI.encode(backUrl);
  }

  onClickLogin = () => {
    doLogin(this.getBackURL());
  }

  render() {

    const { summit_phase, isLoggedUser, userProfile } = this.props;

    const sliderSettings = {
      autoplay: true,
      autoplaySpeed: 5000,
      infinite: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <section className={styles.heroMarketing}>
        <div className={`${styles.heroMarketingColumns} columns is-gapless`}>
          <div className={`${styles.leftColumn} column is-6 is-black`}
            style={{ backgroundImage: MarketingSite.heroBanner.background ? `url(${MarketingSite.heroBanner.background})` : '' }}>
            <div className={`${styles.heroMarketingContainer} hero-body`}>
              <div className="container">
                <h1 className="title">
                  {MarketingSite.heroBanner.title}
                </h1>
                <h2 className="subtitle">
                  {MarketingSite.heroBanner.subTitle}
                </h2>
                <div className={styles.date} style={{ backgroundColor: MarketingSite.heroBanner.dateLayout ? 'var(--color_secondary)' : '' }}>
                  <div>{MarketingSite.heroBanner.date}</div>
                </div>
                <h4>{MarketingSite.heroBanner.time}</h4>
                <div className={styles.heroButtons}>
                  {summit_phase >= PHASES.DURING && isLoggedUser ?
                    <React.Fragment>
                      {MarketingSite.heroBanner.buttons.registerButton.display &&
                        (!userProfile?.summit_tickets?.length > 0 || requireExtraQuestions(userProfile)) &&
                        <a className={styles.link}>
                          <RegistrationLiteComponent location={this.props.location} />
                        </a>
                      }
                      <Link className={styles.link} to={`${getEnvVariable(AUTHORIZED_DEFAULT_PATH) ? getEnvVariable(AUTHORIZED_DEFAULT_PATH) : '/a/'}`}>
                        <button className={`${styles.button} button is-large`}>
                          <i className={`fa fa-2x fa-sign-in icon is-large`}></i>
                          <b>Enter</b>
                        </button>
                      </Link>
                    </React.Fragment>
                    :
                    <React.Fragment>
                      {MarketingSite.heroBanner.buttons.registerButton.display &&
                        !userProfile?.summit_tickets?.length > 0 &&
                        <span className={styles.link}>
                          <RegistrationLiteComponent location={this.props.location} />
                        </span>
                      }
                      {MarketingSite.heroBanner.buttons.loginButton.display && !isLoggedUser &&
                        <span className={styles.link}>
                          <button className={`${styles.button} button is-large`} onClick={() => this.onClickLogin()}>
                            <i className={`fa fa-2x fa-sign-in icon is-large`}></i>
                            <b>{MarketingSite.heroBanner.buttons.loginButton.text}</b>
                          </button>
                        </span>
                      }
                    </React.Fragment>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.rightColumn} column is-6 px-0`} id="marketing-slider">
            <Slider {...sliderSettings}>
              {MarketingSite.heroBanner.images.map((img, index) => {
                return (
                  <div key={index}>
                    <div className={styles.imageSlider} style={{ backgroundImage: `url(${img.image})` }}>
                    </div>
                  </div>
                )
              })}
            </Slider>
          </div>
        </div>
      </section>

    )
  }
}

const mapStateToProps = ({ clockState, userState }) => ({
  summit_phase: clockState.summit_phase,
  userProfile: userState.userProfile
})

export default connect(mapStateToProps, null)(MarketingHeroComponent);