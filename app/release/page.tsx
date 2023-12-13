import { title } from "@/components/primitives";
import Head from "next/head"
import Hero from "../../components/home/hero"
import { TOKEN, DATABASE_ID } from "@/config";
import ReleaseItem from "@/components/release/releaseItem";




// 빌더 타임에 호출
async function fetchNotionAilCall() {

	const options = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Notion-Version': '2022-06-28',
			'content-type': 'application/json',
			Authorization: `${TOKEN}`
		},
		body: JSON.stringify({ 
			sorts: [
				{
					"property": "출시일",
					"direction": "ascending"
				}
			],
			page_size: 100 })
	};

	const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, options)

	const projects = await res.json()

	return projects
}




export default async function ReleaseAppPage() {
	
	const response = await fetchNotionAilCall()

	const projects = response.results.map((aProject: any) =>(
		aProject.properties.이름.title[0]?.plain_text
		))

	let count = 0

	for (const project of projects) {
		count++;
	  }

	
	
	return (
		<div>
			<h1>총 출시 어플: {count}</h1>
			{response.results.map((aApp: any) => (
			<ReleaseItem key={aApp.id} data={aApp}/>
			))}
		
		</div>
	);
}

