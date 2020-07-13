import React from 'react'

import styles from '../styles/sidebar-advertise.module.scss'

import Content from '../content/ads.json'

const SidebarAdvertise = ({ section, column, id }) => {

  const sectionAds = Content.ads.find(ad => ad.section === section).columns.find(c => c.column === column).columnAds;

  if (sectionAds.length > 0) {
    return (
      sectionAds.map((ad, index) => {
        return (
          ad.id ?
            ad.id === id ?
              <div className={`${styles.sponsorContainer} sponsor-container`} key={index}>
                <img src={ad.image} alt="sponsor" />
                <a className={styles.link} href={ad.button.link}>
                  <button className={`${styles.button} button is-large`}>
                    <b>{ad.button.text}</b>
                  </button>
                </a>
              </div>
              :
              null
            :
            <div className={`${styles.sponsorContainer} sponsor-container`} key={index}>
                <img src={ad.image} alt="sponsor" />
                <a className={styles.link} href={ad.button.link}>
                  <button className={`${styles.button} button is-large`}>
                    <b>{ad.button.text}</b>
                  </button>
                </a>
              </div>
        )
      })
    )
  } else {
    return null;
  }
}

export default SidebarAdvertise;