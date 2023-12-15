import { Injectable } from '@nestjs/common';
import { IHelperSMSService } from '../interfaces/helper.sms-service.interface';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class HelperSMSService implements IHelperSMSService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {}

    async send(
        phoneNumber: string,
        message: string
    ): Promise<AxiosResponse<any, any>> {
        const sender = this.configService.get<string>('helper.sms.sender');
        const username = this.configService.get<string>('helper.sms.username');
        const password = this.configService.get<string>('helper.sms.password');

        return await this.httpService
            .post(`https://sendsms.ngt.jo/http/send_sms_http.php`, null, {
                params: {
                    login_name: username,
                    login_password: decodeURIComponent(password),
                    msg: message,
                    mobile_number: phoneNumber,
                    from: sender,
                    charset: 'UTF-8',
                    unicode: 0,
                    dlr: 3,
                    dlrurl: 'http://xyz.com/get_status.php?msg_id=123456',
                    status: '%d',
                },
            })
            .toPromise();
    }
}
