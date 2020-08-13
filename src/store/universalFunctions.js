export function dispatchAction(type, item) {
    return {
        type, item
    }
}

export function getElementById(arr, id) {
    return arr.findIndex(x => x.id === id)
}

export function getDate(date) {
    const convertedDate = new Date(date)
    //console.log(date, convertedDate)
    return ('0' + convertedDate.getHours()).slice(-2) + ':' + ('0' + convertedDate.getMinutes()).slice(-2)
        + ' ' + ('0' + convertedDate.getDate()).slice(-2) + '.' + ('0' + (convertedDate.getMonth() + 1)).slice(-2)
        + '.' + convertedDate.getFullYear()
}