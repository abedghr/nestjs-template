import { registerAs } from '@nestjs/config';

export default registerAs(
    'mail',
    (): Record<string, any> => ({
        host: 'smtp.gmail.com',
        port: 465,
        user: 'jo.auto.care@gmail.com',
        password: 'whnvimmvekjeusmd',
        from: 'No-Reply <modules@nestjs.com>',
    })
);
