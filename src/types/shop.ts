export interface Product {
  id: string; slug: string; name: string; price: number; collection: string; material: string; dimensions: string; description: string; image: string; gallery: string[]; featured: boolean; isNew: boolean; added: number;
}
export interface CartItem { product: Product; quantity: number }
