"use client"
import{ CountUp} from "countup.js";
import { useEffect, useRef } from "react";


interface CountUpProps {
    id: string;
    end: number;
    start?: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    separator?: string;
    mounted?: boolean;
  }


  const CountUpComponent: React.FC<CountUpProps> = ({ 
    id,
    end, 
    start = 0, 
    duration = 2,
    prefix = '',
    suffix = '',
    separator = ',',
    mounted = false
  }) => {
  
    useEffect(() => {
        if(mounted) {
            if(id){
                const countUp = new CountUp(id, end, {
                    startVal: start,
                    duration: duration,
                    prefix: prefix,
                    suffix: suffix,
                    separator: separator,
                  });
        
              if (!countUp.error) {
                countUp.start();
                console.log("작동함")
              } else {
                console.error(countUp.error);
              }
            }
        }
        
        
    }, [id,mounted, end, start, duration, prefix, suffix, separator]);
  
    return <span id={id} className="text-white">{start}</span>;
  };
  
  export default CountUpComponent;