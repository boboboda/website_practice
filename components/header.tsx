
import "@/styles/globals.css";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import { ThemeSwitch } from "@/components/theme-switch";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

export default function Header() {
  return (
        <NextUINavbar maxWidth="xl" position="sticky">
          <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
            <NavbarBrand as="li" className="gap-3 max-w-fit">
              <NextLink className="flex justify-start items-center gap-1" href="/">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </NextLink>
              <span className="ml-3 text-xl">코딩천재 부영실</span>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full"
            justify="end">

            <ul className="hidden lg:flex gap-4 justify-start ml-2">
              {siteConfig.navItems.map((item) => (
                <NavbarItem key={item.href}>
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium"
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
              ))}
            </ul>

            <ThemeSwitch />

          </NavbarContent>
        </NextUINavbar>
  )
}