import { Inject, Injectable } from '@nestjs/common';
import { Repositoties } from 'src/utils/constants';
import {
  CreateRoleDto,
  CreateRoleResponseDto,
} from 'src/api/role/dtos/addRoleDtos';
import {
  UpdateRoleDto,
  UpdateRoleResponseDto,
} from 'src/api/role/dtos/updateRoleDtos';
import { Repository } from 'typeorm';
import { IRole } from './interfaces';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @Inject(Repositoties.ROLE)
    private roleRepository: Repository<Role>,
  ) {}

  public async createRole(dto: CreateRoleDto): Promise<CreateRoleResponseDto> {
    const response = await this.roleRepository
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values({
        name: dto.name,
        description: dto.description,
      })
      .execute();
    return{
      message: "Success",
      affectedRow: response.identifiers[0].id,
    }
  }

  public async updateRole(
    dto: UpdateRoleDto,
    roleId: number,
  ): Promise<UpdateRoleResponseDto> {
    const response = await this.roleRepository
      .createQueryBuilder('Role')
      .update(Role)
      .set(dto)
      .where('Role.id = :roleId', { roleId: roleId })
      .execute();
    return { affectedRow: response.affected };
  }

  public async deleteRole(roleId: number): Promise<number> {
    const response = await this.roleRepository
      .createQueryBuilder('role')
      .delete()
      .from(Role)
      .where('role.id = :roleId', { roleId: roleId })
      .execute();

    return response.affected;
  }
  /*
  Below functions aim to collect data from database
*/

  public async findRoleByName(name: string): Promise<IRole> {
    const response: IRole = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name = :roleName', { roleName: name })
      .getOne();

    return response;
  }

  public async findRoles(): Promise<IRole[]> {
    const response: IRole[] = await this.roleRepository
      .createQueryBuilder('role')
      .getMany();
    return response;
  }

  public async findRoleByCondition(condition: object): Promise<IRole[]> {
    const response: IRole[] = await this.roleRepository.findBy(condition);
    return response;
  }
}
