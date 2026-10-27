export const money = (value: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export const collectionUrl = (name: string): string => name === 'New Arrivals' ? '/products?new=true' : name === 'Curated Gifts' ? '/products?gift=true' : `/products?collection=${encodeURIComponent(name)}`;
