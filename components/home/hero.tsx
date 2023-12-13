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
                    모든 국민은 소급입법에 의하여 참정권의 제한을 받거나 재산권을 박탈당하지 아니한다. 대한민국의 영토는 한반도와 그 부속도서로 한다. 대통령은 내우·외환·천재·지변 또는 중대한 재정·경제상의 위기에 있어서 국가의 안전보장 또는 공공의 안녕질서를 유지하기 위하여 긴급한 조치가 필요하고 국회의 집회를 기다릴 여유가 없을 때에 한하여 최소한으로 필요한 재정·경제상의 처분을 하거나 이에 관하여 법률의 효력을 가지는 명령을 발할 수 있다.
                </p>

                <div className="flex justify-center">
                    <NextLink href="/release">
                    <button className="btn-project">
                        어플 보러가기
                    </button>
                    </NextLink>
                    
                </div>
            </div>
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                <Animation />
            </div>
        </>
    )

}