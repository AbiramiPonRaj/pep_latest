
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CompanyMasterPayload } from "./companymaster_payload";
class  CompanyMasterApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    
    // GET request to fetch all ministries
    getCompanyMaster = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/CompanyMaster');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }
 
}

export default  CompanyMasterApiService;
