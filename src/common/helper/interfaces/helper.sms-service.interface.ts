import { AxiosResponse } from 'axios';

export interface IHelperSMSService {
    send(
        phoneNumber: string,
        message: string
    ): Promise<AxiosResponse<any, any>>;
}
