import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const UIContext = createContext(null);
const useUI = () => useContext(UIContext);
const page = document.body.dataset.page || 'overview';
const pizzaImage = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=90';
const categories = ['Alla', 'Pizza', 'Kebab', 'Sallad', 'Tillbehör'];
const days = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
const dishes = [
  ['Margherita', 'Tomatsås, ost', 'Pizza'],
  ['Vesuvio', 'Tomatsås, ost, skinka', 'Pizza'],
  ['Capricciosa', 'Tomatsås, ost, skinka, champinjoner', 'Pizza'],
  ['Hawaii', 'Tomatsås, ost, skinka, ananas', 'Pizza'],
  ['Calzone', 'Inbakad pizza med ost och skinka', 'Pizza'],
  ['Vegetariana', 'Tomatsås, ost och blandade grönsaker', 'Pizza'],
  ['Kebabpizza', 'Kebabkött, lök, tomat och kebabsås', 'Pizza'],
  ['Quattro Stagioni', 'Skinka, champinjoner, räkor och musslor', 'Pizza'],
  ['Salami', 'Tomatsås, ost och salami', 'Pizza'],
  ['Bussola', 'Tomatsås, ost, skinka och räkor', 'Pizza'],
  ['Tonno', 'Tomatsås, ost, tonfisk och lök', 'Pizza'],
  ['Kycklingpizza', 'Kyckling, ost och färska grönsaker', 'Pizza'],
  ['Kebabtallrik', 'Kebab, pommes frites, sallad och sås', 'Kebab'],
  ['Kebabrulle', 'Kebab, sallad och sås i nybakat bröd', 'Kebab'],
  ['Kebab i bröd', 'Kebab, grönsaker och sås i pitabröd', 'Kebab'],
  ['Kycklingrulle', 'Kyckling, krispig sallad och sås', 'Kebab'],
  ['Falafelrulle', 'Falafel, grönsaker och sås', 'Kebab'],
  ['Kycklingtallrik', 'Kyckling, pommes frites och sallad', 'Kebab'],
  ['Grekisk sallad', 'Sallad, tomat, gurka, fetaost och oliver', 'Sallad'],
  ['Kycklingsallad', 'Kyckling och blandade grönsaker', 'Sallad'],
  ['Kebabsallad', 'Kebabkött och krispiga grönsaker', 'Sallad'],
  ['Pommes frites', 'En portion gyllene pommes', 'Tillbehör'],
  ['Pizzasallad', 'Klassisk vitkålssallad', 'Tillbehör'],
  ['Extra sås', 'Fråga restaurangen om dagens såser', 'Tillbehör']
];

function read(key, fallback = '') {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function useStored(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback));
  function save(next) {
    setValue(next);
    try { localStorage.setItem(key, next); return true; } catch { return false; }
  }
  useEffect(() => {
    const sync = event => { if (event.key === key || event.key === null) setValue(read(key, fallback)); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [key, fallback]);
  return [value, save];
}
function useStockholmTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Stockholm', hour: 'numeric', weekday: 'short', hourCycle: 'h23' }).formatToParts(now);
  const hour = Number(parts.find(part => part.type === 'hour').value);
  const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(parts.find(part => part.type === 'weekday').value);
  return { hour, day, open: hour >= 11 && hour < 21 };
}
function Icon({ name }) {
  const shapes = {
    search: <><circle cx='10.5' cy='10.5' r='6.5'/><path d='m16 16 4 4'/></>,
    sun: <><circle cx='12' cy='12' r='4'/><path d='M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5'/></>,
    pin: <><path d='M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z'/><circle cx='12' cy='10' r='2.5'/></>,
    phone: <path d='m5 3 4 1 1 5-3 2c1 3 3 5 6 6l2-3 5 1 1 4c-1 4-7 2-11-1S2 8 3 5Z'/>,
    heart: <path d='M20.5 5.5c-2.5-3-6.5-2-8.5 1-2-3-6-4-8.5-1s-.5 6.5 2 9L12 21l6.5-6.5c2.5-2.5 4.5-6 2-9Z'/>,
    copy: <><rect x='8' y='8' width='12' height='13' rx='2'/><path d='M15 8V3H3v13h5'/></>,
    store: <path d='M3 10h18l-2-6H5l-2 6Zm1 0v10h16V10M9 20v-7h6v7M3 10c0 3 5 3 5 0 0 3 8 3 8 0 0 3 5 3 5 0'/>,
    cookie: <><path d='M20 12a6 6 0 0 1-8-8A8.5 8.5 0 1 0 20 12Z'/><path d='M8 9h.01M7 15h.01M13 17h.01M11 12h.01M18 4h.01M21 8h.01'/></>,
    menu: <path d='M4 6h16M4 12h16M4 18h16'/>
  };
  return <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>{shapes[name] || shapes.pin}</svg>;
}
function Logo() {
  return <a className='logo' href='index.html' aria-label='Restrate, startsida'><span className='logo-mark' aria-hidden='true'>r.</span><span>Restrate<span className='logo-dot'>.</span>se</span></a>;
}
function Arrow() { return <span aria-hidden='true'>↗</span>; }
function Breadcrumb({ items }) {
  return <nav className='breadcrumb' aria-label='Brödsmulor'>{items.map((item, index) => <React.Fragment key={index}>{index > 0 && <span aria-hidden='true'>/</span>}{item.href ? <a href={item.href}>{item.label}</a> : <span aria-current='page'>{item.label}</span>}</React.Fragment>)}</nav>;
}
function Header() {
  const { theme, changeTheme, setDialog } = useUI();
  const [navOpen, setNavOpen] = useState(false);
  const nav = [['Städer', 'stader.html', 'cities'], ['Guider', 'stader.html#guider', 'guides'], ['Karta', 'karta.html', 'map'], ['Om oss', 'about.html', 'about']];
  return <header id='site-header'><div className='header-inner'><Logo/><nav className={'desktop-nav' + (navOpen ? ' open' : '')} id='main-nav' aria-label='Huvudnavigation'>{nav.map(([label, href, id]) => <a key={id} href={href} className={page === id ? 'current' : undefined} aria-current={page === id ? 'page' : undefined}>{label}</a>)}</nav><div className='header-actions'><button className='plain-button header-search' onClick={() => setDialog('search')} aria-label='Sök restauranger'><Icon name='search'/><span>Sök</span></button><span className='header-divider'/><span className='language-label' lang='sv' title='Språk: Svenska'>SV <span aria-hidden='true'>⌄</span></span><button className='plain-button' id='theme-toggle' onClick={changeTheme} aria-label={theme === 'dark' ? 'Byt till ljust tema' : 'Byt till mörkt tema'} aria-pressed={theme === 'dark'}><Icon name='sun'/><span className='theme-label'>{theme === 'dark' ? 'Mörkt' : 'Ljust'}</span></button><button className='login-button' onClick={() => setDialog('login')}>Logga in</button><button className='plain-button mobile-toggle' id='mobile-toggle' aria-label={navOpen ? 'Stäng navigation' : 'Öppna navigation'} aria-expanded={navOpen} aria-controls='main-nav' onClick={() => setNavOpen(!navOpen)}><Icon name='menu'/></button></div></div></header>;
}
function OpenStatus({ hero = false }) {
  const { time } = useUI();
  return <span className='status live-status'><i/>{time.open ? (hero ? 'Öppet till 21:00' : 'Öppet') : (time.hour < 11 ? 'Öppnar 11:00' : 'Stängt · öppnar 11:00')}</span>;
}
function RestaurantHeading() {
  const [favorite, saveFavorite] = useStored('restrate-favorite', 'no');
  const { toast } = useUI();
  const saved = favorite === 'yes';
  function toggleFavorite() {
    const persisted = saveFavorite(saved ? 'no' : 'yes');
    toast(persisted ? (saved ? 'Restaurangen har tagits bort från dina favoriter.' : 'Aladin är sparad bland dina lokala favoriter.') : 'Valet gäller i denna vy. Webbläsaren tillåter inte lokal lagring.');
  }
  return <div id='restaurant-heading'><Breadcrumb items={[{ label: 'Hem', href: 'stader.html' }, { label: 'Karlskrona', href: 'stader.html?city=Karlskrona' }, { label: 'Övrigt', href: 'menu.html' }, { label: 'Aladin pizza & kebab' }]}/><section className='restaurant-hero' aria-label='Aladin pizza & kebab'><div className='hero-copy'><span className='eyebrow orange-text'>KARLSKRONA · PIZZA & KEBAB</span><h1>Aladin pizza<br/>& kebab<span className='orange-text'>.</span></h1><a className='hero-location' href='karta.html'><Icon name='pin'/> Styrmansgatan 27, Karlskrona <Arrow/></a><div className='hero-meta'><OpenStatus hero/><span className='meta-dot'>•</span><span>Medelpris</span><span className='meta-dot'>•</span><span>Hemleverans</span></div></div><div className='hero-photo'><img src={pizzaImage} alt='Nygräddad pizza med mozzarella, tomat och färsk basilika' fetchPriority='high'/><button className={'save-button' + (saved ? ' saved' : '')} id='save-restaurant' aria-label={saved ? 'Ta bort sparad restaurang' : 'Spara restaurang'} aria-pressed={saved} onClick={toggleFavorite}><Icon name='heart'/></button><span className='photo-label'>GODA SMAKER. NÄRA DIG. <Arrow/></span></div></section><nav className='restaurant-tabs' aria-label='Restauranginformation'>{[['overview', 'index.html', 'Översikt'], ['menu', 'menu.html', 'Meny', '115'], ['reviews', 'recensioner.html', 'Recensioner', '1']].map(([id, href, label, count]) => <a key={id} href={href} className={page === id ? 'active' : undefined} aria-current={page === id ? 'page' : undefined}>{label}{count && <span className='tab-count'>{count}</span>}</a>)}</nav></div>;
}
function MapArt() { return <><div className='map-river' aria-hidden='true'/><div className='map-grid' aria-hidden='true'/><span className='map-place' aria-hidden='true'>KARLSKRONA</span></>; }
function Sidebar() {
  const { time, toast } = useUI();
  const [copied, setCopied] = useState(false);
  async function copyCode() {
    try { await navigator.clipboard.writeText('RESTRATE100'); setCopied(true); toast('RESTRATE100 kopierad — smaklig måltid!'); }
    catch { toast('Kopiera koden manuellt: RESTRATE100'); }
  }
  const ownerUrl = 'mailto:?subject=' + encodeURIComponent('Din restaurang finns på Restrate') + '&body=' + encodeURIComponent('Hej! Aladin pizza & kebab finns på Restrate. Du kan uppdatera restaurangsidan kostnadsfritt genom att kontakta info@restrate.se.\n\n' + new URL('index.html', window.location.href).href);
  return <aside id='restaurant-sidebar' aria-label='Praktisk information'><section className='card contact-card'><div className='side-heading'><h2>Hitta hit & hör av dig</h2><Icon name='pin'/></div><div className='contact-row'><Icon name='pin'/><div><small>Adress</small><a href='karta.html'>Styrmansgatan 27<br/>371 36 Karlskrona, Sverige</a></div></div><div className='contact-row'><Icon name='phone'/><div><small>Telefon</small><a className='contact-phone' href='tel:045582288'>0455-822 88 <Arrow/></a></div></div><div className='hours' id='hours'><div className='side-heading'><h3>Öppettider</h3><OpenStatus/></div><div className='hours-list'>{days.map((day, i) => <div key={day} className={i === time.day ? 'today' : undefined}><span>{day}{i === time.day && <small> · idag</small>}</span><span>11:00–21:00</span></div>)}</div></div></section><section className='delivery-card'><span className='eyebrow'>GOTT, HELA VÄGEN HEM</span><span className='wolt-logo' aria-label='Wolt'>Wolt</span><h2>Din favorit.<br/>Direkt till dörren.</h2><p>Få 50 kr rabatt på dina två första<br/>beställningar hos Wolt.</p><a href='https://wolt.com/sv/swe/karlskrona' target='_blank' rel='noopener noreferrer' className='button wolt-button' id='wolt-link' onClick={copyCode}>Beställ via Wolt <Arrow/></a><div className='coupon'><code>RESTRATE100</code><button id='copy-code' onClick={copyCode}><Icon name='copy'/><span>{copied ? 'Kopierad!' : 'Kopiera'}</span></button></div><p className='coupon-note'>50 kr per order, totalt 100 kr. Wolt avgör kodens giltighet. Koden kopieras när du öppnar Wolt.</p></section><section className='map-mini map-art' aria-label='Hitta restaurangen'><MapArt/><span className='pin' aria-hidden='true'>r.</span><a href='karta.html'><Icon name='pin'/> Öppna karta <Arrow/></a></section><section className='owner-card'><span className='owner-icon'><Icon name='store'/></span><h3>Äger du restaurangen?</h3><p>Gör ett ännu bättre första intryck.<br/>Uppdatera din sida och nå fler gäster.</p><a href='mailto:info@restrate.se?subject=Verifiera%20Aladin%20pizza%20%26%20kebab' className='button secondary'>Verifiera & ta över gratis <Arrow/></a><a className='plain-button text-link' id='share-owner' href={ownerUrl}>Känner du ägaren? Tipsa här <Arrow/></a></section></aside>;
}
function OwnerStrip() {
  return <section id='owner-strip'><div className='container'><div className='owner-strip-inner'><span className='owner-icon'><Icon name='store'/></span><div><strong>Lokala restauranger. Stora möjligheter.</strong><p>Din restaurangsida på Restrate är gratis — utan dolda avgifter.</p></div><a className='button secondary' href='about.html#kontakt'>Lär känna Restrate <Arrow/></a></div></div></section>;
}
function Footer() {
  const { openCookies } = useUI();
  return <footer id='site-footer'><div className='container'><div className='footer-top'><div className='footer-brand'><Logo/><p>Sveriges moderna restaurangguide.<br/>Hitta, jämför och betygsätt restauranger.</p></div><div className='footer-col'><h3>Städer</h3>{['Västerås', 'Stockholm', 'Göteborg', 'Malmö', 'Uppsala'].map(city => <a key={city} href={'stader.html?city=' + encodeURIComponent(city)}>{city}</a>)}</div><div className='footer-col'><h3>Snabblänkar</h3><a href='about.html'>Om Restrate</a><a href='about.html#kontakt'>Kontakta oss</a><a href='mailto:info@restrate.se?subject=Lägg%20till%20restaurang'>Lägg till restaurang</a><a href='about.html#integritet'>Integritetspolicy</a><button onClick={openCookies}>Cookie-inställningar</button><a href='mailto:info@restrate.se?subject=Pressförfrågan'>Press</a></div><div className='footer-col footer-tools'><h3>Verktyg</h3><a href='stader.html#guider'>Kväll för två</a><a href='mailto:info@restrate.se?subject=Jobba%20på%20Restrate'>Lediga jobb</a><a href='stader.html#guider'>Spontanitet</a><a href='karta.html'>Restaurangkarta</a></div><div className='footer-col footer-contact'><h3>Kontakt</h3><a href='mailto:info@restrate.se'>info@restrate.se <Arrow/></a><span className='free-tag'><i/> Restrate är gratis</span><p>Inga dolda avgifter.</p></div></div><div className='footer-bottom'><span>© 2026 Restrate.se. Alla rättigheter förbehållna.</span><span><Icon name='pin'/> Västerås, Sverige <span aria-hidden='true'>·</span> Byggt med matglädje.</span></div></div></footer>;
}
function Modal({ kind, onClose }) {
  const ref = useRef(null);
  const [query, setQuery] = useState('');
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  function backdropClick(event) {
    if (event.target !== ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }
  const match = !query.trim() || 'aladin pizza kebab karlskrona styrmansgatan'.includes(query.toLocaleLowerCase('sv').trim());
  return <dialog ref={ref} id={kind + '-dialog'} aria-labelledby='dialog-title' onCancel={event => { event.preventDefault(); onClose(); }} onClick={backdropClick}><div className='dialog-heading'><h2 id='dialog-title'>{kind === 'search' ? 'Hitta din nästa favorit' : 'Välkommen till Restrate'}</h2><button className='close-dialog' onClick={onClose} aria-label='Stäng'>×</button></div>{kind === 'search' ? <><label className='input-search'><span aria-hidden='true'>⌕</span><input autoFocus type='search' id='global-search' placeholder='Restaurang, stad eller smak' aria-label='Sök restaurang' value={query} onChange={event => setQuery(event.target.value)}/></label><div id='search-results' aria-live='polite'>{match ? <a className='search-result' href='index.html'><strong>Aladin pizza & kebab <Arrow/></strong><span>Karlskrona · Pizza & kebab · 4.5 ★</span></a> : <p>Inga restauranger hittades. Prova ”Karlskrona” eller ”pizza”.</p>}</div><p className='image-note'>Utforska restaurangen som finns i denna förhandsvisning.</p></> : <><p>Spara favoriter och dela dina matupplevelser.</p><div className='soft-notice'>Du tittar på en statisk förhandsvisning. Kontoinloggning är inte aktiverad, men du kan spara restaurangen och skriva ett recensionsutkast lokalt i din webbläsare.</div><a className='button primary dialog-cta' href='recensioner.html#review-form'>Dela din upplevelse <Arrow/></a></>}</dialog>;
}
function GlobalUI() {
  const { dialog, setDialog, message, cookiesOpen, setCookiesOpen, saveConsent, toast, cookieFocus, cookieReturn } = useUI();
  const necessaryRef = useRef(null);
  useEffect(() => { if (cookiesOpen && cookieFocus > 0) necessaryRef.current?.focus(); }, [cookiesOpen, cookieFocus]);
  function consent(value) {
    const persisted = saveConsent(value);
    setCookiesOpen(false);
    cookieReturn.current?.focus();
    cookieReturn.current = null;
    toast(persisted ? 'Dina cookie-inställningar har sparats.' : 'Valet gäller för denna visning. Lokal lagring är inte tillgänglig.');
  }
  return <div id='global-ui'><div className='toast' id='toast' role='status' hidden={!message}>{message}</div>{dialog && <Modal key={dialog} kind={dialog} onClose={() => setDialog(null)}/>}<section className='cookie-banner' id='cookie-banner' aria-label='Cookie-inställningar' hidden={!cookiesOpen}><span className='cookie-icon'><Icon name='cookie'/></span><div className='cookie-copy'><h2>Vi värnar om din integritet</h2><p>Denna förhandsvisning använder inga annons- eller analyscookies. Tema, favoriter, betyg och utkast sparas lokalt i din webbläsare. Ditt val mellan ”Godkänn alla” och ”Endast nödvändiga” sparas också lokalt och aktiverar inga externa skript. <a href='about.html#integritet'>Läs mer om din integritet.</a></p></div><div className='cookie-actions'><button ref={necessaryRef} className='button secondary' onClick={() => consent('necessary')}>Endast nödvändiga</button><button className='button primary' onClick={() => consent('all')}>Godkänn alla</button></div></section></div>;
}
function RatingCard() {
  const [rating, saveRating] = useStored('restrate-rating', '0');
  const [feedback, setFeedback] = useState('');
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  function rate(n) {
    const saved = saveRating(String(n));
    setFeedback(saved ? `Tack! Ditt betyg ${n} av 5 har sparats i den här webbläsaren. Det påverkar inte det publicerade snittet.` : 'Betyget visas här, men webbläsaren tillåter inte lokal lagring.');
  }
  return <section className='card rating-card' aria-labelledby='rating-title'><div className='section-heading'><h2 id='rating-title'>Ett gott intryck</h2><span className='eyebrow'>GÄSTERNAS BETYG</span></div><div className='ratings'><div className='rating-total'><strong>4.5<span>/ 5</span></strong><div className='stars' aria-label='4,5 av 5 stjärnor'>★★★★★</div><span className='muted'>26 betyg på Restrate</span></div><div className='rating-sources'><div><span className='source-icon orange'>r.</span><span>Restrate</span><strong>4.5 <small>(26)</small></strong></div><div><span className='source-icon google'>G</span><span>Google</span><strong>0.0 <small>(0)</small></strong></div></div></div><div className='your-rating'><div><strong>Hur var ditt besök?</strong><p>Klicka på stjärnorna för att betygsätta.</p></div><div className='rate-buttons' role='group' aria-label='Ditt betyg'>{[1, 2, 3, 4, 5].map(n => <button key={n} className={n <= value ? 'selected' : undefined} onClick={() => rate(n)} aria-label={`${n} ${n === 1 ? 'stjärna' : 'stjärnor'}`} aria-pressed={n === value}>{n <= value ? '★' : '☆'}</button>)}</div></div><p id='rating-feedback' className='feedback' aria-live='polite'>{feedback || (value ? `Ditt lokalt sparade betyg: ${value} av 5.` : '')}</p></section>;
}
function Overview() {
  return <><RatingCard/><section className='card about-restaurant'><span className='eyebrow orange-text'>ETT STÄLLE ATT TRIVAS PÅ</span><h2>Om Aladin pizza & kebab</h2><p>Aladin pizza & kebab är en restaurang i Karlskrona. Här hittar du pizza, kebab och något gott för både den lilla och den stora hungern.</p><p>Upptäck menyn med 115 rätter, sväng förbi på lunch eller få favoriterna levererade hem till dörren.</p><div className='feature-chips'>{[['◷', 'Lunch & middag'], ['◈', 'Medelpris'], ['↗', 'Hemleverans'], ['♧', 'Avhämtning']].map(([symbol, label]) => <span key={label}><span aria-hidden='true'>{symbol}</span> {label}</span>)}</div></section><section className='menu-preview'><div className='section-heading'><div><span className='eyebrow orange-text'>HITTA DIN FAVORIT</span><h2>Vad är du sugen på?</h2></div><a href='menu.html' className='text-link'>Utforska menyn <Arrow/></a></div><div className='food-grid'><a className='food-card' href='menu.html?category=Pizza'><img src='https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=650&q=85' alt='Nygräddad pizza med basilika' loading='lazy'/><div><h3>En riktigt god pizza</h3><span>Klassiker & nya favoriter <b aria-hidden='true'>↗</b></span></div></a><a className='food-card' href='menu.html?category=Kebab'><img src='https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=650&q=85' alt='Kebab med grönsaker och bröd' loading='lazy'/><div><h3>Lite extra av allt</h3><span>Kebab & rullar <b aria-hidden='true'>↗</b></span></div></a></div><p className='image-note'>Bilderna är inspirationsbilder.</p></section><section className='card faq'><h2>Vanliga frågor</h2><details><summary>Var ligger Aladin pizza & kebab?</summary><p>Du hittar restaurangen på Styrmansgatan 27, 371 36 Karlskrona. <a href='karta.html'>Visa på kartan.</a></p></details><details><summary>Kan jag beställa hemleverans?</summary><p>Ja, hemleverans erbjuds via Wolt. Se aktuellt leveransområde och tillgänglighet hos Wolt.</p></details><details><summary>När har restaurangen öppet?</summary><p>De angivna öppettiderna är 11:00–21:00 alla dagar. Ring gärna 0455-822 88 för att kontrollera avvikande öppettider.</p></details><details><summary>Finns det vegetariska alternativ?</summary><p>Menyn innehåller vegetariska pizzor. Kontakta restaurangen för aktuella alternativ, allergener och specialkost.</p></details></section><div className='visitor-note'><span className='visitor-icon' aria-hidden='true'>↗</span><div><strong>209 nyfikna matgäster</strong><span>har besökt sidan de senaste 30 dagarna</span></div><span className='little-pill'>Gott sällskap</span></div></>;
}
function Menu() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(() => {
    const initial = new URLSearchParams(window.location.search).get('category');
    return categories.includes(initial) ? initial : 'Alla';
  });
  useEffect(() => {
    const sync = () => {
      const next = new URLSearchParams(window.location.search).get('category');
      setCategory(categories.includes(next) ? next : 'Alla');
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  function chooseCategory(next) {
    setCategory(next);
    const url = new URL(window.location.href);
    if (next === 'Alla') url.searchParams.delete('category'); else url.searchParams.set('category', next);
    window.history.replaceState(null, '', url);
  }
  const items = dishes.filter(dish => (category === 'Alla' || dish[2] === category) && `${dish[0]} ${dish[1]}`.toLocaleLowerCase('sv').includes(query.toLocaleLowerCase('sv').trim()));
  return <><div className='section-heading'><div><span className='eyebrow orange-text'>FRÅN UGNEN TILL BORDET</span><h2>Hitta något gott</h2></div><span className='little-pill'>115 rätter</span></div><p className='muted'>Ett inspirerande urval från menyn. Kontakta restaurangen för aktuell meny, priser och allergener.</p><label className='input-search'><span aria-hidden='true'>⌕</span><input id='menu-search' type='search' placeholder='Sök efter en rätt eller ingrediens' aria-label='Sök i meny' value={query} onChange={event => setQuery(event.target.value)}/></label><div className='filter-row' id='menu-filters' role='group' aria-label='Menykategorier'>{categories.map(item => <button key={item} className={'filter' + (category === item ? ' active' : '')} aria-pressed={category === item} onClick={() => chooseCategory(item)}>{item}</button>)}</div><p id='menu-count' className='muted' aria-live='polite'>{items.length} rätter i urvalet{category === 'Alla' ? '' : ' · ' + category}</p><div id='menu-items' className='menu-items'>{items.length ? items.map(([name, description, type]) => <article className='menu-item' key={name}><span className='eyebrow'>{type}</span><h3>{name}</h3><p>{description}</p></article>) : <p className='soft-notice menu-empty'>Inga rätter hittades. Prova en annan sökning eller välj Alla.</p>}</div><div className='soft-notice'>Har du en allergi? Fråga alltid restaurangen om ingredienser innan du beställer. Utbudet kan ändras.</div></>;
}
function parseReviews(raw) {
  try {
    const reviews = JSON.parse(raw);
    return Array.isArray(reviews) ? reviews.filter(review => review && typeof review.name === 'string' && typeof review.review === 'string' && Number(review.rating) >= 1 && Number(review.rating) <= 5) : [];
  } catch { return []; }
}
function Reviews() {
  const [raw, saveReviews] = useStored('restrate-reviews', '[]');
  const reviews = parseReviews(raw);
  const [feedback, setFeedback] = useState('');
  const { toast } = useUI();
  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const review = { id: Date.now(), name: String(data.get('name')).trim(), rating: Number(data.get('rating')), review: String(data.get('review')).trim() };
    if (!review.name || review.review.length < 10 || review.rating < 1 || review.rating > 5) { setFeedback('Skriv ditt namn, välj betyg och skriv minst 10 tecken om din upplevelse.'); return; }
    const persisted = saveReviews(JSON.stringify([review, ...reviews]));
    if (persisted) form.reset();
    setFeedback(persisted ? 'Tack! Din recension har sparats som ett lokalt utkast. Den är inte publicerad.' : 'Utkastet visas här, men kunde inte sparas i webbläsaren. Kopiera texten innan du lämnar sidan.');
  }
  function remove(id) {
    const persisted = saveReviews(JSON.stringify(reviews.filter(review => review.id !== id)));
    toast(persisted ? 'Utkastet har tagits bort.' : 'Utkastet är dolt i denna vy. Lokal lagring kunde inte uppdateras.');
  }
  return <><section className='card'><span className='eyebrow orange-text'>MAT SMAKAR BÄTTRE TILLSAMMANS</span><h2>Vad tycker gästerna?</h2><div className='review-summary'><strong>4.5</strong><div><div className='stars' aria-label='4,5 av 5 stjärnor'>★★★★★</div><p className='muted'>26 betyg på Restrate</p></div></div><p>Har du ätit här? Dela din upplevelse och hjälp nästa gäst att hitta rätt.</p><a className='button primary' href='#review-form'>Skriv en recension <Arrow/></a></section><section className='card'><div className='section-heading'><h2>Recensioner</h2><span className='little-pill'>1</span></div><p className='muted'>En recension är registrerad. Recensionstexten är inte tillgänglig i denna förhandsvisning.</p><div id='saved-reviews'>{reviews.map(review => <article className='saved-review' key={review.id}><strong>{review.name}</strong><span className='eyebrow'>LOKALT UTKAST · INTE PUBLICERAD</span><div className='stars' aria-label={review.rating + ' av 5 stjärnor'}>{'★'.repeat(Math.floor(Number(review.rating)))}</div><p>{review.review}</p><button className='text-link plain-button' onClick={() => remove(review.id)}>Ta bort utkast</button></article>)}</div></section><section className='card'><h2>Hur var ditt besök?</h2><p className='muted'>Din recension sparas bara i den här webbläsaren i denna förhandsvisning. Den publiceras inte.</p><form id='review-form' className='stack-form' onSubmit={submit}><label>Ditt namn<input name='name' required maxLength={60} autoComplete='given-name' placeholder='Förnamn'/></label><label>Ditt betyg<select name='rating' required defaultValue=''><option value=''>Välj betyg</option><option value='5'>5 — Fantastiskt</option><option value='4'>4 — Riktigt bra</option><option value='3'>3 — Helt okej</option><option value='2'>2 — Kunde varit bättre</option><option value='1'>1 — Inte nöjd</option></select></label><label>Din upplevelse<textarea name='review' rows={5} required minLength={10} maxLength={1500} placeholder='Berätta om maten, servicen och stämningen...'/></label><button className='button primary' type='submit'>Spara recension lokalt <Arrow/></button><p id='review-feedback' className='feedback' aria-live='polite'>{feedback}</p></form></section></>;
}
function About() {
  const { openCookies } = useUI();
  return <><Breadcrumb items={[{ label: 'Hem', href: 'index.html' }, { label: 'Om oss' }]}/><section className='editorial-hero'><div><span className='eyebrow orange-text'>HELA SVERIGE. ALLA SMAKER.</span><h1>Nästa favoritställe<br/>finns runt hörnet.</h1><p>Vi tror att riktigt goda matupplevelser börjar med att hitta rätt. Därför finns Restrate — Sveriges moderna restaurangguide.</p><a className='button primary' href='stader.html'>Upptäck restauranger <Arrow/></a></div><img src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85' alt='Vackert dukade bord i en ljus restaurang'/></section><section className='values-grid'>{[['01', 'Hitta din smak', 'Från kvarterets pizzeria till kvällens nya upptäckt. Vi samlar restauranger så att du kan hitta, jämföra och välja.'], ['02', 'Gästernas perspektiv', 'Betyg och upplevelser hjälper fler att hitta rätt. Dela med dig av ditt besök och gör guiden lite bättre.'], ['03', 'Gratis. På riktigt.', 'Att upptäcka restauranger på Restrate kostar ingenting. Inga dolda avgifter — bara fler goda möjligheter.']].map(([number, title, text]) => <article className='card' key={number}><span className='value-number'>{number}</span><h2>{title}</h2><p>{text}</p></article>)}</section><section className='card prose' id='kontakt'><span className='eyebrow orange-text'>SÄG HEJ</span><h2>Vi hör gärna från dig</h2><p>Har du en fråga, vill du tipsa om en restaurang eller behöver du uppdatera uppgifter? Skriv till <a href='mailto:info@restrate.se'>info@restrate.se</a>.</p><p>Restrate · Västerås, Sverige</p><a className='button secondary' href='mailto:info@restrate.se?subject=Lägg%20till%20restaurang'>Tipsa om en restaurang <Arrow/></a></section><section className='card prose' id='integritet'><h2>Din integritet är viktig</h2><p>Den här statiska förhandsvisningen använder inga annons- eller analysskript. Dina val för tema, cookies, betyg och utkast till recensioner sparas lokalt i din webbläsare. Inga formulär skickas till en server.</p><p>Om du öppnar Wolt, kartan eller andra externa tjänster gäller deras egna integritetsvillkor. Bilder hämtas från Unsplash. Den inbäddade kartan laddas först när du väljer att visa den.</p><button className='button secondary' onClick={openCookies}>Ändra cookie-inställningar</button></section></>;
}
const cities = [['Karlskrona', 'UPPTÄCK BLEKINGE'], ['Stockholm', 'STORSTAD & SMÅ FAVORITER'], ['Göteborg', 'SMAKER PÅ VÄSTKUSTEN'], ['Malmö', 'HELA VÄRLDEN PÅ TALLRIKEN'], ['Västerås', 'VÅR HEMSTAD'], ['Uppsala', 'NYA MATUPPLEVELSER']];
function Cities() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('city') || '');
  const visible = cities.filter(([name]) => name.toLocaleLowerCase('sv').includes(query.toLocaleLowerCase('sv').trim()));
  return <><Breadcrumb items={[{ label: 'Hem', href: 'index.html' }, { label: 'Städer' }]}/><section className='page-intro'><span className='eyebrow orange-text'>EN VÄRLD AV SMAKER, NÄRA DIG</span><h1>Vart går vi och äter?</h1><p>Upptäck nya favoriter, en stad i taget.</p><label className='input-search city-search'><span aria-hidden='true'>⌕</span><input type='search' id='city-search' placeholder='Sök efter en stad' aria-label='Sök efter en stad' value={query} onChange={event => setQuery(event.target.value)}/></label></section><p className='sr-only' role='status'>{visible.length} städer matchar sökningen.</p><div className='city-grid' id='city-grid'>{visible.map(([name, tagline]) => name === 'Karlskrona' ? <a className='city-card featured-city' href='index.html' key={name}><img src='https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=800&q=85' alt='Svensk stadsmiljö vid vattnet'/><div><span className='eyebrow'>{tagline}</span><h2>Karlskrona <Arrow/></h2><p>Se Aladin pizza & kebab</p></div></a> : <article className='card city-placeholder' key={name}><span className='eyebrow'>{tagline}</span><h2>{name}</h2><p>Fler restauranger kommer snart.</p></article>)}</div>{!visible.length && <p id='city-empty' className='soft-notice'>Ingen stad matchade din sökning. Prova ett annat namn.</p>}<section className='guide-section' id='guider'><span className='eyebrow orange-text'>LITE INSPIRATION PÅ VÄGEN</span><h2>Små guider till goda stunder</h2><div className='values-grid'><article className='card'><span className='value-number' aria-hidden='true'>↗</span><h3>En enkel kväll för två</h3><p>Välj varsin favoritpizza, dela på en sallad och låt middagen ta tid. Det behöver inte vara svårare än så.</p><a className='text-link' href='menu.html?category=Pizza'>Hitta era pizzor <Arrow/></a></article><article className='card'><span className='value-number' aria-hidden='true'>◷</span><h3>Lunchen, utan krångel</h3><p>Kolla öppettiderna innan du går. Aladin pizza & kebab öppnar klockan 11 och passar även för avhämtning.</p><a className='text-link' href='index.html#hours'>Se öppettider <Arrow/></a></article><article className='card'><span className='value-number' aria-hidden='true'>⌖</span><h3>Följ din spontanitet</h3><p>En promenad och något gott att äta. Hitta vägen till Styrmansgatan och upptäck ett ställe i Karlskrona.</p><a className='text-link' href='karta.html'>Öppna kartan <Arrow/></a></article></div></section></>;
}
function MapPage() {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef(null);
  useEffect(() => { if (loaded) iframeRef.current?.focus(); }, [loaded]);
  return <><Breadcrumb items={[{ label: 'Hem', href: 'index.html' }, { label: 'Aladin pizza & kebab', href: 'index.html' }, { label: 'Karta' }]}/><section className='page-intro'><span className='eyebrow orange-text'>DITT NÄSTA STOPP</span><h1>Vi ses på Styrmansgatan.</h1><p>Hitta till Aladin pizza & kebab i Karlskrona.</p></section><div className='map-layout'><section className='card map-contact'><span className='status'><i/> Pizza & kebab</span><h2>Aladin pizza & kebab</h2><p>Styrmansgatan 27<br/>371 36 Karlskrona, Sverige</p><a href='tel:045582288' className='contact-phone'>0455-822 88</a><p>Alla dagar · 11:00–21:00</p><a className='button primary' href='https://www.google.com/maps/dir/?api=1&destination=Styrmansgatan+27+Karlskrona' target='_blank' rel='noopener noreferrer'>Få vägbeskrivning <Arrow/></a><a className='text-link' href='index.html'>← Till restaurangen</a></section><section className='large-map map-art' id='interactive-map' aria-label='Restaurangkarta'>{loaded ? <iframe ref={iframeRef} title='Karta över Karlskrona. Använd vägbeskrivningslänken för exakt adress.' src='https://www.openstreetmap.org/export/embed.html?bbox=15.565%2C56.155%2C15.615%2C56.183&layer=mapnik' loading='eager' referrerPolicy='no-referrer'/> : <><MapArt/><div className='map-load-panel'><span className='pin' aria-hidden='true'>r.</span><h2>Hitta hela vägen fram</h2><p>Ladda en interaktiv karta från OpenStreetMap.<br/>Din IP-adress delas då med kartleverantören.</p><button className='button primary' id='load-map' onClick={() => setLoaded(true)}>Visa interaktiv karta <Arrow/></button></div></>}</section></div></>;
}
export default function App() {
  const [theme, saveTheme] = useStored('restrate-theme', 'light');
  const [consent, saveConsent] = useStored('restrate-consent', '');
  const [cookiesOpen, setCookiesOpen] = useState(!consent);
  const [cookieFocus, setCookieFocus] = useState(0);
  const cookieReturn = useRef(null);
  const [dialog, setDialog] = useState(null);
  const [message, setMessage] = useState('');
  const toastTimer = useRef(null);
  const time = useStockholmTime();
  useEffect(() => { document.body.classList.toggle('dark', theme === 'dark'); }, [theme]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    const scrollToHash = () => {
      if (!window.location.hash) return;
      try { document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView(); } catch { /* Invalid URL fragment. */ }
    };
    const frame = requestAnimationFrame(scrollToHash);
    window.addEventListener('hashchange', scrollToHash);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', scrollToHash); };
  }, []);
  function toast(text) {
    clearTimeout(toastTimer.current);
    setMessage(text);
    toastTimer.current = setTimeout(() => setMessage(''), 5000);
  }
  function changeTheme() {
    if (!saveTheme(theme === 'dark' ? 'light' : 'dark')) toast('Temat ändrades, men kunde inte sparas i webbläsaren.');
  }
  function openCookies() {
    cookieReturn.current = document.activeElement;
    setCookiesOpen(true);
    setCookieFocus(value => value + 1);
  }
  const restaurantPage = ['overview', 'menu', 'reviews'].includes(page);
  const content = { overview: <Overview/>, menu: <Menu/>, reviews: <Reviews/>, about: <About/>, cities: <Cities/>, map: <MapPage/> }[page] || <Overview/>;
  return <UIContext.Provider value={{ theme, changeTheme, dialog, setDialog, message, toast, time, cookiesOpen, setCookiesOpen, saveConsent, openCookies, cookieFocus, cookieReturn }}><a className='skip' href='#main'>Hoppa till innehåll</a><Header/><main id='main' className='container' tabIndex={-1}>{restaurantPage ? <><RestaurantHeading/><div className='content-grid'><div className='main-column'>{content}</div><Sidebar/></div></> : content}</main>{restaurantPage && <OwnerStrip/>}<Footer/><GlobalUI/></UIContext.Provider>;
}
