import React from 'react'

import Link from '../components/Link'

import styles from '../styles/advertise.module.scss'

import Content from '../content/ads.json'

const AdvertiseComponent = ({ section, column, id, className }) => {

  const sectionAds = Content.ads.find(ad => ad.section === section).columns.find(c => c.column === column).columnAds;

  if (sectionAds.length > 0) {
    return (
      sectionAds.map((ad, index) => {
        return (
          ad.id ?
            ad.id === id ?
              column === 'center' ?
                null
                :
                <div className={`${styles.sponsorContainer} sponsor-container`} key={index}>
                  {!ad.button.text && ad.button.link &&
                    <Link to={ad.button.link}>
                      <img src={ad.image} alt="sponsor" />
                    </Link>
                  }
                  {ad.button.text && ad.button.link &&
                    <React.Fragment>
                      <img src={ad.image} alt="sponsor" />
                      <Link className={styles.link} to={ad.button.link}>
                        <button className={`${styles.button} button is-large`}>
                          <b>{ad.button.text}</b>
                        </button>
                      </Link>
                    </React.Fragment>
                  }
                  {!ad.button.text && !ad.button.link &&
                    <img src={ad.image} alt="sponsor" />
                  }
                </div>
              :
              null
            :
            column === 'center' ?
              <div className={`${styles.sponsorContainerCenter} ${className}`} key={index}>
                <div className={styles.containerText}>
                  <span className={styles.adText} style={ad.image ? { textAlign: 'left' } : null}>
                    <b>Upload your picture and participate with the #yocovirtualsummit</b>
                  </span>
                  <a className={styles.link} href={ad.button.link}>
                    <button className={`${styles.button} button is-large`} style={ad.image ? { width: '100%' } : null}>
                      <b>{ad.button.text}</b>
                    </button>
                  </a>
                </div>
                {ad.image && <div className={styles.containerImage} style={{ backgroundImage: `url(${ad.image})` }}></div>}
              </div>
              :
              <div className={`${styles.sponsorContainer} ${className} sponsor-container`} key={index}>
                {!ad.button.text && ad.button.link &&
                  <Link to={ad.button.link}>
                    <img src={ad.image} alt="sponsor" />
                  </Link>
                }
                {ad.button.text && ad.button.link &&
                  <React.Fragment>
                    <img src={ad.image} alt="sponsor" />
                    <Link className={styles.link} to={ad.button.link}>
                      <button className={`${styles.button} button is-large`}>
                        <b>{ad.button.text}</b>
                      </button>
                    </Link>
                  </React.Fragment>
                }
                {!ad.button.text && !ad.button.link &&
                  <img src={ad.image} alt="sponsor" />
                }
              </div>
        )
      })
    )
  } else {
    return null;
  }
}

export default AdvertiseComponent;