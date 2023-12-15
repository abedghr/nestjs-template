import { registerAs } from '@nestjs/config';
import { seconds } from 'src/common/helper/constants/helper.function.constant';

export default registerAs(
    'helper',
    (): Record<string, any> => ({
        salt: {
            length: 8,
        },
        sms: {
            sender: process.env?.SMS_SERVICE_SENDER ?? 'OvOApp',
            username: process.env?.SMS_SERVICE_USERNAME ?? 'Ovoapp',
            password: process.env?.SMS_SERVICE_PASSWORD,
        },
    })
);
