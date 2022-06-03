import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import sanitizeHtml from 'sanitize-html';

export const HTMLContent = ({ content, className }) => {
  const [cleanHTML, setCleanHTML] = useState(content);

  useEffect(() => {
    const clean = sanitizeHtml(content, {
      // adds custom settings to default settings (https://www.npmjs.com/package/sanitize-html#default-options)
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe', 'img']),
      allowedAttributes: {...sanitizeHtml.defaults.allowedAttributes, 
        'iframe': [ 'src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen' ],
        'a': ['target'],
        '*': ['href', 'class']
      },
      exclusiveFilter: (frame) => {
        // removing a and p tags with no text or media childrens
        return (frame.tag === 'a' || frame.tag === 'p') && !frame.text.trim() && !frame.mediaChildren;
      }
    });
    setCleanHTML(clean);
  }, [content])

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: cleanHTML }} />
  )
}

const Content = ({ content, className }) => (
  <div className={className}>{content}</div>
)

Content.propTypes = {
  content: PropTypes.node,
  className: PropTypes.string,
}

HTMLContent.propTypes = Content.propTypes

export default Content
