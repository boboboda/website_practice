"use client"


import "@/styles/globals.css";
import {
  Navbar as Navbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem, Link, Image
} from "@nextui-org/react";
import { ThemeSwitch } from "@/components/theme-switch";
import { usePathname, useSearchParams } from 'next/navigation'

import { siteConfig } from "@/config/site";

export default function Header() {

  const pathname = usePathname();

  const path = pathname.split("/").slice(0, 2).join("/");


  return (
    <>
    <Navbar className="mt-2" maxWidth="xl" position="sticky">
          <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
            <NavbarBrand as="li" className="gap-3 max-w-fit">
              <Link className="flex justify-start items-center gap-1" color="foreground" href="/">
                
              <Image
              height="10%"
              width="50%"
              src={"https://firebasestorage.googleapis.com/v0/b/cobusil-site-db.appspot.com/o/ImageFoder%2Fbranding.png?alt=media&token=119a1af2-9a61-47c4-a32b-17af769a97f6"}
              fallbackSrc="https://via.placeholder.com/300x200"
                alt="NextUI hero Image"
              className="w-full object-contain h-[40px] w-[40px]"
            />
                <Image
              height="10%"
              width="50%"
              src={"https://firebasestorage.googleapis.com/v0/b/cobusil-site-db.appspot.com/o/ImageFoder%2F3d%20font.png?alt=media&token=e4a39e74-ed15-4f71-93e6-53b87050f296"}
              fallbackSrc="https://via.placeholder.com/300x200"
                alt="NextUI hero Image"
              className="mr-5 w-full object-contain h-[40px] w-[400px]"
            />
                
              </Link>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full"
            justify="end">

            <ul className="hidden lg:flex gap-4 justify-start items-center">
              {siteConfig.navItems.map((item:any)=>(
                <li key={item.id} className="text-medium whitespace-nowrap box-border list-none">
                  <a className="relative inline-flex items-center tap-highlight-transparent outline-none 
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
                  data-[active=true]:text-xl
                  data-[active=true]: "
                  color="foreground" 
                  data-active={path === item.href ? true : false}
                  href={item.href}>{item.label}</a>
                  </li>
              ))}
              </ul>

          </NavbarContent>
          <ThemeSwitch />
        </Navbar>

        <Navbar className="lg:hidden" maxWidth="xl" position="sticky">
        <NavbarContent className=" basis-1/5 sm:basis-full"
            justify="start">

            <ul className="flex lg:hidden gap-4 justify-start items-center">
              {siteConfig.navItems.map((item:any)=>(
                <li key={item.id} className="text-medium whitespace-nowrap box-border list-none">
                  <a className="relative inline-flex items-center tap-highlight-transparent outline-none 
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
                  data-[active=true]:text-xl
                  data-[active=true]: "
                  color="foreground" 
                  data-active={path === item.href ? true : false}
                  href={item.href}>{item.label}</a>
                  </li>
              ))}
              </ul>

          </NavbarContent>

        </Navbar>
    </>
        
  )
}