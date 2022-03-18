import React from "react";
import { pickBy } from "lodash";
import { Helmet } from "react-helmet";
import Filters from "schedule-filter-widget/dist";
import "schedule-filter-widget/dist/index.css";
import styles from "../styles/full-schedule.module.scss";

const ScheduleFilters = ({ className, filters, ...rest }) => {
  const enabledFilters = pickBy(filters, (value) => value.enabled);
  const { allEvents } = rest;
  /* if we dont have events .. does not render , bc on first
     render does the initial widget loading call to initialize */
  if(!allEvents.length) return null;
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css"
        />
      </Helmet>
      <div className={styles.filters}>
        <Filters title="Filter by" filters={enabledFilters} {...rest} />
      </div>
    </>
  );
};

export default ScheduleFilters;
