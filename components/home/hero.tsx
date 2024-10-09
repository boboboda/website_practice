"use client"

import Animation from "./animation"
import { title } from "@/components/primitives";
import VisitCalcurateView from "./visitCalcurateView";
import CustomTyped from "./customTyped";
import { useAuthStore, useAuthStoreSubscribe } from "@/components/providers/auth-store-provider";
import {  toast } from "react-toastify";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Hero() {

  const router = useRouter()

  const { signInStatus, signUpStatus, socialLoginStatus, logOutStatus, resetStatus } = useAuthStore((state)=> state)

  const notifySuccessEvent = (msg: string) => toast.success(msg);

  useEffect(()=>{

    console.log(logOutStatus, '로그아웃 상태')

    if (signInStatus === "success") {

      notifySuccessEvent("로그인 되었습니다.")

      router.refresh()

      setTimeout(() => {
        resetStatus()
      }, 500)

    } 

    if (signUpStatus === "success") {
      notifySuccessEvent("회원가입 되었습니다.")
      
       router.refresh()

       setTimeout(() => {
        resetStatus()
      }, 500)
    } 

    if (socialLoginStatus === "success") {
      notifySuccessEvent("소셜 로그인 되었습니다.")

      router.refresh()

      setTimeout(() => {
        resetStatus()
      }, 500)
    } 

    if (logOutStatus === "success") {

      notifySuccessEvent("로그아웃 되었습니다.")

      router.refresh()

      setTimeout(() => {
        resetStatus()
      }, 500)
      
    }


  }, [signInStatus, signUpStatus, socialLoginStatus, logOutStatus, resetStatus, router])



  return (
    <>
      <div className="flex flex-col w-full md:h-[1500px] md:px-8 md:justify-start items-center">
     
        <div className="flex flex-col justify-center items-center md:flex-row md:h-[700px] w-full">
        <div className="items-center flex flex-col mt-[130px] space-y-10 w-full md:w-[50%] text-left md:items-start justify-start">
          <h1 className={title({ size: "sm" })}>
            안녕하세요!!&nbsp;
          </h1>
          <li className={title({ size: "sm" })}>
            코딩천재 부영실입니다.&nbsp;
          </li>
          <li className={title({ size: "sm" })}>
            여러분은 꿈을 꾸십니까?
          </li>
          <CustomTyped />

        </div>
        <div className="w-full md:w-[50%]">
        <Animation />
        </div>
        </div>
        

        <div className="md:">
          <VisitCalcurateView />
        </div>
      </div>

    </>
  )
}