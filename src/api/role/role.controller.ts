import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  CreateRoleDto,
  CreateRoleResponseDto,
} from 'src/api/role/dtos/addRoleDtos';
import {
  UpdateRoleDto,
  UpdateRoleResponseDto,
} from 'src/api/role/dtos/updateRoleDtos';
import { IRole } from './interfaces';
import { RoleService } from './role.service';

@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('create')
  async create(@Body() dto: CreateRoleDto, @Res() res: Response) {
    try {
      const findExistRole: IRole = await this.roleService.findRoleByName(
        dto.name,
      );
      if (!findExistRole) {
        const result: CreateRoleResponseDto = await this.roleService.createRole(
          dto,
        );

        return res.status(201).json({
          data: result,
        });
      }
      throw new ConflictException();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch('update/:roleId')
  async updateRole(
    @Body() updateDto: UpdateRoleDto,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Res() res: Response,
  ) {
    const findExistRole: IRole = await this.roleService.findRoleByName(
      updateDto.name,
    );
    if (findExistRole && findExistRole.id !== roleId)
      throw new ConflictException();
    if (!findExistRole || findExistRole.id === roleId) {
      const result: UpdateRoleResponseDto = await this.roleService.updateRole(
        updateDto,
        roleId,
      );
      return res.status(200).json({
        data: result,
      });
    }
  }

  @Delete('delete/:roleId')
  async deleteRole(@Param('roleId', ParseIntPipe) roleId: number) {
    const response = await this.roleService.deleteRole(roleId);
    return response;
  }

  /*
  Below functions aim to collect data from database
*/
  @Get('findAll')
  async getRoles(@Res() res: Response) {
    try {
      const response: IRole[] = await this.roleService.findRoles();
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('find/:roleName')
  async getRoleByName(
    @Param('roleName') roleName: string,
    @Res() res: Response,
  ) {
    try {
      const response: IRole[] = await this.roleService.findRoleByCondition({name: roleName});
      if (!response) throw new NotFoundException();
      return res.status(200).json({
        data: response[0],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('find/:roleId')
  async getRoleById(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Res() res: Response,
  ) {
    try {
      const response: IRole[] = await this.roleService.findRoleByCondition({id: roleId});
      if (!response) throw new NotFoundException();
      return res.status(200).json({
        data: response[0],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
