import {
  getAccessToken,
  getRequest,
  createAction,
  stopLoading,
  startLoading,
} from 'openstack-uicore-foundation/lib/methods';

import { customErrorHandler } from '../utils/customErrorHandler';

import { getEnvVariable, SUMMIT_API_BASE_URL, SUMMIT_ID } from '../utils/envVariables';

export const REQUEST_PRESENTATIONS_PAGE = 'REQUEST_PRESENTATIONS_PAGE';
export const RECEIVE_PRESENTATIONS_PAGE = 'RECEIVE_PRESENTATIONS_PAGE';
export const REQUEST_PRESENTATIONS_PAGE_ERROR = 'REQUEST_PRESENTATIONS_PAGE_ERROR';

export const getVoteablePresentations = (page = 1, perPage = 9) => async (dispatch, getState) => {

  dispatch(startLoading());

  const accessToken = await getAccessToken();
  if (!accessToken) {
    dispatch(stopLoading());
    return Promise.resolve();
  }

  const params = {
    access_token: accessToken,
    expand: 'track, media_uploads',
    filter: 'published==1',
    order: 'random',
    page: page,
    per_page: perPage,
  };

  return getRequest(
    createAction(REQUEST_PRESENTATIONS_PAGE),
    createAction(RECEIVE_PRESENTATIONS_PAGE),
    `${getEnvVariable(SUMMIT_API_BASE_URL)}/api/v1/summits/${getEnvVariable(SUMMIT_ID)}/presentations/voteable`,
    customErrorHandler,
    { page }
  )(params)(dispatch).then((result) => {
    const { presentationsState: { pagination: { pages, lastPage } } } = getState();
    const fetchedPages = Object.keys(pages).map(Number);
    const allPages = Array.from({ length: lastPage }, (_, i) => i + 1);
    const remainingPages = allPages.filter(x => !fetchedPages.includes(x));
    if (remainingPages.length) {
      const randomRemainingPageIndex = Math.floor(Math.random() * remainingPages.length);
      dispatch(getVoteablePresentations(remainingPages[randomRemainingPageIndex], perPage));
    } else {
      dispatch(stopLoading());
    }
  }).catch(e => {
    dispatch(stopLoading());
    dispatch(createAction(REQUEST_PRESENTATIONS_PAGE_ERROR)(e));
    return (e);
  });
};