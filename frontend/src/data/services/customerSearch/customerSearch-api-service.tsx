import HttpClientWrapper from "../../api/http-client-wrapper";
import { CustomerSearchPayload } from "./customerSearch-payload";

class CustomerSearchApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    saveCustomerSearch = async (payload: CustomerSearchPayload) => {
        try {
            const response = await this.httpClientWrapper.ALpost('/api/v1/customers/fetch-all', payload);
            return response;
        } catch (error) {
            console.error('Error in Customer Search:', error);
            throw error;
        }
    }

    getState = async () => {
        try {
            const response = await this.httpClientWrapper.ALget('/api/v1/State');
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default CustomerSearchApiService;

