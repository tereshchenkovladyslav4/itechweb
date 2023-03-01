export function parseJSON(json) {
    try {
        return JSON.parse(json);
    }
    catch(error) {
        console.log('Could not read JSON data ' + json);
        console.error(error);
    }
}