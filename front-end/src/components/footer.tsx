'use client'
import Image from "next/image";
import { Container, Navbar } from "react-bootstrap";

import './componentGlobal.css';

export default function Footer() {
    
	return (
		<Navbar id="footer">
		<Container fluid className="">
			<Navbar.Brand href="" className="">
			</Navbar.Brand>
			{/* <Navbar.Text>Creator: Dang Huyen Tran</Navbar.Text> */}
			<Navbar.Text>© Tran Dang 2023. All rights reserved</Navbar.Text>
			<Navbar.Toggle />
		</Container>
	</Navbar>
	)
}