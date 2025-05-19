import HttpClientWrapper from "../../../api/http-client-wrapper";
import { RelativeTypePayload } from "./relativetype_payload";

class RelativeTypeApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    doMasterRelativeType = async (payload: RelativeTypePayload) => {
        console.log("RelativeTypeApiService doMasterRelativeType() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/v1/relativeTypes/createRelativeType', payload);
            const data = response.data;
            console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("RelativeTypeApiService doMasterRelativeType() error:", error);
            throw error;
        }
    }

    getRelativeTypeOptions = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/relativeTypes');
            return response;
        } catch (error) {
            throw error;
        }
    }

    updateRelativeType = async (id: number, payload: RelativeTypePayload) => {
        console.log("RelativeTypeApiService updateRelativeType() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/relativeTypes/${id}`, payload);
            const data = response.data;
            console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("RelativeTypeApiService updateRelativeType() error:", error);
            throw error;
        }
    }

    blockRelativeType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/relativeTypes/${id}/block`);
            const data = response.data;
            console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("RelativeTypeApiService blockRelativeType() error:", error);
            throw error;
        }
    }

    unblockRelativeType = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/relativeTypes/${id}/unblock`);
            const data = response.data;
            console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("RelativeTypeApiService unblockRelativeType() error:", error);
            throw error;
        }
    }
}


export default RelativeTypeApiService;
