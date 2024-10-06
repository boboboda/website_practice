
import Hero from "../components/home/hero";

export default function Home() {
  console.log("메인페이지로드");

  return (
    <div className="h-full w-full mx-auto flex md:flex-row flex-col md:mt-16 items-center justify-center ">
      <Hero />
    </div>
  );
}
