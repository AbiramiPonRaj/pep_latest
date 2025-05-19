
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { MaritalStatusPayload } from "./maritalstatus_payload";

class MaritalStatusApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateMaritalStatus = async (payload: MaritalStatusPayload) => {
        console.log("StateApiService MasterMaritalStatus() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/v1/marialstatus/MaritalStatus', payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("MaritalStatusApiService MasterState() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }

    // GET request to fetch all ministries
    getMaritalStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/marialstatus');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }

   
    updateMaritalStatus = async (id: number, payload: MaritalStatusPayload) => {
        console.log("StateApiService updateMaritalStatus() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/marialstatus/${id}`, payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("StateApiService updateMaritalStatus() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }
    // DELETE request to delete a ministry by ID
 
    
    blockMaritalStatus = async (id: number) => {
       
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/marialstatus/{id}/${id}/block` );
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("updateMaritalStatusApiService blockMaritalStatus() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }
    unblockMaritalStatus = async (id: number) => {
       
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/marialstatus/{id}/${id}/unblock` );
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("updateMaritalStatusApiService deleteupdateMaritalStatus() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }
}

export default MaritalStatusApiService;
