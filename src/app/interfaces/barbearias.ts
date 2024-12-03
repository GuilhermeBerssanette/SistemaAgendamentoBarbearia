import {Barbeiros} from "./barbeiros";

export interface Barbearias {

  nomeFantasia: string,
  razaoSocial: string,
  responsavel: string,

  cpf: string,
  cnpj: string,
  rg: string,
  inscricaoEstadual: string,

  estado: string,
  cidade: string,
  rua: string,
  numero: string,

  email: string,
  celular: string,
  whats: string,
  telefone: string,

  instagram: string,
  facebook: string,
  tiktok: string,
  twitter: string,

  comodidades: string,

  barbers?: Barbeiros[],

  profileImageUrl: string,

  ownerId: string
}

