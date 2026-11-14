import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertaComponent } from '../../shared/alerta/alerta.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, AlertaComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal('');
  cargando = signal(false);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  invalido(campo: 'username' | 'password') {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/productos']),
      error: (e: Error) => {
        this.error.set(e.message);
        this.cargando.set(false);
      }
    });
  }
}