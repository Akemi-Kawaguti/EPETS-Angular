# E’PETS — PI Front (Angular)

Loja de rações e acessórios + painel admin, seguindo o protótipo do Figma Make.

## Rodar

```bash
npm install
npm start        # http://localhost:4200
```

## Telas

| Rota | Tela | Pasta |
|---|---|---|
| `/` | Home | `pages/home` |
| `/catalogo` | Catálogo (filtros, busca, ordenação) | `pages/catalog` |
| `/produto/:id` | Detalhe do produto | `pages/product-detail` |
| `/sacola` | Sacola | `pages/cart` |
| `/checkout` | Finalizar compra | `pages/checkout` |
| `/confirmacao/:id` | Pedido confirmado | `pages/confirmation` |
| `/admin` | Visão geral | `admin/dashboard` |
| `/admin/produtos` | CRUD de produtos | `admin/products` |
| `/admin/movimentacoes` | Entradas, saídas e ajustes | `admin/movements` |

Layout: `layout/header`, `layout/footer`, `layout/shop-layout` (loja) e `layout/admin-layout` (admin).
Componente reutilizável: `components/product-card`.

## Dados (por enquanto no navegador)

`services/products.ts`, `cart.ts`, `stock.ts` e `orders.ts` guardam tudo no `localStorage`.
Quando o back-end (Spring Boot) estiver pronto, troque o corpo dos métodos desses services por
chamadas `HttpClient` — as telas não precisam mudar.

- Finalizar um pedido dá baixa no estoque e aparece como **Saída** em Movimentações.
- Para voltar aos dados de exemplo: limpe o localStorage do site (F12 → Application).

## Fotos dos produtos

Coloque as fotos em `public/img/` com os nomes de `src/app/models/seed.ts`
(ex.: `p-golden-adultos.jpg`). Enquanto não existirem, aparece um placeholder.
