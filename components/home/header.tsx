"use client";

import "@/styles/globals.css";
import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  Image,
} from "@nextui-org/react";
import { ThemeSwitch } from "@/components/theme-switch";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";
import Head from "next/head";
import { Metadata, Viewport } from "next";



export default function Header() {
  const pathname = usePathname();
  const path = pathname.split("/").slice(0, 2).join("/");

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
        <div className="grid grid-cols-1 pt-5 xl:pt-2 xl:grid-cols-12 gap-4 items-center justify-center">
          <div className="col-span-1  xl:col-span-6 flex justify-end xl:justify-start">
            <NextLink href="/" className="flex justify-center items-center gap-1">
              <Image
                height="10%"
                width="50%"
                src="https://firebasestorage.googleapis.com/v0/b/cobusil-site-db.appspot.com/o/ImageFoder%2Fbranding.png?alt=media&token=119a1af2-9a61-47c4-a32b-17af769a97f6"
                fallbackSrc="https://via.placeholder.com/300x200"
                alt="Branding Image"
                className="object-contain h-[40px] w-[40px]"
              />
              <Image
                height="10%"
                width="50%"
                src="https://firebasestorage.googleapis.com/v0/b/cobusil-site-db.appspot.com/o/ImageFoder%2F3d%20font.png?alt=media&token=e4a39e74-ed15-4f71-93e6-53b87050f296"
                fallbackSrc="https://via.placeholder.com/300x200"
                alt="3D Font Image"
                className="mr-5 object-contain h-[40px] w-[400px]"
              />
            </NextLink>
          </div>
          <div className="col-span-1 xl:col-span-6">
            <Navbar className="w-full" position="sticky">
              <NavbarContent className="w-full" justify="end">
                <ul className="flex gap-4 justify-end items-center w-full">
                  {siteConfig.navItems.map((item: any, index) => (
                    <li
                      key={index}
                      className="text-medium whitespace-nowrap box-border list-none"
                    >
                      <a
                        className="relative inline-flex items-center tap-highlight-transparent outline-none 
                        text-xl text-slate-500 font-semibold
                        data-[focus-visible=true]:z-10 
                        data-[focus-visible=true]:outline-2 
                        data-[focus-visible=true]:outline-focus 
                        data-[focus-visible=true]:outline-offset-2
                        hover:opacity-80
                        hover:text-slate-100
                        active:opacity-disabled transition-opacity 
                        data-[active=true]:text-[#0072F5]
                        data-[active=true]:dark:text-[#0072F5]
                        data-[active=true]:text-xl"
                        color="foreground"
                        data-active={path === item.href ? true : false}
                        href={item.href}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <ThemeSwitch />
              </NavbarContent>
            </Navbar>
          </div>
        </div>
      </header>
    </>
  );
}