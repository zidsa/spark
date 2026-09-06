import type { PostHog } from 'posthog-js';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const PostHogContext = createContext<PostHog | undefined>(undefined);

export const usePostHog = () => useContext(PostHogContext);

interface PostHogProviderProps {
  children: ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const [client, setClient] = useState<PostHog>();

  useEffect(() => {
    const key = import.meta.env.VITE_POSTHOG_KEY;
    if (!key) return;

    let active = true;
    void import('posthog-js')
      .then(({ default: posthog }) => {
        if (!active) return;
        posthog.init(key, {
          api_host: String(import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'),
          person_profiles: 'identified_only',
          capture_pageview: false,
          defaults: '2025-11-30',
        });
        setClient(posthog);
      })
      .catch(reportError);

    return () => {
      active = false;
    };
  }, []);

  return <PostHogContext value={client}>{children}</PostHogContext>;
}
