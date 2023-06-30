// import '../../variables.css';

import { capitalizeFirstLetterOfEachWord } from "@/src/utils/functions";
import { chartDataType, customDataCategory } from "@/src/utils/interfaces";
import { useState } from "react";
import { Col, Container, Row, Tooltip } from "react-bootstrap";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";


const renderActiveShape = (props:any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, name } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    
    return (
        <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={`rgba(0,0,0,0)`}>
            {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
          />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${name}`}</text>
        
        {/* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
            {payload.laps}
        </text> */}
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
};

export default function CustomPieChart({data, title="", colors=[]}:chartDataType) {
    const [active, setActive] = useState(0)
    const onPieEnter = (_:any, index:number) => {
        setActive(index)
    };
    return(
        <Container className="pb-5">
            <Row className='text-center'>
                <h3>{capitalizeFirstLetterOfEachWord(title)}</h3>
                <Col
                style={{height:500}}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart
                        width={1000}
                        height={1000}
                        >
                        <Pie
                        activeIndex={active}
                        activeShape={renderActiveShape}
                        dataKey="laps"
                        // isAnimationActive={false}
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        onMouseEnter={onPieEnter}
                        >
                            {data?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
        </Container>
    )
}