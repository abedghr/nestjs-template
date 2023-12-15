import { ApiProperty } from '@nestjs/swagger';
import { IMessage } from 'src/common/message/interfaces/message.interface';

export class ResponseMetadataSerialization {
    languages: string[];
    path: string;
    version: string;
    repoVersion: string;
    [key: string]: any;
}

export class ResponseDefaultSerialization<T = Record<string, any>> {
    @ApiProperty({
        name: 'statusCode',
        type: Number,
        nullable: false,
        description: 'return specific status code for every endpoints',
        example: 200,
    })
    statusCode: number;

    @ApiProperty({
        name: 'message',
        nullable: false,
        description: 'Message base on language',
        oneOf: [
            {
                type: 'string',
                example: 'message endpoint',
            },
            {
                type: 'object',
                example: {
                    en: 'This is test endpoint.',
                    id: 'Ini adalah endpoint test',
                },
            },
        ],
    })
    message: string | IMessage;

    @ApiProperty({
        name: '_metadata',
        nullable: true,
        description: 'Contain metadata about API',
        type: 'object',
        required: true,
        example: {
            languages: ['en'],
            path: '/api/v1/test/hello',
            version: '1',
            repoVersion: '1.0.0',
        },
    })
    _metadata?: ResponseMetadataSerialization;

    data?: T;
}
