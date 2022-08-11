import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access'){
    constructor(
        config: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET')
        })
    }

    async validate(payload : any){
        console.log("🚀 ~ file: jwt-at.strategy.ts ~ line 19 ~ JwtAccessToken ~ validate ~ payload", payload)
        return payload;
    }
}
