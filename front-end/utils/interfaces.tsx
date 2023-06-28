import { type } from "os";

export type catParams = {
    category:string,
    name:string,
    year:string
};

export type subCatParams = {
    category:string,
    type:string,
    name:string,
    year:string
};

export type paramsString = Parameters<(x: string)=>void>

export type PageServerSideProp = {
    isAuthanticated: boolean,
    query?: catParams[]
}

export type verticalChartDataSetsType = {
    label: string,
    data: number[],
    color:string
}

export type verticalChartDataType = {
    labels:string[],
    dataSets: verticalChartDataSetsType[]
}

export type customDataCategory = {
    keys:string[],
    content:(undefined|[])[],
    year:string
}

export type chartDataType = {
    data: {[key:string]:any}[],
    // xAxis: {
    //     label:string,
    //     key:string,
    // }[],
    // yAixs: string[],
    title:string,
    [key:string]:any|undefined,
}