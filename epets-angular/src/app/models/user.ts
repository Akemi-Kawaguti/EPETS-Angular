export type Papel = 'admin' | 'cliente';

export interface Usuario {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Papel;
}