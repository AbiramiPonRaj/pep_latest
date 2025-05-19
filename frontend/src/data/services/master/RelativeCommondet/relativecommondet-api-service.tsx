
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { RelativeCommondetPayload } from "./relativecommondet-payload";

class RelativeCommondetApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    doRelativeCommondet = async (payload: RelativeCommondetPayload) => {
        console.log("RelativeCommondetApiService doRelativeCommondet() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/v1/relativecommondet/createRelativeCommondet', payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("RelativeCommondetApiService doRelativeCommondet() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }

    // GET request to fetch all ministries
    getRelativeCommondet = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/relativecommondet');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }

   
    updateRelativeCommondet = async (id: number, payload: RelativeCommondetPayload) => {
        console.log("CountryApiService updateRelativeCommondet() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/relativecommondet/${id}`, payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("CountryApiService updateRelativeCommondet() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }
    // DELETE request to delete a ministry by ID


blockRelativeCommondet = async (id: number) => {
       
    try {
        const response = await this.httpClientWrapper.put(`/api/v1/relativecommondet/${id}/block` );
        const data = response.data;
        console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("StateApiService blockRelativeCommondet() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
unblockRelativeCommondet= async (id: number) => {
   
    try {
        const response = await this.httpClientWrapper.put(`/api/v1/relativecommondet/${id}/unblock` );
        const data = response.data;
        console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("StateApiService unblockRelativeCommondet() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
}



export default RelativeCommondetApiService;