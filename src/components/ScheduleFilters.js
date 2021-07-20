import React, {useEffect} from "react";
import { connect } from "react-redux";
import {pickBy} from 'lodash';
import { Helmet } from "react-helmet";
import { updateFilter, updateFiltersFromHash } from "../actions/schedule-actions";
import Filters from "schedule-filter-widget/dist";
import "schedule-filter-widget/dist/index.css";

const ScheduleFilters = ({
  className,
  summit,
  events,
  allEvents,
  filters,
  colorSource,
  colorSettings,
  updateFilter,
  updateFiltersFromHash,
  ...rest
}) => {
  const enabledFilters = pickBy(filters, value => value.enabled);

  useEffect(() => {
    updateFiltersFromHash();
  });

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
    marketingSettings: colorSettings,
    colorSource: colorSource,
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
      <div className={className || "filter-container"}>
        <Filters {...componentProps} />
      </div>
    </>
  );
};

const mapStateToProps = ({ summitState, scheduleState, settingState }) => ({
  events: scheduleState.events,
  allEvents: scheduleState.allEvents,
  filters: scheduleState.filters,
  colorSource: scheduleState.colorSource,
  summit: summitState.summit,
  colorSettings: settingState.colorSettings,
});

export default connect(mapStateToProps, { updateFilter, updateFiltersFromHash })(ScheduleFilters);
