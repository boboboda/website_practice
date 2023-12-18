"use client";
import NextLink from "next/link";
import Animation from "./animation"
import { title, subtitle } from "@/components/primitives";
import Typed from 'typed.js';
import { useState, useEffect, useRef } from "react";


export default function Hero() {

    const el = useRef(null);

    useEffect(() => {
        const typed = new Typed(el.current, {
          strings: [
            "나만의 홈페이지 또는 어플?", 
          "비전있는 아이템?", 
          "충족되지 않는 앱 서비스?", 
          "그 꿈 부영실이",
          "이루어드리겠습니다."], // Strings to display
          // Speed settings, try diffrent values untill you get good results
          startDelay: 300,
          typeSpeed: 100,
          backSpeed: 100,
          backDelay: 300,
          loop: true
        });
    
        // Destropying
        return () => {
          typed.destroy();
        };
      }, []);

    return (
        <>
            <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col space-y-5 md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                <h1 className={title()}>
                    안녕하세요!!&nbsp;  
                </h1>
                <li className={title({ size:"sm" })}>
                저는 코딩천재 부영실입니다.&nbsp; 
				</li>

                <li className={title({ size:"xs" })}>
                여러분은 꿈을 꾸십니까? 
				</li>

                <h1 className={title({ size:"xs", color:"pink"})}>
                <span ref={el}></span>
                </h1>
            
            </div>
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                <Animation />
            </div>
        </>
    )

}