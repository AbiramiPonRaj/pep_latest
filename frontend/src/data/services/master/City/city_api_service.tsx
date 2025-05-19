
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CityPayload } from "./city_payload";

class CityApiService {
    private httpClientWrapper: HttpClientWrapper;
    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    MasterCity = async (payload: CityPayload) => {
        console.log("CityApiService MasterCity() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/v1/ministrys/createMinistry', payload);
            const data = response.data;
            // console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("CityApiService MasterCity() error:", error);
            throw error;
        }
    }

    getCityOptions = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ministrys');
            return response;
        } catch (error) {
            throw error;
        }
    }

    updateCity = async (id: number, payload: CityPayload) => {
        console.log("CityApiService updateCity() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/ministrys/${id}`, payload);
            const data = response.data;
            // console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("CityApiService updateCity() error:", error);
            throw error;
        }
    }

    deletecity = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.delete(`/api/v1/ministrys/${id}`);
            const data = response.data;
            // console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("CityApiService deletecity() error:", error);
            throw error;
        }
    }
}

export default CityApiService;
