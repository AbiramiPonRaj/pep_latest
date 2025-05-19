
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { IdTypePayload } from "./idtype_payload";
class IdTypeApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    doMasterIdType = async (payload: IdTypePayload) => {
        console.log("IdTypeApiService doMasterIdType() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/v1/idtypes/createIdtype', payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("IdTypeApiService doMasterIdType() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }

    // GET request to fetch all ministries
    getIdTypes = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/idtypes');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }

   
    updateIdTypes = async (id: number, payload: IdTypePayload) => {
        console.log("IdTypeApiService updateIdTypes() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/idtypes/${id}`, payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("IdTypeApiService updateIdTypes() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }
    // DELETE request to delete a ministry by ID
 
blockIdType = async (id: number) => {
       
    try {
        const response = await this.httpClientWrapper.put(`/api/v1/idtypes/${id}/block` );
        const data = response.data;
        console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("StateApiService blockIdType() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
unblockIdType= async (id: number) => {
   
    try {
        const response = await this.httpClientWrapper.put(`/api/v1/idtypes/${id}/unblock` );
        const data = response.data;
        console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("StateApiService unblockIdType() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
}

export default IdTypeApiService;
