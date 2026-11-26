export type OrderedDataType = {
    date: number;
    time: any;
    event: string;
    totals: number;
};

import rawDataM from './orderedDataM.json';
import rawDataH from './orderedDataH.json';

export const orderedDataM = rawDataM as OrderedDataType[];
export const orderedDataH = rawDataH as OrderedDataType[];
export const emptyData: OrderedDataType[] = [
    {
        "date": 1,
        "time": "1:00",
        "event": "B",
        "totals": 0
    },
]


