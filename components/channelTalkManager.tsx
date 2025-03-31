"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useEffect, useState } from "react";
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

const AppProvider = ({ children }: PropsWithChildren) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: 2,
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60 * 5,
        },
        mutations: {
          retry: 1,
        },
      },
    })
  );

  // 채널톡 적용
  useEffect(() => {
    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey: "c904884f-0dc2-48df-b9c2-9ef002727b21",
    });
  }, []);

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProvider;
