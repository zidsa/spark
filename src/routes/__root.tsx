import type { QueryClient } from '@tanstack/react-query';
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router';
import type { i18n } from 'i18next';
import { useEffect } from 'react';

import fontsCss from '~/ui/styles/fonts.css?url';

import { RootComponent } from '~/global/components/root-component';

import {
  getSupportedLanguageFromPathname,
  getLangDirection,
  localeDefault,
} from '~/libraries/i18next/resource';
import appCss from '~/styles.css?url';

interface MyRouterContext {
  queryClient: QueryClient;
  i18n: i18n;
}

const renderOnServer = ['ssr', 'ssg'].includes(import.meta.env.MODE);

export const Route = createRootRouteWithContext<MyRouterContext>()({
  ssr: renderOnServer,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Spark',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: fontsCss,
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  pendingComponent: RootPending,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const locale = useRouterState({
    select: state => getSupportedLanguageFromPathname(state.location.pathname) ?? localeDefault,
  });
  useEffect(() => {
    // One static SPA shell serves every locale; hydration does not repair its attributes.
    if (!renderOnServer) {
      document.documentElement.lang = locale;
      document.documentElement.dir = getLangDirection(locale);
    }
  }, [locale]);
  return (
    <html lang={locale} dir={getLangDirection(locale)} suppressHydrationWarning={!renderOnServer}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootPending() {
  return <div id="root-pending" />;
}
