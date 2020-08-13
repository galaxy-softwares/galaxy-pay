import { UserAction } from "../actions/user.action";

const userState = {
    username: "",
    avatar: "",
    id: "",
    work_path: ""
}

export const userReducer = (state = userState, actions: UserAction) => {
    switch (actions.type) {
        case 'SETUSER':
            return { ...state, ...actions.payload }
        default:
            return state
    }
}
