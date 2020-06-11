import "schedule-lite/dist/index.css";

import React from "react";
import Loadable from "@loadable/component";

import Layout from "../../components/Layout";

import YoutubeVideoComponent from "../../components/YoutubeVideoComponent";
import DisqusComponent from "../../components/DisqusComponent";
const ScheduleLite = Loadable(() => import("schedule-lite/dist"));
const ScheduleClientSide = Loadable(() => import("../../components/ScheduleComponent"));

export default class BlogIndexPage extends React.Component {
  render() {
    const scheduleProps = {
      apiBaseUrl: "https://api.dev.fnopen.com",
      eventBaseUrl: "/events",
      trackBaseUrl: "/tracks",
      speakerBaseUrl: "/speakers",
      roomBaseUrl: "/rooms",
      summitId: 16,
      landscape: true,
      updateCallback: (ev) => console.log("event updated", ev),
    };

    return (
      <Layout>
        Testing place
        {/*<YoutubeVideoComponent videoSrcURL="https://www.youtube.com/embed/P7d1H83IcjE" />
            <DisqusComponent />
            <ScheduleClientSide base='blog'/>*/}
        <ScheduleLite {...scheduleProps} />
      </Layout>
    );
  }
}
