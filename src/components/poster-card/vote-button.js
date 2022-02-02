import React from 'react';
import PropTypes from 'prop-types';

import styles from './vote-button.module.scss';

const VoteButton = ({isVoted, addVote, removeVote}) => {

  if (!removeVote) return null;

  let buttonClass = null;
  let iconClass = null;
  let onClick = null;
  let title = '';

  if (isVoted) {
    iconClass = 'fa-heart';
    buttonClass = styles.added;
    title = 'Remove vote'
    onClick = removeVote;
  } else {
    iconClass = 'fa-heart-o';
    buttonClass = addVote ? styles.add : styles.disabled;
    title = addVote ? 'Vote for this poster!' : 'Maximun votes registered'
    onClick = addVote;
  }

  return (
    <button
      title={title}
      className={`${styles.voteButton} ${buttonClass}`}
      {...(onClick && { onClick: onClick })}
      {...(!onClick && { disabled: true })}
    >
      <i className={`fa ${iconClass}`} aria-hidden="true" />
    </button>
  );
}

VoteButton.propTypes = {
  isVoted: PropTypes.bool.isRequired,
  addVote: PropTypes.func,
  removeVote: PropTypes.func,
};

export default VoteButton;