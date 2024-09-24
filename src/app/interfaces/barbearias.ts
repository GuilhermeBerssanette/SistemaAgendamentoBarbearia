import {Barbeiros} from "./barbeiros";

export interface Barbearias {

  // Dados da barbearia
  nomeFantasia: string,
  razaoSocial: string,

  // PF ou PJ
  cpf: string,
  cnpj: string,
  rg: string,
  inscricaoEstadual: string,

  // Endereço
  estado: string,
  cidade: string,
  rua: string,
  numero: string,

  // Contato
  email: string,
  celular: string,
  whats: string,
  telefone: string,

  // Redes Sociais
  instagram: string,
  facebook: string,
  tiktok: string,
  twitter: string,

  // Comodidades
  comodidades: string,

  // Barbeiros
  barbers?: Barbeiros[]
}

