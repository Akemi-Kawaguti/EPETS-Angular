import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductImg } from '../../components/product-img';
import { ProductService } from '../../services/products';
import { StockService } from '../../services/stock';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe, DatePipe, DecimalPipe, ProductImg],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected readonly products = inject(ProductService);
  private readonly stock = inject(StockService);

  protected readonly saudacao = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  })();

  protected readonly chart = computed(() => {
    const data = this.products.stockByCategory();
    const max = Math.max(1, ...data.map((d) => d.value));
    return data.map((d) => ({ ...d, pct: Math.max(2, (d.value / max) * 100) }));
  });
  protected readonly recent = computed(() => this.stock.list().slice(0, 5));

  /** baixa um CSV (separador ; e BOM, abre direto no Excel em português) */
  protected exportar(): void {
    const head = ['Código', 'Produto', 'Marca', 'Pet', 'Categoria', 'Preço', 'Custo', 'Estoque', 'Mínimo'];
    const fmt = (n: number) => n.toFixed(2).replace('.', ',');
    const rows = this.products.items().map((p) => [p.id, p.name, p.brand, p.pet, p.category, fmt(p.price), fmt(p.cost), p.stock, p.minStock]);
    const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `estoque-epets-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
