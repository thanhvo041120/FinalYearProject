import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { AuthDto, RegisterDto } from './dtos';
import * as argon from 'argon2';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @Inject('AUTH_REPOSITORY')
        private accountRepository : Repository<Account>,
        private config : ConfigService,
        private userService : UserService,
        private jwt : JwtService
    ){}

    public async register(dto: RegisterDto): Promise<any>{
        try {
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
            console.log("🚀 ~ file: auth.service.ts ~ line 23 ~ AuthService ~ registerService ~ error", error);
            }
        } catch (error) {
        console.log("🚀 ~ file: auth.service.ts ~ line 18 ~ AuthService ~ register ~ error", error);
            
        }
    }


    public async login(dto: AuthDto):Promise<any>{
        try {
            // Get user's account from account table
            const user: object = await this.accountRepository
            .createQueryBuilder('Account')
            .where("Account.email = :enteredEmail",{enteredEmail: dto.email})
            .getOne();
            
            // Check existed user
            if(!user) return "Credentials incorrect";

            // Check correct password
            const isCorrectPassword : boolean = await this.verifyPassword(dto.password, user["password"]);
            if(!isCorrectPassword) return 'Credentials incorrect';

            // Correct user
            return this.signToken(user["id"], dto.email);
        } catch (error) {
        console.log("🚀 ~ file: auth.service.ts ~ line 58 ~ AuthService ~ login ~ error", error)
            
        }
    }


    private async signToken(userId: number, email: string): Promise<{access_token: string, refresh_token: string}>{
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET');
        const refreshSecret = this.config.get('JWT_RF_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
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

    private async verifyPassword (enteredPassword, storedPassword):Promise<boolean>{
        const isCorrectPassword = await argon.verify(
            storedPassword,
            enteredPassword
        );
        return isCorrectPassword;
    }
}
