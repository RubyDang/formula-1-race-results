import axios from "axios";
import moment from "moment";
// import $ from 'jquery';

export async function getResultsHTML() {
    return await axios.get(`https://www.formula1.com/en/results.html`)
    .then(res=>{
        console.log('get result.html - success');
        return res.data
    })
    .catch(function (error) {
        if (error.response) {
            console.log("get result.html - error status: ", error.response.status);
            console.log("get result.html - error headers: ", error.response.headers);
            return error.response.status;
        } 
        if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
            console.log("get result.html - error request: ",error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
            console.log("get result.html - error message: ", error.message);
        }
        // return 
    });

}

export async function getRacesHTMLByYear(year=moment().format('YYYY') ) {
    return await axios.get(`https://www.formula1.com/en/results.html/${year}/races.html`)
    .then(res=>{
        console.log('get race.html - success');
        return res.data
    })
    .catch(function (error) {
        if (error.response) {
            console.log("get race.html by year - error status: ", error.response.status);
            console.log("get race.html by year - error headers: ", error.response.headers);
            return error.response.status;
        } 
        if (error.request) {
            console.log("get race.html by year - error request: ", error.request);
        } else {
            console.log("get race.html by year - error message: ", error.message);
        }
    });
}

export async function getRacesHTMLByYear_SubCat(year=moment().format('YYYY'), subCat:string){
    return await axios.get(`https://www.formula1.com/en/results.html/${year}/races/${subCat}/race-result.html`)
    .then(res=>{
        console.log('get race.html by year and grand prix - success');
        return res.data
    })
    .catch(function (error) {
        if (error.response) {
            console.log("get race.html by year and grand prix - error status: ", error.response.status);
            console.log("get race.html by year and grand prix - error headers: ", error.response.headers);
            return error.response.status;
        } 
        if (error.request) {
            console.log("get race.html by year and grand prix - error request: ", error.request);
        } else {
            console.log("get race.html by year and grand prix - error message: ", error.message);
        }
    });
    // const $ = cheerio.load(test)
    // let options = $('[name="meetingKey"] option');
    
    // options.each((index, el) => {
    //     console.log($(el).attr('value'));
    // })
}

export async function getTeamsHTMLByYear(year=moment().format('YYYY')) {
    return await axios.get(`https://www.formula1.com/en/results.html/${year}/team.html`)
    .then(res=>{
        console.log('get team.html by year - success');
        return res.data
    })
    .catch(function (error) {
        if (error.response) {
            console.log("get team.html by year - error status: ", error.response.status);
            console.log("get team.html by year - error headers: ", error.response.headers);
            return error.response.status;
        } 
        if (error.request) {
            console.log("get team.html by year - error request: ", error.request);
        } else {
            console.log("get team.html by year - error message: ", error.message);
        }
    });
    // const $ = cheerio.load(test)
    // let options = $('.resultsarchive-filter-item-link ')
    // console.log(options.text())
}

export async function getTeamsHTMLByYear_SubCat(year=moment().format('YYYY'), subCat:string){
    return await axios.get(`https://www.formula1.com/en/results.html/${year}/team/${subCat}.html`)
    .then(res=>{
        console.log(`get ${subCat}.html by year and team - success`);
        return res.data
    })
    .catch(function (error) {
        if (error.response) {
            console.log(`get ${subCat}.html by year and team - error status: `, error.response.status);
            console.log(`get ${subCat}.html by year and team - error headers: `, error.response.headers);
            return error.response.status;
        } 
        if (error.request) {
            console.log(`get ${subCat}.html by year and team - error request: `, error.request);
        } else {
            console.log(`get ${subCat}.html by year and team - error message: `, error.message);
        }
    });
    // const $ = cheerio.load(test)
    // let options = $('[name="meetingKey"] option');
    
    // options.each((index, el) => {
    //     console.log($(el).attr('value'));
    // })
}

export async function getDriversHTMLByYear(year=moment().format('YYYY')) {
    return await axios.get(`https://www.formula1.com/en/results.html/${year}/drivers.html`)
    .then(res=>{
        console.log('get drivers.html by year - success');
        return res.data
    })
    .catch(function (error) {
        if (error.response) {
            console.log("get drivers.html by year - error status: ", error.response.status);
            console.log("get drivers.html by year - error headers: ", error.response.headers);
            return error.response.status;
        } 
        if (error.request) {
            console.log("get drivers.html by year - error request: ", error.request);
        } else {
            console.log("get drivers.html by year - error message: ", error.message);
        }
    });
    // const $ = cheerio.load(test)
    // let options = $('.resultsarchive-filter-item-link ')
    // console.log(options.children('option'))
}

export async function getDriversHTMLByYear_SubCat(year=moment().format('YYYY'), subCat:string){
    return await axios.get(`https://www.formula1.com/en/results.html/${year}/drivers/${subCat}.html`)
    .then(res=>{
        console.log(`get ${subCat}.html by year and driver name - success`);
        return res.data
    })
    .catch(function (error) {
        if (error.response) {
            console.log(`get ${subCat}.html by year and driver name - error status: `, error.response.status);
            console.log(`get ${subCat}.html by year and driver name - error headers: `, error.response.headers);
            return error.response.status;
        } 
        if (error.request) {
            console.log(`get ${subCat}.html by year and driver name - error request: `, error.request);
        } else {
            console.log(`get ${subCat}.html by year and driver name - error message: `, error.message);
        }
    });
    // const $ = cheerio.load(test)
    // let options = $('[name="meetingKey"] option');
    
    // options.each((index, el) => {
    //     console.log($(el).attr('value'));
    // })
}