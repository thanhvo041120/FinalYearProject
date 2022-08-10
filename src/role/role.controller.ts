import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';
import { RoleDto, UpdateRoleDto } from './dtos';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(
        private roleService: RoleService
    ){}

    @Post('create')
    async create(@Body() dto: RoleDto){
        const response = await this.roleService.createRole(dto);
        if(response === 'Existed') return new HttpException(response, HttpStatus.CONFLICT)
        return {
            data: response.raw,
            status: HttpCode(201),
        };
    }

    @Get()
    async getRoles(){
        const response = await this.roleService.findroles();
        return {
            data: response,
            status: HttpCode(200)
        }
    }

    @Get('find/:roleName')
    async getRoleByName(@Param('roleName') roleName: string){
        const response = await this.roleService.findRoleByName(roleName);
        if(!response) return new HttpException('Not Found', HttpStatus.NOT_FOUND);
        return {
            data: response,
            status: HttpCode(200)
        }
    }

    @Put('update/:roleId')
    async updateRole(@Body() updateDto: UpdateRoleDto, @Param('roleId') roleId: string){
        const id = parseInt(roleId);
        const response  = await this.roleService.updateRole(updateDto, id);
        if(response === 'Existed') return new HttpException(response, HttpStatus.CONFLICT)
        return {
            data: response,
            status: HttpCode(200)
        };
    }

    @Delete('delete/:roleId')
    async deleteRole(@Param('roleId') roleId){
        const parsedRoleId = parseInt(roleId);
        const response = await this.roleService.deleteRole(parsedRoleId);
        return response;
    }
}
