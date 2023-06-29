import Footer from "@/src/components/footer";
import Header from "@/src/components/header";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../variables.css';
import '../../category.css';

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getDriversHTMLByYear, getDriversHTMLByYear_SubCat, getRacesHTMLByYear, getRacesHTMLByYear_SubCat, getResultsHTML, getTeamsHTMLByYear, getTeamsHTMLByYear_SubCat } from "@/src/apis/getData";
import { capitalizeFirstLetter, getDataByFunctionName, getDriversNavItemsByHTML, getRacesNavItemsByHTML, getResultsYearsItemsByHTML, getTableContentByHTML, getTableContentByHTML_subCateIsAll, getTableKeysByHTML, getTeamsNavItemsByHTML } from "@/src/utils/functions";

import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";

import moment from "moment";
import { catParams } from "@/src/utils/interfaces";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import RacesAllComponent from "@/src/components/races/componentAllPage";
import RacesDetailsComponent from "@/src/components/races/componentDetailPage";
import DriversAllComponent from "@/src/components/drivers/componentAllPage";
import DriversDetailsComponent from "@/src/components/drivers/componentDetailPage";
import TeamsAllComponent from "@/src/components/teams/componentAllPage";
import TeamsDetailsComponent from "@/src/components/teams/componentDetailPage";
import { functionsGetData } from "@/src/utils/constanst";
import Loader from "@/src/components/loader";
import Cookies from 'universal-cookie';

export const getServerSideProps: GetServerSideProps = async (context) => {
    
    let { category, year, name }:catParams = context.query as catParams ?? {
        category: "races"
    } as catParams;
    let dataList:{[key:string|number]: any} ={}
    let navItems:string[] = []

    if(["drivers", "races", "teams"].includes(category)){
        let resultsHtml = await getResultsHTML();
        let years: (string| number|undefined)[] = getResultsYearsItemsByHTML(resultsHtml);
        let html:string ="";

        //GET NAVIGATIONS ITEMS
        if(!year){
            year = `${years[0]}`
        }
        let htmlTemp = await getDataByFunctionName(functionsGetData,`get${capitalizeFirstLetter(category)}HTMLByYear`, `${year}`)
        if(typeof htmlTemp == "string"){
            let listNavItems = await getDataByFunctionName(functionsGetData,`get${capitalizeFirstLetter(category)}NavItemsByHTML`, htmlTemp)
            navItems=listNavItems
        }

        //GET DATA
        // htmlTemp = await getDataByFunctionName(functionsGetData,`get${capitalizeFirstLetter(category)}HTMLByYear`, `${year}`)??""
        if(typeof htmlTemp == "string"){
            if(name){
                let foundNavItem = navItems.find((navItem:string) => navItem.includes(name))
                // console.log(navItems, foundNavItem)
                if(foundNavItem){
                    let htmlTemp1 = await getDataByFunctionName(functionsGetData,`get${capitalizeFirstLetter(category)}HTMLByYear_SubCat`, `${year}`, `${foundNavItem}`)??""
                    if(htmlTemp1){
                        let tableKeys = await getTableKeysByHTML(htmlTemp1)
                        let tableConent = await getTableContentByHTML(htmlTemp1)
                        return { props: {
                            category:category,
                            years:years,
                            navItems:navItems,
                            data:{
                                year:year,
                                keys:tableKeys,
                                content:tableConent
                            }
                        } }
                    }
                }
                return { redirect: {
                    destination:`/results/${category}?year=${year}`,
                    permanent:true,
                }}
                // navItems.push(listNavItems)
            }else{
                let tableKeys = await getTableKeysByHTML(htmlTemp)
                let tableConent = await getTableContentByHTML(htmlTemp)
                return { props: {
                    category:category+"-all",
                    years:years,
                    navItems:navItems,
                    data:{
                        year:year,
                        keys:tableKeys,
                        content:tableConent
                    }
                } }
            }
        }
        
        
    }
    return {
        notFound: true,
    }
}

export default function ResultsCategories({category, data, years, navItems}:InferGetServerSidePropsType<typeof getServerSideProps>) {
    const cookies = new Cookies();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(cookies.get("isLoading")||"true");
    // new post loaded
    useEffect(()=> {
        if(data){
            cookies.set('isLoading', false, { path: '/' })
            setIsLoading("false")
        }
    }, [ data]);


    useEffect(()=>{
        console.log("COOKIE CHANEG", cookies.get("isLoading"));
        if(cookies.get('isLoading'))
            setIsLoading(cookies.get("isLoading"));
    },[cookies])
    return (
        <>
        <div>
        <Header/>
        <main className="position-relative">
            {isLoading!="false" ? <Loader/>:<>
            {
                category === 'races-all' &&
                <RacesAllComponent
                dataInput={data}
                category={category}
                years={years}
                navItems={navItems}/>
            }
            {
                category === 'races' &&
                <RacesDetailsComponent
                dataInput={data}
                category={category}
                years={years}
                navItems={navItems}/>
            }
            {
                category === 'drivers-all' &&
                <DriversAllComponent
                dataInput={data}
                category={category}
                years={years}
                navItems={navItems}/>
            }
            {
                category === 'drivers' &&
                <DriversDetailsComponent
                dataInput={data}
                category={category}
                years={years}
                navItems={navItems}/>
            }
            {
                category === 'teams-all' &&
                <TeamsAllComponent
                dataInput={data}
                category={category}
                years={years}
                navItems={navItems}/>
            }
            {
                category === 'teams' &&
                <TeamsDetailsComponent
                dataInput={data}
                category={category}
                years={years}
                navItems={navItems}/>
            }</>}
        </main>
        <Footer/>
        </div>
    </>
    )
    
}