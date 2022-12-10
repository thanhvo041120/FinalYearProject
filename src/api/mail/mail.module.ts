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
