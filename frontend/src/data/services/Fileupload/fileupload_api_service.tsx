import HttpClientWrapper from "../../api/http-client-wrapper";

class FileUpload {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getFormDataHeaderConfig = () => {
        return this.httpClientWrapper.getHeaderConfig('multipart/form-data');
    };

    // uploadImage = async (formData: FormData): Promise<any> => {
    //     try {
    //         const headerConfig = this.getFormDataHeaderConfig();
    //         const response = await this.httpClientWrapper.sendPostRequest('/api/v1/FileUpload/files/upload', formData, headerConfig);
    //         return response.data;
    //     } catch (error: any) {
    //         if (error instanceof Error) {
    //             throw new Error('Error uploading image: ' + error.message);
    //         } else {
    //             throw new Error('Unknown error occurred during image upload');
    //         }
    //     }
    // };

    async getfiletype() {
        const url = '/api/v1/FileUpload/fileget';
        try {
          const response = await this.httpClientWrapper.get(url);
          return response; 
        } catch (error) {
          throw error;
        }
      }
      async getfiletype1() {
        const url = '/api/v1/FileUpload/fileget';
        try {
          const response = await this.httpClientWrapper.get(url);
          return response; 
        } catch (error) {
          throw error;
        }
      }
      async getfiletype3() {
        const url = '/api/v1/FileUpload/fileget';
        try {
          const response = await this.httpClientWrapper.get(url);
          return response; 
        } catch (error) {
          throw error;
        }
      }
      async getfiletype2() {
        const url = '/api/v1/FileUpload/fileget';
        try {
          const response = await this.httpClientWrapper.get(url);
          return response; 
        } catch (error) {
          throw error;
        }
      }
      async getfiletype4() {
        const url = '/api/v1/FileUpload/fileget';
        try {
          const response = await this.httpClientWrapper.get(url);
          return response; 
        } catch (error) {
          throw error;
        }
      }
      async getfiletype5() {
        const url = '/api/v1/FileUpload/fileget';
        try {
          const response = await this.httpClientWrapper.get(url);
          return response; 
        } catch (error) {
          throw error;
        }
      }

      async getFileByPepIdAndPathId(pepId: number, pathId: number, filename: string): Promise<any> {
        const url = `/api/v1/FileUpload/files/${pepId}/${pathId}/${filename}`;
    
        try {
            const response = await this.httpClientWrapper.get(url);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error fetching file: ${error.message}`);
            } else {
                throw new Error('Unknown error occurred during file fetch');
            }
        }
    }
    

    

}

export default FileUpload;
