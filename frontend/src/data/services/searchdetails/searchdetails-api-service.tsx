import HttpClientWrapper from "../../api/http-client-wrapper";
import { AliasesDetails, CaseDetails, CompanyDetails, IdentificationDetails, PersonalDetails, SearchDetails } from "../searchdetails/searchdetails-payload";

class SearchDetailsService {
  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }
  
  private async fetchData(endpoint: string, criminalId: number): Promise<any> {
    try {
      const response = await this.httpClientWrapper.get(`${endpoint}?criminalId=${criminalId}`);
      return response;
    } catch (error) {
      throw new Error(`Error in API request:`);
    }
  }

  async getSearchDetails(criminalId: number): Promise<SearchDetails[]> {
    return this.fetchData('/api/v1/details', criminalId);
  }

  async getAliasesDetails(criminalId: number): Promise<AliasesDetails[]> {
    return this.fetchData('/api/v1/aliases', criminalId);
  }

  async getIdentification(criminalId: number): Promise<IdentificationDetails[]> {
    return this.fetchData('/api/v1/identifications', criminalId);
  }

  async getPersonalDetails(criminalId: number): Promise<PersonalDetails[]> {
    return this.fetchData('/api/v1/personaldetails', criminalId);
  }

  async getCompanyDetails(criminalId: number): Promise<CompanyDetails[]> {
    return this.fetchData('/api/v1/companydetails', criminalId);
  }

  async getCaseDetails(criminalId: number): Promise<CaseDetails[]> {
    return this.fetchData('/api/v1/casedetails', criminalId);
  }

}

export default SearchDetailsService;
