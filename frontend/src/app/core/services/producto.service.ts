import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Producto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private url = '/api/productos';

  listar() { return this.http.get<Producto[]>(this.url); }
  obtener(id: number) { return this.http.get<Producto>(`${this.url}/${id}`); }
  crear(p: Producto) { return this.http.post<Producto>(this.url, p); }
  actualizar(id: number, p: Producto) { return this.http.put<Producto>(`${this.url}/${id}`, p); }
  eliminar(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}