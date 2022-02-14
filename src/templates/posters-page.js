import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Layout from '../components/Layout';
import PosterGrid from '../components/poster-grid';

import { getVoteablePresentations } from '../actions/presentation-actions';
import { togglePresentationVote } from '../actions/user-actions';

import styles from '../styles/posters-page.module.scss';

const PostersPage = ({ location, getVoteablePresentations, togglePresentationVote, posters, votes }) => {
  const [canVote, setCanVote] = useState(true);

  const toggleVote = (presentation, isVoted) => {
    togglePresentationVote(presentation, isVoted);
  };

  useEffect(() => {
    getVoteablePresentations();
  }, []);

  return (
    <Layout location={location}>
      <div className="container">
        { posters &&
          <PosterGrid
          posters={posters}
          canVote={canVote}
          votes={votes}
          toggleVote={toggleVote}
        />
        }
      </div>
    </Layout>
  );
};

PostersPage.propTypes = {
};

const mapStateToProps = ({ presentationsState, userState }) => ({
  posters: presentationsState.presentations,
  votes: userState.attendee.presentation_votes
});

export default connect(mapStateToProps, {
  getVoteablePresentations,
  togglePresentationVote,
})(PostersPage);
