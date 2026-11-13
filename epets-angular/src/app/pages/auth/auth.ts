import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../services/auth';

type Modo = 'entrar' | 'cadastro';

function senhasIguais(g: AbstractControl): ValidationErrors | null {
  return g.get('senha')?.value === g.get('confirmar')?.value ? null : { diferentes: true };
}

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthPage {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** 'entrar' ou 'cadastro', definido na rota */
  protected readonly modo = toSignal(this.route.data.pipe(map((d) => (d['modo'] as Modo) ?? 'entrar')), {
    requireSync: true,
  });

  protected readonly formEntrar = this.fb.group({
    id: ['', [Validators.required]],
    senha: ['', [Validators.required]],
    lembrar: [true],
  });

  protected readonly formCadastro = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]{3,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(4)]],
      confirmar: ['', [Validators.required]],
      termos: [false, [Validators.requiredTrue]],
    },
    { validators: senhasIguais },
  );

  protected readonly verSenha = signal(false);
  protected readonly verConfirmar = signal(false);
  protected readonly enviando = signal(false);
  protected readonly erro = signal('');
  protected readonly aviso = signal('');

  protected invalido(c: AbstractControl): boolean {
    return c.invalid && c.touched;
  }

  protected confirmarInvalido(): boolean {
    const c = this.formCadastro.controls.confirmar;
    return c.touched && (c.invalid || this.formCadastro.hasError('diferentes'));
  }

  protected esqueci(): void {
    this.aviso.set('Demonstração: a recuperação de senha será ligada quando a API existir.');
  }

  protected async entrar(): Promise<void> {
    this.erro.set('');
    this.aviso.set('');
    if (this.formEntrar.invalid) {
      this.formEntrar.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    const v = this.formEntrar.getRawValue();
    const r = await this.auth.login(v.id, v.senha, v.lembrar);
    this.enviando.set(false);

    if (!r.ok) {
      this.erro.set(r.erro);
      return;
    }
    this.router.navigateByUrl(this.destino(r.user.role === 'admin'));
  }

  protected async cadastrar(): Promise<void> {
    this.erro.set('');
    if (this.formCadastro.invalid) {
      this.formCadastro.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    const v = this.formCadastro.getRawValue();
    const r = await this.auth.cadastrar({
      name: v.name,
      username: v.username,
      email: v.email,
      password: v.senha,
    });
    this.enviando.set(false);

    if (!r.ok) {
      this.erro.set(r.erro);
      return;
    }
    this.router.navigateByUrl(this.destino(false));
  }

  /** admin vai para o painel; cliente volta para onde estava (ou para a loja) */
  private destino(admin: boolean): string {
    const pedido = this.route.snapshot.queryParamMap.get('redirect') ?? '';
    const seguro = pedido.startsWith('/') && !pedido.startsWith('//');
    if (seguro && (admin || !pedido.startsWith('/admin'))) return pedido;
    return admin ? '/admin' : '/';
  }
}