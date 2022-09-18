import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Account } from './entities';
import * as argon from 'argon2';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities';
import { IToken } from './interfaces';
import { RegisterDto } from 'src/utils/dtos/authentication/registerDtos';
import { AuthDto } from 'src/utils/dtos/authentication/authDtos';
import { Repositoties } from 'src/utils/constants';

@Injectable()
export class AuthService {
    constructor(
        @Inject(Repositoties.AUTH)
        private accountRepository : Repository<Account>,
        @Inject(Repositoties.TOKEN)
        private tokenRepository : Repository<RefreshToken>,
        private config : ConfigService,
        private userService : UserService,
        private jwt : JwtService
    ){}

    public async register(dto: RegisterDto): Promise<any>{
        try {
            const hashedPassword = await argon.hash(dto.password);
            // create an user object
            const user = new Account();
            // add new email and password to object
            user.email = dto.email;
            user.password = hashedPassword;

            // delete redundant data out of dto
            delete(dto.email);
            delete(dto.password);

            // add new user
            const addUserData = await this.userService.createUser(dto);
            
            if(addUserData["data"] === "User's phonenumber is existed") return addUserData["data"];
            // add userid to user object
            user.user = addUserData["data"];
            const addedUser = await this.accountRepository.save(user);
            
            delete(addedUser.password);
            return addedUser;
        } catch (error) {
            return error.message
        }
    }


    public async login(dto: AuthDto):Promise<IToken|object>{
        try {
            // Get user's account from account table
            const user: object = await this.accountRepository
            .createQueryBuilder('Account')
            .where("Account.email = :enteredEmail",{enteredEmail: dto.email})
            .getOne();
            
            // Check existed user
            if(!user) return new UnauthorizedException("Credentials incorrect");

            // Check correct password
            const isCorrectPassword : boolean = await this.verifyPassword(dto.password, user["password"]);
            if(!isCorrectPassword) return new UnauthorizedException("Credentials incorrect");

            // Correct user
            const response = await this.signToken(user["id"], dto.email);

            await this.setRefreshToken(user["id"], response.refresh_token);
            // return response;
        } catch (error) {
            return error.message;
        }
    }


    public async refreshToken(email:string, refreshToken:string): Promise<IToken|object>{
        try {
            const account: object = await this.accountRepository
            .createQueryBuilder('Account')
            .where("Account.email = :enteredEmail",{enteredEmail: email})
            .getOne();
            
            // Check existed account
            if(!account) return new ForbiddenException("Access Denied");
            
            const existedToken = await this.tokenRepository.createQueryBuilder('refreshToken')
            .where('refreshToken.accountId = :accountId', {accountId: account['id']})
            .getOne();
            
            if(!(refreshToken ===existedToken.token)) {
                return new ForbiddenException('Access Denied')
            }
            const response: IToken = await this.signToken(account['id'], email);
            await this.updateRFToken(account['id'],response.refresh_token);
            return response;
            
        } catch (error) {
            return error.message;
        }
    }
    
    private async signToken(accountId: number, email: string): Promise<IToken>{
        const payload = {
            sub: accountId,
            email
        }
        const secret = this.config.get('JWT_SECRET');
        const refreshSecret = this.config.get('JWT_RF_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '60s',
            secret: secret
        });

        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: '12d',
            secret: refreshSecret
        })

        return {
            access_token: token,
            refresh_token: refreshToken,
        };
    }

    
    private async setRefreshToken(accountId: number, refreshToken: string):Promise<number>{
        /*
        This private function aim to set refresh token to a table in database
        +>  return value equal to 1 when the token is updated or saved to the database 
        =>  return value equal to 0 when the token is existed in the database
        */

        const existedAccountInDBTable = await this.tokenRepository.createQueryBuilder('refreshToken')
        .where('refreshToken.accountId = :accountId', {accountId: accountId})
        .getOne();

        if(!existedAccountInDBTable){
            await this.tokenRepository.createQueryBuilder()
            .insert()
            .into(RefreshToken)
            .values({
                token: refreshToken,
                account: accountId
            })
            .execute();
            return 1;
        }
                
        if(!(refreshToken ===existedAccountInDBTable.token)){
            await this.updateRFToken(accountId, refreshToken);
            return 1;
        }

        return 0;
    }

    private async updateRFToken(accountId: number, refreshToken: string): Promise<void>{
        /*
        This private function aim to update refresh token to a table in database
        */
        await this.tokenRepository.createQueryBuilder()
        .update(RefreshToken)
        .set({
            token: refreshToken,
            account: accountId,
        })
        .where("account = :accountId", {accountId: accountId})
        .execute();
    }
    private async verifyPassword (enteredPassword, storedPassword):Promise<boolean>{
        const isCorrectPassword = await argon.verify(
            storedPassword,
            enteredPassword
        );
        return isCorrectPassword;
    }
}
