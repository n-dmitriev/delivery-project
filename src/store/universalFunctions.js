export function dispatchAction(type, item) {
    return {
        type, item,
    }
}

export function getElementById(arr, id) {
    return arr.findIndex(x => x.id === id)
}

export function getDate() {
    const date = new Date()
    const formatDate = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ' ' + ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
    return formatDate
}