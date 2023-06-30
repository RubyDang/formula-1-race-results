'use client'
import moment from 'moment';
import Image from 'next/image'
import { useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Carousel, Col, Container, Row } from 'react-bootstrap'
import AboutPage_Carousel from '../components/aboutPageCarousel';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';
import Loader from '../components/loader';

export default function Home() {
  const cookies = new Cookies();
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(cookies.get("isLoading")||"true");

  useEffect(()=>{
    setIsLoading("false")
    cookies.set('isLoading', false, { path: '/' })
  }, [cookies])

  useEffect(()=>{
    if(cookies.get('isLoading'))
      setIsLoading(cookies.get("isLoading"));
  },[cookies])

  const route = useSearchParams();
  let year:string = route?.get('year') ?? moment().format("YYYY");
  let category:string = route?.get('category') ?? "races";
  let grandPrix = (category == "fastest-laps") ? null : (route?.get('grand-prix') ?? 'all')
  
  const CheckIsLoadingRender =({children}:any)=>{
    if(isLoading!="false")
      return(<Loader/>)
    return(children)
  }
  return (
    <main className={`flex min-h-screen flex-col justify-between py-23 main`}>
      <Container fluid>
        <Row className="mb-2 banner justify-content-center align-items-center px-24">
          <Col lg={6} className="text-center">
              <div>
                <p className="h1">Welcome to F1 Racer Results Crawled From: <a href="https://www.formula1.com/en/results.html/2023/races.html">www.formula1.com</a></p>
              </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <AboutPage_Carousel/>
          </Col>
        </Row>
      </Container>
      
    </main>
  )
}
