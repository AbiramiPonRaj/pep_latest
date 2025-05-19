
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { StatusPayload } from "./status-payload";

class statusApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateStatus = async (payload: StatusPayload) => {
        console.log("CountryApiService CreateStatus() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Status/createStatus', payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; 
        } catch (error) {
            console.error("CountryApiService doMasterCountry() error:", error);
            throw error;
        }
    }

    getStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Status');
            return response;
        } catch (error) {
            throw error;
        }
    }

   
    updateStatus = async (id: number, payload: StatusPayload) => {
        console.log("CountryApiService updateCountry() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Status/${id}`, payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; 
        } catch (error) {
            console.error("CountryApiService updateCountry() error:", error);
            throw error; 
        }
    }

    blockStatus = async (id: number) => {       
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Status/${id}/block` );
            const data = response.data;
            console.log("Response data:", data);
            return data; 
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error; 
        }
    }

    unblockStatus= async (id: number) => {  
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Status/${id}/unblock` );
            const data = response.data;
            console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error; 
        }
    }
}

export default statusApiService;
