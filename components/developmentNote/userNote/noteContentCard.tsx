"use client"

import {Card, CardHeader, CardFooter, Image, Button} from "@nextui-org/react";
import { useUserStore } from "@/components/providers/user-store-provider"
import { useRouter } from "next/navigation";


export default function NoteContentCard() {

  const router = useRouter()
  
    return (
      <div className="max-w-[1000px] px-4 mt-[20px]">
         <div className="w-full gap-2 grid grid-cols-12 grid-rows-2 ">
         <Card className="col-span-12 h-[250px] pt-2 flex justify-start bg-slate-800 gap-4 hover:cursor-pointer hover:bg-gray-600"
        isPressable
        onClick={()=>{
          // console.log('노트 누름')
          router.push("/note/react")

          // window.location.href = "/note/react"
        }}
        >
            <div className="flex w-full h-[50px] items-center justify-center">
            <h4 className="text-white font-medium text-[24px]">코딩의 기초</h4>
            </div>
            <div className="flex flex-col w-[60%] h-full mt-[5px] justify-start gap-2">
          <h4 className="text-white font-medium text-[14px] ms-2 text-left">1. 컴포즈 ui 구현</h4>
          <h4 className="text-white font-medium text-[14px] ms-2 text-left">2. 파이어베이스 연동, 로컬 Room DB 구현</h4>
          <h4 className="text-white font-medium text-[14px] ms-2 text-left">3. 다양한 아키텍처 구현</h4>
          <h4 className="text-white font-medium text-[14px] ms-2 text-left">4. 딥링크 구현</h4>
          <h4 className="text-white font-medium text-[14px] ms-2 text-left">5. 배포 및 버전관리</h4>
          </div>
          
        </Card>
        <Card className="col-span-12 sm:col-span-6 h-[250px] flex justify-start bg-slate-800 gap-4 hover:cursor-pointer hover:bg-gray-600"
        isPressable
        onClick={()=>{
          // console.log('노트 누름')
          router.push("/note/react")

          // window.location.href = "/note/react"
        }}
        >
            <div className="flex w-full h-[50px] items-center justify-center">
            <h4 className="text-white font-medium text-[24px]">Android Jetpack Compose</h4>
            </div>
            <div className="flex flex-row">
            <div className="flex w-[40%] items-center justify-center">
            <Image
            removeWrapper
            alt="Card background"
            className="w-[90%] object-cover"
            src="/composeLogo.png"
          /></div>
          <div className="flex flex-col w-[60%] h-full mt-[5px] justify-start gap-2">
          <h4 className="text-white font-medium text-[14px] ms-2 text-left">1. 컴포즈 ui 구현</h4>
          <h4 className="text-white font-medium text-[14px] ms-2 text-left">2. 파이어베이스 연동, 로컬 Room DB 구현</h4>
          <h4 className="text-white font-medium text-[14px] ms-2 text-left">3. 다양한 아키텍처 구현</h4>
          <h4 className="text-white font-medium text-[14px] ms-2 text-left">4. 딥링크 구현</h4>
          <h4 className="text-white font-medium text-[14px] ms-2 text-left">5. 배포 및 버전관리</h4>
          </div>
            </div>
          
        </Card>
        <Card className="col-span-12 sm:col-span-6 h-[250px]">
          <CardHeader className="absolute z-10 top-1 flex-col !items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">Plant a tree</p>
            <h4 className="text-white font-medium text-large">Contribute to the planet</h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Card background"
            className="z-0 w-full h-full object-cover"
            src="https://nextui.org/images/card-example-3.jpeg"
          />
        </Card>
        <Card className="w-full h-[250px] col-span-12 sm:col-span-4">
          <CardHeader className="absolute z-0 top-1 flex-col items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">New</p>
            <h4 className="text-black font-medium text-2xl">Acme camera</h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Card example background"
            className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
            src="https://nextui.org/images/card-example-6.jpeg"
          />
          <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-0 justify-between">
            <div>
              <p className="text-black text-tiny">Available soon.</p>
              <p className="text-black text-tiny">Get notified.</p>
            </div>
            <Button className="text-tiny" color="primary" radius="full" size="sm">
              Notify Me
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-full h-[250px] col-span-12 sm:col-span-8">
          <CardHeader className="absolute z-0 top-1 flex-col items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">Your day your way</p>
            <h4 className="text-white/90 font-medium text-xl">Your checklist for better sleep</h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Relaxing app background"
            className="z-0 w-full h-full object-cover"
            src="https://nextui.org/images/card-example-5.jpeg"
          />
          <CardFooter className="absolute bg-black/40 bottom-0 z-0 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              <Image
                alt="Breathing app icon"
                className="rounded-full w-10 h-11 bg-black"
                src="https://nextui.org/images/breathing-app-icon.jpeg"
              />
              <div className="flex flex-col">
                <p className="text-tiny text-white/60">Breathing App</p>
                <p className="text-tiny text-white/60">Get a good night</p>
              </div>
            </div>
            <Button radius="full" size="sm">Get App</Button>
          </CardFooter>
        </Card> 
      </div>

      </div>
        
      );
}