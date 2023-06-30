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

export default function CustomTableLive({data, title="", category="", years=[], navItems=[]}:{data: customDataCategory, title:string, category:string, years:[], navItems:[]}){
    const router = useRouter();
    const offsets = [5, 10, 50, 100]
    const [numOfDataShow, setNumOfDataShow] = useState(offsets[0])
    const [pageNum, setPageNum] = useState(data.content?.length/numOfDataShow  ||  0)
    const[indexPage, setIndexPage] = useState(0)

    const [bodyData, setBodyData] = useState(data.content || [])
    const [bodyDataConst, setBodyDataConst] = useState(data.content || [])

    const [searchStr, setSearchStr] = useState("")
    const [selectedYear, setSelectedYear] = useState(data.year||"")
    const [sortByCol, setSortByCol] = useState("")
    const [isASC, setIsASC] = useState(true)

    useEffect(()=>{
        setBodyDataConst(data.content)
        if(data.content?.length>0)
            setBodyData(data.content.slice(0, numOfDataShow))
    },[data.content, numOfDataShow])

    useEffect(()=>{
        setPageNum(Math.ceil((bodyDataConst?.length || 0)/numOfDataShow))
    },[bodyDataConst, numOfDataShow])

    useEffect(()=>{
        setBodyData(bodyDataConst?.slice(indexPage*numOfDataShow, (indexPage*numOfDataShow)+numOfDataShow))
    },[indexPage, bodyDataConst, numOfDataShow])

    useEffect(()=>{
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
            setBodyData(foundData.filter((i)=>i))
        }else{
            setBodyData(bodyDataConst?.slice(indexPage*numOfDataShow, (indexPage*numOfDataShow)+numOfDataShow))
        }
    },[bodyDataConst, indexPage, numOfDataShow, searchStr])
    
    useEffect(()=>{
        if(selectedYear!== data.year){
            router.replace(`/results/${category.replace("-all","")}?year=${selectedYear}${router.query.name ? "&name=" + router.query.name :""}`)
            setInterval(()=>{
                router.reload()
            },1000)
        }
    },[category, data.year, router, searchStr, selectedYear])

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
                <Pagination.Next key={"pargination-next"} disabled={indexPage==pageNum-1} onClick={()=>{setIndexPage(indexPage+1)}}/>,
                <Pagination.Last key={"pargination-last"} disabled={indexPage==pageNum-1} onClick={()=>{setIndexPage(pageNum-1)}}/>
            )
        }else{
            for (let i = 0; i < pageNum; i++) {
                arrPages.push(<Pagination.Item key={i} active={i === indexPage} onClick={()=>{setIndexPage(i)}}>{i+1}</Pagination.Item>)
            }
        }
        return <Pagination className='custom-table-pagination'>{arrPages}</Pagination>;
    }

    const getParamsOfRow=(row:string[])=>{
        let strArr:string[] = []
        if(row?.length>0 && /.-all/g.test(category)){
            if(category==="races-all"){
                strArr = row[0].replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"").split(/\s/g).filter(i=>i) || []
                if(strArr?.length >2){
                    strArr = strArr.slice(0, 2)
                }
            }else 
            if(category==="teams-all"){
                strArr = row[1].replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"").split(/\s/g).filter(i=>i) || []
                return strArr.join('_').toLowerCase()
            }
            if(category==="drivers-all"){
                strArr = row[1].replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"").split(/\s/g).filter(i=>i) || []
            }
            return strArr.join('-').toLowerCase()
        }
    }

    useEffect(()=>{
        if(data.keys?.length>0){
            let keyIndex = data.keys.indexOf(sortByCol || data.keys[0])
            if(keyIndex>-1){
                let test =  bodyDataConst.sort((a:string[]|undefined, b:string[]|undefined)=>{
                    return compare(a && a[keyIndex], b && b[keyIndex])
                })
                test = isASC?test: test.reverse()
                setBodyDataConst(test);
                setBodyData(test.slice(0, numOfDataShow))
            }
        }
    },[bodyDataConst, isASC, data.keys, numOfDataShow, sortByCol])

    const onClickSort=(key:string)=>{
        if(sortByCol == key){
            setIsASC(!isASC)
        }else{
            setIsASC(true)
            setSortByCol(key)
        }
    }


    return (
        <>
        <Container className="my-5 position-relative custom-box-container pt-5">
            <Row className="g-2 w-100 position-absolute top-0 start-50 translate-middle custom-table-head-container m-0">
                <Col className='justify-content-center text-center'>
                    <h3>Search box</h3>
                </Col>
            </Row>
            <Row className="g-2 justify-content-center align-items-end">
                <Col md xl={9}>
                    <Form>
                        <Form.Group className="mb-3" controlId="search.searchInput">
                            <Form.Label>What do you want to search?</Form.Label>
                            <Form.Control type="text" placeholder="Search" name="search" value={searchStr} onChange={(e)=>{setSearchStr(e.target.value)}} />
                        </Form.Group>
                        
                    </Form>
                </Col>
                <Col md>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Year</Form.Label>
                        <Form.Select aria-label="choose year to filter"
                        onChange={(e)=>{setSelectedYear(e.target.value)}}
                        value={selectedYear}
                        >
                            {years.map((year:string, index:number)=>{
                                return <option key={`option-${index}`} value={year}>{year}</option>
                            })}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </Container>
        <Container fluid className={`position-relative custom-box-container pt-5`}>
            <Row className='g-2 w-100 position-absolute top-0 start-50 translate-middle custom-table-head-container m-0'>
                <Col md={3} sm={12} className="order-2 order-md-1">
                    <div className='d-flex flex-wrap justify-content-center align-items-center'>
                        <div className='mx-2'>Show</div>
                        <Form.Select aria-label="choose number to show on list table"
                        onChange={(e)=>{setNumOfDataShow(parseInt(e.target.value))}}
                        className='w-auto'
                        value={numOfDataShow}
                        >
                            {offsets.map((offset:number, index:number)=>{
                                return <option key={`option-offset-${index}`} value={offset} >{offset}</option>
                            })}
                        </Form.Select>
                        <div className='mx-2'>Entries</div>
                    </div>
                </Col>
                <Col md={6} sm={12} className='order-1 order-md-2 justify-content-center text-center'>
                    <h2>{title ?? `All ${capitalizeFirstLetterOfEachWord(category.replaceAll("-all",""))} List`}</h2>
                </Col>
                <Col className='order-3'>
                </Col>
            </Row>
            {(bodyData?.length<1&&searchStr) ? 
            <Row>
                <Col>
                    <h2>Data Not Found</h2>
                </Col>
            </Row>
            :
            <>
            <Row className='custom-table-body-container py-5'>
                <Col>
                    <Table responsive striped bordered hover className='custom-table'>
                        <thead>
                            <tr>
                                {
                                    data.keys?.length>0 && data.keys.map(key=><th key={key} onClick={()=>{onClickSort(key)}}>{key} {key==sortByCol&&(isASC?<FaAngleDown/>: <FaAngleUp/>)}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {bodyData && bodyData.map((row, index)=>{
                            return <tr key={`team-tr-${index}`}>
                                {row?.map((col:string, i:number)=><td key={`team-tr-${i}`} className="p-0">
                                {/.-all/g.test(category)?
                                <Link className="w-100 custom-link"
                                href={`/results/${category.replace("-all","")}?year=${data.year}&name=${getParamsOfRow(row)}`}>
                                    <div className="p-2">{col}</div>
                                </Link>
                                :
                                <div className="p-2">{col}</div>
                                }
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