import { capitalizeFirstLetter } from "./functions";

export const CustomTooltip = ({ active, payload, label }: { active:any, payload:any, label:any }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-1 custom-tooltip"
        style={{
            border:`1px solid rgb(${window.getComputedStyle(document.documentElement).getPropertyValue('--red-600-rgb')})`,
            borderRadius:8,

        }}
        >
          <p className="label">{`${label}`}</p>
          {Object.keys(payload[0].payload).map((payloadKey:any, index:number)=>{
            return (payloadKey!=="id" && payloadKey!=="name")&& <p key={`${payloadKey}-${index}`} className="intro">{`${capitalizeFirstLetter(payloadKey)}: ${payload[0].payload[payloadKey]}`}</p>
          })}
          {/* <p className="desc">{`${payload[0].name}: ${payload[1].value}`}</p> */}
        </div>
      );
    }
  
    return null;
  };