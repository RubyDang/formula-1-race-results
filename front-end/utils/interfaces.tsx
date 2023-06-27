export type catParams = {
    // category:[
        category:string,
        name:string,
        year:string
    // ]
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