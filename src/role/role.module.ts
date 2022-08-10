import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RoleController } from './role.controller';
import { roleProviders } from './role.provider';
import { RoleService } from './role.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [RoleService, ...roleProviders],
  exports: [...roleProviders, RoleService]
})
export class RoleModule {}
