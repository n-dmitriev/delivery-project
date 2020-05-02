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

export async function sortArray(ordersList, coordinate) {
    const arr = []

    for (let i of ordersList) {
        const route = await window.ymaps.route([coordinate, i.coordinate])
        const distance = Math.ceil(route.getLength())
        arr.push({
            distance, data: i
        })
    }

    arr.sort((a, b) => {
        if (a.distance > b.distance) return 1;
        if (a.distance == b.distance) return 0;
        if (a.distance < b.distance) return -1;
    })
    console.log(arr)
    return arr
}