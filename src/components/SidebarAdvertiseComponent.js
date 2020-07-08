import React from 'react'

import styles from '../styles/sidebar-advertise.module.scss'

const SidebarAdvertise = ({ }) => (
  <div className={`${styles.sponsorContainer} sponsor-container`}>
    <img src="/img/intel.png" alt="sponsor" />
    <button className={`${styles.button} button is-large`}>
      <b>Sponsor Text</b>
    </button>
  </div>
)

export default SidebarAdvertise;