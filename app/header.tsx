import "@/styles/globals.css";

import Head from "next/head";
import NavBar from "../components/navBar";



export default async function Header() {


  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="m5OSAuutjyid3qZGPul7bLxNpaLK1TLfY_jCeh5TpXM"
        />
        <meta
          name="naver-site-verification"
          content="f71196e4dbe205d177e771af7db3602a74f06a6d"
        />
      </Head>

      <header className="w-full">
        <NavBar/>
      </header>
    </>
  );
}