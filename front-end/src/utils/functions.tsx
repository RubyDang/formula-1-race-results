import * as cheerio from 'cheerio';
import moment from 'moment';

export const capitalizeFirstLetterOfEachWord = (str:string) =>{
    return str.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
}
export function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function getDataByFunctionName(functionsGetData: { [K: string]: Function }, name: string, ...arg: string[]) {
    if (functionsGetData[name]) {
        // if(arg?.length==1)
        //     return await functionsGetData[name](arg[0]);
        // if(arg?.length==2)
            return await functionsGetData[name](...arg);
    }

    return undefined;
}

export function compare(a:any, b:any) {
    // check for numberhood
    const numA = !isNaN(a);
    const numB = !isNaN(b);
    
    if (numA && numB) {
        return Number(a) - Number(b);
    }
    
    if (numA) return -1;
    if (numB) return 1;
    
    // check for wordhood
    const wordA = /^[a-zA-Z]+/.test(a);
    const wordB = /^[a-zA-Z]+/.test(b);

    if (wordA && wordB) {
        return a.localeCompare(b);
    }

    if (wordA) return -1;
    if (wordB) return 1;

    return a>b?1:-1; // or whatever logic to sort within non-alphanumeric values
}

import "../variables.css";

export const getColorFromCSS = (elt:Element, nameVar:string) => {
    return getComputedStyle(elt).getPropertyValue(nameVar);
}

// GET YEARS NAVIGATION ITEMS
// RESULTS HTML
export function getResultsYearsItemsByHTML (html:string){
    const $ = cheerio.load(html)
    let options = $('a[data-name="year"]');
    const values:(string|number|undefined)[] = []; 
    
    options.each((_index, el) => {
        let elVal = $(el).attr('data-value') ?? undefined;
        values.push( elVal || undefined);
    })
    
    console.log('get results years - finished')
    return values.filter(v => v);
}

// GET NAVIGTION ITEMS OF CATEGORIES
// RACES
export function getRacesNavItemsByHTML (html:string){
    const $ = cheerio.load(html)
    let options = $('[name="meetingKey"] option');
    const values:string[] = []; 
    
    options.each((_index, el) => {
        values.push($(el).attr('value')??"");
    })
    
    return values.filter(v => v);
}

//DRIVERS
export function getDriversNavItemsByHTML (html:string){
    const $ = cheerio.load(html)
    let options = $('[name="driverRef"] option');
    const values:string[] = []; 
    
    options.each((_index, el) => {
        values.push($(el).attr('value')??"");
    })
    
    return values.filter(v => v);
}

//TEAMS
export function getTeamsNavItemsByHTML (html:string){
    const $ = cheerio.load(html)
    let options = $('[name="teamKey"] option');
    const values:string[] = []; 
    
    options.each((_index, el) => {
        values.push($(el).attr('value')??"");
    })
    
    return values.filter(v => v);
}



// GET TABLE CONTENT OF HTML
export function getTableContentByHTML (html:string, category:string=""){
    let keys = getTableKeysByHTML(html)
    const $ = cheerio.load(html)
    let date = $(`.resultsarchive-content-header.group p.date`).children()
    let dateTemp:string[] = [];
    date.each((_index, el)=>{
        let dateTexts = $(el).text().replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"").split("\n").filter(i=>i)??[]
        dateTemp.push(dateTexts.join('-'))
    })
    let contentKeys = $('table.resultsarchive-table tbody td[class!="limiter"]');
    let content : any[] = [];
    const contentTemp:string[] = [];
    let objFilter:any[] = []
    contentKeys.each((_index, el) => {
        let words:string[] = $(el).text().replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"").split("\n").filter(i=>i)??[]
        if(words?.length>2){
            words = [words[0], words[1]]
        }
        contentTemp.push(words.join(' '))
    })
    
    for (let i = 0; i < contentTemp.length; i++) {
        let item:string|number = contentTemp[i];
        let keyIndex = i%keys.length;
        if(keyIndex==keys.findIndex(key=>key.toLowerCase()=='date')){
            item = moment(item,'DD-MMM-YYYY').format("DD/MM/YYYY")
        }
        if(keyIndex==0){
            if(category!=""){
                objFilter=[category]
                objFilter.push(item)
            }else{
                objFilter=[item]

            }
        }else{
            objFilter.push(item)
            if(keyIndex==keys.length-1){
                if(dateTemp?.length>0)
                    objFilter.push(dateTemp[date.length-1])
                content.push(objFilter)
            }
        }
    }
    return content;
}

export function getTableKeysByHTML (html:string){
    const $ = cheerio.load(html)
    let contentKeys = $('table.resultsarchive-table thead th[class!="limiter"]');
    const keys : string[] = [];
    
    contentKeys.each((_index, el) => {
        keys.push($(el).text()??"");
    })
    return keys
}

export function getTableContentByHTML_subCateIsAll (html:string){
    let keys = getTableKeysByHTML(html)
    const $ = cheerio.load(html)
    let contentKeys = $('table.resultsarchive-table tbody td[class!="limiter"]');
    let content : {[key: string]: any}[] = [];
    const contentTemp:string[] = [];
    let objFilter = {}

    contentKeys.each((_index, el) => {
        let words:string[] = $(el).text().replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"").split("\n").filter(i=>i)??[]
        if(words?.length>2){
            words = [words[0], words[1]]
        }
        contentTemp.push(words.join('-').toLowerCase())
    })

    for (let i = 0; i < contentTemp.length; i++) {
        const item = contentTemp[i];
        let keyIndex = i%keys.length;
        objFilter = {...objFilter, [keys[keyIndex]]:item}
        if(keyIndex==keys.length-1){
            content.push(objFilter)
        }
    }

    return content;
}