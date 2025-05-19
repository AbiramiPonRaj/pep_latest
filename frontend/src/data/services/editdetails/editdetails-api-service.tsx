import HttpClientWrapper from "../../api/http-client-wrapper";

class EditDetailsApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  updateCustomer = async (
    pepDetailsWriteDTO: any,
    files: File[],
    pathIds: number[],
    files1: File[],
    pathIds1: number[],
    files2: File[],
    pathIds2: number[],
    files3: File[],
    pathIds3: number[],
    companyfiles: File[],
    companyfilesPathId: number[],
    cinfcrn: string[],
    pepId: string,
    euid: number,
  ) => {
    try {
      const formData = new FormData();
      formData.append('PepDetailsWriteDTO', JSON.stringify(pepDetailsWriteDTO));
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formData.append('files', file);
          formData.append('pathIds', String(pathIds[index])); 
        });
      }
      if (files1 && files1.length > 0) {
        files1.forEach((file1, index) => {
          formData.append('files1', file1);
          formData.append('pathIds1', String(pathIds1[index])); 
        });
      }
      if (files2 && files2.length > 0) {
        files2.forEach((file2, index) => {
          formData.append('files2', file2);
          formData.append('pathIds2', String(pathIds2[index])); 
        });
      }
      if (files3 && files3.length > 0) {
        files3.forEach((file3, index) => {
          formData.append('files3', file3);
          formData.append('pathIds3', String(pathIds3[index])); 
        });
      }    
      if (companyfiles && companyfiles.length > 0) {
        companyfiles.forEach((file, index) => {
          formData.append('companyfiles', file);
          formData.append('companyfilesPathId', String(companyfilesPathId[index]));
          formData.append('cinfcrn', String(cinfcrn[index]));
        })
      }
      const headers = this.getFormDataHeaderConfig();
      const url = `/api/v1/CustomerSave/UpdateCustomerDetails?pepId=${pepId}&euid=${euid}`;
      const response = await this.httpClientWrapper.pute(url, formData, { headers });
      const data = response?.data;
      return data;
    } catch (error) {
      console.error("EditDetailsApiService updateCustomer() error:", error);
      throw error;
    }
  };

  getFormDataHeaderConfig() {
    return this.httpClientWrapper.getHeaderConfig('multipart/form-data');
  }

  deactivateRelativeId = async (pepId: string, euid: number, relativeMasterId: string) => {
    try {
      const response = await this.httpClientWrapper.put(`/api/v1/Relative/deActive/${pepId}?pepId=${pepId}&euid=${euid}&relativeMasterId=${relativeMasterId}`);
      return response;
    } catch (error) {
      console.log('Error deactivating the relativeId:', error);
      throw error;
    }
  };
}

export default EditDetailsApiService;
