import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux'

import { getAccessToken } from 'openstack-uicore-foundation/lib/methods';

const withAccessToken = (WrappedComponent) => (props) => {

  const isLoggedUser = useSelector(state => state.loggedUserState.isLoggedUser);

  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const retrieveAccessToken = async () => {
      try {
        const token = await getAccessToken()
        setAccessToken(token)
      } catch (error) {
        console.log(error);
      }
    }
    retrieveAccessToken();
  }, [isLoggedUser]);

  if (!isLoggedUser) return (<WrappedComponent {...props} />);

  if (accessToken == null) return null;

  return (
    <WrappedComponent accessToken={accessToken} {...props} />
  );
};

export default withAccessToken;