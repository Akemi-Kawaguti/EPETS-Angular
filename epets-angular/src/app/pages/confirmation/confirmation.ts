import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { OrderService } from '../../services/orders';

@Component({
  selector: 'app-confirmation',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation {
  private readonly route = inject(ActivatedRoute);
  private readonly orders = inject(OrderService);
  private readonly id = toSignal(this.route.paramMap.pipe(map((m) => m.get('id') ?? '')), { requireSync: true });

  protected readonly order = computed(() => this.orders.byId(this.id()));
  protected readonly pagamento = computed(() => {
    const p = this.order()?.pagamento;
    return p === 'pix' ? 'Pix' : p === 'cartao' ? 'Cartão de crédito' : 'Dinheiro na entrega/retirada';
  });
}
