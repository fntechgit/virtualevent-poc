/**
 * Copyright 2017 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import React from 'react'
import URI from "urijs"
import { Redirect, navigate } from '@reach/router'
import { connect } from 'react-redux';
import { AbstractAuthorizationCallbackRoute } from "openstack-uicore-foundation/lib/components";
import { getUserProfile } from '../actions/user-actions'

import envVariables from '../utils/envVariables'

class AuthorizationCallbackRoute extends AbstractAuthorizationCallbackRoute {

  constructor(props) {
    super(envVariables.IDP_BASE_URL, envVariables.OAUTH2_CLIENT_ID, props);
  }

  _callback(backUrl) {
    navigate(URI.decode(backUrl));
  }

  _redirect2Error(error) {
    return (
      <div render={props => {
        return <Redirect to={`/error?error=${error}`} />
      }} />
    )
  }
}

const mapStateToProps = ({ loggedUserState }) => ({
  accessToken: loggedUserState.accessToken,
  idToken: loggedUserState.idToken,
  sessionState: loggedUserState.sessionState,
})

export default connect(mapStateToProps, {
  getUserProfile
})(AuthorizationCallbackRoute)
