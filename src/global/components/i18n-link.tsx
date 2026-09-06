import { styled } from '@mui/material/styles';

import { Route } from '~/routes/$lang/route';

// Styling must preserve the route's generic destination and parameter types.
export const I18nLink = styled(Route.Link)({
  textDecoration: 'none',
  color: 'inherit',
}) as unknown as typeof Route.Link;
