import React from 'react';

import PropTypes from 'prop-types';
import PosterCard from '../poster-card';

import styles from './index.module.scss';

const PosterGrid = ({ posters, canVote, toggleVote, votes, showDetailPage = null }) => {
  if (!posters) return null;
  const cards = posters.map(poster => 
    <PosterCard
      key={`poster-${poster.id}`}
      poster={poster}
      showDetailPage={showDetailPage ? () => showDetailPage(poster.id) : null}
      canVote={canVote}
      isVoted={!!votes.find(v => v.presentation_id === poster.id)}
      toggleVote={toggleVote}
    />
  );
  return (
    <div className={styles.posters} style={{gridTemplateColumns: posters.length === 3 ? '1fr 1fr 1fr' : ''}}>
      { cards }
    </div>
  )
};
PosterGrid.propTypes = {
  posters: PropTypes.array.isRequired,
  showDetailPage: PropTypes.func,
  canVote: PropTypes.bool.isRequired,
  toggleVote: PropTypes.func.isRequired,
  votes: PropTypes.array.isRequired
};
export default PosterGrid;