import React from 'react'
import { connect } from "react-redux";

import styles from '../styles/event-hero.module.scss'

const EventHeroComponent = ({siteSettings}) => (
  <section className="hero">
    <div className={`${styles.heroEvents} columns`}>
      <div className={'column is-12'}>
        <div className={`${styles.heroBody} hero-body`}>
          <div className={`${styles.heroEventContainer}`}>
            <div>
              <span className={styles.title}>
                {siteSettings.heroBanner.title}
              </span>
              <span className={styles.subtitle}>
              {siteSettings.heroBanner.subTitle}
              </span>
            </div>
            <div className={styles.date}>
              <span>{siteSettings.heroBanner.date}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const mapStateToProps = ({settingState}) => ({
  siteSettings: settingState.siteSettings
});

export default connect(mapStateToProps, {})(EventHeroComponent);