import { InvalidRoleType } from './exceptions/InvalidRoleType';

export class Role {
  public name: string;

  constructor(role: string) {
    const validRole = RoleType.includes(role);
    if (!validRole) throw new InvalidRoleType(role);
    this.name = role;
  }
}

const RoleType = [
  'Usuário',
  'Controlador de Acesso',
  'Atendente',
  'Responsável por Atendente',
  'Coordenação de Serviço',
  'Gestão CEIP',
];
