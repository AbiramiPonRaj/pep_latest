import HttpClientWrapper from "../../api/http-client-wrapper";
import StorageService from "../../storage/storage-service";
import { AuthPayload } from "./auth-payload";
import { AuthSearch } from "./Auth-Search";

class AuthApiService {
   
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    doLogin = async (payload: AuthPayload) => {
        console.log("AuthApiService doLogin() start = " + JSON.stringify(payload));
        try {
            let data: any = await this.httpClientWrapper.post('/api/v1/users/createUser', payload);
            if (data && data.token) {
                StorageService.setToken(data.token);
            }
            console.log("AuthApiService doLogin() response data " + JSON.stringify(data));
            console.log("AuthApiService doLogin() end = " + JSON.stringify(payload));
            return data;
        } catch (error) {
            throw error;
        }
    }

    //     public getCountries = async () => {
    //     console.log("HttpClientWrapper getCountries() start");
    //     try {
    //         let response: any = await this.axiosClient.get('/api/v1/crmConfigCountry'); // Adjust the API endpoint
    //         console.log("HttpClientWrapper getCountries() response data " + JSON.stringify(response.data));
    //         console.log("HttpClientWrapper getCountries() end");
    //         return response.data;
    //     } catch (err: any) {
    //         console.log("HttpClientWrapper getCountries() error === " + JSON.stringify(err));
    //         // Handle the error as needed
    //         throw err;
    //     }
    // }
    // getCountryOptions = async () => {
    //     try {
    //         const response = await this.httpClientWrapper.get('/api/v1/crmConfigCountry');
    //         return response;
    //     } catch (error) {
    //         // Handle the error as needed
    //         throw error;
    //     }
    // }
   
    // getStateDataByCountryId= async () => {
    //     try {
    //         const response = await this.httpClientWrapper.get('/api/v1/crmConfigState');
    //         return response;
    //     } catch (error) {
    //         // Handle the error as needed
    //         throw error;
    //     }
    // }
    
    getTypeOptions=async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/crmConfigType');
            return response;
        } catch (error) {
            throw error;
        }
    }
    doSearch = async (payload: AuthSearch) => {
        console.log("AuthApiService doSearch() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/v1/crmsearch/createCrmSearch', payload);
            const data = response.data;
            console.log("Response data:", data);
            return data;
        } catch (error) {           
            console.error("AuthApiService doSearch() error:", error);
            throw error;
        }
    }
}

export default AuthApiService;