export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}