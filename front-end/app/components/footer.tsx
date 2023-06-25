'use client'
import Image from "next/image";
import { Container, Navbar } from "react-bootstrap";

import './componentGlobal.css';

export default function Footer() {
    
	return (
		<Navbar id="footer">
		<Container fluid className="flex flew-wrap flex-column text-center justify-content-center navbar-brand align-items-center">
			<Navbar.Brand href="." className="">
			

			</Navbar.Brand><Navbar.Text>© Tran Dang 2023. All rights reserved</Navbar.Text>
			<Navbar.Toggle />
			{/* <Navbar.Collapse >
				<Navbar.Text>
					
				</Navbar.Text>
			</Navbar.Collapse> */}
		</Container>
	</Navbar>
	)
}