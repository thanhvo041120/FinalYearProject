import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailRequestDto } from './dtos/SendMailDto/send.dto';

@Injectable()
export class MailService {
    constructor(
        private readonly mailer: MailerService,
        private readonly config: ConfigService,
    ){}
    
    public async sendMail(sendMailDto: SendMailRequestDto){
        const response = await this.mailer.sendMail({
            to: sendMailDto.receiver,
            from: this.config.get('MAIL_USER'),
            subject: sendMailDto.subject,
            text: sendMailDto.text
        })
        return response;
    }
}
