export const getDayandTime = () => {
    const date = Date()
    console.log(date.split(" "))
    const todaysDate = `${date.split(" ")[0]} ${date.split(" ")[1]} ${date.split(" ")[2]},${date.split(" ")[3]}`
    // console.log(`${date.split(" ")[0]} ${date.split(" ")[1]} ${date.split(" ")[2]},${date.split(" ")[3]} `)

    let isDay;
    let isNight;

    const time = Date().split(" ")[4]

    const number = time.split(":")[0]

    if (parseInt(number) >= 5 && parseInt(number) <= 16) {
        isDay = true
        isNight = false
    } else {
        isDay = false
        isNight = true
    }


    // console.log({isDay,isNight})
    return { time, number , isDay , isNight,todaysDate }
}