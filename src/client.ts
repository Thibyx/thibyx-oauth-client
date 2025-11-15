import axios from 'axios';

export class Client {
    public id: string;
    #secret: string;
    #isLoggedIn: boolean;

    constructor({id, secret, clientId, clientSecret}: {id: string, secret: string, clientId: undefined, clientSecret: undefined} | {id: undefined, secret: undefined, clientId: string, clientSecret: string}) {
        this.id = id ?? clientId;
        this.#secret = secret ?? clientSecret;
        this.#isLoggedIn = false;
    }

    get isLoggedIn() {
        return this.#isLoggedIn;
    }

    public async login() {
        if (!this.id || !this.#secret) {
            throw new Error('Client ID and secret are required');
        }

        try {
            const response = await axios.post('http://localhost:3000/api/oauth/validate-client', {
                client_id: this.id,
                client_secret: this.#secret,
            });
            const isValid = response.status === 200;
            this.#isLoggedIn = isValid;
            if (!isValid) {
                throw new Error(response.data.message || 'Internal server error');
            }
        } catch (error: any) {
            this.#isLoggedIn = false;
            throw new Error(error?.response?.data?.message || error.message || 'Network error');
        }
    }

    public fetchToken() {

    }
}