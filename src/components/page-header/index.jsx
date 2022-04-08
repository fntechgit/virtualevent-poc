import React from 'react';

import styles from './index.module.scss';

const PageHeader = ({ title, subtitle, backgroundImage }) => (
  <section className={styles.pageHeader}>
    <div className={styles.titles}>
      <h1>{title}</h1>
      <span class={styles.subtitle}>{subtitle}</span>
    </div>
    {backgroundImage &&
      <div className={styles.image} style={{backgroundImage: `url(${backgroundImage})`}}></div>
    }
  </section>
);

export default PageHeader;