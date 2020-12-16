// import Axios from 'axios'
import { LOG_IN, LOG_OUT } from './helper'

export let login = (data) => {
    return {
        type: LOG_IN,
        payload: data
    }
}

export let logout = () => {
    return {
        type: LOG_OUT
    }
}

// export const keepLogin = () => {
//     return async (dispatch) => {
//         try {
//             let id = localStorage.getItem('id')
//             const { data } = await Axios.get(URL + `/users?id=${id}`)
//             dispatch({ type : LOG_IN, payload : data[0]})
//         } catch(err) {
//             console.log(err)
//         }
//     }
// }