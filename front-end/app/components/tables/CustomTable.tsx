import '../../../variables.css';
import { compare } from "@/utils/functions";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button, Col, Container, Form, Pagination, Row, Table } from "react-bootstrap";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import './customTable.css';

export default function CustomTable({data, category="", years=[], navItems=[]}:{data:{keys:string[], content:(undefined|[])[], year:string}, category:string, years:[], navItems:[]}){
    const offsets = [5, 10, 50, 100]
    const [numOfDataShow, setNumOfDataShow] = useState(offsets[0])
    const [pageNum, setPageNum] = useState(data.content?.length/numOfDataShow  ||  0)
    const[indexPage, setIndexPage] = useState(0)

    const [bodyData, setBodyData] = useState(data.content || [])
    const [bodyDataConst, setBodyDataConst] = useState(data.content || [])

    const [searchStr, setSearchStr] = useState("")
    const [sortByCol, setSortByCol] = useState("")
    const [isASC, setIsASC] = useState(true)

    useEffect(()=>{
        setBodyDataConst(data.content)
        if(data.content?.length>0)
            setBodyData(data.content.slice(0, numOfDataShow))
    },[data.content, numOfDataShow])

    useEffect(()=>{
        setPageNum((bodyDataConst?.length || 0)/numOfDataShow)
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

    const CustomPagination = () => {
        let arrPages = []
        // if()
        for (let i = 0; i < pageNum; i++) {
            arrPages.push(<Pagination.Item key={i} active={i === indexPage} onClick={()=>{setIndexPage(i)}}>{i}</Pagination.Item>)
        }
        return <Pagination>{arrPages}</Pagination>;
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
        <Container className="mb-5 custom-filter-box-container">
            <Row className="g-2 justify-content-center align-items-end">
                <Col md xl={8}>
                    <Form>
                        <Form.Group className="mb-3" controlId="search.searchInput">
                            <Form.Control type="text" placeholder="Search" name="search" value={searchStr} onChange={(e)=>{setSearchStr(e.target.value)}} />
                        </Form.Group>
                        
                    </Form>
                </Col>
                <Col md>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Year</Form.Label>
                        <Form.Select aria-label="choose year to filter">
                            {years.map((year:string, index:number)=>{
                                return <option key={`option-${index}`} value={year} selected={year==(data.year)}>{year}</option>
                            })}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Select aria-label="Choose name to filter">
                            {navItems?.map((nav:string, index:number)=>{
                                return <option key={`option-${index}`} value={nav}>{nav}</option>
                            })}
                        {/* <option>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option> */}
                    </Form.Select>
                    </Form.Group>
                </Col>
                <Button>Filter</Button>
            </Row>
        </Container>
        <Container>
            {(bodyData?.length<1&&searchStr) ? 
            <Row>
                <Col>
                    <h2>Data Not Found</h2>
                </Col>
            </Row>
            :
            <>
            <Row>
                <Col>
                    
                    <Table striped bordered hover>
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
                                <Link className="w-100"
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
                <Col>
                    <CustomPagination/>
                </Col>
            </Row>
            </>}
        </Container>
        </>
    )
} 