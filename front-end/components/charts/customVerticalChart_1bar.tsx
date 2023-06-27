import '../../variables.css';
import { customDataCategory } from "@/utils/interfaces";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Bar, BarChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


export default function CustomVerticalChart({data, title="", colors=[]}:{data: any[], title:string, colors:string[]}) {
	return(
		<Container className="my-5">
			<Row>
				<Col sm={12} style={{minHeight:500}}>
				<h3>{title.replace("-all", "").toUpperCase()}</h3>
				<ResponsiveContainer width='100%' height="90%">
					<BarChart
						width={100}
						height={90}
						data={data}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" hide={true} />
						<XAxis dataKey="id" xAxisId={1} orientation="bottom">
							<Label value="Racers" height={40} offset={0} position="insideBottom" />
						</XAxis>
						<Legend verticalAlign="top" height={36} />
          				<YAxis yAxisId="right" orientation="right" stroke={`rgb(${colors[1]})`} >
							<Label value="PTS" offset={0} position="insideRight" angle={90}/>
						</YAxis>
						<Tooltip />
						<Bar yAxisId="right" dataKey="pts" fill={`rgb(${colors[1]})`} />
					</BarChart>
				</ResponsiveContainer>
				</Col>
			</Row>
		</Container>
	);
}

