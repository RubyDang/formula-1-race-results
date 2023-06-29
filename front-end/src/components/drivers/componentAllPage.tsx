import { customDataCategory } from "@/src/utils/interfaces";
import { Col, Container, Row } from "react-bootstrap";
import CustomTableLive from "../tables/CustomTableLive";
import CustomVerticalChart from "../charts/customVerticalChartOneBar";
import { useEffect, useState } from "react";
import { getColorFromCSS } from "@/src/utils/functions";

export default function DriversAllComponent({dataInput, category="", years=[], navItems=[]}:{dataInput: customDataCategory, category:string, years:[], navItems:[]}) {
    const [data, setData] = useState<{[key:string]:any}[]>([]);
    const [colors, setColors] = useState<string[]>([])
    useEffect(()=>{
        let dataSets:{[key:string]:any}[] =[];
        let dataSetsCar:{[key:string]:any}[] =[];
		if(dataInput?.content?.length>0){
			// if(category == "races"){
				dataInput.content.map((item:any, index:number, arr:([] | undefined)[])=>{
                    // console.log(item[item.length-1], moment(item[arr.length-1],"HH:mm:ss.000").format("HH:mm:ss.000"));
					dataSets.push({
                        name:item[1],
                        nat:item[2],
                        pts:parseInt(item[item.length-1])
					})
                    // if(dataSetsCar.find((_car:any, _index:number, obj:{})=>{
                    //     return Object.keys(obj)[0] == item[2]
                    // })){

                    // }
				})
			// }
		}
        setData(dataSets)
        setColors([
            getColorFromCSS(window.document.documentElement, "--red-600-rgb"),
            getColorFromCSS(window.document.documentElement, "--orange-300-rgb"),
        ])
    },[dataInput.content])

    return(
    <>
    <Container fluid className="custom-heading-header ">
        <Row className="pt-4">
            <Col className="mt-4 mt-md-0">
                <h1>F1 DRIVERS&#39;S LIST</h1>
            </Col>
        </Row>
    </Container>
    <Container>
        <Row>
            <Col>
                <CustomTableLive
                title="Drivers List"
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
                colors={colors}
                data={data}
                title={`Driver Points Chart in ${dataInput.year}`}
                />
            </Col>
        </Row>
    </Container>
    </>
    )
}