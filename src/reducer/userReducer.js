let INITIAL_STATE = {
    username: "",
    email: "",
    password: "",
    id: "",
    cart: ""
}

let userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "LOG_IN":
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
                password: action.payload.password,
                id: action.payload.id,
                cart: action.payload.cart,
                role: action.payload.role,
            }
        case "LOG_OUT":
            return INITIAL_STATE
        default:
            return state
    }
}

export default userReducer