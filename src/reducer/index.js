// import combineReducers from redux
import { combineReducers } from 'redux'

// import reducer
import userReducer from "./userReducer"
import { historyReducer } from './HistoryReducer'


// combine all reducer
let allReducers = combineReducers ({
    user: userReducer,
    history: historyReducer
})

export default allReducers