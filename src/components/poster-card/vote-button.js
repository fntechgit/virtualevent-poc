import React from 'react';
import PropTypes from 'prop-types';

import styles from './vote-button.module.scss';

const VoteButton = ({poster, canVote, toggleVote}) => {
  let buttonClass = null;
  let iconClass = null;
  let title = '';
  if (poster.isVoted) {
    iconClass = 'fa-heart';
    buttonClass = styles.added;
    title = 'Remove vote'
  } else {
    iconClass = 'fa-heart-o';
    buttonClass = canVote ? styles.add : styles.disabled;
    title = canVote ? 'Vote for this poster!' : 'Maximun votes registered'
  }
  return (
    <button
      title={title}
      className={`${styles.voteButton} ${buttonClass}`}
      onClick={() => toggleVote(poster)}
      disabled={!(canVote || poster.isVoted)}
    >
      <i className={`fa ${iconClass}`} aria-hidden="true" />
    </button>
  );
}

VoteButton.propTypes = {
  poster: PropTypes.object.isRequired,
  canVote: PropTypes.bool.isRequired,
  toggleVote: PropTypes.func.isRequired,
};

export default VoteButton;