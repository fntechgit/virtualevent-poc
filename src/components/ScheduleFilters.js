import React, { useEffect, useState } from "react";
import { pickBy } from "lodash";
import { Helmet } from "react-helmet";
import Filters from "schedule-filter-widget/dist";
import "schedule-filter-widget/dist/index.css";
import styles from "../styles/full-schedule.module.scss";

const ScheduleFilters = ({ className, filters, ...rest }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(70);
  const [showFilters, setShowfilters] = useState(false);
  const enabledFilters = pickBy(filters, (value) => value.enabled);
  const onFilterClick = () => { setShowfilters(true); };

  const handleScroll = () => {
    const position = window.pageYOffset;
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.clientHeight);
    }
    if (position < headerHeight) setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css"
        />
      </Helmet>
      <div
        className={`${styles.filters} ${showFilters ? styles.show : ""}`}
        style={{ top: headerHeight - scrollPosition }}
      >
        <Filters title="Filter by" filters={enabledFilters} {...rest} />
      </div>
      <button className={styles.filterButton} onClick={onFilterClick}>
        <i className="fa fa-filter" />
        Filters
      </button>
    </>
  );
};

export default ScheduleFilters;
