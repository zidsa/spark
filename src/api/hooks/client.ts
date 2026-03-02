import { QueryClient } from '@tanstack/react-query';

//
//

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 180_000, // 3 minutes
      retry: 0, // retries handled by Ky
    },
  },
});
