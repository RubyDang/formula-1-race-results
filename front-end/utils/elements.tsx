import { capitalizeFirstLetter } from "./functions";

export const CustomTooltip = ({ active, payload, label }: { active:any, payload:any, label:any }) => {
    if (active && payload && payload.length) {
        console.log(payload)
      return (
        <div className="bg-white p-1 custom-tooltip"
        style={{
            border:`1px solid rgb(${window.getComputedStyle(document.documentElement).getPropertyValue('--red-600-rgb')})`,
            borderRadius:8,

        }}
        >
          <p className="label">{`${label}`}</p>
          {payload.map((payloadItem:any, index:number)=>{
            return <p key={`${payloadItem}-${index}`} className="intro">{`${capitalizeFirstLetter(payloadItem.name)}: ${payloadItem.value}`}</p>
          })}
          {/* <p className="desc">{`${payload[0].name}: ${payload[1].value}`}</p> */}
        </div>
      );
    }
  
    return null;
  };