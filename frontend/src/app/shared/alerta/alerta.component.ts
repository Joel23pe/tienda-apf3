import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrl: './alerta.component.scss'
})
export class AlertaComponent {
  @Input() mensaje = '';
  @Output() cerrar = new EventEmitter<void>();
}