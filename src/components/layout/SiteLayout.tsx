import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
export function SiteLayout() { const {pathname} = useLocation();useEffect(() => {window.scrollTo({top:0,behavior:'instant'});},[pathname]);return <><Navbar/><main id="main-content" key={pathname}><Outlet/></main><Footer/></>; }
