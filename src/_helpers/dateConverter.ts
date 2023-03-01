//ticks are in nanotime; convert to microtime
const ticksToMicrotime =  10000; // ms

//ticks are recorded from 1/1/1; get microtime difference from 1/1/1/ to 1/1/1970
const epochMicrotimeDiff = 621355968000000000;

export const ticksToDate = (ticks:number|null):number => {
    if(ticks === null) return 0;

    //new date is ticks, converted to microtime, minus difference from epoch microtime
    const tickDate = new Date((ticks - epochMicrotimeDiff)/ticksToMicrotime);

    tickDate.setMilliseconds(0);
    return tickDate.getTime();
}

export const dateToTicks = (time:number):number => {
    return (time * ticksToMicrotime) + epochMicrotimeDiff; 
}
