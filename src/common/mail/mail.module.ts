import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    exports: [MailService],
    providers: [MailService],
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.get('mail.host'),
                    port: config.get('mail.port'),
                    auth: {
                        user: config.get('mail.user'),
                        pass: config.get('mail.password'),
                    },
                    secure: true,
                },
                defaults: {
                    from: config.get('mail.from'),
                },
                template: {
                    dir: __dirname + '/templates',
                    adapter: new PugAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
})
export class MailModule {}
