import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
export function NotFound() {return <section className="page-shell section-shell not-found" aria-labelledby="not-found-title"><span className="eyebrow terracotta">404 · A little off the beaten path</span><h1 id="not-found-title">Let’s find your<br/><em>way home.</em></h1><p>This corner of Maison doesn’t exist, but there’s plenty of beauty waiting elsewhere.</p><Link className="site-button" to="/">Back to Maison <Icon name="arrow" width="17"/></Link></section>;}
