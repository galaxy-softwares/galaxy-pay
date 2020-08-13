import { ModalActions } from "../actions/modal.action"

const modalState = {
    visible: false,
}

export const modalReducer = (state = modalState, actions: ModalActions) => {
    switch (actions.type) {
        case 'SEVISIBLE':
            return { ...state, visible: actions.payload }
        default:
            return state
    }
}
