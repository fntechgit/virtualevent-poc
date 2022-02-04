import React, {useState} from 'react';
import PropTypes from 'prop-types';

import VoteButton from './vote-button';
import BlockImage from 'react-block-image';

import styles from './index.module.scss';

const PosterCard = ({ poster, showDetail, canVote, toggleVote }) => {
  const [hover, setHover] = useState(false);
  const handleClick = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      if (showDetail) {
        showDetail();
      }
  };
  return (
    <article className={styles.card}>
      <BlockImage
        src={poster.imageURL}
        className={`${styles.header} ${showDetail && hover ? styles.header__hover : ''}`}
        onMouseEnter={() => { setHover(true) }} 
        onMouseLeave={() => { setHover(false) }}
        onClick={handleClick}
      >
        { showDetail && hover &&
        <button className={`${styles.button} button is-large`}>
          <i className={`fa fa-2x fa-eye icon is-large`} />
          <b>Detail</b>
        </button>
        }
      </BlockImage>
      <div className={styles.body}>
        <h2 className={styles.title}>{poster.title}</h2>
        { poster.order && <span className={styles.order}>{poster.order}</span> }
        { poster.track?.name && poster.track?.color &&
        <span className={styles.track} style={{backgroundColor: poster.track.color}}>{poster.track.name}</span>
        }
        <VoteButton
          poster={poster}
          canVote={canVote}
          toggleVote={toggleVote}
        />
      </div>
    </article>
  );
};

PosterCard.propTypes = {
  poster: PropTypes.object.isRequired,
  showDetail: PropTypes.func,
  canVote: PropTypes.bool.isRequired,
  toggleVote: PropTypes.func.isRequired,
};

export default PosterCard;
