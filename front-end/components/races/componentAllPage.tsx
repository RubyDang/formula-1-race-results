import { customDataCategory } from "@/utils/interfaces";
import { Col, Container, Row } from "react-bootstrap";
import CustomTable from "../tables/CustomTable";
import { useEffect, useState } from "react";
import CustomLineBarChart from "../charts/cutomLineBarChart";
import moment from "moment";

export default function RacesAllComponent({dataInput, category="", years=[], navItems=[]}:{dataInput: customDataCategory, category:string, years:[], navItems:[]}) {
    const [dataCarsNames, setDataCarsNames] = useState([]);
    const [dataWinnerNames, setDataWinnerNames] = useState([]);
    const [data, setData] = useState<{[key:string]:any}[]>([]);

    const COLORS = [
        window.getComputedStyle(document.documentElement).getPropertyValue('--red-800-rgb'),
        window.getComputedStyle(document.documentElement).getPropertyValue('--red-700-rgb'),
        window.getComputedStyle(document.documentElement).getPropertyValue('--red-600-rgb'),
        window.getComputedStyle(document.documentElement).getPropertyValue('--red-500-rgb'),
        window.getComputedStyle(document.documentElement).getPropertyValue('--orange-500-rgb'),
        window.getComputedStyle(document.documentElement).getPropertyValue('--orange-600-rgb'),
        window.getComputedStyle(document.documentElement).getPropertyValue('--orange-700-rgb'),
        window.getComputedStyle(document.documentElement).getPropertyValue('--orange-800-rgb'),
        window.getComputedStyle(document.documentElement).getPropertyValue('--orange-900-rgb'),
    ];

    useEffect(()=>{
        let dataSets:{[key:string]:any}[] =[];
		if(dataInput?.content?.length>0){
			// if(category == "races"){
				dataInput.content.map((item:any, index:number, arr:([] | undefined)[])=>{
                    // console.log(item[item.length-1], moment(item[arr.length-1],"HH:mm:ss.000").format("HH:mm:ss.000"));
					dataSets.push({
                        GP:item[0],
                        name:`${item[2]}, ${item[3]}`,
                        laps:parseInt(item[4]),
                        time:moment(item[item.length-1],"HH:mm:ss.000").valueOf()

					})
				})
			// }
		}
        setData(dataSets)
    },[dataInput.content])

    return(
    <>
    <Container fluid className="custom-heading">
        <Row>
            <Col>
                <h1>F1 RACE RESULTS</h1>
            </Col>
        </Row>
    </Container>
    <Container fluid>
        <Row>
            <Col>
                <CustomTable
                data={dataInput}
                category={category}
                years={years}
                navItems={navItems}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                <CustomLineBarChart
                data={data}
                title={"Driver's Laps and time Chart in " + dataInput.year}
                colors={COLORS}
                />
            </Col>
        </Row>
    </Container>
    </>
    )
}