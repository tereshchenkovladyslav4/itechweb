
export function parseTimeRangeToMs(timeRange: string): (number|null)[] {
    const timeRanges = timeRange.split("-");

    if (timeRanges.length === 1) {
        const ms = convertTimetoMs(timeRanges[0]);
        const ms2 = convertTimetoMsAddPeriod(timeRanges[0]);
        return [ms, ms2];
    }

    const ms = convertTimetoMs(timeRanges[0]);
    const ms2 = convertTimetoMs(timeRanges[1]);
    return [ms, ms2];
}


// Allowed inputs are:
// h[h]
// h[h]:m[m]
// h[h]:m[m]:s[s]
export function convertTimetoMs(time: string): number | null {
    if (time) {
        const splitTime = time.split(':');
        const hrs = Number(splitTime.length === 0 ? time : splitTime[0]);
        const mins = Number(splitTime.length >= 2 ? splitTime[1] : 0);
        const secs = Number(splitTime.length === 3 ? splitTime[2] : 0);

        return (hrs * 60 * 60 +
            mins * 60 +
            secs) * 1000;
    }
    return null;
}

// adds a "period" of format given to input time
// i.e. 1 becomes 2 hrs
//      00:1 becomes 2 mins 
export function convertTimetoMsAddPeriod(time: string): number | null {
    if (time) {
        const splitTime = time.split(':');
        const hrs = Number(splitTime.length === 0 ? time : splitTime[0]);
        const mins = Number(splitTime.length >= 2 ? splitTime[1] : 0);
        const secs = Number(splitTime.length === 3 ? splitTime[2] : 0);

        let addPeriod = 0;
        switch (splitTime.length) {
            case 0:
            case 1:
                addPeriod = 60 * 60;
                break;
            case 2:
                addPeriod = 60;
                break;
            case 3:
                addPeriod = 1;
                break;

        }
        return (hrs * 60 * 60 +
            mins * 60 +
            secs +
            addPeriod) * 1000;
    }
    return null;

}

// N.B drops the millisecs part so conversion back will not give original value
export function convertMstoTime(duration: number): string {
    const seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) );

    const hrs = zeroPad(hours, 2);
    const mins = zeroPad(minutes, 2);
    const secs = zeroPad(seconds, 2);

    return `${hrs}:${mins}:${secs}`;
}

const zeroPad = (num: number, places: number): string => String(num).padStart(places, '0')