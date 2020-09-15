import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ClockComponent from '../components/ClockComponent'
import useSiteMetadata from './SiteMetadata'
import { withPrefix } from 'gatsby'

import SummitObject from '../content/summit.json'

// import "../styles/all.scss"
// import "../styles/palette.scss"
import "../styles/bulma.scss"

const TemplateWrapper = ({ children, marketing }) => {

  const { title, description } = useSiteMetadata();
  const { summit } = SummitObject;

  const [isFocus, setIsFocus] = useState(true);

  const onFocus = useCallback(() => {
    setIsFocus(true);
  });

  const onBlur = useCallback(() => {
    setIsFocus(false);
  });

  useEffect(() => {
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    // Specify how to clean up after this effect:
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  });

  return (
    <div id="container">
      <Helmet>
        <html lang="en" />
        <title>{`${summit.name} - ${title}`}</title>
        <meta name="description" content={description} />

        <link
          rel="icon"
          type="image/x-icon"
          href={`${withPrefix('/')}img/favicon.ico`}
          sizes="16x16"
        />

        <meta name="theme-color" content="#fff" />

        <meta property="og:type" content="business.business" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content="/" />
        <meta
          property="og:image"
          content={`${withPrefix('/')}img/og-image.jpg`}
        />
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
      </Helmet>
      <Header />
      <ClockComponent summit={summit} display={isFocus} />
      <div id="content-wrapper">{children}</div>
      <Footer marketing={marketing} />
    </div>
  )
}

export default TemplateWrapper;