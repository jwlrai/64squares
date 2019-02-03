const defaultState = {
    show:false,
    content:''
}
  
function model (state = defaultState, action) {
    switch (action.type) {
        case 'SHOW_MODEL':
            return action.content;
        case 'HIDE_MODEL':
            return action.content;
        default:
        return state;
    }
}

export default model;