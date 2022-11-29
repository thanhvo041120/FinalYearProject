import { Body, Controller, InternalServerErrorException, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtGuard } from '../auth/guards';
import { SendMailRequestDto } from './dtos/SendMailDto/send.dto';
import { MailService } from './mail.service';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService,
    ){}

    @Post('sendToUser')
    async sendMail (
        @Body() sendMailDto: SendMailRequestDto,
        @Res() res: Response
    ){
        try {
            const response = await this.mailService.sendMail(sendMailDto);
            return response
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
