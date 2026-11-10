import { Product } from './product';

type Seed = Omit<Product, 'description' | 'minStock'> & { minStock?: number; description?: string };

const textos: Record<string, string> = {
  'Rações': 'Ração completa e balanceada, formulada para a espécie e a fase de vida indicadas. Mude a alimentação aos poucos, em 7 dias.',
  'Sachês': 'Alimento úmido para variar o cardápio e estimular a hidratação. Pode ser usado como complemento da ração.',
  'Petiscos': 'Petisco para o momento de carinho e de treino. Ofereça com moderação, sem substituir a refeição.',
  'Higiene': 'Produto de higiene para manter a rotina de cuidados em dia, com praticidade.',
  'Brinquedos': 'Para gastar energia, brincar junto e deixar a rotina mais divertida. Supervisione a brincadeira.',
  'Coleiras': 'Passeio com conforto e segurança. Confira o tamanho ideal antes de escolher.',
  'Caminhas': 'Um cantinho macio e quentinho para o descanso do seu pet.',
  'Comedouros e bebedouros': 'Praticidade na hora de comer e beber, fácil de limpar e de manter em casa.',
};

const seed: Seed[] = [
  // ---- Cães: rações
  { id: 'golden-adultos', name: 'Golden Fórmula Cães Adultos', brand: 'Golden', pet: 'Cães', category: 'Rações', fase: 'Adultos', detail: 'Frango e arroz • 15 kg', price: 149.9, cost: 112, stock: 24, image: 'img/p-golden-adultos.jpg', featured: true },
  { id: 'golden-filhotes', name: 'Golden Fórmula Cães Filhotes', brand: 'Golden', pet: 'Cães', category: 'Rações', fase: 'Filhotes', detail: 'Frango e arroz • 15 kg', price: 164.9, cost: 125, stock: 12, image: 'img/p-golden-filhotes.jpg', featured: true },
  { id: 'magnus-adultos', name: 'Magnus Todo Dia Cães Adultos', brand: 'Magnus', pet: 'Cães', category: 'Rações', fase: 'Adultos', detail: 'Carne • 15 kg', price: 119.9, cost: 88, stock: 31, image: 'img/p-magnus.jpg', featured: true },
  { id: 'pedigree-adultos', name: 'Pedigree Cães Adultos', brand: 'Pedigree', pet: 'Cães', category: 'Rações', fase: 'Adultos', detail: 'Carne e vegetais • 10,1 kg', price: 139.9, cost: 102, stock: 18, image: 'img/p-pedigree-adultos.jpg' },
  { id: 'pedigree-filhotes', name: 'Pedigree Cães Filhotes', brand: 'Pedigree', pet: 'Cães', category: 'Rações', fase: 'Filhotes', detail: 'Frango e leite • 10,1 kg', price: 149.9, cost: 110, stock: 3, minStock: 6, image: 'img/p-pedigree-filhotes.jpg' },
  { id: 'purina-dog-chow', name: 'Dog Chow Adultos Raças Médias', brand: 'Purina', pet: 'Cães', category: 'Rações', fase: 'Adultos', detail: 'Carne, frango e arroz • 15 kg', price: 159.9, cost: 120, stock: 9, image: 'img/p-dog-chow.jpg' },
  // ---- Cães: petiscos, higiene, acessórios
  { id: 'biscoito-magnus', name: 'Biscoito Magnus Mix', brand: 'Magnus', pet: 'Cães', category: 'Petiscos', fase: 'Adultos', detail: 'Mix de sabores • 500 g', price: 16.9, cost: 9.5, stock: 1, minStock: 6, image: 'img/p-biscoito-magnus.jpg' },
  { id: 'ossinho-natural', name: 'Osso natural para cães', brand: 'Petisco Bom', pet: 'Cães', category: 'Petiscos', fase: 'Todas as fases', detail: 'Couro bovino • 3 unidades', price: 24.9, cost: 14, stock: 40, image: 'img/p-osso.jpg' },
  { id: 'bifinho-frango', name: 'Bifinho de frango', brand: 'Petisco Bom', pet: 'Cães', category: 'Petiscos', fase: 'Adultos', detail: 'Frango • 65 g', price: 8.9, cost: 4.8, stock: 58, image: 'img/p-bifinho.jpg' },
  { id: 'shampoo-neutro', name: 'Shampoo neutro para cães e gatos', brand: 'PetClean', pet: 'Cães', category: 'Higiene', fase: 'Todas as fases', detail: 'Neutro • 500 ml', price: 22.9, cost: 12.4, stock: 36, image: 'img/p-shampoo.jpg' },
  { id: 'tapete-higienico', name: 'Tapete higiênico', brand: 'PetClean', pet: 'Cães', category: 'Higiene', fase: 'Todas as fases', detail: '30 unidades • 60 x 90 cm', price: 69.9, cost: 44, stock: 22, image: 'img/p-tapete.jpg' },
  { id: 'escova-dental', name: 'Kit escova e pasta dental', brand: 'PetClean', pet: 'Cães', category: 'Higiene', fase: 'Todas as fases', detail: 'Sabor carne • 70 g', price: 31.9, cost: 18, stock: 14, image: 'img/p-escova.jpg' },
  { id: 'bola-borracha', name: 'Bola de borracha para cães', brand: 'Pet Games', pet: 'Cães', category: 'Brinquedos', fase: 'Todas as fases', detail: 'Borracha • 7,5 cm • Azul', price: 29.9, cost: 15, stock: 26, image: 'img/p-bola.jpg' },
  { id: 'mordedor-corda', name: 'Mordedor de corda', brand: 'Pet Games', pet: 'Cães', category: 'Brinquedos', fase: 'Todas as fases', detail: 'Algodão • 30 cm', price: 19.9, cost: 9, stock: 17, image: 'img/p-corda.jpg' },
  { id: 'coleira-nylon-m', name: 'Coleira de nylon M', brand: 'Pet Games', pet: 'Cães', category: 'Coleiras', fase: 'Adultos', detail: 'Ajustável • Vermelha', price: 27.9, cost: 14, stock: 33, image: 'img/p-coleira.jpg' },
  { id: 'peitoral-g', name: 'Peitoral acolchoado G', brand: 'Pet Games', pet: 'Cães', category: 'Coleiras', fase: 'Adultos', detail: 'Ajustável • Preto', price: 54.9, cost: 30, stock: 11, image: 'img/p-peitoral.jpg' },
  { id: 'caminha-europa-gg', name: 'Caminha Europa GG', brand: 'Casa Pet', pet: 'Cães', category: 'Caminhas', fase: 'Adultos', detail: 'Lavável • 90 x 70 cm', price: 189.9, cost: 120, stock: 0, minStock: 6, image: 'img/p-caminha.jpg' },
  { id: 'caminha-nuvem-m', name: 'Caminha Nuvem M', brand: 'Casa Pet', pet: 'Cães', category: 'Caminhas', fase: 'Todas as fases', detail: 'Pelúcia • 60 x 50 cm', price: 99.9, cost: 58, stock: 15, image: 'img/p-caminha-nuvem.jpg' },
  { id: 'comedouro-inox', name: 'Comedouro de inox', brand: 'Casa Pet', pet: 'Cães', category: 'Comedouros e bebedouros', fase: 'Todas as fases', detail: 'Antiderrapante • 946 ml', price: 34.9, cost: 19, stock: 29, image: 'img/p-comedouro.jpg' },
  { id: 'bebedouro-fonte', name: 'Bebedouro tipo fonte', brand: 'Casa Pet', pet: 'Gatos', category: 'Comedouros e bebedouros', fase: 'Todas as fases', detail: 'Bivolt • 2 L', price: 129.9, cost: 78, stock: 7, image: 'img/p-fonte.jpg' },
  // ---- Gatos
  { id: 'premier-castrados', name: 'PremieR Gatos Castrados', brand: 'PremieR', pet: 'Gatos', category: 'Rações', fase: 'Castrados', detail: 'Salmão • 7,5 kg', price: 89.9, cost: 64, stock: 20, image: 'img/p-premier-castrados.jpg', featured: true },
  { id: 'premier-filhotes-gato', name: 'PremieR Gatos Filhotes', brand: 'PremieR', pet: 'Gatos', category: 'Rações', fase: 'Filhotes', detail: 'Frango • 7,5 kg', price: 99.9, cost: 72, stock: 13, image: 'img/p-premier-filhotes.jpg' },
  { id: 'golden-gatos-adultos', name: 'Golden Gatos Adultos', brand: 'Golden', pet: 'Gatos', category: 'Rações', fase: 'Adultos', detail: 'Frango • 10,1 kg', price: 129.9, cost: 95, stock: 16, image: 'img/p-golden-gatos.jpg' },
  { id: 'whiskas-adultos', name: 'Whiskas Gatos Adultos', brand: 'Whiskas', pet: 'Gatos', category: 'Rações', fase: 'Adultos', detail: 'Carne • 10,1 kg', price: 119.9, cost: 86, stock: 5, minStock: 6, image: 'img/p-whiskas.jpg' },
  { id: 'sache-atum', name: 'Sachê Whiskas Atum ao molho', brand: 'Whiskas', pet: 'Gatos', category: 'Sachês', fase: 'Adultos', detail: 'Atum • 85 g', price: 3.9, cost: 2.2, stock: 120, image: 'img/p-sache-atum.jpg' },
  { id: 'sache-frango-filhote', name: 'Sachê para gatos filhotes', brand: 'Whiskas', pet: 'Gatos', category: 'Sachês', fase: 'Filhotes', detail: 'Frango • 85 g', price: 3.9, cost: 2.2, stock: 96, image: 'img/p-sache-filhote.jpg' },
  { id: 'sache-castrados', name: 'Sachê para gatos castrados', brand: 'Whiskas', pet: 'Gatos', category: 'Sachês', fase: 'Castrados', detail: 'Peixe • 85 g', price: 4.2, cost: 2.5, stock: 84, image: 'img/p-sache-castrados.jpg' },
  { id: 'areia-sanitaria', name: 'Areia sanitária granulada', brand: 'PetClean', pet: 'Gatos', category: 'Higiene', fase: 'Todas as fases', detail: 'Perfumada • 4 kg', price: 24.9, cost: 14, stock: 45, image: 'img/p-areia.jpg' },
  { id: 'bebedouro-gato', name: 'Bebedouro para gatos', brand: 'Casa Pet', pet: 'Gatos', category: 'Comedouros e bebedouros', fase: 'Todas as fases', detail: 'Plástico • 400 ml', price: 21.9, cost: 11, stock: 0, minStock: 6, image: 'img/p-bebedouro-gato.jpg' },
  { id: 'arranhador', name: 'Arranhador com poste', brand: 'Casa Pet', pet: 'Gatos', category: 'Brinquedos', fase: 'Todas as fases', detail: 'Sisal • 50 cm', price: 79.9, cost: 46, stock: 8, image: 'img/p-arranhador.jpg' },
  { id: 'varinha-penas', name: 'Varinha com penas', brand: 'Pet Games', pet: 'Gatos', category: 'Brinquedos', fase: 'Todas as fases', detail: 'Penas • 45 cm', price: 14.9, cost: 6.5, stock: 38, image: 'img/p-varinha.jpg' },
  { id: 'caminha-gato', name: 'Caminha iglu para gatos', brand: 'Casa Pet', pet: 'Gatos', category: 'Caminhas', fase: 'Todas as fases', detail: 'Pelúcia • 40 cm', price: 89.9, cost: 52, stock: 6, image: 'img/p-iglu.jpg' },
  { id: 'petisco-gato', name: 'Petisco cremoso para gatos', brand: 'Whiskas', pet: 'Gatos', category: 'Petiscos', fase: 'Todas as fases', detail: 'Salmão • 4 x 15 g', price: 9.9, cost: 5.5, stock: 52, image: 'img/p-petisco-gato.jpg' },
  { id: 'coleira-gato', name: 'Coleira com guizo', brand: 'Pet Games', pet: 'Gatos', category: 'Coleiras', fase: 'Todas as fases', detail: 'Ajustável • Rosa', price: 12.9, cost: 6, stock: 27, image: 'img/p-coleira-gato.jpg' },
  // ---- Roedores
  { id: 'nutropica-hamster', name: 'Nutrópica Hamster', brand: 'Nutrópica', pet: 'Roedores', category: 'Rações', fase: 'Adultos', detail: 'Alimento extrusado • 300 g', price: 29.9, cost: 17, stock: 0, minStock: 6, image: 'img/p-nutropica.jpg' },
  { id: 'feno-coelho', name: 'Feno para coelhos e porquinhos', brand: 'Nutrópica', pet: 'Roedores', category: 'Rações', fase: 'Todas as fases', detail: 'Capim • 500 g', price: 19.9, cost: 10.5, stock: 19, image: 'img/p-feno.jpg' },
  // ---- Aves silvestres
  { id: 'alcon-curio', name: 'Alcon Club Curió', brand: 'Alcon', pet: 'Aves silvestres', category: 'Rações', fase: 'Adultos', detail: 'Alimento para curiós • 325 g', price: 24.9, cost: 14.5, stock: 10, image: 'img/p-alcon.jpg' },
  { id: 'alcon-trinca', name: 'Alcon Club Trinca-ferro', brand: 'Alcon', pet: 'Aves silvestres', category: 'Rações', fase: 'Adultos', detail: 'Alimento extrusado • 300 g', price: 23.9, cost: 14, stock: 8, image: 'img/p-alcon-trinca.jpg' },
];

export const SEED_PRODUCTS: Product[] = seed.map((s) => ({
  minStock: 6,
  ...s,
  description: s.description ?? textos[s.category] ?? '',
}));
