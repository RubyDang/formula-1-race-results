import { customDataCategory } from "@/utils/interfaces";
import { Col, Container, Row } from "react-bootstrap";
import CustomTableLive from "../tables/CustomTableLive";
import CustomVerticalChart from "../charts/customVerticalChartOneBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { capitalizeFirstLetter, capitalizeFirstLetterOfEachWord } from "@/utils/functions";

export default function TeamsDetailsComponent({dataInput, category="", years=[], navItems=[]}:{dataInput: customDataCategory, category:string, years:[], navItems:[]}) {
    const {query: {name, year}} = useRouter();
    const [ data, setData ]  = useState<{[key:string]:any}[]>([]);
	
	const colors = [
		window.getComputedStyle(document.documentElement).getPropertyValue('--red-500-rgb'),
		window.getComputedStyle(document.documentElement).getPropertyValue('--orange-400-rgb'),
	]
	
	useEffect(()=>{
		let dataSets:{[key:string]:any}[] =[];
		if(dataInput.content?.length>0){
            dataInput.content.map((item:any, index:number, arr:([] | undefined)[])=>{
                dataSets.push({
                    id:item[0],
                    name:item[0],
                    [dataInput.keys.find(i=> i.toLowerCase() =="pts")?.toLowerCase()||'pts']:parseInt(item[item.length-1])

                })
            })
		}
		setData(dataSets)
	},[dataInput, category])

    return(
    <>
    <Container fluid className="custom-heading">
        <Row>
            <Col>
                <h1>F1 - {typeof name == 'string' && capitalizeFirstLetterOfEachWord(name.split(/-|_/gi).join(" "))}</h1>
            </Col>
        </Row>
    </Container>
    <Container fluid>
        <Row>
            <Col>
                <CustomTableLive
                title={`${typeof name == 'string' && (capitalizeFirstLetterOfEachWord(name.split(/-|_/gi).join(" ")))}`}
                data={dataInput}
                category={category}
                years={years}
                navItems={navItems}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                <CustomVerticalChart
                xAxisTitle="Grand prix"
                data={data}
                title={`${typeof name == 'string' && (capitalizeFirstLetterOfEachWord(name.split(/-|_/gi).join(" ")))} PTS in ${dataInput.year}`}
                colors={colors}
                />
            </Col>
        </Row>
    </Container>
    </>
    )
}