"use client"

import Animation from "./animation"
import { title } from "@/components/primitives";
import VisitCalcurateView from "./visitCalcurateView";
import CustomTyped from "./customTyped";
import { useAuthStore, useAuthStoreSubscribe } from "@/components/providers/auth-store-provider";
import {  toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroTyped from "./heroTyped";
import TypedComponent from "./heroTyped";

export default function Hero() {

  const [startFirst, setStartFirst] = useState(false);
  const [startSecond, setStartSecond] = useState(false);
  const [startThird, setStartThird] = useState(false);
  const [startFour, setStartFour] = useState(false);
  const [startFive, setStartFive] = useState(false);

  const router = useRouter()

  const { signInStatus, signUpStatus, socialLoginStatus, logOutStatus, resetStatus } = useAuthStore((state)=> state)

  const notifySuccessEvent = (msg: string) => toast.success(msg);

  useEffect(()=>{

    console.log(logOutStatus, '로그아웃 상태')

    if (signInStatus === "success") {

      notifySuccessEvent("로그인 되었습니다.")

      // router.refresh()

      setTimeout(() => {
        resetStatus()
      }, 500)

    } 

    if (signUpStatus === "success") {
      notifySuccessEvent("회원가입 되었습니다.")
      
      //  router.refresh()

       setTimeout(() => {
        resetStatus()
      }, 500)
    } 

    if (socialLoginStatus === "success") {
      notifySuccessEvent("소셜 로그인 되었습니다.")

      // router.refresh()

      setTimeout(() => {
        resetStatus()
      }, 500)
    } 

    if (logOutStatus === "success") {

      notifySuccessEvent("로그아웃 되었습니다.")

      // router.refresh()

      setTimeout(() => {
        resetStatus()
      }, 500)
      
    }


  }, [])


  useEffect(() => {
    const timer1 = setTimeout(() => setStartFirst(true), 300);  // Start the first after 300ms
    const timer2 = setTimeout(() => setStartSecond(true), 1000); // Start the second after 3400ms
    const timer3 = setTimeout(() => setStartThird(true), 2500); 
    const timer4 = setTimeout(() => setStartFour(true), 4500);
    const timer5 = setTimeout(() => setStartFive(true), 7000); 

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);


  return (
    <>
      <div className="flex flex-col w-full lg:h-[1500px] justify-start items-center">
     
        <div className="flex justify-start items-start flex-row lg:h-[700px] w-full max-w-[1400px]">
        
        <div className="w-full w-[50%] flex justify-center h-full">
        <Animation />
        </div>

        <div className="w-full flex flex-col h-full items-start justify-start w-[50%] pt-[150px] pr-[150px]">
        <TypedComponent text="프로필" showEndCursor="none" start={startFirst} className={title({size: "sm", color: "black"})}/> 
      <br />
      <TypedComponent text="이름: 부영실" showEndCursor="none" start={startSecond} className={title({size: "sm", color: "black"})}/>
      <br />
      <TypedComponent text="취미: 코딩, 게임 등" showEndCursor="none" start={startThird} className={title({size: "sm", color: "black"})}/>
      <br />
      <TypedComponent text="관심사: 재테크, 개발, 1인기업" showEndCursor="none" start={startFour} className={title({size: "sm", color: "black"})}/>
      <br />
      <TypedComponent text="할줄 아는 것: 안드로이드 개발, IOS 개발, 웹 개발" start={startFive} className={title({size: "sm", color: "black"})}/>
        </div>

        </div>
        

        <div className="w-full bg-slate-300 flex justify-center">
        <div className="w-full max-w-[1400px] flex flex-col md:flex-row bg-slate-300 py-[80px]">
          <div className="lg:w-[50%] w-full px-[40px] flex justify-center">

          <VisitCalcurateView />
          </div>
          
          <div className="items-center flex flex-col pl-[50px] h-full items-center justify-center space-y-10 w-full md:w-[50%] text-left md:items-start justify-start">
          <h1 className={title({ size: "sm" })}>
            안녕하세요!!
          </h1>
          <li className={title({ size: "sm" })}>
            코딩천재 부영실입니다.
          </li>
          <li className={title({ size: "sm" })}>
            여러분은 꿈을 꾸십니까?
          </li>
          <CustomTyped />

        </div>
         
        </div>
        </div>
       
      </div>

    </>
  )
}