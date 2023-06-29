import { getDriversHTMLByYear, getDriversHTMLByYear_SubCat, getRacesHTMLByYear, getRacesHTMLByYear_SubCat, getTeamsHTMLByYear, getTeamsHTMLByYear_SubCat } from "@/src/apis/getData";
import { getDriversNavItemsByHTML, getRacesNavItemsByHTML, getTeamsNavItemsByHTML } from "./functions";

export const functionsGetData: { [K: string]: Function } = {
    getRacesHTMLByYear: getRacesHTMLByYear,
    getTeamsHTMLByYear: getTeamsHTMLByYear,
    getDriversHTMLByYear: getDriversHTMLByYear,
    getRacesNavItemsByHTML: getRacesNavItemsByHTML,
    getDriversNavItemsByHTML: getDriversNavItemsByHTML,
    getTeamsNavItemsByHTML: getTeamsNavItemsByHTML,
    getRacesHTMLByYear_SubCat:getRacesHTMLByYear_SubCat,
    getDriversHTMLByYear_SubCat:getDriversHTMLByYear_SubCat,
    getTeamsHTMLByYear_SubCat:getTeamsHTMLByYear_SubCat,
};