import React from "react"

const VideoBanner = ({ event }) => {

  return (
    <div className="join-zoom-container">
      <span>
        Join DiSC Zoom Link
      </span>
      <a className="zoom-link" href={event.meeting_url} target="_blank" rel="noreferrer">
        <button className="zoom-button button">
          <b>Click Here</b>
        </button>
      </a>
    </div>
  )
}

export default VideoBanner;
