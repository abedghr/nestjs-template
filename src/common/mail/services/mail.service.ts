import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IMailService } from '../interfaces/mail-service.interface';

@Injectable()
export class MailService implements IMailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendMailResetPassword(
        to: string,
        username,
        otp: string,
        lang = 'en'
    ): Promise<void> {
        try {
            this.mailerService.sendMail({
                to,
                subject: 'CMS | Reset Password',
                template:
                    lang === 'en'
                        ? './reset-password-en.template.pug'
                        : './reset-password-ar.template.pug',
                context: {
                    otp,
                    username,
                },
            });
        } catch (err: any) {
            throw err;
        }
    }
}
