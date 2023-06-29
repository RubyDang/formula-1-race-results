import { Col, Container, Row } from "react-bootstrap";
import "./loader.css";

export default function Loader(){

    return(
        <Container fluid className="position-absolute top-0 start-0 custom-loader-container">
            <div className="w-100 h-100 ">
                <div className="w-100 h-100 position-relative">
                <div className="loader-circle"></div>
                <div className="loader-line-mask">
                    <div className="loader-line"></div>
                </div>
                </div>
            </div>
        </Container>
    )
}