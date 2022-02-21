import React, { useState, useEffect, useCallback } from "react"
import VoteButton from "./poster-card/vote-button";

import {
  calculateRemaingVotes,
  calculateVotesPerTrackGroup,
  TRACK_GROUP_CLASS_NAME
} from '../utils/voting-utils';

import { PHASES } from '../utils/phasesUtils';

import styles from '../styles/poster-components.module.scss'

const PosterDescription = ({ poster: { speakers, title, description, custom_order, track }, allPosters, poster, votingPeriods, votes, isVoted, toggleVote, votingAllowed }) => {
  
  const [votesPerTrackGroup, setVotesPerTrackGroup] = useState({});
  const [remainingVotes, setRemainingVotes] = useState({});

  useEffect(() => {
    setVotesPerTrackGroup(calculateVotesPerTrackGroup(allPosters, votes));
  }, [allPosters, votes]);

  useEffect(() => {
    if (votingPeriods && TRACK_GROUP_CLASS_NAME in votingPeriods)
      setRemainingVotes(calculateRemaingVotes(votingPeriods[TRACK_GROUP_CLASS_NAME], votesPerTrackGroup));
  }, [votingPeriods, votesPerTrackGroup]);

  const canVote = useCallback((poster) => {
    let result = false;
    if (!(TRACK_GROUP_CLASS_NAME in votingPeriods)) return result;
    if (poster && poster.track && poster.track.track_groups) {
      poster.track.track_groups.forEach(trackGroupId => {
        if (trackGroupId in votingPeriods[TRACK_GROUP_CLASS_NAME]) {
          const votingPeriod = votingPeriods[TRACK_GROUP_CLASS_NAME][trackGroupId];
          result = votingPeriod.phase === PHASES.DURING && remainingVotes[trackGroupId] > 0;
        }
      });
    }
    return result;
  }, [remainingVotes]);

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
  }

  return (
    <div className={`columns talk ${styles.posterDescriptionContainer}`}>
      <div className="column is-full">
        <div className={styles.posterUpperText}>
          {track?.name && track?.color &&
            <span className={styles.track} style={{ backgroundColor: track.color }}>{track.name}</span>
          }
          <span className={styles.order}>
            {custom_order ? `#${custom_order}` : <>&nbsp;</>}
          </span>
          { votingAllowed &&
          <VoteButton
            isVoted={isVoted}
            canVote={canVote(poster)}
            toggleVote={() => toggleVote(poster, !isVoted)}
            style={{ position: 'relative', marginLeft: 'auto' }}
          />
          }
        </div>
        <h1>
          <b>{title}</b>
        </h1>
        <div className="talk__speaker">
          {speakers && speakers?.length === 0 ?
            null
            :
            speakers?.length < 10 ?
              <div className="columns is-multiline is-mobile">
                {speakers.map((s, index) => {
                  return (
                    <div className="column is-one-third-desktop is-half-mobile talk__speaker-container" key={index}>
                      <img alt="" src={s.pic} />
                      <div>
                        {`${s.first_name} ${s.last_name}`}
                        <br />
                        {s.title && <b dangerouslySetInnerHTML={{ __html: s.title }} />}
                        {s.company && <><b> - </b><b dangerouslySetInnerHTML={{ __html: s.company }} /></>}
                      </div>
                    </div>
                  )
                })
                }
              </div>
              :
              <span className="talk__speaker--name">
                {formatSpeakers(speakers)}
              </span>
          }
          <br />
          <div className="talk__description" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <br />
      </div>
    </div>
  )
}

export default PosterDescription;