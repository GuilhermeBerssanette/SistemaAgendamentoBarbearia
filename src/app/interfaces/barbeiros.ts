export interface Barbeiros {
  id: string;
  nome: string;
  rg: string;
  cpf: string;
  telefone: string;
  whats: string;
  email: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
  atendeAutista: boolean;
  atendeCrianca: boolean;
  atendeDomicilio: boolean;
  experienciaCrespo: boolean;
  servicoEventos: boolean;
  galleryItem?: {
    imageUrl: string;
    comment: string;
  }[];
  services?: {
    nome: string;
    duracao: number;
    preco: number;
  }[];
  profileImageUrl: string,
}
