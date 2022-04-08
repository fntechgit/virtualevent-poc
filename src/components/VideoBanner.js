import React from "react"

const VideoBanner = ({ event }) => {

  return (
    <div className="join-zoom-container">
      <span>
        Click the button to join the Zoom
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
