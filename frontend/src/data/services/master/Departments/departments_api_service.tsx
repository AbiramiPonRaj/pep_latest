
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { DepartmentPayload } from "./departments_payload";

class DepartmentApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    doMasterDepartment = async (payload: DepartmentPayload) => {
        console.log("DepartmentApiService doMasterDepartment() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/v1/departments/createDepartment', payload);
            const data = response.data;
            // console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("DepartmentApiService doMasterDepartment() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }

    // GET request to fetch all ministries
    getDepartmentOptions = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/departments');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }

   
    updateDepartment = async (id: number, payload: DepartmentPayload) => {
        console.log("DepartmentApiService updateDepartment() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/departments/${id}`, payload);
            const data = response.data;
            // console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("DepartmentApiService updateDepartment() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }
    // DELETE request to delete a ministry by ID


blockDepartment = async (id: number) => {
       
    try {
        const response = await this.httpClientWrapper.put(`/api/v1/departments/${id}/block` );
        const data = response.data;
        // console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("DepartmentApiService blockDepartment() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
unblockDepartment= async (id: number) => {
   
    try {
        const response = await this.httpClientWrapper.put(`/api/v1/departments/${id}/unblock` );
        const data = response.data;
        // console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("DepartmentApiService unblockDepartment() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
}

export default DepartmentApiService;
