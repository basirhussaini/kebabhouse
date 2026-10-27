import { Link } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { products } from '@/data/catalog';
import { ProductCard } from '@/components/ui/ProductCard';
import { Icon } from '@/components/ui/Icon';
export function Wishlist() {const {wishlist}=useShop();const saved=products.filter(p=>wishlist.includes(p.id));return <div className="page-shell section-shell"><div className="page-intro"><span className="eyebrow terracotta">Keep a little inspiration</span><h1>Your favourite things.</h1><p>A considered collection, all your own.</p></div>{saved.length?<div className="product-grid catalog-grid">{saved.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="empty-state"><Icon name="heart" width="42" height="42"/><h2>Good things are worth keeping.</h2><p>Tap the heart on any piece to save it here for another day.</p><Link className="site-button" to="/products">Find your favourites <Icon name="arrow" width="17"/></Link></div>}</div>;}
