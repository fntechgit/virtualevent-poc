import React from 'react';
import PropTypes from 'prop-types';

import styles from './vote-button.module.scss';

const VoteButton = ({isVoted, addVote, removeVote}) => {

  let buttonClass = null;
  let iconClass = null;
  let onClick = null;
  let title = '';

  if (!isVoted && addVote) {
    buttonClass = styles.add;
    iconClass = 'fa-heart-o';
    title = 'Vote for this poster!'
    onClick = addVote;
  } else if (!isVoted && !addVote) {
    buttonClass = styles.disabled;
    iconClass = 'fa-heart-o';
    title = 'Maximun votes registered'
  } else if (isVoted && removeVote) {
    buttonClass = styles.added;
    iconClass = 'fa-heart';
    title = 'Remove vote'
    onClick = removeVote;
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