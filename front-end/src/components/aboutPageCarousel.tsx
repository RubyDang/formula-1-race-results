import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, Carousel, Col, Container, Row } from "react-bootstrap";

export default function AboutPage_Carousel() {
    const [index, setIndex] = useState<number>(0);

  const handleSelect = (selectedIndex:number) => {
    setIndex(selectedIndex);
  };

  return(
    <Carousel data-bs-theme="dark" activeIndex={index} onSelect={handleSelect} className="custom-carousel" controls={false}>
        <Carousel.Item className="custom-carousel-item"
        style={{
            backgroundImage:`url('/banner_1.png'), linear-gradient(to top,rgb(var(--red-500-rgb)),rgb(var(--orange-500-rgb)))`,
            backgroundPosition:'center, center',
            backgroundRepeat: 'no-repeat',
            backgroundOrigin:'content-box',
            backgroundColor: 'transparent',
            backgroundSize: 'cover',
        }}
        >
            <Container className="" fluid>
            <Row className="align-items-center align-content-center">
                    <Col sm={12} md={6} lg={6} className="ps-0 ps-md-1 ps-lg-5 d-flex flex-wrap flex-column position-relative justify-content-center align-content-center custom-carousel-img-container"
                    style={{
                        backgroundColor:'white',
                        height:500,
                    }}
                    >
                        <div className="ms-0 ms-md-1 ms-lg-5">
                            <p className="h2">About</p>
                            <p>This website is made for displaying content crawled from the F1 racing results from <a href="http://formula1.com/">RESULTS</a> of which contain: Races Result, Drivers, Teams</p>
                        </div>
                    </Col>
                    <Col sm={12} md={6} lg={6} className="d-none d-md-block"></Col>
                </Row>
            </Container>
        </Carousel.Item>
        <Carousel.Item className="custom-carousel-item">
            <Container fluid>
                <Row className="align-items-center align-content-center">
                    <Col sm={12} lg={6} md={6} className="d-none d-md-block order-2 order-md-1 d-md-flex flex-wrap flex-column position-relative  custom-carousel-img-container">
                        <Image
                        className="position-absolute w-sm-100 h-sm-100 mt-3 mt-md 0 top-50 start-0  custom-floating-img"
                        src={'/rrffy_page.png'}
                        alt="screenshot of race results page"
                        width={300}
                        height={300}
                        />
                        <Image
                        className="position-absolute w-sm-100 h-sm-100 mt-3 mt-md 0 top-50 start-50 translate-middle custom-floating-img"
                        src={'/rrby_page.png'}
                        alt="screenshot of race results page"
                        width={300}
                        height={300}
                        />
                        
                    </Col>
                    <Col sm={12} md={6} lg={6} className="order-2 order-md-1 d-flex flex-wrap flex-column position-relative justify-content-center align-content-center custom-carousel-img-container">
                        <p className="h2">Results By Year - page</p>
                        <p>This page contain the data for each year displayed on the search box</p>
                        <p>To navigate to the page. Click on the &#34;Results By Year&#34; on the header navbar.<br/>Or:</p>
                        <Button variant="outline-dark" className="mt-3"><Link href={'/results/races'}>Click here to see more</Link></Button>
                    </Col>

                </Row>
            </Container>
        </Carousel.Item>
        <Carousel.Item className="custom-carousel-item">
            <Container fluid>
                <Row className="align-items-center align-content-center">
                    <Col sm={12} md={6} lg={6} className="order-1 d-flex flex-wrap flex-column position-relative justify-content-center align-content-center custom-carousel-img-container">
                        <p className="h2">Results First Five Years - page</p>
                        <p>This page contain the data for each year displayed on the search box</p>
                        <p>To navigate to the page. Click on the &#34;Results First Five Years&#34; on the header navbar.<br/>Or:</p>
                        <Button variant="outline-dark" className="mt-3"><Link href={'/results/races'}>Click here to see more</Link></Button>
                    </Col>
                    <Col sm={12} md={6} lg={6} className="d-none d-md-block order-2 d-md-flex flex-wrap flex-column position-relative custom-carousel-img-container">
                        <Image
                        className="position-absolute w-sm-100 h-sm-100 mt-3 mt-md 0 top-50 start-0  custom-floating-img"
                        src={'/rrby_page.png'}
                        alt="screenshot of race results page"
                        width={300}
                        height={300}
                        />
                        <Image
                        className="position-absolute w-sm-100 h-sm-100 mt-3 mt-md 0 top-50 start-50 translate-middle custom-floating-img"
                        src={'/rrffy_page.png'}
                        alt="screenshot of race results page"
                        width={300}
                        height={300}
                        />
                        
                    </Col>

                </Row>
            </Container>
        </Carousel.Item>
    </Carousel>
  )
}