import {convertTimetoMs, convertMstoTime, parseTimeRangeToMs} from "../durationConverter";
 
describe("duration converter utils", () => {
    it('converts duration of hours mins secs to time string', () => {
        const expectedResult = "08:30:20";
        const duration = 30620000; 
        const result = convertMstoTime(duration);

        expect(result).toEqual(expectedResult);
    });

    it('converts time of hours mins secs string to duration', () => {
        const expectedResult = 30620000;
        const duration = "08:30:20"; 
        const result = convertTimetoMs(duration);

        expect(result).toEqual(expectedResult);
    });

    it('converts zero duration to time string', () => {
        const expectedResult = "00:00:00";
        const duration:number = 0; 
        const result = convertMstoTime(duration);

        expect(result).toEqual(expectedResult);
    });

    it('converts time of hours mins secs string to duration: 01:01:23', () => {
        const expectedResult = 3683000;
        const duration = "01:01:23"; 
        const result = convertTimetoMs(duration);

        expect(result).toEqual(expectedResult);
    });

    it('converts duration with excess millisecs to truncated time string', () => {
        const expectedResult =  "01:01:23";
        const duration = 3683027; 
        const result = convertMstoTime(duration);

        expect(result).toEqual(expectedResult);
    });


    it('converts time range h - h to valid array of ms', () => {
        const expectedResult =  [0, 60*60*1000];
        const inputRange = "0-1"; 
        const result = parseTimeRangeToMs(inputRange);

        expect(result).toEqual(expectedResult);
    });

    it('converts time range h:m - h to valid array of ms', () => {
        const expectedResult =  [20*60*1000, 60*60*1000];
        const inputRange = "0:20-1"; 
        const result = parseTimeRangeToMs(inputRange);

        expect(result).toEqual(expectedResult);
    });

    it('converts time range h:m:s - h to valid array of ms', () => {
        const expectedResult =  [20*60*1000 + 30*1000, 60*60*1000];
        const inputRange = "0:20:30-1"; 
        const result = parseTimeRangeToMs(inputRange);

        expect(result).toEqual(expectedResult);
    });

    it('converts time range h to valid array of ms', () => {
        const expectedResult =  [60*60*1000, 2*60*60*1000];
        const inputRange = "1"; 
        const result = parseTimeRangeToMs(inputRange);

        expect(result).toEqual(expectedResult);
    });

    it('converts time range h:m to valid array of ms', () => {
        const expectedResult =  [60*60*1000 + 30*60*1000, 60*60*1000 + 31*60*1000];
        const inputRange = "1:30"; 
        const result = parseTimeRangeToMs(inputRange);

        expect(result).toEqual(expectedResult);
    });
});