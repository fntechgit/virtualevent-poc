import React from 'react'
import URI from "urijs"

import { doLogin } from 'openstack-uicore-foundation/lib/security/methods'

import { getEnvVariable, AUTHORIZED_DEFAULT_PATH } from '../utils/envVariables'

const LoginButton = class extends React.Component {

  getBackURL() {
    let { location } = this.props;
    let defaultLocation = getEnvVariable(AUTHORIZED_DEFAULT_PATH) ? getEnvVariable(AUTHORIZED_DEFAULT_PATH) : '/a/';
    let backUrl = location.state?.backUrl ? location.state.backUrl : defaultLocation;    
    return URI.encode(backUrl);
  }

  onClickLogin() {    
    doLogin(this.getBackURL());
  }

  render() {
    return (
      <div className="container">
        <div className="login-form">
          <h2 className="form-signin-heading">Virtual Event Login</h2>
          <button className="btn btn-lg btn-primary btn-block" onClick={() => this.onClickLogin()}>Sign in</button>
          <br /><br />
          <h4>Request access</h4>
          Get access to virtual event. Register <a href="https://idp.dev.fnopen.com/auth/register">here</a>
        </div>
      </div>
    )
  }
}

export default LoginButton