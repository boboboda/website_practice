import "@/styles/globals.css";
import NextLink from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="">
        <div className="">
          <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
            <NextLink href="/" className="flex title-font font-medium items-center md:justify-start justify-center">

              <span className="ml-3 text-[1.1rem]">코딩천재 부영실</span>

            </NextLink>

            <p className="text-sm text-gray-500 sm:ml-6 sm:mt-0 mt-4">© 2023 —
              <a className="text-gray-600 ml-1" target="_blank">kju9038@gmail.com</a>
            </p>
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-end">
              <a className="ml-auto text-gray-500">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}