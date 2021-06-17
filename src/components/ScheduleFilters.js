import React from "react";
import { connect } from "react-redux";
import {pickBy} from 'lodash';
import { Helmet } from "react-helmet";
import { updateFilter } from "../actions/schedule-actions";

// these two libraries are client-side only
import Filters from "schedule-filter-widget/dist";
import "schedule-filter-widget/dist/index.css";

const ScheduleFilters = ({
  className,
  summit,
  events,
  allEvents,
  filters,
  marketingSettings,
  updateFilter,
  ...rest
}) => {
  const wrapperClass = "filter-container";
  const enabledFilters = pickBy(filters, value => value.enabled);

  if (!summit) return null;

  const componentProps = {
    title: "Filter by",
    summit,
    events,
    allEvents,
    filters: enabledFilters,
    triggerAction: (action, payload) => {
      updateFilter(payload);
    },
    marketingSettings: marketingSettings.colors,
    ...rest,
  };

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css"
        />
      </Helmet>
      <div className={className || wrapperClass}>
        <Filters {...componentProps} />
      </div>
    </>
  );
};

const mapStateToProps = ({ summitState, scheduleState }) => ({
  events: scheduleState.events,
  allEvents: scheduleState.allEvents,
  filters: scheduleState.filters,
  summit: summitState.summit,
  marketingSettings: summitState.marketingSettings,
});

export default connect(mapStateToProps, { updateFilter })(ScheduleFilters);
