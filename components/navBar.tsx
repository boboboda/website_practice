"use client";

import { ThemeSwitch } from "@/components/theme-switch";
import NextLink from "next/link";
import {
  NavbarContent,
  Image,
  Button,
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
import { useUserStore, useUserStoreSubscribe  } from "@/components/providers/user-store-provider";
import { User } from "next-auth";
import { signOutWithForm } from "@/lib/serverActions/auth";
import { useAuthStore } from "@/components/providers/auth-store-provider";
import { toast } from "react-toastify";

import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function NavBar() {

  const { user, expires, fetchSession  } = useUserStore((state)=> state);

  const { subscribe } = useUserStoreSubscribe();

  const [path, setPath] = useState('/')

  const pathname = usePathname();

  useEffect(() => {
    // pathname이 변경될 때마다 필요한 업데이트 수행
    console.log('Current pathname:', pathname);

    setPath(pathname.split("/").slice(0, 2).join("/"))

  }, [pathname]);


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

    }, 1000)

  }, [])

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
    <div className="w-full max-w-[1400px] flex flex-col md:flex-row mt-[20px] md:items-center justify-end md:justify-center">
      
      <NextNavbar maxWidth="full" className="w-full flex flex-col md:flex-row items-start">
        <NavbarContent className="justify-start">
        <NextLink href="/" className="flex justify-start items-start">
        <Image
          height="50%"
          width="100%"
          src="/brand.png"
          fallbackSrc="https://via.placeholder.com/300x200"
          alt="Branding Image"
          className="object-contain h-[50px] w-[180px] ms-[10px]"
        />
      </NextLink>
          <ul className="flex gap-4 justify-start items-start">
            {siteConfig.navItems.map((item: any, index) => (
              <li
                key={index}
                className="text-medium whitespace-nowrap box-border list-none"
              >
                <a
                  className="relative inline-flex items-center tap-highlight-transparent outline-none 
            text-[15px] md:text-xl text-slate-500 font-semibold
            data-[focus-visible=true]:z-10 
            data-[focus-visible=true]:outline-2 
            data-[focus-visible=true]:outline-focus 
            data-[focus-visible=true]:outline-offset-2
            hover:opacity-80
            hover:text-slate-100
            active:opacity-disabled transition-opacity 
            data-[active=true]:text-[#0072F5]
            data-[active=true]:dark:text-[#0072F5]
            data-[active=true]:text-[15px] 
            data-[active=true]:md:text-xl"
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
      </NextNavbar>

      <div className="flex flex-row w-full md:w-fit justify-end mr-[40px] gap-5">
      {isLoading ? 
        <div>
        <Skeleton className="flex rounded-[5px] w-[100px] h-12"/>
      </div>  
        : !existsUserState ? (
          <div className="flex flex-row gap-3">
            {
              path === '/signup' ? null 
              : <Link className="text-white no-underline font-sans" href="/signup">
              <Button variant="ghost">Sign Up</Button>
              </Link>

            }
            
            <Link className="text-white no-underline font-sans" href="/signin">
              <Button variant="ghost">Sign In</Button>
              </Link>
          </div>
        ) : (
          <div>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex w-[150px] items-center justify-center bg-transparent cursor-pointer">
                  <UserCircleIcon className="w-6 h-6"></UserCircleIcon>
                  <p className="inline-block max-w-[100px]  px-1 py-1 text-black dark:text-white bg-transparent truncate">{user?.name}</p>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" textValue={`${user?.email}`} >
                  <p>로그인 정보</p>
                  <p>{user?.email}</p>
                </DropdownItem>
                {
                  user?.role === 'admin'? 
                  
                  <DropdownItem key="resister" textValue="resister" onClick={()=>{
                    router.push('/admin/register');
                  }}>
                  <p>앱 등록</p>
                </DropdownItem>
                
                  
                  : null
                }
                {
                  user?.role === 'admin'? 
                  
                  <DropdownItem key="adminWrite" textValue="adminWrite" onClick={()=>{
                    router.push('/admin/write');
                  }}>
                  <p>개발노트 쓰기</p>
                </DropdownItem>
                
                  
                  : null
                }
                {
                  user?.role === 'admin'? 
                  <DropdownItem key="adminNoteList" textValue="adminNoteList" onClick={()=>{
                    router.push('/admin/list')
                  }}>
                    <p>개발노트 리스트 관리</p>
                  </DropdownItem>
                  : null
                }
                <DropdownItem key="logout" color="danger" textValue="Log Out" onClick={handleLogOut}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}

<ThemeSwitch />
      </div>
    </div>
  );
}
