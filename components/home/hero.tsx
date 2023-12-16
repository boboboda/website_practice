"use client";
import NextLink from "next/link";
import Animation from "./animation"
import { title, subtitle } from "@/components/primitives";

export default function Hero() {
    return (
        <>
            <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col space-y-5 md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                <h1 className={title()}>
                    안녕하세요!!&nbsp;  
                </h1>
                <h1 className={title({ size:"sm" })}>
                저는 코딩천재 부영실입니다.&nbsp; 
				</h1>
                <p className={title({ size:"xs", weight:"normal"})}>
                   홈페이지 개설 준비 중
                </p>
            </div>
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                <Animation />
            </div>
        </>
    )

}