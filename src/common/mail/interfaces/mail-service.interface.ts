export interface IMailService {
    sendMailResetPassword(
        to: string,
        username: string,
        otp: string,
        lang: string
    ): void;
}
