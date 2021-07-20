import {createAction} from 'openstack-uicore-foundation/lib/methods';
import { FragmentParser } from "openstack-uicore-foundation/lib/components";

import {pickBy, isEqual, isEmpty} from "lodash";

export const UPDATE_EVENTS      = 'UPDATE_EVENTS';
export const UPDATE_FILTER      = 'UPDATE_FILTER';
export const UPDATE_FILTERS     = 'UPDATE_FILTERS';
export const CHANGE_VIEW        = 'CHANGE_VIEW';

const fragmentParser = new FragmentParser();

export const updateFilter = (filter) => (dispatch, getState) => {
    dispatch(createAction(UPDATE_FILTER)({...filter}))
};

export const updateFiltersFromHash = () => (dispatch, getState) => {
    const qsFilters = fragmentParser.getParams();

    // escape if no hash
    if (isEmpty(qsFilters)) return null;

    const {scheduleState} = getState();
    const {filters: storedFilters} = scheduleState;
    const filterKeys = Object.keys(storedFilters);
    const newFilters = {};

    // remove any query vars that are not filters
    const normalizedFilters =  pickBy(qsFilters, (value, key) => filterKeys.includes(key));

    // populate state filters with hash values
    Object.keys(storedFilters).forEach(key => {
        newFilters[key] = {...storedFilters[key]}; // copy label and rest of props
        const newValues = normalizedFilters[key] ? normalizedFilters[key].split(',') : [];
        newFilters[key].values = newValues.map(val => {
            if (isNaN(val)) return val;
            return parseInt(val);
        })
    });

    // only update if filters have changed
    if (!isEqual(newFilters, storedFilters)) {
        dispatch(createAction(UPDATE_FILTERS)({filters: newFilters, view: qsFilters.view}));
    }

    // clear hash
    fragmentParser.clearParams();

    if (typeof window !== 'undefined') {
        window.history.replaceState(null, null, ' ');
    }
};

export const getShareLink = (filters, view) => {
    const hashVars = [];

    Object.entries(filters).forEach(([key, value]) => {
        if(value.values.length > 0) {
            hashVars.push(`${key}=${value.values.join(',')}`)
        }
    });

    hashVars.push(`view=${view}`);

    if (typeof window !== 'undefined') {
        return `${window.location}#${hashVars.join('&')}`;
    }

    return '';
};

export const callAction = (action, payload) => (dispatch) => {
    return dispatch(createAction(action)(payload));
};