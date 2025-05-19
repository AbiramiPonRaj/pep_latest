import HttpClientWrapper from "../../api/http-client-wrapper";
import { CustomerrequestPayload } from "./customerrequest-payload";

// Import statements and other code...

class CustomerRequestApiService {
    private httpClientWrapper: HttpClientWrapper;
  
    constructor() {
      this.httpClientWrapper = new HttpClientWrapper();
    }
  
    // saveCustomerRequest = async (payload:CustomerrequestPayload ) => {
    //     console.log(`LLPsApiService saveCustomerRequest() start = ${JSON.stringify(payload)}`);
    //     try {
    //       const response = await this.httpClientWrapper.post('/api/v1/Customer/CreateCustomerRequest', payload);
    //       const data = response.data;
    //       console.log("Response data:", data);
    //       return data;
    //     } catch (error) {
    //       console.error("LLPsApiService saveCustomerRequest() error:", error);
    //       throw error;
    //     }
    //   }
    // getcustomer = async (pepId: string) => {
    //   try {
    //     const response = await this.httpClientWrapper.get(`/api/v1/CustomerSave/GetAssociatedCompaniesRequest/${pepId}`);
    //     return response;
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    getcustomer = async (pepId: string) => {
      try {
        const response = await this.httpClientWrapper.get(`/api/v1/CustomerSave/GetAssociatedCompaniesRequest/${pepId}`);
        return response;
      } catch (error) {
        throw error;
      }
    }
    // getcustomer = async (pepId: string, companyId: string) => {
    //   try {
    //     const response = await this.httpClientWrapper.get(`/api/v1/CustomerSave/GetAssociatedCompaniesRequest/${pepId}?companyId=${companyId}`);
    //     return response;
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    // updatecustomer = async (pepId: string) => {
    //   try {
    //     const response = await this.httpClientWrapper.get(`/api/v1/CustomerSave/GetAssociatedCompaniesRequest/${pepId}`);
    //     return response;
    //   } catch (error) {
    //     throw error;
    //   }
    // }
  }
      
      
  
  
  export default CustomerRequestApiService;
  