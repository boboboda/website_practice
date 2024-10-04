"use client";

import { ThemeSwitch } from "@/components/theme-switch";
import NextLink from "next/link";
import {
  NavbarContent,
  Image,
  Button,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link,
  Skeleton
} from "@nextui-org/react";
import { Navbar as NextNavbar } from "@nextui-org/react";
import { siteConfig } from "@/config/site";
import { usePathname, useRouter } from "next/navigation";
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserStore, useUserStoreSubscribe  } from "@/app/providers/user-store-provider";
import { User } from "next-auth";
import { signOutWithForm } from "@/serverActions/auth";
import { useAuthStore } from "@/app/providers/auth-store-provider";
import { ToastContainer, toast } from "react-toastify";

export default function NavBar() {


  const { user, expires, fetchSession  } = useUserStore((state)=> state);

  const { subscribe } = useUserStoreSubscribe();

  const pathname = usePathname();
  const path = pathname.split("/").slice(0, 2).join("/");
  const [existsUserState, setExistsUserState] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter();

 
  useEffect(() => {
    
    clearTimeout(timeoutRef.current)

    setIsLoading(true)
    fetchSession()

    timeoutRef.current = setTimeout(() => { 
      setIsLoading(false)

    }, 2000)

  }, [fetchSession])

   // user 상태 변경을 구독하는 effect
   useEffect(() => {
    const unsubscribe = subscribe(
      state => state,
      (newSession, preSession) => {
        console.log('session state changed:', newSession);
        updateUserState(newSession.user, newSession.expires);
      }
    );

    return () => unsubscribe();
  }, [subscribe]);

  // user 상태 업데이트 함수
  const updateUserState = (user, expires) => {
    if (user.name !== "" && expires !== "" && user !== null && expires !== null) {
      setExistsUserState(true);
    } else {
      setExistsUserState(false);
    }
  };

  // user 또는 expires 변경 시 실행되는 effect
  useEffect(() => {
    updateUserState(user, expires);
  }, [user, expires]);

  const { setLogOutStatus } = useAuthStore((state)=> state)

  const notifyFailedEvent = (msg: string) => toast.error(msg);

  const handleLogOut = async () => {
    const result = await signOutWithForm();

    if (result.success) {

      console.log('로그아웃 성공', result);

      fetchSession();

      setLogOutStatus("success");

    } else {
      notifyFailedEvent("로그인이 실패하였습니다. 다시 시도해주세요");
    }
  };

  return (
    <div className="flex mt-[10px] ms-[30px] items-center justify-center">
      <NextLink href="/" className="flex flex-col justify-start items-start">
        <Image
          height="50%"
          width="100%"
          src="/brand.png"
          fallbackSrc="https://via.placeholder.com/300x200"
          alt="Branding Image"
          className="object-contain h-[50px] w-[180px] ms-[10px]"
        />
      </NextLink>
      <NextNavbar maxWidth="full" className="w-full flex flex-col items-start">
        <NavbarContent className="justify-start">
          <ul className="flex gap-4 justify-start items-start">
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
        </NavbarContent>
        {isLoading ? 
        <div>
        <Skeleton className="flex rounded-full w-12 h-12"/>
      </div>  
        : !existsUserState ? (
          <NavbarContent justify="end">
            {
              path === '/signup' ? null 
              : <NavbarItem>
              <Link className="text-white no-underline font-sans" href="/signup">
              <Button variant="ghost">Sign Up</Button>
              </Link>
            </NavbarItem>

            }
            
            <NavbarItem>
            <Link className="text-white no-underline font-sans" href="/signin">
              <Button variant="ghost">Sign In</Button>
              </Link>
            </NavbarItem>
          </NavbarContent>
        ) : (
          <div>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center justify-center bg-slate-600 size-[50px] rounded-full cursor-pointer">
                  <p className="inline-block max-w-[100px] px-1 py-1 text-white truncate">{user?.name}</p>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" textValue={`${user?.email}`} >
                  <p>로그인 정보</p>
                  <p>{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" textValue="Log Out" onClick={handleLogOut}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}

        {/* <NavbarContent justify="end">
        <NavbarItem>
        <ThemeSwitch />
        </NavbarItem>
        </NavbarContent> */}

        {/* <div className="w-full flex flex-row justify-end">
          
        </div> */}
      </NextNavbar>
    </div>
  );
}