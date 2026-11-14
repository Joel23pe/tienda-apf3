import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { AlertaComponent } from '../../shared/alerta/alerta.component';

@Component({
  selector: 'app-producto-form',
  imports: [ReactiveFormsModule, RouterLink, AlertaComponent],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.scss'
})
export class ProductoFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(ProductoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = Number(this.route.snapshot.paramMap.get('id')) || null;
  error = signal('');
  guardando = signal(false);

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]]
  });

  constructor() {
    if (this.id) {
      this.service.obtener(this.id).subscribe({
        next: (p) => this.form.patchValue({ nombre: p.nombre, precio: p.precio, stock: p.stock }),
        error: (e: Error) => this.error.set(e.message)
      });
    }
  }

  invalido(campo: 'nombre' | 'precio' | 'stock') {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    const datos = this.form.getRawValue();
    const peticion = this.id ? this.service.actualizar(this.id, datos) : this.service.crear(datos);
    peticion.subscribe({
      next: () => this.router.navigate(['/productos']),
      error: (e: Error) => {
        this.error.set(e.message);
        this.guardando.set(false);
      }
    });
  }
}