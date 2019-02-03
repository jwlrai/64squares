import { combineReducers } from 'redux'
import alert from './alert'
import model from './model'

// Combine all our reducers together
const rootReducer = combineReducers({
    alert,model
})

export default rootReducer