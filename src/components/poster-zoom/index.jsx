import { navigate } from 'gatsby';
import React, { useEffect } from 'react';

import VoteButton from '../poster-card/vote-button';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import styles from './index.module.scss';

const PosterZoom = ({ poster, closePosterDetail, goToPresentation, onPosterNavigation, showVoteButton, canVote, isVoted, toggleVote }) => {

  useEffect(() => {
    window.addEventListener("keydown", detectKey, { passive: true });
    return () => {
      window.removeEventListener("keydown", detectKey);
    };
  }, []);

  if (!poster) return null;

  const { title, custom_order, speakers, media_uploads } = poster;
  const posterImage = media_uploads.find(m => m.name === 'Poster');

  if (!posterImage) return null;

  const detectKey = (e) => {
    if (e.code === 'ArrowLeft') onPosterNavigation(false);
    if (e.code === 'ArrowRight') onPosterNavigation(true);
  };

  const onBackgroundClick = (e) => {
    if (e.target === e.currentTarget) closePosterDetail();
  };

  const formatSpeakers = (speakers) => {
    let formatedSpeakers = '';
    if (speakers && speakers.length > 0) {
      speakers.forEach((speaker, index) => {
        formatedSpeakers += `${speaker.first_name} ${speaker.last_name}`;
        if (speakers.length > index + 2) formatedSpeakers += ', ';
        if (speakers.length - 2 === index) formatedSpeakers += ' & ';
      });
    }
    return formatedSpeakers;
  };

  return (
    <div className={styles.background} onClick={onBackgroundClick} >
      <div className={styles.posterZoomWrapper}>
        <div className={styles.zoomTitle}>
          <div className={styles.profile}>
            {speakers.length === 1 &&
              <img src={speakers[0].pic} />
            }
            <div className={styles.profileData}>
              <span><h1>{title}</h1>{`${custom_order ? `#${custom_order}` : ''}`}</span>
              <br />
              <span>{formatSpeakers(speakers)}</span>
            </div>
          </div>
          <button onClick={() => goToPresentation()}>
            <i className='fa fa-book' />
            View presentation
          </button>
        </div>
        <TransformWrapper >
          <TransformComponent wrapperClass={styles.zoomWrapper}>
            <img src={posterImage.public_url} alt={title} />
          </TransformComponent>
        </TransformWrapper>
        <div className={styles.zoomFooter}>
          <div className={styles.buttonWrapper}>
            <button onClick={() => onPosterNavigation(false)}>
              <i className={`fa fa-chevron-left`} />
              Previous Poster
            </button>
          </div>
          <div className={styles.buttonWrapper}>
            <button onClick={() => onPosterNavigation(true)}>
              Next Poster
              <i className={`fa fa-chevron-right`} />
            </button>
          </div>
          { showVoteButton &&
          <VoteButton
            style={{ position: 'absolute', bottom: '75px', right: '30px' }}
            isVoted={isVoted}
            canVote={canVote}
            toggleVote={() => toggleVote(poster, !isVoted)}
          />
          }
        </div>
      </div>
    </div>
  )
};

export default PosterZoom;