import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { navigate } from "gatsby";
import Layout from '../components/Layout';
import PageHeader from '../components/page-header';
import PosterGrid from '../components/poster-grid';
import ScheduleFilters from '../components/ScheduleFilters';
import FilterButton from '../components/FilterButton';

import {
  setInitialDataSet,
  getAllVoteablePresentations,
  updateFilter
} from '../actions/presentation-actions';

import {
  castPresentationVote,
  uncastPresentationVote

} from '../actions/user-actions';

import { filterByTrackGroup } from '../utils/filterUtils';

import styles from '../styles/posters-page.module.scss';

const PostersPage = ({
                      location,
                      trackGroupId,
                      setInitialDataSet,
                      getAllVoteablePresentations,
                      posters,
                      votes,
                      castPresentationVote,
                      uncastPresentationVote,
                      summit,
                      allPosters,
                      filters,
                      updateFilter,
                      colorSettings,
                      pagesSettings
                    }) => {

  const [canVote, setCanVote] = useState(true);
  const [showFilters, setShowfilters] = useState(false);
  const [postersByTrackGroup, setPostersByTrackGroup] = useState(posters);
  const [allPostersByTrackGroup, setAllPostersByTrackGroup] = useState(allPosters);
  const [pageSettings, setPageSetting] = useState(pagesSettings.find(pps => pps.trackGroupId === parseInt(trackGroupId)));

  useEffect(() => {
    setInitialDataSet().then(() => getAllVoteablePresentations());
  }, [trackGroupId]);

  useEffect(() => {
    setPostersByTrackGroup(filterByTrackGroup(posters, parseInt(trackGroupId)));
  }, [posters, trackGroupId]);

  useEffect(() => {
    setAllPostersByTrackGroup(filterByTrackGroup(allPosters, parseInt(trackGroupId)));
  }, [allPosters, trackGroupId]);

  const toggleVote = (presentation, isVoted) => {
    isVoted ? castPresentationVote(presentation) : uncastPresentationVote(presentation);
  };

  const filterProps = {
    summit,
    events: allPostersByTrackGroup,
    allEvents: allPostersByTrackGroup,
    filters,
    triggerAction: (action, payload) => {
      updateFilter(payload);
    },
    marketingSettings: colorSettings,
    colorSource: '',
  };

  return (
    <Layout location={location}>
      { pageSettings &&
      <PageHeader
        title={pageSettings.title}
        subtitle={pageSettings.subtitle}
        backgroundImage={pageSettings.image}
      />
      }
      { postersByTrackGroup &&
      <div className={`${styles.wrapper} ${showFilters ? styles.showFilters : ''}`}>
        <div className={styles.postersWrapper}>
          <PosterGrid
            posters={postersByTrackGroup}
            showDetailPage={(posterId) => navigate(`/a/poster/${posterId}`)}
            canVote={canVote} votes={votes}
            toggleVote={toggleVote}
          />
        </div>
        <div className={styles.filterWrapper}>
          <ScheduleFilters {...filterProps} />
        </div>
        <FilterButton open={showFilters} onClick={() => setShowfilters(!showFilters)}/>
      </div>
      }
    </Layout>
  );
};

PostersPage.propTypes = {};

const mapStateToProps = ({presentationsState, userState, summitState, settingState}) => ({
  posters: presentationsState.voteablePresentations.filteredPresentations,
  allPosters: presentationsState.voteablePresentations.ssrPresentations,
  filters: presentationsState.voteablePresentations.filters,
  votes: userState.attendee?.presentation_votes?? [],
  summit: summitState.summit,
  colorSettings: settingState.colorSettings,
  pagesSettings: [...settingState.posterPagesSettings.posterPages],
});

export default connect(mapStateToProps, {
  setInitialDataSet,
  getAllVoteablePresentations,
  castPresentationVote,
  uncastPresentationVote,
  updateFilter,
})(PostersPage);
