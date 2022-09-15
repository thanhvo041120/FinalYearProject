import { Inject, Injectable } from '@nestjs/common';
import { Repositoties } from 'src/utils/constants';
import { CreateRoleDto } from 'src/utils/dtos/roles/addRoleDtos';
import { UpdateRoleDto } from 'src/utils/dtos/roles/updateRoleDtos';
import { Repository } from 'typeorm';
import { IRole } from './interfaces';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
    constructor(
        @Inject(Repositoties.ROLE)
        private roleRepository: Repository<Role>,
    ){}

    public async createRole(role: CreateRoleDto){
        try {
            const findExistRole = await this.findRoleByName(role.name);
            if(!findExistRole){
                const response = await this.roleRepository
                .createQueryBuilder()
                .insert()
                .into(Role)
                .values({
                    name: role.name,
                    description: role.description
                })
                .execute();
                return response;
            }
            return 'Existed';
        } catch (error) {
        console.log("🚀 ~ file: role.service.ts ~ line 16 ~ RoleService ~ createRole ~ error", error);
        }
    }

    public async findRoleByName(name: string): Promise<IRole>{
        try {
            const response: IRole = await this.roleRepository
            .createQueryBuilder('role')
            .where("role.name = :roleName", {roleName: name})
            .getOne();
            return response;
        } catch (error) {
        console.log("🚀 ~ file: role.service.ts ~ line 36 ~ RoleService ~ findRoleByName ~ error", error);      
        }
    }

    public async findroles(): Promise<IRole[]>{
        try {
            const response: IRole[] = await this.roleRepository
            .createQueryBuilder('role')
            .getMany();
            return response;
        } catch (error) {
        console.log("🚀 ~ file: role.service.ts ~ line 51 ~ RoleService ~ findroles ~ error", error)
            
        }
    }

    public async updateRole(dto: UpdateRoleDto, roleId: number){
        try {
            const findExistRole: IRole = await this.findRoleByName(dto.name);
            if(findExistRole && findExistRole.id !== roleId) return "Existed";          
            if(!findExistRole || findExistRole.id === roleId){
                const response = this.roleRepository.createQueryBuilder('role')
                .update(Role)
                .set(dto)
                .where("role.id = :roleId", {roleId: roleId})
                .execute();
                return response;
            }
        } catch (error) {
        console.log("🚀 ~ file: role.service.ts ~ line 63 ~ RoleService ~ updateRole ~ error", error)
            
        }
    }

    public async deleteRole(roleId: number){
        try {
            const response = await this.roleRepository.createQueryBuilder('role')
            .delete()
            .from(Role)
            .where("role.id = :roleId", {roleId: roleId})
            .execute();

            return response;
        } catch (error) {
        console.log("🚀 ~ file: role.service.ts ~ line 81 ~ RoleService ~ deleteRole ~ error", error)
            
        }
    }
}
