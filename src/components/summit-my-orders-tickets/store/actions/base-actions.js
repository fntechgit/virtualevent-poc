import { createAction } from "openstack-uicore-foundation/lib/utils/actions";

export const RESET_STATE = 'RESET_STATE';

export const resetState = () => (dispatch) => {
    dispatch(createAction(RESET_STATE)({}));
};
