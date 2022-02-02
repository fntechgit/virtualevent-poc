import React from 'react';
import PropTypes from 'prop-types';

import styles from './vote-button.module.scss';

const VoteButton = ({isVoted, toggleVote}) => {

  let buttonClass = null;
  let iconClass = null;
  let title = '';

  if (isVoted) {
    iconClass = 'fa-heart';
    buttonClass = styles.added;
    title = 'Remove vote'
  } else {
    iconClass = 'fa-heart-o';
    buttonClass = toggleVote ? styles.add : styles.disabled;
    title = toggleVote ? 'Vote for this poster!' : 'Maximun votes registered'
  }

  return (
    <button
      title={title}
      className={`${styles.voteButton} ${buttonClass}`}
      {...(toggleVote && { onClick: toggleVote })}
      {...(!toggleVote && { disabled: true })}
    >
      <i className={`fa ${iconClass}`} aria-hidden="true" />
    </button>
  );
}

VoteButton.propTypes = {
  isVoted: PropTypes.bool.isRequired,
  toggleVote: PropTypes.func,
};

export default VoteButton;