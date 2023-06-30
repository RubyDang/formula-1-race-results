import { CustomTooltip } from '@/src/utils/elements';
import '../../variables.css';
import { chartDataType } from "@/src/utils/interfaces";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Bar, BarChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { capitalizeFirstLetterOfEachWord } from '@/src/utils/functions';


export default function CustomVerticalChart({data, title="", colors=[], xAxisTitle}:chartDataType) {
    const [dataKeys, setDataKeys] = useState<string[]|[]>();

    useEffect(()=>{
        if(data?.length>0){
            let keys = Object.keys(data[0])
            setDataKeys(keys || [])
        }
    }, [data])
	return(
		<Container className="pb-5">
			<Row>
				<Col sm={12} style={{minHeight:500}}>
				<h3>{capitalizeFirstLetterOfEachWord(title.replace("-all", ""))}</h3>
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
						<Tooltip
                        content={<CustomTooltip active={undefined} payload={undefined} label={undefined}/>}
                        />
          				{dataKeys && dataKeys.length> 0 && dataKeys.map((key:any,index:number)=> typeof data[0][key] == "number" && <>
                        <YAxis key={`yAxis-${index}-${key}`} yAxisId={key} orientation={Math.abs(index%2)?"left":"right"} stroke={`rgb( 253, 152, 67)`} >
							<Label value={key} offset={0} position={Math.abs(index%2)?"insideLeft": "insideRight"} angle={Math.abs(index%2)?-90:90}/>
						</YAxis>
						<Bar yAxisId={key} dataKey={key} fill={`rgb( 253, 152, 67)`} /></>
                        )}
					</BarChart>
				</ResponsiveContainer>
				</Col>
			</Row>
		</Container>
	);
}

