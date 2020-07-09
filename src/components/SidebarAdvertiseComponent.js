import React from 'react'

import styles from '../styles/sidebar-advertise.module.scss'

import Ads from '../content/ads.json'

const SidebarAdvertise = ({ section, id }) => {

  const sectionAds = Ads.find(ad => ad.section === section).ads;

  console.log(sectionAds);

  if (sectionAds.length > 0) {
    return (
      sectionAds.map((ad, index) => {
        if (id && ad.id === id) {
          return (
            <div className={`${styles.sponsorContainer} sponsor-container`} key={index}>
              <img src={ad.image} alt="sponsor" />
              <button className={`${styles.button} button is-large`}>
                <b>{ad.text}</b>
              </button>
            </div>
          )
        } else {
          return (
            <div className={`${styles.sponsorContainer} sponsor-container`} key={index}>
              <img src={ad.image} alt="sponsor" />
              <button className={`${styles.button} button is-large`}>
                <b>{ad.text}</b>
              </button>
            </div>
          )
        }
      })
    )
  } else {
    return null;
  }
}

export default SidebarAdvertise;