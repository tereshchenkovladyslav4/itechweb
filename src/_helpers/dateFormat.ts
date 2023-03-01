

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

// Get UTC date as a string in format dd/mm/yyyy hh:mm
// or as dd/mm/yyyy hh:mm:ss when includeSeconds true
export const dateUtcString = (d: Date, includeSeconds = false): string => {

    const str = `${zeroPad(d.getUTCDate(), 2)}/${zeroPad(d.getUTCMonth() + 1, 2)}/${d.getUTCFullYear()} ${zeroPad(d.getUTCHours(), 2)}:${zeroPad(d.getUTCMinutes(), 2)}`;

    return str + (includeSeconds ? `:${zeroPad(d.getUTCSeconds(), 2)}` : '');
}

// Get date as a string in format dd/mm/yyyy hh:mm
// or as dd/mm/yyyy hh:mm:ss when includeSeconds true
export const dateString = (d: Date, includeSeconds = false): string => {

    const str = `${zeroPad(d.getDate(), 2)}/${zeroPad(d.getMonth() + 1, 2)}/${d.getFullYear()} ${zeroPad(d.getHours(), 2)}:${zeroPad(d.getMinutes(), 2)}`;

    return str + (includeSeconds ? `:${zeroPad(d.getSeconds(), 2)}` : '');
}
