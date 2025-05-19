export interface SearchDetails {
    title: string;
    firstName: string;
    lastName: string;
    dob: string;
    placeofBirth: string;
    coName: string;
    designation: string;
    department: string;
    ministry: string;
    address: string;
    state: string;
    dist: string;
    id: number;
    criminalId: number;
}

export interface AliasesDetails {
    name: string;
    dateofbirth: string;
    criminalId: number;
}

export interface IdentificationDetails {
    idType: string;
    idDet: string;
    criminalId: number;
}

export interface PersonalDetails {
    relationship: string;
    name: string;
    aliaseName: string;
    dateOfBirth: string;
    companyName: string;
    accountNo: string;
    designation: string;
    aliaseAccountNo: string;
    criminalId: number;
}

export interface CompanyDetails {
    cin: string;
    companyName: string;
    accountNo: string;
    companyAddress: string;
    companyOwner: string;
    chairman: string;
    criminalId: number;
}

export interface CaseDetails {
    caseNo: string;
    caseTitle: string;
    summaryAllegations: string;
    dateOfRegistration: string;
    criminalId: number;
}




