import '../../variables.css';
import { capitalizeFirstLetter, capitalizeFirstLetterOfEachWord, compare } from "@/src/utils/functions";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button, Col, Container, Form, Pagination, Row, Table } from "react-bootstrap";
import { FaAngleDown, FaAngleUp, } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

import './customTable.css';
import { useRouter } from 'next/router';
import { customDataCategory } from '@/src/utils/interfaces';
import moment from 'moment';

export default function CustomTable({data, keys=[], title="", years}:{data: any[], keys:[], title:string, years:(string | number | undefined)[]}){
    const router = useRouter();
    const offsets = [5, 10, 50, 100]
    const [numOfDataShow, setNumOfDataShow] = useState(offsets[0])
    const [pageNum, setPageNum] = useState(0)
    const[indexPage, setIndexPage] = useState(0)

    const [bodyData, setBodyData] = useState<any[]>(data||[])
    const [bodyDataConst, setBodyDataConst] = useState<any[]>(data||[])
    const [keysConst, setKeysConst] = useState([...keys,"Years"])

    const [searchStr, setSearchStr] = useState("")
    const [selectedYear, setSelectedYear] = useState((years?.length>0 && years[0])||moment().format("YYYY"))
    const [sortByCol, setSortByCol] = useState("")
    const [isASC, setIsASC] = useState(true)

    const CustomPagination = () => {
        let arrPages = []
        if(pageNum>6){
            arrPages.push(
                <Pagination.First key={"pargination-first"} disabled={!indexPage} onClick={()=>{setIndexPage(0)}}/>,
                <Pagination.Prev  key={"pargination-prev"} active={false} disabled={!indexPage} onClick={()=>{setIndexPage(indexPage-1>-1?indexPage-1:0)}}/>,
                <Pagination.Item key={"pargination-num-"+0} active={!indexPage} onClick={()=>{setIndexPage(0)}}>{1}</Pagination.Item>
            )
            if(indexPage>0 && indexPage<(pageNum-1)){
                if(indexPage-2>0){
                    arrPages.push(<Pagination.Ellipsis key={"pargination-ell-left"}/>)
                }
                if(indexPage-1>0){
                    arrPages.push(<Pagination.Item key={"pargination-num-"+(indexPage-1)} onClick={()=>{setIndexPage(indexPage-1)}}>{indexPage}</Pagination.Item>)
                }
                if(indexPage>0){
                    arrPages.push(<Pagination.Item key={"pargination-num-"+(indexPage)} active={true} onClick={()=>{setIndexPage(indexPage)}}>{indexPage+1}</Pagination.Item>)
                }
                if(indexPage+1<pageNum-1){
                    arrPages.push(<Pagination.Item key={"pargination-num-"+(indexPage+1)} onClick={()=>{setIndexPage(indexPage+1)}}>{indexPage+2}</Pagination.Item>)
                }
                if(indexPage+2<pageNum-1){
                    arrPages.push(<Pagination.Ellipsis key={"pargination-ell-right"}/>)
                }
            }else{
                if(indexPage-2>0)
                    arrPages.push(<Pagination.Ellipsis key={"pargination-ell-left"}/>)
                if(indexPage-1>0)
                    arrPages.push(<Pagination.Item key={"pargination-num-"+(indexPage-1)} onClick={()=>{setIndexPage(indexPage-1)}}>{indexPage}</Pagination.Item>)
                if(indexPage+1<(pageNum-1))
                    arrPages.push(<Pagination.Item key={"pargination-num-"+(indexPage+1)} onClick={()=>{setIndexPage(indexPage+1)}}>{indexPage+2}</Pagination.Item>)
                if(indexPage+2<(pageNum-1))
                arrPages.push(<Pagination.Ellipsis key={"pargination-ell-right"}/>)

            }
            arrPages.push(
                <Pagination.Item key={"pargination-num-"+pageNum} active={(pageNum-1) == indexPage} onClick={()=>{setIndexPage(pageNum-1)}}>{pageNum}</Pagination.Item>,
                <Pagination.Next key={"pargination-next"} disabled={indexPage ==pageNum-1} onClick={()=>{setIndexPage(indexPage+1)}}/>,
                <Pagination.Last key={"pargination-last"} disabled={indexPage ==pageNum-1} onClick={()=>{setIndexPage(pageNum-1)}}/>
            )
        }else{
            for (let i = 0; i < pageNum; i++) {
                arrPages.push(<Pagination.Item key={i} active={i === indexPage} onClick={()=>{setIndexPage(i)}}>{i+1}</Pagination.Item>)
            }
        }
        return <Pagination className='custom-table-pagination'>{arrPages}</Pagination>;
    }

    const onClickSort=(key:string)=>{
        if(sortByCol == key){
            setIsASC(!isASC)
        }else{
            setIsASC(true)
            setSortByCol(key)
        }
    }

    useEffect(()=>{
        setBodyDataConst(data)
        if(data?.length>0)
            setBodyData(data.slice(0, numOfDataShow))
    },[data, numOfDataShow])

    useEffect(()=>{
        setPageNum(Math.ceil((bodyDataConst?.length || 0)/numOfDataShow))
    },[bodyData, bodyDataConst?.length, numOfDataShow])
    
    useEffect(()=>{
        setBodyData(bodyDataConst?.slice(indexPage*numOfDataShow, (indexPage*numOfDataShow)+numOfDataShow))
    },[indexPage, bodyDataConst, numOfDataShow])
    
    //Searches for input
    useEffect(()=>{
        setIndexPage(0)
        let indexPageTemp = 0
        let foundData = []
        if(searchStr!="" && bodyDataConst?.length>0){
            for (let i = 0; i < bodyDataConst.length; i++) {
                const row = bodyDataConst[i];
                if(row){
                    let foundIndex = row.findIndex((item:string)=>{
                        return item.toLowerCase().includes(searchStr.toLowerCase())
                    })
                    if(foundIndex>-1){
                        foundData.push(row)
                    }
                }
                
            }

            setSortByCol("")
            setIsASC(true)
            setBodyData(foundData.filter((i)=>i).slice(indexPageTemp*numOfDataShow, (indexPageTemp*numOfDataShow)+numOfDataShow))
        }else{
            setBodyData(bodyDataConst?.slice(indexPageTemp*numOfDataShow, (indexPageTemp*numOfDataShow)+numOfDataShow))
        }
    },[bodyDataConst, numOfDataShow, searchStr])

    //sort data by click
    useEffect(()=>{
        if(keysConst?.length>0){
            let keyIndex = keysConst.indexOf(sortByCol || keysConst[0])
            if(keyIndex>-1){
                let reverseArr =  bodyDataConst.sort((a:string[]|undefined, b:string[]|undefined)=>{
                    return compare(a && a[keyIndex], b && b[keyIndex])
                })
                reverseArr = isASC?reverseArr: reverseArr.reverse()
                setBodyDataConst(reverseArr);
                setBodyData(reverseArr.slice(0, numOfDataShow))
            }
        }
    },[bodyDataConst, isASC, keysConst, numOfDataShow, sortByCol])

    return (
        <>
        <Container className="my-5 position-relative custom-box-container pt-3">
            <Row className="g-2 w-100 position-absolute top-0 start-50 translate-middle custom-table-head-container m-0">
                <Col className='justify-content-center text-center'>
                    <h3>Search box</h3>
                </Col>
            </Row>
            <Row className="pt-4 g-2 justify-content-center align-items-end">
                <Col>
                    <Form>
                        <Form.Group className="mb-3" controlId="search.searchInput">
                            <Form.Label>What do you want to search?</Form.Label>
                            <Form.Control type="text" placeholder="Search" name="search" value={searchStr} onChange={(e)=>{setSearchStr(e.target.value)}} />
                        </Form.Group>
                        
                    </Form>
                </Col>
            </Row>
        </Container>
        <Container fluid className={`position-relative custom-box-container pt-5`}>
            {(bodyData?.length<1&&searchStr) ? 
            <Row>
                <Col>
                    <h2>Data Not Found</h2>
                </Col>
            </Row>
            :
            <>
            <Row className='g-2 w-100 position-absolute top-0 start-50 translate-middle custom-table-head-container m-0'>
                <Col md={4} sm={12} className="order-2 order-md-1">
                    <div className='d-flex flex-wrap justify-content-center align-items-center'>
                        <div className='mx-2'>Show</div>
                        <Form.Select aria-label="choose number to show on list table"
                        onChange={(e)=>{setNumOfDataShow(parseInt(e.target.value))}}
                        className='w-auto'
                        value={numOfDataShow}
                        >
                            {offsets.map((offset:number, index:number)=>{
                                return <option key={`option-offset-${index}`} value={offset}>{offset}</option>
                            })}
                        </Form.Select>
                        <div className='mx-2'>Entries</div>
                    </div>
                </Col>
                <Col md={6} sm={12} className='order-1 order-md-2 justify-content-center text-center'>
                    <h2>{title ?? `List Table`}</h2>
                </Col>
                <Col>
                </Col>
            </Row>
            <Row className='custom-table-body-container py-5'>
                <Col>
                    <Table striped bordered hover responsive className='custom-table'>
                        <thead>
                            <tr>
                                {
                                    keysConst?.length>0 && keysConst.map(key=><th key={key} onClick={()=>{onClickSort(key)}}>{key} {key==sortByCol&&(isASC?<FaAngleDown/>: <FaAngleUp/>)}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {bodyData && bodyData.map((row, index)=>{
                            return <tr key={`team-tr-${index}`}>
                                {row?.map((col:string, i:number)=><td key={`team-tr-${i}`} className="p-0">
                                    <div className="p-2">{col}</div>
                                </td>)}
                            </tr>})}
                        </tbody>
                    </Table>
                    
                </Col>
            </Row>
            
            <Row>
                <Col className='d-flex flex-wrap justify-content-end align-content-end align-items-center custom-table-pagination-container'>
                    <CustomPagination/>
                </Col>
            </Row>
            </>}
        </Container>
        </>
    )
} 