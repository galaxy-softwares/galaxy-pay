import { combineReducers, createStore, applyMiddleware} from "redux";
import thunkMiddleware from 'redux-thunk'
import { menuReducer } from "./reducers/menu.reducer";
import { modalReducer } from "./reducers/modal.reducer";
import { userReducer } from "./reducers/user.reducer";
// const rootReducer = combineReducers({
//     menuReducer,
//     modalReducer,
//     userReducer,
// })
//
// export type AppState = ReturnType<typeof rootReducer>
//
// export default  function configureStore() {
//     const store = createStore(rootReducer)
//     return store
// }


const rootReducer = combineReducers({
    menuReducer,
    modalReducer,
    userReducer,
})

export type AppState = ReturnType<typeof rootReducer>

export default function configureStore() {
    const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))
    return store
}
