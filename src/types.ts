export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stockQuantity: number;
  minStock: number;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNeighborhood: string;
  customerCity: string;
  customerComplement: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  date: string;
  paymentMethod: string;
  observations: string;
}

export interface BusinessSettings {
  name: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  deliveryFee: number;
  minOrder: number;
  openingHours: string;
}
