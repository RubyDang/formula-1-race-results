import moment from 'moment';
import '../../variables.css';
import './customCharts.css'
import { customDataCategory } from "@/utils/interfaces";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Bar, BarChart, CartesianGrid, ComposedChart, Label, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const CustomTooltip = ({ active, payload, label }: { active:any, payload:any, label:any }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-1 custom-tooltip"
        style={{
            border:`1px solid rgb(${window.getComputedStyle(document.documentElement).getPropertyValue('--red-600-rgb')})`,
            borderRadius:8,

        }}
        >
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Laps: ${payload[0].value}`}</p>
          <p className="desc">{`Time: ${payload[1].value}`}</p>
        </div>
      );
    }
  
    return null;
  };

export default function CustomLineBarChart({data, title="", colors=[]}:{data: any[], title:string, colors:string[]}) {
	
	return(
		<Container className="my-5">
			<Row>
				<Col sm={12} className='p-0' style={{height:500}}>
				<h3>{title.replace("-all", "").toUpperCase()}</h3>
				<ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                    width={500}
                    height={400}
                    data={data}
                    >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" scale="auto" tickFormatter = {(val) => {let test = /\b(\w+)\W*$/gi.exec(val); return test?.length ? test[1]:""}}/>
                    <YAxis 
                    dataKey="time" 
                    tickFormatter = {(timestamp) => moment(timestamp).format('hh:mm:ss')}
                    type='number'
                    domain={['auto', 'auto']}
                    yAxisId='time'
                    orientation={"right"}
                    scale="time">
                        <Label value="Time" offset={-10} position="top"/>
                    </YAxis>
                    <YAxis dataKey="laps"
                    yAxisId="laps"
                    orientation={"left"}
                    >
                        <Label value="Number od Laps" offset={0} position="insideLeft" angle={-90}/>
                    </YAxis>
                    <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined}/>} />
                    <Legend />
                    <Bar dataKey="laps" yAxisId="laps" barSize={10} fill={`rgb(${window.getComputedStyle(document.documentElement).getPropertyValue('--orange-300-rgb')})`} />
                    <Line type="monotone" yAxisId="time" dataKey="time" stroke={`rgb(${window.getComputedStyle(document.documentElement).getPropertyValue('--red-500-rgb')})`} />
                    </ComposedChart>
                </ResponsiveContainer>
				</Col>
			</Row>
		</Container>
	);
}

