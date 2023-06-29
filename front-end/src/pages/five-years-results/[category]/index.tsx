import Footer from "@/src/components/footer";
import Header from "@/src/components/header";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../variables.css';
import '../../category.css';

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getDriversHTMLByYear, getDriversHTMLByYear_SubCat, getRacesHTMLByYear, getRacesHTMLByYear_SubCat, getResultsHTML, getTeamsHTMLByYear, getTeamsHTMLByYear_SubCat } from "@/src/apis/getData";
import { capitalizeFirstLetter, capitalizeFirstLetterOfEachWord, getDataByFunctionName, getDriversNavItemsByHTML, getRacesNavItemsByHTML, getResultsYearsItemsByHTML, getTableContentByHTML, getTableContentByHTML_subCateIsAll, getTableKeysByHTML, getTeamsNavItemsByHTML } from "@/src/utils/functions";

import { Button, Col, Container, FloatingLabel, Form, Nav, Row, Tab, Tabs } from "react-bootstrap";

import moment from "moment";
import _ from "lodash";
import { catParams } from "@/src/utils/interfaces";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { functionsGetData } from "@/src/utils/constanst";
import CustomTable from "@/src/components/tables/CustomTable";
import CustomTimeIncludedBarChart from "@/src/components/charts/customTimeIncludedBarChart";
import CustomPieChart from "@/src/components/charts/customPieChart";
import CustomVerticalChartMultipleData from "@/src/components/charts/customVerticalChartTwoBars";
import CustomVerticalChart from "@/src/components/charts/customVerticalChartOneBar";
import Loader from "@/src/components/loader";

import Cookies from 'universal-cookie';

export async function getServerSideProps(context:any){
    let { category, year, name }:catParams = context.query as catParams ?? {
        category: "races"
    } as catParams;
    let dataList:{[key:string|number]: any} ={
        content:{},
        all:{}
    }
    let navItems:any[] = []
    
    if(["drivers", "races", "teams"].includes(category)){
        let resultsHtml = await getResultsHTML();
        let years: (string|number|undefined)[] = getResultsYearsItemsByHTML(resultsHtml).slice(0, 5);
        let html:string ="";
        
        //GET NAVIGATIONS ITEMS
        if(!year){
            year = `${years[0]}`
        }
        if(!years.includes(year)){
            return { redirect: {
                destination:`/ten-years-results/${category}?year=2023`,
                permanent:true,
            }}
        }
        
        let htmlTemp = ""
        for (let i = 0; i < years.length; i++) {
            htmlTemp = await getDataByFunctionName(functionsGetData,`get${capitalizeFirstLetter(category)}HTMLByYear`, `${years[i]}`)
            let listNavItems = []
            if(typeof htmlTemp == "string"){
                let tableKeys = await getTableKeysByHTML(htmlTemp);
                let tableConent = await getTableContentByHTML(htmlTemp); 
                // if(dataList.all){
                    dataList.all[`${years[i]}`]={
                            keys: tableKeys,
                            content: tableConent.slice(0,6)
                        }
                    // }
                // } else{
                //     dataList.all = {
                //         ...dataList.all,
                //         [`${years[i]}`]:{
                //             keys: tableKeys,
                //             content: tableConent
                //         }
                //     }
                // }
                listNavItems = (await getDataByFunctionName(functionsGetData,`get${capitalizeFirstLetter(category)}NavItemsByHTML`, htmlTemp)).slice(0,6)
                let foundAll = listNavItems.findIndex((itemNav:any)=>itemNav=='all')
                if(foundAll>-1){
                    listNavItems = listNavItems.slice(foundAll+1)
                }
            }
            if(listNavItems?.length>0){
                let htmlTempByNav = await getDataByFunctionName(functionsGetData, `get${capitalizeFirstLetter(category)}HTMLByYear_SubCat`,`${years[i]}`, `${listNavItems[0]}`)
                let tableKeys;
                let tableConent;
                if(typeof htmlTempByNav == "string"){
                    if(i==0){
                        tableKeys = await getTableKeysByHTML(htmlTempByNav)
                        dataList={
                            ...dataList,
                            keys: category=="races" ? [...tableKeys, "Grand Prix"]: ["Name",...tableKeys],
                        }
                    }
                }
                for (let indexItemsNav = 0; indexItemsNav < listNavItems.length; indexItemsNav++) {
                    htmlTempByNav = await getDataByFunctionName(functionsGetData, `get${capitalizeFirstLetter(category)}HTMLByYear_SubCat`,`${years[i]}`, `${listNavItems[indexItemsNav]}`)
                    if(typeof htmlTempByNav == "string"){
                        let categoryTemp:any = listNavItems[indexItemsNav].replace(/-|_/gi, " ").split("/")
                        categoryTemp = capitalizeFirstLetterOfEachWord(categoryTemp[categoryTemp.length-1])
                        tableConent = await getTableContentByHTML(htmlTempByNav, category!="races"?categoryTemp:"")
                        if(dataList.content[`${years[i]}`]){
                            dataList.content[`${years[i]}`]=[
                                ...dataList.content[`${years[i]}`],
                                ...tableConent
                            ]
                        }else{
                            dataList.content[`${years[i]}`]=[
                                ...tableConent
                            ]
                        }
                    }
                }
            }
        }
        
        if(Object.values(dataList)?.length>0){
            return{props:{
                category:category,
                years:years,
                data:dataList}
            }
        }else{
            return {
                redirect:{
                    destination:'/'
                }
            }
        }
        
    }
    return {
        notFound: true,
    }
}

export default function Categories({category, data, years}:InferGetServerSidePropsType<typeof getServerSideProps>) {
    const cookies = new Cookies();
    const colors = [
        "rgb(227, 93, 106)",
        "rgb(220, 53, 69)",
        "rgb(176 42 55)",
        "rgb(132 32 41)",
        "rgb(253, 152, 67)",
        "rgb(253, 126, 20)",
        "rgb(202, 101, 16)",
        "rgb(152, 76, 12)",
    ]
    const router = useRouter();
    const [isLoading, setIsLoading] = useState("true");
    const [index, setIndex] = useState(0);
    const [dataTableInput, setDataTabelInput] = useState<any>();
    const [dataYearWinnerChartInput, setDataYearWinnerChartInput] = useState<any>();
    const [dataChart, setDataChartInput] = useState<any>({});
    const [dataPieChartInput, setDataPieChartInput] = useState<any>();

    
    const onClick = () =>{
        // setIsLoading("true")
        // setTimeout(()=>{
            setIsLoading("true")
            cookies.set('isLoading', true, { path: '/' })
            router.push(`/results/${category}`);

        // },500)
    }

    useEffect(()=>{
        if(data?.content){
            //set up tabe data
            let test = Object.entries(data.content).map((item:any, index:number)=>{
                return item[1].map((i:any)=>{
                    return [...i, item[0]]
                })
            }).flat();
            cookies.set('isLoading', false, { path: '/' })
            setDataTabelInput(test)
            setIsLoading("false")
        }
        // else{
        //     // cookies.set('isLoading', true, { path: '/' })
        //     setIsLoading(true)

        // }
    }, [data.content])
    
    useEffect(()=>{
        if (category=="races"){
            if(data?.all){
                let winnerYearsData = Object.keys(data.all).map((item:any, index:number)=>{
                    return {
                        id:data.all[item].content[0][0],
                        name:data.all[item].content[0][2],
                        laps:parseInt(data.all[item].content[0][4]),
                        time:moment(data.all[item].content[0][5],"hh:mm:ss.000").valueOf(),
                    }
                })
                setDataYearWinnerChartInput(winnerYearsData)


                let pieCartData = Object.keys(data.all).map((item:any, index:number)=>{
                    return {
                        id:data.all[item].content[0][0],
                        name:data.all[item].content[0][2],
                        laps:parseInt(data.all[item].content[0][4]),
                        year:item,
                    }
                })
                setDataPieChartInput(pieCartData)

            }
            if(data.content){
                let eachYearData:any = Object.keys(data.content).reverse().map((item:any, index)=>{
                    let content = data.content[item].slice(0, 10).map((yearContent:any, index:number)=>{
                        return {
                            name: yearContent[2],
                            id: yearContent[2],
                            laps: parseInt(yearContent[4]),
                            pts: parseInt(yearContent[6])
                        }
                    });
                    return {[item]:content}
                })
                setDataChartInput(_.merge.apply(null, eachYearData))
                
            }

        }else if(category=="teams"){
            if(data?.all){
                let winnerYearsData = Object.keys(data.all).map((item:any, index:number)=>{
                    return {
                        id:data.all[item].content[0][1],
                        name:data.all[item].content[0][1],
                        pts:parseInt(data.all[item].content[0][2]),
                    }
                })
                setDataYearWinnerChartInput(winnerYearsData)
            }

            if(data.content){
                let includedName:string[] = []
                let eachYearData:any = Object.keys(data.content).reverse().map((item:any)=>{
                    includedName = []
                    let content = data.content[item].map((yearContent:any)=>{
                        if(includedName.findIndex(i=>i==yearContent[0])==-1){
                            includedName.push(yearContent[0])
                            return {
                                name: yearContent[0],
                                id: yearContent[1],
                                gp:yearContent[1],
                                date: yearContent[2],
                                pts: parseInt(yearContent[3]),
                                // pts: parseInt(yearContent[6])
                            }
                        }
                        return undefined
                    }).filter((i:any)=>i);
                    return {[item]:content}
                })
                setDataChartInput(_.merge.apply(null, eachYearData))
                
            }
        } else {
            if(data?.all){
                let winnerYearsData = Object.keys(data.all).map((item:any, index:number)=>{
                    return {
                        id:data.all[item].content[0][1],
                        name:data.all[item].content[0][1],
                        nat:data.all[item].content[0][2],
                        team:data.all[item].content[0][3],
                        pts:parseInt(data.all[item].content[0][4]),
                    }
                })
                setDataYearWinnerChartInput(winnerYearsData)
            }
            if(data.content){
                let includedName:string[] = []
                let eachYearData:any = Object.keys(data.content).reverse().map((item:any)=>{
                    includedName = []
                    let content = data.content[item].map((yearContent:any)=>{
                        if(includedName.findIndex(i=>i==yearContent[0])==-1){
                            includedName.push(yearContent[0])
                            return {
                                name: yearContent[0],
                                id: yearContent[1],
                                gp:yearContent[1],
                                date:yearContent[2],
                                car:yearContent[3],
                                pos:yearContent[4],
                                pts: parseInt(yearContent[5]),
                                // pts: parseInt(yearContent[6])
                            }
                        }
                        return undefined
                    }).filter((i:any)=>i);
                    return {[item]:content}
                })
                setDataChartInput(_.merge.apply(null, eachYearData))
                
            }
        }
    },[category, data.all, data.content])
    
    useEffect(() => {
        // subscribe to routeChangeStart event
        const setLoadingPage = () => {
            setIsLoading("true");
        };
        router.events.on('routeChangeStart', setLoadingPage);

        // subscribe to routeChangeComplete event
        const setFinishLoad = () => {
            setIsLoading("false");
        };
        router.events.on('routeChangeComplete', setFinishLoad);

        // unsubscribe on component destroy in useEffect return function
        return () => {
            router.events.off('routeChangeStart', setLoadingPage);
            router.events.off('routeChangeComplete', setFinishLoad);
        }
    }, [router.events]);

    useEffect(()=>{
        console.log("COOKIE CHANEG");
        if(cookies.get('isLoading'))
            setIsLoading(cookies.get("isLoading"));
    },[cookies])

    return (
        <>
        <div>
        <Header/>
        <main className="position-relative">
            {isLoading !=="false" ?
            <Loader />:<>
            <Container fluid className="custom-heading pt-5">
                <Row className="pt-4">
                    <Col className="mt-4 mt-md-0">
                        <h1>F1 - List Of {category=="races"?"Race Results":capitalizeFirstLetterOfEachWord(category)}</h1>
                        <p>Warning: The data below might be inaccurate because the crawled data have exceeds the threshold of 128 kB, this amount of data can reduce performance.</p>
                        <p className="text-center text-md-start">To see different design: </p>
                        <div className="mx-auto mx-md-0 text-center text-md-start ">
                        <Button variant="outline-light" onClick={()=>{onClick()}} className={`custom-heading-btn`}>
                            Click here
                        </Button>

                        </div>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                        <CustomTable
                        keys={data.keys}
                        data={dataTableInput}
                        title = {`List of ${category}`}
                        years={years}
                        />
                    </Col>
                </Row>
            </Container>
            <Container
                className="my-5"
            >
                <Row>
                    <Col>
                        <h2>{(category=="races"?"Races Results":capitalizeFirstLetterOfEachWord(category)) +"'s Charts"}</h2>
                    </Col>
                </Row>
                <Tab.Container id="left-tabs" defaultActiveKey="all">
                    <Row>
                        <Col sm={3}>
                            <div className="custom-nav-container">
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item className="btn-outline-light">
                                        <Nav.Link eventKey="all">All</Nav.Link>
                                    </Nav.Item>
                                    {Object.keys(dataChart)?.length>0 && Object.keys(dataChart).map((key:any, index:number)=>{
                                        return(
                                            <Nav.Item key={`${key}-${index}`} >
                                                <Nav.Link eventKey={`${key}-${index}`}>{key}</Nav.Link>
                                            </Nav.Item>
                                        )
                                    })}
                                </Nav>
                            </div>
                        
                        </Col>
                        <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="all">
                                {category=="races" ? 
                                <Container fluid>
                                    <Row>
                                        <Col xl={6}>
                                            <CustomTimeIncludedBarChart
                                            data={dataYearWinnerChartInput}
                                            title={"winner's lap and time chart of in first five years"}
                                            />
                                        </Col>
                                        <Col xl={6}>
                                            <CustomPieChart
                                            data={dataPieChartInput}
                                            title="Drivers percentage laps chart in first five years"
                                            colors={colors}/>
                                        </Col>
                                    </Row>
                                </Container>
                                :
                                <Container fluid>
                                    <Row>
                                        <Col xl={12}>
                                            <CustomVerticalChart
                                            data={dataYearWinnerChartInput}
                                            title={`${category} with highest PTS chart in first five years`}
                                            />
                                        </Col>
                                    </Row>
                                </Container>
                                }
                            </Tab.Pane>
                            {Object.keys(dataChart)?.length>0 && Object.keys(dataChart).map((key:any, index:number)=>{
                                return (
                                <Tab.Pane key={`${key}-${index}`} eventKey={`${key}-${index}`}>
                                {category=="races"?
                                    <CustomVerticalChartMultipleData
                                    data={dataChart[key]}
                                    title={`Random Driver Laps and PTS chart in ${key}`}
                                    colors={colors}
                                    />
                                :
                                    <CustomVerticalChart
                                    data={dataChart[key]}
                                    title={`Random ${capitalizeFirstLetter(category)}'s PTS chart in ${key}`}
                                    colors={colors}
                                    />}
                                </Tab.Pane>
                                )
                            })}
                        </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
                
            </Container></>}
        </main>
        <Footer/>
        </div>
    </>
    )
    
}