
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CountryPayload } from "./country-payload";
class CountryApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    
    // GET request to fetch all ministries
    getCountryOptions = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Country');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }

   
 
}

export default CountryApiService;
