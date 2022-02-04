import React from 'react';
import PropTypes from 'prop-types';

import PosterCard from '../poster-card';

import styles from './index.module.scss';

const Posters = ({posters, showDetail, toggleVote}) => {

  return (
    <div className={styles.posters}>
      { posters.map(poster =>
          <PosterCard
            poster={poster}
            showDetail={showDetail}
            toggleVote={toggleVote}
          />
        )
      }
    </div>
  )
};

Posters.propTypes = {
  posters: PropTypes.array.isRequired,
  showDetail: PropTypes.func,
  toggleVote: PropTypes.func.isRequired,
};

export default Posters;