
export const CustomTooltip = ({ active, payload, label }: { active:any, payload:any, label:any }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-1" style={{}}>
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Laps: ${payload[0].value}`}</p>
          <p className="desc">{`Time: ${payload[1].value}`}</p>
        </div>
      );
    }
  
    return null;
  };