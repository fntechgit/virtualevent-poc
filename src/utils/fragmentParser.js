import { FragmentParser } from "openstack-uicore-foundation/lib/components";

const fragmentParser = new FragmentParser();

// Helper functions.
export const getUrlParam = param => {
    return fragmentParser.getParam(param);
};

export const setUrlParam = (name, value, clearVars = null) => {
    if (clearVars) {
        fragmentParser.deleteParams(clearVars);
    }
    fragmentParser.setParam(name, value);
    if (typeof window !== 'undefined')
        window.location.hash = fragmentParser.serialize();
};

export const getUrlParams = () => {
    return fragmentParser.getParams();
};

export const setUrlParams = (params, exclude = []) => {
    Object.keys(params).forEach(param => {
        if (exclude.indexOf(param) < 0) {
            fragmentParser.setParam(param, params[param]);
        }
    });

    if (typeof window !== 'undefined')
        window.location.hash = fragmentParser.serialize();
};

export const clearUrlParams = (params = null) => {
    if (!params) {
        fragmentParser.clearParams();
        if (typeof window !== 'undefined')
            window.location.hash = '';
    } else {
        fragmentParser.deleteParams(params);
        if (typeof window !== 'undefined')
            window.location.hash = fragmentParser.serialize();
    }
};