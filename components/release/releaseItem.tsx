"use client"

import React from "react";
import { Image, Card, CardFooter, CardBody, Tooltip, Chip, Button, Link,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, listboxSection,
} from "@nextui-org/react";
import { title, subtitle, ButtnCustom } from "../primitives";
import { TagCustom } from "../primitives";
import {Divider} from "@nextui-org/react";
import { useState, useMemo} from "react";
import { useRouter, usePathname } from "next/navigation"
// import Image from 'next/image';


export default function ReleaseItem({ data }: {data: any }) {
    const appTitle = data.properties.Name.title[0]?.plain_text
    const appLink = data.properties.AppLink.url
    const description = data.properties.AppDescription.rich_text[0]?.plain_text
    // const imgSrc = data.cover.file? data.cover.file.url : data.cover.external.url

    const router = useRouter()

    const [linkData, setLinkData] = useState({});

    const [noticeLinkData, setNoticeLinkData] = useState({})

    const postHref = useMemo(() => {
      const databaseName = data.properties.database.rich_text[0]?.plain_text;
      return `/release/postBoard/${databaseName}`;
    }, [linkData]);

    const noticeHref = useMemo(() => {
      const databaseName = data.properties.database.rich_text[0]?.plain_text;
      return `/release/noticeBoard/${databaseName}`;
    }, [noticeLinkData]);

    const noticeHandleClick = () => {
      return (
        <DropdownItem onPress={()=>(
          router.push(`${noticeHref}`)
        )}>공지사항</DropdownItem>
      );
    };

    const postHandleClick = () => {
      return (
        <DropdownItem onPress={()=>(
          router.push(`${postHref}`)
        )}>문의게시판</DropdownItem>
      );
    };

    


    // 다른 표현
    const imgSrc = data.cover.file?.url || data.cover.external.url

    // const databaseName = notionData.properties.database.rich_text[0]?.plain_text

    const appTags = data.properties.Tags.multi_select


    const linesDescription = description.split("\n");



    return (
 <div>
           {
        <Card className="flex flex-col m-3 bg-slate-300 dark:bg-slate-500 rounded-xl w-full transition duration-300 transform border border-gray-300
        hover:scale-105
        hover:shadow-lg
        dark:border-gray-200/50
        dark:hover:shadow-gray-400/40">
          <CardBody className="overflow-visible space-y-6 item-center">
            <Image
              shadow="sm"
              radius="lg"
              height="100%"
              width="100%"
              src={imgSrc}
              fallbackSrc="https://via.placeholder.com/300x200"
                alt="NextUI hero Image"
              className="w-full object-cover h-[300px]"
            />
            <div className="flex flex-col p-x-2 space-y-4 item-center">
            <li className= {title({ size:"sm", position: "center" })}>
            {appTitle}
            </li>
            
            <div className="items-start mt-2 w-full ">
            
              {
                linesDescription.map((item:any)=>(
                  <li key={item.id} className="list-none -indent-4 ml-5">
                    {item}
                  </li>
                ))
              }
            
            </div>
            
            <div className="items-start mt-2 w-full "
            style={{display: "inline"}}>
                {
                    appTags.map((aTag:any)=> (
                        <Chip
                        style={{
                          display: "inline-block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        key={aTag.id} 
                        className={TagCustom({color: aTag.color})}>
                            {aTag.name}</Chip>
                            ))
                 }
                </div>
            </div>

            <Divider className="my-2 text-black" />
                
                <div className=" flex flex-direction-row ml-auto gap-4 items-center">
                <Button className={ButtnCustom()}>
                  <Link color="foreground" href={appLink}>
                  앱 바로가기
                  </Link>
                </Button>
                
                <Dropdown>
              <DropdownTrigger>
                <Button className={ButtnCustom()}>
                  메뉴
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={() =>{
                // console.log(`aTodo.id: ${aTodo.id}  key: ${key}}`)

                // setCurrentModalData({focusedTodo: aTodo, modalType: key as CustomModalType})
                // onOpen();
              }}>
                {noticeHandleClick()}
                {postHandleClick()}
                <DropdownItem href="">개인정보처리방침</DropdownItem>
              </DropdownMenu>
            </Dropdown>
                </div>
          </CardBody>
          
        </Card>
     }

   </div>
    )
}