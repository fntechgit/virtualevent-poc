export const createReducer = ({ actionHandlers, middleware }) => (state, action) => {
    const actionHandler = actionHandlers[action.type];

    if (!actionHandler) throw new Error(`Unhandled action type: ${action.type}`);

    if (middleware) middleware(state, action);

    const newState = actionHandler(state, action.payload);

    return newState;
};
