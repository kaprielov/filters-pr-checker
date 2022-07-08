import axios, { AxiosRequestConfig, Method } from 'axios';
import * as core from '@actions/core';
import FormData from 'form-data';

export class ImgurApi {
    IMGUR_URL = 'https://api.imgur.com/';

    private readonly clientId: string;

    constructor() {
        this.clientId = core.getInput('imgur_client_id', { required: true });
    }

    async makeRequest(url: string, method: Method, options: AxiosRequestConfig) {
        try {
            return await axios({
                url: this.IMGUR_URL + url,
                method,
                ...options,
            });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
            throw e;
        }
    }

    async upload(image: Buffer): Promise<string> {
        const METHOD = 'POST';
        const URL = '3/image';

        const form = new FormData();
        form.append('image', image);

        const response = await this.makeRequest(URL, METHOD, {
            data: form,
            headers: {
                Authorization: `Client-ID ${this.clientId}`,
            },
        });

        return response.data.data.link;
    }
}
