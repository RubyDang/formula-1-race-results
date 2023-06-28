import { CustomTooltip } from '@/utils/elements';
import '../../variables.css';
import { chartDataType, customDataCategory } from "@/utils/interfaces";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Bar, BarChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


export default function CustomVerticalChartMultipleData({data, title="", xAxisTitle="", colors=[]}:chartDataType) {
	console.log(data)
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
							<Label value={xAxisTitle} height={40} offset={0} position="insideBottom" />
						</XAxis>
						<Legend verticalAlign="top" height={36} />
						<YAxis yAxisId="left" orientation="left" stroke={`rgb(${colors[0]})`} >
							<Label value="Number of Laps" offset={0} position="insideLeft" angle={-90}/>
						</YAxis>
          				<YAxis yAxisId="right" orientation="right" stroke={`rgb(${colors[1]})`} >
							<Label value="PTS" offset={0} position="insideRight" angle={90}/>
						</YAxis>
						<Tooltip
						content={<CustomTooltip active={undefined} payload={undefined} label={undefined}/>}
						/>
						<Bar yAxisId="left" dataKey="laps" fill={`rgb(${colors[0]})`} />
						<Bar yAxisId="right" dataKey="pts" fill={`rgb(${colors[1]})`} />
					</BarChart>
				</ResponsiveContainer>
				</Col>
			</Row>
		</Container>
	);
}

