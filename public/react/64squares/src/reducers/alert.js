const defaultState = {
    display:"none",
    content:''
}
  
function alert (state = defaultState, action) {
    switch (action.type) {
        case 'SHOW_ALERT':
            return action.alert;
        case 'HIDE_ALERT':
            return action.alert;
        default:
        return state;
    }
}

export default alert;