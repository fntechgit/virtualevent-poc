import React from 'react';
import PropTypes from 'prop-types';
import VideoJSPlayer from './VideoJSPlayer';

const VideoComponent = class extends React.Component {

  constructor(props) {
    super(props);

    this.checkLiveVideo = this.checkLiveVideo.bind(this);
  }

  checkLiveVideo(url) {
    let isLiveVideo = null;
    url.match(/.m3u8/) ? isLiveVideo = true : isLiveVideo = false;
    return isLiveVideo;
  }

  render() {
    const { url, title, namespace, firstHalf, autoPlay } = this.props;

    console.log(autoPlay, 'AUTO');

    let videoJsOptions = {
      autoplay: autoPlay,
      controls: true,
      fluid: true,
      playsInline: true
    }

    if (url) {
      if (this.checkLiveVideo(url)) {
        videoJsOptions = {
          ...videoJsOptions,
          sources: [{
            src: url,
            type: 'application/x-mpegURL'
          }]
        }
        return (
          <VideoJSPlayer title={title} namespace={namespace} firstHalf={firstHalf} {...videoJsOptions} />
        )
      } else {
        videoJsOptions = {
          ...videoJsOptions,
          techOrder: ["youtube"],
          sources: [{
            type: "video/youtube",
            src: url
          }],
          youtube: {
            ytControls: 0,
            iv_load_policy: 1
          }
        }

        return (
          <VideoJSPlayer title={title} namespace={namespace} {...videoJsOptions} />
        )
      }
    } else {
      return <span className="no-video">No video URL Provided</span>
    }
  }
}

VideoComponent.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
  namespace: PropTypes.string,
  firstHalf: PropTypes.bool,
  autoPlay: PropTypes.bool
};

VideoComponent.defaultProps = {
  title: '',
  namespace: '',
  firstHalf: true,
  autoPlay: false
}

export default VideoComponent
