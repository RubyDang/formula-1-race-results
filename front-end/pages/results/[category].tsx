import Footer from "@/app/components/footer";
import Header from "@/app/components/header";

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/variables.css';

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getDriversHTMLByYear, getDriversHTMLByYear_SubCat, getRacesHTMLByYear, getRacesHTMLByYear_GPrix, getRacesHTMLByYear_SubCat, getResultsHTML, getTeamsHTMLByYear, getTeamsHTMLByYear_SubCat } from "@/apis/getData";
import { capitalizeFirstLetter, getDataByFunctionName, getDriversNavItemsByHTML, getRacesNavItemsByHTML, getResultsYearsItemsByHTML, getTableContentByHTML, getTableContentByHTML_subCateIsAll, getTableKeysByHTML, getTeamsNavItemsByHTML } from "@/utils/functions";

import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";

import moment from "moment";
import { catParams } from "@/utils/interfaces";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomTable from "@/app/components/tables/CustomTable";

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

export default function Categories({category, data, years, navItems}:InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    console.log(navItems)
    
    
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
        <main style={{
            marginTop:100,
            marginBottom:100,
        }}>
            <Container>
                <Row>
                    <Col>
                        <h1>{data.year&&data.year+" - "}F1 {router.query.name?.toLocaleString().replaceAll(/-|_/g,' ').toUpperCase() ?? router.query.category?.toLocaleString().toLocaleUpperCase()} RESULT</h1>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                        <CustomTable 
                        data={data}
                        category={category}
                        years={years}
                        navItems={navItems}
                        />
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

export const getServerSideProps: GetServerSideProps = async ({query}:{query:catParams}) => {
    console.log(query)
    let { category, year, name } = query ?? {
        category: "races"
    };
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
                console.log(navItems, foundNavItem)
                if(foundNavItem){
                    htmlTemp = await getDataByFunctionName(functionsGetData,`get${capitalizeFirstLetter(category)}HTMLByYear_SubCat`, `${year}`, `${foundNavItem}`)??""
                    if(htmlTemp){
                        let tableKeys = await getTableKeysByHTML(htmlTemp)
                        let tableConent = await getTableContentByHTML(htmlTemp)
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
