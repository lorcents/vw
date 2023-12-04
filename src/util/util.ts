export const generateRandomSixDigitNumber =() =>{
    return (Math.floor(100000 + Math.random() * 900000)).toString();
}

export const addMinutesToDate = (mins:number) =>{
    let currentDate = new Date();
currentDate.setMinutes(currentDate.getMinutes() + mins);
return currentDate
}