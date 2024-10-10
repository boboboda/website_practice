import "@/styles/globals.css";
import NextLink from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="">
      <div className="container py-6 mx-auto flex items-center sm:flex-row flex-col">
            <NextLink href="/" className="flex title-font font-medium items-center md:justify-start justify-center">

              <span className="ml-3 text-[1.1rem]">코딩천재 부영실</span>

            </NextLink>

            <p className="text-sm text-gray-500 sm:ml-6 sm:mt-0 mt-4">© 2023 —
              <a className="text-gray-600 ml-1" target="_blank">kju9038@gmail.com</a>
            </p>
          </div>
      </footer>
    </>
  )
}