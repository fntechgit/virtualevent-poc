import React from 'react';
import PropTypes from 'prop-types';

import styles from './vote-button.module.scss';

const VoteButton = ({isVoted, addVote, removeVote}) => {

  let buttonClass = null;
  let iconClass = null;
  let onClick = null;
  let title = ''

  const handleClick = (ev, action) => {
    ev.preventDefault();
    ev.stopPropagation();
    action();
  };

  if (!isVoted && addVote) {
    buttonClass = `${styles.add}`;
    iconClass = 'fa-heart-o';
    title = 'Vote for this poster!'
    onClick = ev => handleClick(ev, addVote);
  } else if (!isVoted && !addVote) {
    buttonClass = `${styles.disabled}`;
    iconClass = 'fa-heart-o';
    title = 'Maximun votes registered'
    onClick = ev => handleClick(ev, () => {});
  } else if (isVoted && removeVote) {
    buttonClass = `${styles.added}`;
    iconClass = 'fa-heart';
    title = 'Remove vote'
    onClick = ev => handleClick(ev, removeVote);
  }

  if (!onClick) return null;

  return (
    <button title={title} className={`${styles.voteButton} ${buttonClass}`} onClick={onClick}>
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