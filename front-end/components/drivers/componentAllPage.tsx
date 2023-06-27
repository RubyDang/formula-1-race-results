import { customDataCategory } from "@/utils/interfaces";
import { Col, Container, Row } from "react-bootstrap";
import CustomTable from "../tables/CustomTable";
import CustomVerticalChart from "../charts/customVerticalChart_1bar";
import { useEffect, useState } from "react";

export default function DriversAllComponent({dataInput, category="", years=[], navItems=[]}:{dataInput: customDataCategory, category:string, years:[], navItems:[]}) {
    const [data, setData] = useState<{[key:string]:any}[]>([]);

    useEffect(()=>{
        let dataSets:{[key:string]:any}[] =[];
        let dataSetsCar:{[key:string]:any}[] =[];
		if(dataInput?.content?.length>0){
			// if(category == "races"){
				dataInput.content.map((item:any, index:number, arr:([] | undefined)[])=>{
                    // console.log(item[item.length-1], moment(item[arr.length-1],"HH:mm:ss.000").format("HH:mm:ss.000"));
					dataSets.push({
                        name:item[2],
                        nat:item[3],
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
    },[dataInput.content])

    return(
    <>
    <Container fluid className="custom-heading">
        <Row>
            <Col>
                <h1>F1 DRIVERS&#39;S LIST</h1>
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
                {/* <CustomVerticalChart/> */}
            </Col>
        </Row>
    </Container>
    </>
    )
}