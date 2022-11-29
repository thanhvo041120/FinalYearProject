import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Account } from './entities';
import * as argon from 'argon2';
import { UserService } from 'src/api/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities';
import { IAccount, IToken } from './interfaces';
import {
  RegisterDto,
  RegisterResponseDto,
} from 'src/api/auth/dtos/registerDtos';
import { AuthDto, AuthResponseDto } from 'src/api/auth/dtos/authDtos';
import { Repositoties } from 'src/utils/constants';
import { User } from '../user/entities';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Repositoties.AUTH)
    private accountRepository: Repository<Account>,
    @Inject(Repositoties.TOKEN)
    private tokenRepository: Repository<RefreshToken>,
    private config: ConfigService,
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  public async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const hashedPassword = await argon.hash(dto.password);
    const user = new Account();
    user.email = dto.email;
    user.password = hashedPassword;
    delete dto.email;
    delete dto.password;
    const addUserData = await this.userService.createUser(dto);
    user.userId = addUserData.affectedRow;
    user.roleId = dto.roleId;
    const addedUser = await this.accountRepository.save(user);
    delete addedUser.password;
    return addedUser;
  }

  public async login(dto: AuthDto, account: object): Promise<AuthResponseDto> {
    const isCorrectPassword: boolean = await this.verifyPassword(
      dto.password,
      account['password'],
    );
    if (!isCorrectPassword) return { status: 401 };
    const response: IToken = await this.signToken(account['id'], dto.email);
    await this.setRefreshToken(account['id'], response.refresh_token);
    return {
      status: 201,
      tokens: response,
    };
  }

  public async findAccountsByOption(option: Object): Promise<IAccount[]> {
    const account: IAccount[] = await this.accountRepository.findBy(option);
    return account;
  }

  public async getProfile(accountId: number) {
    const account = await this.accountRepository
      .createQueryBuilder('account')
      .select([
        'account.email',
        'account.id',
        'account.roleId',
        'account.user',
        'account.walletAddress',
      ])
      .where('account.id = :accountId', { accountId: accountId })
      .leftJoinAndSelect('account.user', 'user')
      .getOne();

    return account;
  }
  public async refreshToken(
    email: string,
    refreshToken: string,
  ) {
    try {
      const account: object = await this.accountRepository
        .createQueryBuilder('Account')
        .where('Account.email = :enteredEmail', { enteredEmail: email })
        .getOne();

      if (!account) return new ForbiddenException('Access Denied');

      const existedToken = await this.tokenRepository
        .createQueryBuilder('refreshToken')
        .where('refreshToken.accountId = :accountId', {
          accountId: account['id'],
        })
        .getOne();

      if (!existedToken.token.includes(refreshToken)) {
        return {
          status: 403,
          message: 'Invalid Token'
        };
      }
      if (existedToken.token.includes(refreshToken)) {
        const response: IToken = await this.signToken(account['id'], email);
        await this.updateRFToken(account['id'], response.refresh_token);
        return {
          status: 200,
          message: response
        };
      }
    } catch (error) {
      return error.message;
    }
  }

  public async logout(refreshToken: string) {
    await this.tokenRepository.delete({ token: refreshToken });
  }

  private async signToken(accountId: number, email: string): Promise<IToken> {
    const payload = {
      sub: accountId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const refreshSecret = this.config.get('JWT_RF_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30s',
      secret: secret,
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '12d',
      secret: refreshSecret,
    });

    return {
      access_token: token,
      refresh_token: refreshToken,
    };
  }

  private async setRefreshToken(
    accountId: number,
    refreshToken: string,
  ): Promise<number> {
    /*
        This private function aim to set refresh token to a table in database
        +>  return value equal to 1 when the token is updated or saved to the database 
        =>  return value equal to 0 when the token is existed in the database
        */

    const existedAccountInDBTable = await this.tokenRepository
      .createQueryBuilder('refreshToken')
      .where('refreshToken.accountId = :accountId', { accountId: accountId })
      .getOne();

    if (!existedAccountInDBTable) {
      await this.tokenRepository
        .createQueryBuilder()
        .insert()
        .into(RefreshToken)
        .values({
          token: refreshToken,
          accountId: accountId,
        })
        .execute();
      return 1;
    }

    if (!(refreshToken === existedAccountInDBTable.token)) {
      await this.updateRFToken(accountId, refreshToken);
      return 1;
    }

    return 0;
  }

  private async updateRFToken(
    accountId: number,
    refreshToken: string,
  ): Promise<void> {
    /*
        This private function aim to update refresh token to a table in database
        */
    await this.tokenRepository
      .createQueryBuilder()
      .update(RefreshToken)
      .set({
        token: refreshToken,
        accountId: accountId,
      })
      .where('account = :accountId', { accountId: accountId })
      .execute();
  }
  private async verifyPassword(
    enteredPassword,
    storedPassword,
  ): Promise<boolean> {
    const isCorrectPassword = await argon.verify(
      storedPassword,
      enteredPassword,
    );
    return isCorrectPassword;
  }

  public async updateAccount(option: object, accountId: number) {
    const response = await this.accountRepository
      .createQueryBuilder('Account')
      .update(Account)
      .set(option)
      .where('id = :accountId', { accountId: accountId })
      .execute();
    return response;
  }
}
