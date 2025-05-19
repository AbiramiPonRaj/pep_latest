
  export interface Regulator {
    id: string;
    regulator: string;
  }
  
  export interface RecordType {
    id: string;
    regulator: string;
  
  }
  export interface Regulator {
    id: string;
    Dead: string;
  }

  export interface AliasesNameRequest {
    name: string;
  }
  export interface Gender {
    id: string;
   
    gender: string;
  }
  
  export interface BirthDataRequest {
    name: string;
  }
  export interface PlaceofBirthRequest {
    PlaceofBirth: string;
  }
  export interface Dead {
    id: string;
    Dead: string;
  }
  export interface AddressRequest {
  
    Address: string;
  }
  export interface DateofBirthRequest {
  
    DateofBirth: string;
  }
  export interface RelativeDetDTO {
   
    Aliaes: string;
    
   
  }
  
  export interface RelationDTOS {
    Relationshipname:string;
  }
  
  export interface RelativeDTO {
    pepId: number;
    relativeMasterId: string;
    relativeName: string;
    pan: string;
  }
  
  export interface RelativeCombineDTO {
 
    relativeDTO: RelativeDTO;
    relativeDetDTOS: RelativeDetDTO[];
    relationDTOSDTOS: RelationDTOS[];
  }
  export interface RelativePayload {
    relativeCombineDTO: RelativeCombineDTO[];
  }
  export  interface Image {
    name: string;
  }
  
  export interface CompanyDTO {
    id: number;
    // pepId: number;
  
    associateMasterId: number,
  
    companyName: string;
  
    originalDateOfAppointment: string;
    cinfcrn: string;
    document:string;
  }
  
  export interface CombinedDTO {
    companyDTO: CompanyDTO;
   
  }
  
  export interface Payload {
    combinedDTO: CombinedDTO[];
  
  
  
  }


  export interface OrganizationfDTO {
    pepId: number;
    LinkedIndividualName: string;
 
  }
  
  export interface OrganizationNameDTO {
    pepId: number;
  
    LinkedIndividualNameAliases: string;
   
  }
  
  export interface OrganizationrShareholderDTO {
    pepId: number;
   
    Relatinship: string;
    RelatinshipNameAliases:string;
  
  }
  export interface DetailsaboutDTO {
    pepId: number;
    DetailsabouttheRelation: string;
  }
  
  export interface OrganizationCommonDTO {
    organizationfDTO:  OrganizationfDTO;
    organizationNameDTO:  OrganizationNameDTO[];
    organizationrShareholderDTO:  OrganizationrShareholderDTO[];
    detailsaboutDTO:   DetailsaboutDTO[];
  }

  export interface OrganizationFamilyPayload {
    organizationCommonDTO: OrganizationCommonDTO[];
  }

  export interface HeadQuartersDTO {
    pepId: number;
    HeadQuartersId: number;
  }
  
  export interface NationalIdentificationDTO {
    pepId: number;
    HeadQuartersId:number
    NationalIdentificationId: number;
 
  }
  
  export interface NationalIdentificationNumberDTO {
    pepId: number;
   
    Name: string;
   
  }
  export interface NationalIdentificationDetailsDTO {
    pepId: number;
   
    Name: string;
  
  }
  
  
  export interface CountryofHeadQuartersCombinedDTO {
    headQuartersDTO: HeadQuartersDTO[];
    nationalIdentificationDTO: NationalIdentificationDTO[];
    nationalIdentificationNumberDTO: NationalIdentificationNumberDTO[];
    nationalIdentificationDetailsDTO: NationalIdentificationDetailsDTO[];
  }
  
  export interface HeadQuartersPayload {
    countryofHeadQuartersCombinedDTO:  CountryofHeadQuartersCombinedDTO[];
  }
  
  export interface Country {
    id: string;
    name: string;
  
  }

  export interface CustomerRequest {

    sourceLink: string;

  
  
  }