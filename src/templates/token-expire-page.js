import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import URI from "urijs";
import { handleResetReducers } from '../actions/event-actions'
import { doLogin } from "openstack-uicore-foundation/lib/methods";

export const TokenExpirePageTemplate = class extends React.Component {

  constructor(props) {
    super(props);

    this.redirectToLogin = this.redirectToLogin.bind(this);
  }

  redirectToLogin() {
    const { location, handleResetReducers } = this.props;

    let previousLocation = location.state?.backUrl ? location.state.backUrl : '/a/';    
    let backUrl = URI.encode(previousLocation);
    setTimeout(() => {
      handleResetReducers();
      doLogin(backUrl);
    }, 3000);
  }

  render() {

    this.redirectToLogin();

    return (
      <div className="container pt-5">
        <div className="columns">
          <div className="column">
            <h3>Your session has timed out.</h3>
            <h3>You will be redirected to the login page.</h3>
          </div>
        </div>
      </div>
    )
  }
}

TokenExpirePageTemplate.propTypes = {
  loggedUser: PropTypes.object,
  location: PropTypes.object,
  handleResetReducers: PropTypes.func,
}

const TokenExpirePage = ({ loggedUser, location, handleResetReducers }) => {

  return (
    <TokenExpirePageTemplate
      loggedUser={loggedUser}
      location={location}
      handleResetReducers={handleResetReducers}
    />
  )

}

TokenExpirePage.propTypes = {
  loggedUser: PropTypes.object,
  location: PropTypes.object,
  handleResetReducers: PropTypes.func,
}

const mapStateToProps = ({ loggedUserState }) => ({
  loggedUser: loggedUserState
})

export default connect(mapStateToProps, { handleResetReducers })(TokenExpirePage);
