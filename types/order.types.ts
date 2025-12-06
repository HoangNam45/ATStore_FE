export interface CheckoutData {
  accountId: string;
  accountType: string;
  game: string;
  server?: string;
  categoryName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  displayImage: string;
}

export interface CreateOrderRequest {
  accountId: string;
  accountType: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  email: string;
  game: string;
  server: string;
  displayImage: string;
  userId?: string;
}

export interface Order {
  orderId: string;
  checkoutCode: string;
  accountId: string;
  accountType: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  email: string;
  game: string;
  server: string;
  displayImage: string;
  userId?: string;
  status: "pending" | "paid" | "expired" | "cancelled";
  qrCodeUrl?: string;
  createdAt: { _seconds: number; _nanoseconds: number };
  expiresAt: { _seconds: number; _nanoseconds: number };
  updatedAt: { _seconds: number; _nanoseconds: number };
}

export interface BankInfo {
  bankName: string;
  accountNo: string;
  accountName: string;
}
