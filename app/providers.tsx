"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useContext } from 'react'

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}



export function Providers({ children, themeProps }: ProvidersProps) {
	useEffect(() => {
		setMount(true)
	}, [])
	
	const [isMount, setMount] = React.useState(false)

  const router = useRouter();

  if(!isMount) {
	return null
  }

	return (
		<NextUIProvider navigate={router.push}>
			<NextThemesProvider {...themeProps} >{children}</NextThemesProvider>
		</NextUIProvider>
	);
}
