import Footer from "@/components/footer";
import Header from "@/components/header";

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/variables.css';
import './category.css';

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getDriversHTMLByYear, getDriversHTMLByYear_SubCat, getRacesHTMLByYear, getRacesHTMLByYear_SubCat, getResultsHTML, getTeamsHTMLByYear, getTeamsHTMLByYear_SubCat } from "@/apis/getData";
import { capitalizeFirstLetter, getDataByFunctionName, getDriversNavItemsByHTML, getRacesNavItemsByHTML, getResultsYearsItemsByHTML, getTableContentByHTML, getTableContentByHTML_subCateIsAll, getTableKeysByHTML, getTeamsNavItemsByHTML } from "@/utils/functions";

import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";

import moment from "moment";
import { catParams } from "@/utils/interfaces";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomTable from "@/components/tables/CustomTable";
import CustomRacesVerticalChart from "@/components/charts/customVerticalChart_TwoBars";
import CustomDriverChart from "@/components/charts/customDriverCharts";
import RacesAllComponent from "@/components/races/componentAllPage";
import RacesDetailsComponent from "@/components/races/componentDetailPage";
import DriversAllComponent from "@/components/drivers/componentAllPage";
import DriversDetailsComponent from "@/components/drivers/componentDetailPage";
import TeamsAllComponent from "@/components/teams/componentAllPage";
import TeamsDetailsComponent from "@/components/teams/componentDetailPage";

const functionsGetData: { [K: string]: Function } = {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    
    let { category, year, name }:catParams = context.query as catParams ?? {
        category: "races"
    } as catParams;
    let dataList:{[key:string|number]: any} ={}
    let navItems:string[] = []

    if(["drivers", "races", "teams"].includes(category)){
        let resultsHtml = await getResultsHTML();
        let years: (number|undefined)[] = getResultsYearsItemsByHTML(resultsHtml);
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
                        console.log(tableConent)
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

export default function Categories({category, data, years, navItems}:InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    
    // new post loaded
    useEffect(()=> {
        if(data)
            setIsLoading(false)
    }, [data]);

    return (
        <>
    {isLoading ? (
        <h1>Loading...</h1>
    ) : (
        <div>
        <Header/>
        <main>
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
                data={data}
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
            }
            <Container fluid className="my-5">
                <Row>
                    <Col>
                        {/* {!(/.-all/g.test(category)) && 
                        (category=='races' ? 
                        
                        : */}
                        {/* category=='drivers' && <CustomDriverChart
                        category={category}
                        dataInput={data}
                        title={category == "drivers"?`Driver PTS charts in ${data.year}`:""}
                        />)} */}
                    </Col>
                </Row>
            </Container>
        </main>
        <Footer/>
        </div>
    )}
    </>
    )
    
}