import React from 'react'

import { connect } from "react-redux";

import Layout from '../components/Layout'
import SponsorComponent from '../components/SponsorComponent'
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'
import AccessTracker from '../components/AttendeeToAttendeeWidgetComponent'
import styles from '../styles/expo-hero.module.scss'

const ExpoHallPage = ({ location, expoHallHeader }) => {

  return (
    <Layout location={location}>
      <AttendanceTrackerComponent />
      <AccessTracker />
        <section className="hero is-large sponsors-header" style={{ backgroundImage: `url(${expoHallHeader.image})` }}>
          <div className="hero-body">
            <div className={styles.heroContainer}>
              <h1 className={styles.title}>
                {expoHallHeader.title}
              </h1>
              <span className={styles.subtitle}>
                {expoHallHeader.subtitle}
              </span>
            </div>
          </div>
        </section>      
      <section className="section px-6 py-6">
        <SponsorComponent />
      </section>
    </Layout>
  )
}

const mapStateToProps = ({ sponsorState }) => ({
  expoHallHeader: sponsorState.expoHallHeader
});

export default connect(mapStateToProps, {})(ExpoHallPage);