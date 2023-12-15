import React from "react";
import { Image, Card, CardFooter, CardBody, Tooltip, Chip} from "@nextui-org/react";
import { title, subtitle } from "../primitives";
import { TagCustom } from "../primitives";
// import Image from 'next/image';


export default function ReleaseItem({ data }: {data: any }) {
    const appTitle = data.properties.Name.title[0]?.plain_text
    const appLink = data.properties.AppLink.url
    const description = data.properties.AppDescription.rich_text[0]?.plain_text
    // const imgSrc = data.cover.file? data.cover.file.url : data.cover.external.url
    // 다른 표현
    const imgSrc = data.cover.file?.url || data.cover.external.url

   

    const appTags = data.properties.Tags.multi_select


    const lines = appTitle.split("\n");
    const lineNumber = lines.length;

    console.log(lineNumber);



    return (
 <div>
           {
        <Card className=" bg-slate-500">
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
            {appTitle}</li>
            <h3>{description}</h3>
            <div className="flex items-start mt-2">
               
                {
                    appTags.map((aTag:any)=> (
                        <h1 
                        key={aTag.id} 
                        className={TagCustom({color: aTag.color})}>
                            {aTag.name}</h1>
                    ))
                    
                }
                
           
           

            </div>
            <a href={appLink}>앱 바로가기</a>
            </div>
          </CardBody>
        </Card>
     }

   </div>
    )
}



 {/* {
                    


                } */}