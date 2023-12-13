export default function ReleaseItem({data}: any){

    const appTitle = data.properties.이름.title[0]?.plain_text
    const appTag = []
    
    for (const tag of data.properties.태그.multi_select) {
        appTag.push(tag.name)
    }
    


    return (
        <div className="p-6 m-3 bg-slate-400 rounded-md">
            <h1>{
                    appTitle
                }</h1>
                <h1>{
                    appTag
                }</h1>
        </div>
    )
}