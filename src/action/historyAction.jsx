export let getHistory = (data) => {
    return {
        type: "GET_HISTORY",
        payload: data
    }
}