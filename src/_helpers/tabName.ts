export {
    getNextTabName,
    defaultSize,
    fullWidth,
    getFullHeight
};

// get next consecutive "Item " numbered tab name... does not fill in gaps in existing series
const getNextTabName = (tabs: any[], prefix: string): string => {
    const maxNo = Math.max(
        ...tabs
            .filter(
                (x: any) =>
                    x.name.startsWith(prefix) && !isNaN(x.name.substring(prefix.length))
            )
            .map((x: any) => Number(x.name.substring(prefix.length)))
            .sort((a: any, b: any) => a - b)
    );

    const name = prefix + (isNaN(maxNo) || maxNo === -Infinity ? 1 : maxNo + 1);
    return name;
};

// component default and max sizes
const defaultSize = 8;
const fullWidth = 24;

const getFullHeight = (): number => {
    const rowHeight = 40;
    const screenHeight = (document.documentElement.clientHeight || 300) - 80;
    const screenBottom = Math.ceil(screenHeight / (rowHeight + 10)) - 1;
    return screenBottom;
}