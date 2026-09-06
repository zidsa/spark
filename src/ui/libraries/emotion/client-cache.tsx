import { CacheProvider } from '@emotion/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { createEmotionCache } from '~/ui/libraries/emotion/create-cache';
import { themeParcelOptions } from '~/ui/libraries/theme/parcel';

import { getLangDirection } from '~/libraries/i18next/resource';

//
//

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

export const ClientCacheProvider: React.FC<ClientCacheProviderProps> = ({
  children,
}: ClientCacheProviderProps) => {
  const { i18n } = useTranslation();
  const dir = getLangDirection(i18n.language);
  const cache = useMemo(() => createEmotionCache(dir), [dir]);
  const theme = useMemo(() => createTheme({ ...themeParcelOptions, direction: dir }), [dir]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};
