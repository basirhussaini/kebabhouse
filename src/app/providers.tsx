import { StrictMode, type PropsWithChildren } from 'react';
import { ShopProvider } from '@/hooks/useShop';
export function AppProviders({children}: PropsWithChildren) { return <StrictMode><ShopProvider>{children}</ShopProvider></StrictMode>; }
