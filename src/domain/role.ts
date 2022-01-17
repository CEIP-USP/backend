import { InvalidRoleType } from './exceptions/InvalidRoleType';

export class Role {
  public name: string;

  constructor(role: string) {
    const validRole = RoleType.includes(role);
    if (!validRole) throw new InvalidRoleType(role);
    this.name = role;
  }
}

export enum RoleTypes {
  USUARIO = 'Usuário',
  CONTROLADOR_DE_ACESSO = 'Controlador de Acesso',
  ATENDENTE = 'Atendente',
  RESPONSAVEL_POR_ATENDENTE = 'Responsável por Atendente',
  COORDENACAO_DE_SERVICO = 'Coordenação de Serviço',
  GESTAO_CEIP = 'Gestão CEIP',
}

const RoleType = Object.values(RoleTypes) as string[];
