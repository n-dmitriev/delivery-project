export function dispatchAction(type, item) {
    return {
        type, item,
    }
}

export function getElementById(arr, id) {
    return arr.findIndex(x => x.id === id)
}