import React from "react";
import { Image } from "@nextui-org/react";
// import Image from 'next/image';




export default function ReleaseItem({ data }: any) {

    const appTitle = data.properties.Name.title[0]?.plain_text
    const appLink = data.properties.AppLink.url
    const description = data.properties.AppDescription.rich_text[0]?.plain_text
    // const imgSrc = data.cover.file? data.cover.file.url : data.cover.external.url
    // 다른 표현
    const imgSrc = data.cover.file?.url || data.cover.external.url


// console.log(newUrl);


    const appTag = []

    for (const tag of data.properties.Tags.multi_select) {
        appTag.push(tag.name)
    }
    


    return (
        <div className="flex flex-col m-3 bg-slate-700 rounded-xl">

            <Image
                src={imgSrc}
                width={500}
                height={500}
                fallbackSrc="https://via.placeholder.com/300x200"
                alt="NextUI Image with fallback"
            />


            <h1>{appTitle}</h1>
            <h3>{description}</h3>
            <h1>{appTag}</h1>
            <a href={appLink}>앱 바로가기</a>
        </div>
    )
}