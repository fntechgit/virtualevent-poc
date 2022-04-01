import React from 'react'
import PropTypes from 'prop-types'
import Link from "./Link";
import CMSImage from "./CMSImage";

import styles from "../styles/advertise.module.scss";


const Ad = ({ link, text, image, alt, wrapperClass }) => {

  return (
      <div className={wrapperClass}>
        {!link && <CMSImage file={image} alt={alt} />}

        {!text && link &&
        <Link to={link}>
          <CMSImage file={image} alt={alt} />
        </Link>
        }

        {text && link &&
        <>
          <CMSImage file={image} alt={alt} />
          <Link className={styles.link} to={link}>
            <button className={`${styles.button} button is-large`}>
              <b>{text}</b>
            </button>
          </Link>
        </>
        }
      </div>
  )
}

Ad.propTypes = {
  link: PropTypes.string,
  text: PropTypes.string,
  image: PropTypes.string.isRequired,
  alt: PropTypes.string,
  wrapperClass: PropTypes.string,
};

Ad.defaultProps = {
  wrapperClass: ''
};

export default Ad
