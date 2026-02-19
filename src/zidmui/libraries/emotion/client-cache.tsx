import { CacheProvider } from '@emotion/react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { getLangDirection } from '~/libraries/i18next/resource';

import { createEmotionCache } from './create-cache';
import { EmotionStyleContext } from './style-context';

//
//

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

export const ClientCacheProvider: React.FC<ClientCacheProviderProps> = ({
  children,
}: ClientCacheProviderProps) => {
  const { i18n } = useTranslation();
  const dir = i18n.isInitialized ? getLangDirection(i18n.language) : 'rtl';

  const currentDir = useRef(dir);
  const [cache, setCache] = useState(createEmotionCache(dir));

  const clientStyleContextValue = useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache(dir));
      },
    }),
    [dir],
  );

  useEffect(() => {
    if (currentDir.current === dir) return;
    clientStyleContextValue.reset();
    currentDir.current = dir;
  }, [clientStyleContextValue, dir]);

  return (
    <EmotionStyleContext value={clientStyleContextValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </EmotionStyleContext>
  );
};
