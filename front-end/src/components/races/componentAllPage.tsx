import { customDataCategory } from "@/src/utils/interfaces";
import { Col, Container, Row } from "react-bootstrap";
import CustomTableLive from "../tables/CustomTableLive";
import { useEffect, useState } from "react";
import CustomTimeIncludedBarChart from "../charts/customTimeIncludedBarChart";
import moment from "moment";

export default function RacesAllComponent({dataInput, category="", years=[], navItems=[]}:{dataInput: customDataCategory, category:string, years:[], navItems:[]}) {
    const [data, setData] = useState<{[key:string]:any}[]>([]);
    
    useEffect(()=>{
        let dataSets:{[key:string]:any}[] =[];
		if(dataInput?.content?.length>0){
			// if(category == "races"){
				dataInput.content.map((item:any, index:number, arr:([] | undefined)[])=>{
                    // console.log(item[item.length-1], moment(item[arr.length-1],"HH:mm:ss.000").format("HH:mm:ss.000"));
					dataSets.push({
                        GP:item[0],
                        name:`${item[3]}, ${item[2]}`,
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
    <Container>
        <Row>
            <Col>
                <CustomTableLive
                title={"Races Results List"}
                data={dataInput}
                category={category}
                years={years}
                navItems={navItems}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                <CustomTimeIncludedBarChart
                data={data}
                title={"Driver's Laps and time Chart in " + dataInput.year}
                />
            </Col>
        </Row>
    </Container>
    </>
    )
}