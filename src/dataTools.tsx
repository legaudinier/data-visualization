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
