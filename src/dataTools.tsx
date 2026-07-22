import { orderedData } from "./orderedData";

export const bColor = '#672be0'
export const pColor = '#52b1e8'
export const allColor = '#0b7028'

export const allBData: any = orderedData.filter(x => x?.event === 'B');
export const allPData: any = orderedData.filter(x => x?.event === 'P');

const allTotals = orderedData.reduce((accumulator: any, currentItem: any) => {
    const key = currentItem.event;

    // If the category does not exist in our accumulator, initialize it
    if (!accumulator[key]) {
        accumulator[key] = { date: key, totals: 0, event: currentItem.event };
    }

    // Sum the amount into the existing category group
    accumulator[key].totals += currentItem.totals;

    return accumulator;
}, {});

export const allTotalsArray: any[] = Object.values(allTotals);

// Combine all B events and sum their values
const combinedMap = allBData.reduce((accumulator: any, currentItem: any) => {
    const key = currentItem.date;

    // If the category does not exist in our accumulator, initialize it
    if (!accumulator[key]) {
        accumulator[key] = { date: key, totals: 0, event: currentItem.event };
    }

    // Sum the amount into the existing category group
    accumulator[key].totals += currentItem.totals;

    return accumulator;
}, {});

// Combine all P events items and sum their values
const pCombinedMap = allPData.reduce((accumulator: any, currentItem: any) => {
    const key = currentItem.date;

    // If the category does not exist in our accumulator, initialize it
    if (!accumulator[key]) {
        accumulator[key] = { date: key, pTotals: 0, pEvent: currentItem.event };
    }

    // Sum the amount into the existing category group
    accumulator[key].pTotals += currentItem.totals;

    return accumulator;
}, {});

// Convert the grouped object values back into an array of objects
const resultB = Object.values(combinedMap);
const resultP = Object.values(pCombinedMap)

// Combine both resultB and resultP based on their similar date values
export const combinedResults = Object.values(
    [...resultB as any, ...resultP as any].reduce((acc: any, current: any) => {
        const key: any = current['date'];
        acc[key] = acc[key] ? { ...acc[key], ...current } : { ...current };
        return acc;
    }, {})
);