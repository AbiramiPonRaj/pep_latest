import HttpClientWrapper from "../../../api/http-client-wrapper";
import { DesignationPayload } from "./designation_payload";

class DesignationService {
    private httpClientWrapper: HttpClientWrapper;
    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getDesignation = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Designation');
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default DesignationService;