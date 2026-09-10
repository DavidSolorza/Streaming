export interface CartItem {
  cartItemId: string;
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
}
