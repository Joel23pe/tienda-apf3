import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Producto } from '../../core/models/models';
import { ProductoService } from '../../core/services/producto.service';

@Component({
  selector: 'app-producto-list',
  imports: [RouterLink],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.scss'
})
export class ProductoListComponent {
  private service = inject(ProductoService);

  productos = signal<Producto[]>([]);
  error = signal('');
  cargando = signal(true);

  constructor() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.service.listar().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.cargando.set(false);
      }
    });
  }

  eliminar(p: Producto) {
    if (!p.id || !confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.error.set('');
    this.service.eliminar(p.id).subscribe({
      next: () => this.cargar(),
      error: (e: Error) => this.error.set(e.message)
    });
  }
}