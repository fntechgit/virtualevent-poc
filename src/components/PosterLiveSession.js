import React from "react"
import { navigate } from "gatsby";

import styles from '../styles/poster-components.module.scss'

const PosterLiveSession = ({ poster }) => {

    const goToLiveSession = (url) => {
        navigate(url);
    }

    return (
        <div className={styles.posterJoinContainer}>
            <span>
                Join the sessions
            </span>
            <span className={styles.date}>
                Tuesday
            </span>
            <button onClick={() => goToLiveSession(poster.meeting_url)} className="poster-button button">
                <b>Chat with poster authors</b>
            </button>
        </div>
    )
}

export default PosterLiveSession;