import { createContext, useContext, useEffect, useState, useCallback, useRef, type PropsWithChildren } from 'react';
import type { CartItem, Product } from '@/types/shop';
import { products } from '@/data/catalog';
interface ShopState { cart: CartItem[]; wishlist: string[] }
interface ShopContextValue extends ShopState { add: (product: Product, quantity: number) => void; update: (id: string, quantity: number) => void; remove: (id: string) => void; clear: () => void; toggleWish: (id: string) => void; subtotal: number; count: number; toast: string; notify: (message: string) => void }
const ShopContext = createContext<ShopContextValue | null>(null);
function load(): ShopState {
 try {
  const parsed: unknown = JSON.parse(localStorage.getItem('maison-shop') ?? 'null');
  if (!parsed || typeof parsed !== 'object') return {cart:[],wishlist:[]};
  const saved = parsed as Record<string, unknown>;
  const cart: CartItem[] = [];
  if (Array.isArray(saved.cart)) for (const entry of saved.cart as unknown[]) {
   if (!entry || typeof entry !== 'object') continue;
   const item = entry as Record<string, unknown>;
   if (!item.product || typeof item.product !== 'object') continue;
   const product = products.find(p => p.id === (item.product as Record<string, unknown>).id);
   if (product && typeof item.quantity === 'number' && Number.isFinite(item.quantity)) cart.push({product, quantity: Math.max(1, Math.min(10, Math.floor(item.quantity)))});
  }
  const wishlist = Array.isArray(saved.wishlist) ? saved.wishlist.filter((id: unknown): id is string => typeof id === 'string' && products.some(p => p.id === id)) : [];
  return {cart,wishlist};
 } catch { return {cart:[],wishlist:[]}; }
}
export function ShopProvider({children}: PropsWithChildren) {
 const [state,setState] = useState<ShopState>(load);
 const [toast,setToast] = useState('');
 const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
 useEffect(() => { try { localStorage.setItem('maison-shop',JSON.stringify(state)); } catch { /* Shopping remains available without storage. */ } },[state]);
 useEffect(() => () => clearTimeout(timer.current),[]);
 const notify = useCallback((message: string) => {setToast(message); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(''),4000);},[]);
 const add = (product: Product, quantity: number) => {
  setState(s => { const existing = s.cart.find(i => i.product.id === product.id); return {...s,cart: existing ? s.cart.map(i => i.product.id === product.id ? {...i,quantity:Math.min(10,i.quantity + quantity)} : i) : [...s.cart,{product,quantity:Math.max(1,Math.min(10,quantity))}]}; });
  notify(`${product.name} added to your bag`);
 };
 const update = (id: string, quantity: number) => setState(s => ({...s,cart:s.cart.map(i => i.product.id === id ? {...i,quantity:Math.max(1,Math.min(10,quantity))} : i)}));
 const remove = (id: string) => setState(s => ({...s,cart:s.cart.filter(i => i.product.id !== id)}));
 const clear = () => setState(s => ({...s,cart:[]}));
 const toggleWish = (id: string) => setState(s => ({...s,wishlist:s.wishlist.includes(id) ? s.wishlist.filter(i => i !== id) : [...s.wishlist,id]}));
 return <ShopContext.Provider value={{...state,add,update,remove,clear,toggleWish,subtotal:state.cart.reduce((sum,i) => sum+i.product.price*i.quantity,0),count:state.cart.reduce((sum,i) => sum+i.quantity,0),toast,notify}}>{children}<div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast && <><span>✓</span>{toast}</>}</div></ShopContext.Provider>;
}
export function useShop(): ShopContextValue { const context = useContext(ShopContext); if (!context) throw new Error('ShopProvider is required'); return context; }
