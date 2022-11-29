import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@smtp.google.com>',
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
