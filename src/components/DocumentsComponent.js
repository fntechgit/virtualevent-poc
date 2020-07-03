import React from 'react'
import styles from '../styles/documents.module.scss'

const DocumentsComponent = ({ materials }) => {

  let sortedMaterials = [...materials].sort((a, b) => {
    if (a.order > b.order) {
      return 1;
    } else if (a.order < b.order) {
      return -1;
    } else {
      return 0;
    }
  });

  console.log(sortedMaterials)

  return (
    <div className="column is-one-quarter">
      <div className={`${styles.docsContainer}`}>
        <div className={styles.title}>Documents</div>
        <hr />
        {sortedMaterials.length > 0 &&
          sortedMaterials.map((material, index) => {
            return (
              <React.Fragment>
                {material.class_name === 'PresentationSlide' ?
                  <div className="columns is-mobile is-vcentered" key={index}>
                    <div className="column is-2 is-offset-1">
                      <i className={`fa fa-file-o icon is-large`}></i>
                    </div>
                    <div className="column is 6">
                      <span dangerouslySetInnerHTML={{ __html: material.description }}></span>
                    </div>
                    <div className="column is-2 has-text-right">
                      <a href={material.link}><i className="fa fa-download icon is-large"></i></a>
                    </div>
                    <div className="column is-1"></div>
                  </div>
                  :
                  <div className="columns is-mobile is-vcentered" key={index}>
                    <div className="column is-2 is-offset-1">
                      <i className={`fa ${material.class_name === 'PresentationVideo' ? 'fa-video-camera' : 'fa-link'} icon is-large`}></i>
                    </div>
                    <div className="column is 8">
                      <a href={material.class_name === 'PresentationVideo' ? `https://www.youtube.com/watch?v=${material.youtube_id}` : material.link} target="_blank">
                        <span dangerouslySetInnerHTML={{ __html: material.description }}></span>
                      </a>
                    </div>
                    <div className="column is-1"></div>
                  </div>}
                <hr />
              </React.Fragment>
            )
          })
        }
      </div>
    </div>
  )
}

export default DocumentsComponent;
