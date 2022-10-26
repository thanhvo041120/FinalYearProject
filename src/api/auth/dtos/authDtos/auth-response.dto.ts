import { IToken } from "src/api/auth/interfaces";

export class AuthResponseDto {
    status: number;
    tokens?: IToken;
}