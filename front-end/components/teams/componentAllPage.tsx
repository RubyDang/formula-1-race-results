import { customDataCategory } from "@/utils/interfaces";
import { Col, Container, Row } from "react-bootstrap";
import CustomTable from "../tables/CustomTable";

export default function TeamsAllComponent({data, category="", years=[], navItems=[]}:{data: customDataCategory, category:string, years:[], navItems:[]}) {
    return(
    <>
    <Container fluid className="custom-heading">
        <Row>
            <Col>
                <h1>F1 TEAMS&#39;S LIST</h1>
            </Col>
        </Row>
    </Container>
    <Container fluid>
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
    </>
    )
}