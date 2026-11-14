import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Producto } from '../../core/models/models';

@Component({
  selector: '[app-producto-fila]',
  imports: [RouterLink],
  templateUrl: './producto-fila.component.html',
  styleUrl: './producto-fila.component.scss'
})
export class ProductoFilaComponent {
  @Input({ required: true }) producto!: Producto;
  @Output() eliminar = new EventEmitter<Producto>();
}