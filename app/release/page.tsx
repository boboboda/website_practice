import { title } from "@/components/primitives";
import Head from "next/head"
import Hero from "../../components/home/hero"
import { TOKEN, DATABASE_ID } from "@/config";
import ReleaseItem from "@/components/release/releaseItem";




// 빌더 타임에 호출
async function fetchNotionAilCall() {

	const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
		cache: 'no-store',
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Notion-Version': '2022-06-28',
			'content-type': 'application/json',
			Authorization: `${TOKEN}`
		},
		body: 
		JSON.stringify({ 
			sorts: [
				{
					"property": "Name",
					"direction": "descending"
				}
			],
			page_size: 100 }),
	} )

	const projects = await res.json()

	return projects
}




export default async function ReleaseAppPage() {
	
	const response = await fetchNotionAilCall()

	const projects = response.results?.map((aProject: any) =>(
		aProject.properties.Name.title[0]?.plain_text
		))

	let count = 0

	for (const project of projects) {
		count++;
	  }

	
	
	return (
		<>
		<h1 className={title()}>출시 어플: 
		{
		<span className="pl-4 text-blue-500">{count}</span>
		}</h1>
		<div className="md:gap-8 grid grid-cols-1 md:grid-cols-2">
		{response.results?.map((aApp: any) => (
			<ReleaseItem key={aApp.id} data={aApp}/>
			))}
		</div>
		</>
		
	);
}

