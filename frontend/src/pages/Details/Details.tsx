import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Typography, Dialog, TextareaAutosize, DialogTitle, DialogContent, DialogActions, Modal, FormControlLabel, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './Details.css';
import { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import AddressApiService from '../../data/services/insert/address-api-service';
import RelativeApiService from '../../data/services/master/relative/relative-api-serivces';
import StateApiService from '../../data/services/master/State/state_api_service';
import CountryApiService from '../../data/services/master/Country/country_api_service';
import Header from '../../layouts/header/header';
import AssociatedListApiService from '../../data/services/AssociatedList/associatedlist-api-service';
import { AddressDTO, Pan, AkaDetRequest, AssociatedlistPayload, PartyPayload, CompaniesDirectorsDTO, CompanyDTO, ContactDTO, Country, CustomerRequest, Emailids, OtherAssociationRequest, PartyRequest, PartyAddress, Payload, PhoneNumbers, CompanyMasterPayload, Relative, RelativePayload, State, DesignationPayload, CompanyDocumentsDTO, Gender, FamilyPayload, SpouseFamilyPayload, ListOfCompanyPayload, PartysPayload } from '../../data/services/viewpage/viewpagedetails-payload';
import FileUpload from '../../data/services/Fileupload/fileupload_api_service';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DesignationService from '../../data/services/master/designation/designation_api_service';
import { Col } from 'react-bootstrap';
import PartyApiService from '../../data/services/master/party/party_api_serivces';
import CompanyMasterApiService from '../../data/services/master/companymaster/companymaster_api_service';
import { useParams } from 'react-router-dom';
import GenderApiService from '../../data/services/master/Gender/gender_api_service';
import ViewPageDetailsService from '../../data/services/viewpage/viewpagedetails-api-service';
import Checkbox from '@mui/material/Checkbox';

interface FieldState {
    imageName: string;
    fileType: string;
    uploading: boolean;
    uploadSuccess: boolean;
}

interface FieldState1 {
    imageName1: string;
    fileType: string;
    uploading: boolean;
    uploadSuccess: boolean;
}

interface FieldState2 {
    imageName2: string;
    fileType: string;
    uploading: boolean;
    uploadSuccess: boolean;
}

interface FieldState3 {
    imageName3: string;
    fileType: string;
    uploading: boolean;
    uploadSuccess: boolean;
}

interface FieldState4 {
    imageName4: string;
    fileType: string;
    uploading: boolean;
    uploadSuccess: boolean;
}

interface FieldState5 {
    imageName5: string;
    fileType: string;
    uploading: boolean;
    uploadSuccess: boolean;
}

interface FileType {
    id: string;
    name: string;
}

interface MultipartFile {
    name: string;
    size: number;
    type: string;
}

interface CombinedDTOSS {
    companyDTO: CompanyDTO;
}

interface CompanyDetailsItem {
    companyDTO: {
        id: number;
        associateMasterId: number;
        companyName: string;
        originalDateOfAppointment: string;
        cinfcrn: string;
        document: string;
    };
    addressDTOS: Array<{
        id: number;
        companyId: number;
        registeredAddress: string;
    }>;
    contactDTOS: Array<{
        companyId: number;
        emailID: string;
    }>;
    companiesDirectorsDTOS: Array<{
        id: number;
        din: string;
        companyId: number;
        directorId: number;
        designationId: number;
        companyMasterId: number;
        appointmentDate: string;
        cessationDate: string;
        designation: string;
        directorStatus: string;
        directorName: string;
    }>;
    companyDocumentsDTOS: Array<{
        companyId: number;
        documentTypeId: number;
        documentType: string;
        imageName3: string;
        uid: number;
        files3: string[];
        path: number[];
        euid: number;
    }>;
}

const Details: React.FC = () => {

    const navigate = useNavigate();
    const [listofcompanyError, setListOfCompanyError] = useState(false);

    const initialFieldState: FieldState = {
        imageName: '',
        fileType: '',
        uploading: false,
        uploadSuccess: false,
    };

    const initialFieldState1: FieldState1 = {
        imageName1: '',
        fileType: '',
        uploading: false,
        uploadSuccess: false,
    };

    const initialFieldState2: FieldState2 = {
        imageName2: '',
        fileType: '',
        uploading: false,
        uploadSuccess: false,
    };

    const initialFieldState3: FieldState3 = {
        imageName3: '',
        fileType: '',
        uploading: false,
        uploadSuccess: false,
    };

    const initialFieldState4: FieldState4 = {
        imageName4: '',
        fileType: '',
        uploading: false,
        uploadSuccess: false,
    };

    const initialFieldState5: FieldState5 = {
        imageName5: '',
        fileType: '',
        uploading: false,
        uploadSuccess: false,
    };

    const [formData, setFormData] = useState<CustomerRequest>({
        name: '',
        sourceLink: '',
        education: '',
        dob: '',
        placeOfBirth: '',
        pan: '',
        directorsIdentificationNumber: '',
        adverseInformation: 0,
        regulatoryAction: 0,
        uid: '',
        genderId: 0,
        createdAt: '',
    });

    const [akaformData, setAkaFormData] = useState<AkaDetRequest[]>([{ akaName: '' }]);
    const [PerMediaformData, setPerMediaData] = useState<OtherAssociationRequest[]>([{ otherAssociationAsPerMedia: '' }]);
    const [imageFiles, setImageFiles] = useState<{ data: any; name: string; ext: string }[]>([]);
    const location = useLocation();
    const countryName = sessionStorage.getItem('countryName');
    const stateName = sessionStorage.getItem('stateName');
    const [disabled, setDisabled] = useState(false);

    const [partyData, setPartyData] = useState<PartysPayload>({
        partyCommonDto: [
            {
                partyCandidateDetailsDTO: {
                    pepId: 0,
                    positionInTheGovernment: '',
                    otherInformation: '',
                    died: '',
                    permanentAddress: '',
                },
                partyDetailsDTO: [
                    {
                        pepId: 0,
                        partyMasterId: 0,
                        formerAndCurrent: '',
                        positionInTheParty: '',
                        partyCandidateId: 0,
                    },
                ],
            },
        ],
    });

    const [Address, setAddress] = useState<PartyAddress[]>([{
        permanentAddress: '',
    },]);

    const [RelativeformData, setRelativeFormData] = useState<RelativePayload>({
        relativeCombineDTO: [
            {
                relativeDTO: {
                    pepId: 0,
                    relativeMasterId: '',
                    relativeName: '',
                    pan: '',
                },
                relativeDetDTOS: [
                    {
                        pepId: 0,
                        relativeId: 0,
                        name: '',
                        pan: '',
                    },
                ],
                relativeChildrenDTOS: [
                    {
                        pepId: 0,
                        relativeDetId: 0,
                        relativeId: 0,
                        childrenName: '',
                        pan: '',
                    },
                ],
            },
        ],
    });

    const [FamilyformData, setFamilyFormData] = useState<FamilyPayload>({
        familyCombinedDTO: [
            {
                hufDTO: [
                    {
                        pepId: 0,
                        hufPan: '',
                        hufName: '',
                    },
                ],
                fatherDTOS: [
                    {
                        pepId: 0,
                        fatherName: '',
                        fatherPan: '',
                    },
                ],
                motherDTOS: [
                    {
                        pepId: 0,
                        motherName: '',
                        motherPan: '',
                    },
                ],
            },
        ],
    });

    const [SpouseFamilyformData, setSpouseFamilyFormData] = useState<SpouseFamilyPayload>({
        spouseCommonDTO: [
            {
                spouseDetailsDTO: {
                    pepId: 0,
                    spouseName: '',
                    spousePan: '',
                },
                spouseHufDTOS: [
                    {
                        pepId: 0,
                        spouseId: 0,
                        hufName: '',
                        hufPan: '',
                    },
                ],
                spouseFatherDTOS: [
                    {
                        pepId: 0,
                        spouseId: 0,
                        fatherName: '',
                        fatherPan: '',
                    },
                ],
                spouseMotherDTOS: [
                    {
                        pepId: 0,
                        spouseId: 0,
                        motherName: '',
                        motherPan: '',
                    },
                ],
            },
        ],
    });

    const [motherPanErrors, setmotherPanErrors] = useState<string[]>([]);
    const [fatherPanErrors, setfatherPanErrors] = useState<string[]>([]);
    const [HUFPanErrors, setHUFPanErrors] = useState<string[]>([]);
    const [relative, setRelative] = useState<Relative[]>([]);
    const [PhoneNumberss, setPhoneNumberss] = useState<PhoneNumbers[]>([{ pepId: 0, communicationDt: '', communicationTypeId: 0 }]);
    const [Emailidss, setEmailidss] = useState<Emailids[]>([{ pepId: 0, communicationDt: '', communicationTypeId: 0 }]);
    const relatives = new RelativeApiService();
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedState, setselectedState] = useState<string[]>(['']);
    const [states, setStates] = useState<State[]>([]);
    const authService = new StateApiService();
    const countryService = new CountryApiService();
    const genderService = new GenderApiService();
    const partyservices = new PartyApiService();
    const [Party, setparty] = useState<PartyPayload[]>([]);
    const companymasterservices = new CompanyMasterApiService();
    const [companymaster, setcompanymaster] = useState<CompanyMasterPayload[]>([]);
    const [listOfCompanyDetails, setListOfCompany] = useState<ListOfCompanyPayload[]>([]);
    const [selectedParty, setselecteParty] = useState<string[]>(['']);
    const [gender, setgender] = useState<Gender[]>([]);
    const fileUpload = new FileUpload();
    const [filetype, Setfiletype] = useState<FileType[]>([]);
    const [filetype1, setFiletype1] = useState<FileType[]>([]);
    const [filetype2, setFiletype2] = useState<FileType[]>([]);
    const [filetype3, setFiletype3] = useState<FileType[]>([]);
    const [filetype4, setFiletype4] = useState<FileType[]>([]);
    const [filetype5, setFiletype5] = useState<FileType[]>([]);
    const [filteredFileTypes, setFilteredFileTypes] = useState<FileType[]>([]);
    const [fields, setFields] = useState<FieldState[]>([initialFieldState]);
    const [fields1, setFields1] = useState<FieldState1[]>([initialFieldState1]);
    const [fields2, setFields2] = useState<FieldState2[]>([initialFieldState2]);
    const [fields3, setFields3] = useState<FieldState3[]>([initialFieldState3]);
    const [fields4, setFields4] = useState<FieldState4[]>([initialFieldState4]);
    const [fields5, setFields5] = useState<FieldState5[]>([initialFieldState5]);
    const { pepId, stateId, countryId } = useParams();
    const [error, setError] = useState<string | null>(null);
    const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
    const selectedField = fields[selectedFileIndex || 0];
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [fileErrorMessage, setFileErrorMessage] = useState<string | null>(null);
    const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
    const sourceLinkRef = useRef<HTMLInputElement | null>(null);
    const nameRef = useRef<HTMLInputElement | null>(null);
    const genderRef = useRef<HTMLInputElement | null>(null);
    const companynameRef = useRef<HTMLInputElement | null>(null);
    const companyFileTypeRef = useRef<HTMLInputElement | null>(null);
    const [sourceLinkError, setSourceLinkError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [genderError, setGenderError] = useState(false);
    const [companyFileTypeError, setCompanyFileTypeError] = useState(false);
    const [panError, setPanError] = useState('');
    const [panfatherError, setPanfatherError] = useState('');
    const [panmotherError, setPanmotherError] = useState('');
    const [emailErrors, setEmailErrors] = useState<string[]>([]);
    const [panErrors, setPanErrors] = useState<string[]>([]);
    const [panfatherErrors, setPanfatherErrors] = useState<string[]>([]);
    const [panhufErrors, setPanhufErrors] = useState<string[]>([]);
    const [panmotherErrors, setPanmotherErrors] = useState<string[]>([]);
    const [isValidInput, setIsValidInput] = useState(true);
    const [relativePanTouched, setRelativePanTouched] = useState(false);
    const [relativePanspouseTouched, setRelativePanspouseTouched] = useState(false);
    const [spousePanTouched, setSpousePanTouched] = useState(false);
    const [spousePanhufTouched, setSpousePanhufTouched] = useState(false);
    const [childrenPanTouched, setChildrenPanTouched] = useState(false);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [touchedFields, setTouchedFields] = useState<boolean[]>([false]);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        fetchListOfCompany();
        fetchAssociatedList();
        setSelectedCountry('');
        fetchDesignationList();
        fetchCountries();
        fetchRelative();
        fetchStates();
        fetchfiletype();
        fetchPartylist();
        fetchgender();
        fetchComapnymasterlist();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
    }, [countryName, stateName]);

    const fetchfiletype = async () => {
        try {
            const response: FileType[] = await fileUpload.getfiletype();
            const response1: FileType[] = await fileUpload.getfiletype1();
            const response2: FileType[] = await fileUpload.getfiletype2();
            const response3: FileType[] = await fileUpload.getfiletype3();
            const response4: FileType[] = await fileUpload.getfiletype4();
            setFiletype1(response1);
            setFiletype2(response2);
            setFiletype3(response3);
            setFiletype4(response4);
            Setfiletype(response);
        } catch (error) {
            console.error('Error fetching filetype:', error);
        }
    };

    const [combinedDTOList, setCombinedDTOList] = useState<CombinedDTOSS[]>([]);

    const [formDatas, setformDatas] = useState<Payload>({
        combinedDTO: [
            {
                companyDTO: {
                    id: 0,
                    sourceLink: '',
                    associateMasterId: 0,
                    companyName: '',
                    listAdverseInformation: 0,
                    listRegulatoryAction: 0,
                    listGovernment: 0,
                    originalDateOfAppointment: '',
                    typeId: 0,
                    cinfcrn: '',
                    document: '',
                },
                addressDTOS: [
                    {
                        id: 0,
                        companyId: 0,
                        registeredAddress: '',
                    },
                ],
                contactDTOS: [
                    {
                        companyId: 0,
                        emailID: '',
                    },
                ],
                companiesDirectorsDTOS: [
                    {
                        id: 0,
                        din: '',
                        companyId: 0,
                        directorId: 0,
                        designationId: 0,
                        companyMasterId: 0,
                        appointmentDate: '',
                        cessationDate: '',
                        designation: '',
                        directorStatus: '',
                        directorName: '',
                    },
                ],
                companyDocumentsDTOS: [
                    {
                        companyId: 0,
                        documentTypeId: 0,
                        documentType: '',
                        imageName3: '',
                        uid: loginDetails.id,
                        files3: [],
                        path: [],
                        euid: 0,
                    },
                ],
                companyAssociationDTOS: [
                    {
                        id: 0,
                        companyId: 0,
                        companyAssociation: '',
                        uid: loginDetails.id,
                    },
                ],
            },
        ],
    });
    const [isPANExists, setIsPANExists] = useState(false); // State to manage PAN existence
    const [popupVisible, setPopupVisible] = useState<boolean>(false);


    const [clickCount, setClickCount] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState<Array<File[]>>([]);
    const authServices = new AddressApiService();
    const [associatedList, setAssociatedList] = useState<AssociatedlistPayload[]>([]);
    const associatedListService = new AssociatedListApiService();
    const [Designationlist, setDesignationlist] = useState<DesignationPayload[]>([]);
    const DesignationlistService = new DesignationService();
    const dinService = new ViewPageDetailsService();
    const [errorMsg, setErrorMsg] = useState("");
    const [errorMsgs, setErrorMsgs] = useState("");
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [isCheckboxCheckeds, setIsCheckboxCheckeds] = useState(false);

    const handleInputChangeCompanies = (
        personIndex: number,
        field:
            | keyof Payload['combinedDTO'][0]['companyDTO']
            | keyof Payload['combinedDTO'][0]['contactDTOS'][0]
            | keyof Payload['combinedDTO'][0]['addressDTOS'][0]
            | keyof Payload['combinedDTO'][0]['companiesDirectorsDTOS'][0],
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
    ) => {
        const updatedPeople = [...formDatas.combinedDTO];

        const updateContactField = (index: number, field: keyof ContactDTO) => {
            const value = event.target.value as string;
            updateNestedField(updatedPeople[personIndex].contactDTOS, index, field, value);
            validateEmail(value, index);
        };

        const updateAddressField = (index: number, field: keyof AddressDTO) => {
            updateNestedField(updatedPeople[personIndex].addressDTOS, index, field, event.target.value as string);
        };

        const updateDirectorsField = (index: number, field: keyof CompaniesDirectorsDTO) => {
            if (field === 'appointmentDate' || field === 'cessationDate') {
                updateNestedField(updatedPeople[personIndex].companiesDirectorsDTOS, index, field, event.target.value as string);
            } else {
                const value = typeof event.target.value === 'string' ? event.target.value : Number(event.target.value);
                updateNestedField(updatedPeople[personIndex].companiesDirectorsDTOS, index, field, value);
            }
        };
        if (index !== null) {
            if (field === 'emailID') {
                updateContactField(index, field);
            } else if (field === 'companyId' || field === 'registeredAddress') {
                updateAddressField(index, field);
            } else if (field === 'directorName' || field === 'din') {
                updateDirectorsField(index, field);
            } else if (field === 'appointmentDate' || field === 'cessationDate' || field === 'designationId' || field === 'companyMasterId') {
                updateDirectorsField(index, field);
            }
            if (index !== null && field === 'emailID') {
                updateContactField(index, field);
            }
        } else {
            const companyDTO = updatedPeople[personIndex].companyDTO;
            if (field === 'companyId' && 'companyId' in companyDTO) {
                companyDTO[field] = event.target.value as string;
            } else {
                const fieldType = getFieldInputType(field);
                (companyDTO as any)[field] = convertInputValue(event.target.value as string, fieldType);
            }
        }
        setformDatas({ combinedDTO: updatedPeople });
    };

    const updateNestedField = <T, K extends keyof T>(array: T[], index: number, key: K, value: T[K]) => {
        array[index][key] = value;
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateEmail = (email: string, index: number) => {
        const errors = [...emailErrors];
        const isValid = emailRegex.test(email);
        if (!isValid) {
            errors[index] = 'Invalid email Format';
        } else {
            errors[index] = '';
        }
        setEmailErrors(errors);
    };

    const getFieldInputType = (field: string): string => {
        switch (field) {
            case 'cinfcrn':
            case 'companyName':
            case 'designation':
            case 'sourceLink':
            case 'originalDateOfAppointment':
                return 'text';
            default:
                return 'text';
        }
    };

    const convertInputValue = (
        value: string,
        type: string
    ): any => {
        switch (type) {
            case 'text':
                return value;
            default:
                return value;
        }
    };

    const handleAddFieldCompanies = (
        personIndex: number,
        fieldType: string
    ) => {
        const updatedPeople = [...formDatas.combinedDTO];
        if (fieldType === 'email') {
            updatedPeople[personIndex].contactDTOS.push({
                companyId: 0,
                emailID: '',
            });
        } else if (fieldType === 'address') {
            updatedPeople[personIndex].addressDTOS.push({
                id: 0,
                companyId: 0,
                registeredAddress: '',
            });
        } else if (fieldType === 'directors') {
            updatedPeople[personIndex].companiesDirectorsDTOS.push({
                id: 0,
                din: '',
                companyId: 0,
                directorId: 0,
                designationId: 0,
                companyMasterId: 0,
                appointmentDate: '',
                cessationDate: '',
                designation: '',
                directorStatus: '',
                directorName: '',
            });
        }
        setformDatas({ combinedDTO: updatedPeople });
    };

    const handleDeleteFieldCompanies = (
        personIndex: number,
        field1:
            | keyof Payload['combinedDTO'][0]['contactDTOS'][0]
            | keyof Payload['combinedDTO'][0]['addressDTOS'][0]
            | keyof Payload['combinedDTO'][0]['companiesDirectorsDTOS'][0],
        index: number
    ) => {
        const updatedPeople = [...formDatas.combinedDTO];
        if (field1 === 'emailID') {
            updatedPeople[personIndex].contactDTOS.splice(index, 1);
        } else if (field1 === 'companyId' || field1 === 'registeredAddress') {
            updatedPeople[personIndex].addressDTOS.splice(index, 1);
        } else if (field1 === 'directorName' || field1 === 'din') {
            updatedPeople[personIndex].companiesDirectorsDTOS.splice(index, 1);
        }
        setformDatas({ combinedDTO: updatedPeople });
    };

    const handleRemoveBoxCompanies = (personIndex: number) => {
        const updatedPeople = [...formDatas.combinedDTO];
        updatedPeople.splice(personIndex, 1);
        setformDatas({ combinedDTO: updatedPeople });
        setClickCount(prevCount => Math.max(0, prevCount - 1));
    };

    const handleRemoveBoxakaName = (index: number) => {
        const updatedakaName = [...akaformData];
        updatedakaName.splice(index, 1);
        setAkaFormData(updatedakaName);
    };

    const handleAddakaNameField = () => {
        setAkaFormData([...akaformData, { akaName: '' }]);
    };

    const handleakaNameChange = (value: string, index: number) => {
        const updatedakaName = [...akaformData];
        updatedakaName[index].akaName = value;
        setAkaFormData(updatedakaName);
    };

    const [akaNameError, setAkaNameError] = useState(false);
    const resetAkaNameError = () => setAkaNameError(false);

    const handleRemoveBoxtPerMedia = (index: number) => {
        const updatedatPerMedia = [...PerMediaformData];
        updatedatPerMedia.splice(index, 1);
        setPerMediaData(updatedatPerMedia);
    };

    const handleRemoveBoximage = (index: number) => {
        const updatedatimage = [...fields];
        updatedatimage.splice(index, 1);
        setFields(updatedatimage);
    };

    const handleAddtPerMediaField = () => {
        setPerMediaData([...PerMediaformData, { otherAssociationAsPerMedia: '' }]);
    };

    const handletPerMediaChange = (value: string, index: number) => {
        const updatedatPerMedia = [...PerMediaformData];
        updatedatPerMedia[index].otherAssociationAsPerMedia = value;
        setPerMediaData(updatedatPerMedia);
    };

    const fetchStates = async () => {
        try {
            const States = await authService.getStateDataByCountryId();
            setStates(States);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    const fetchCountries = async () => {
        try {
            const Countries = await countryService.getCountryOptions();
            setCountries(Countries);
        } catch (error) {
            console.error("Error fetching Country:", error);
        }
    };

    const fetchgender = async () => {
        try {
            const gender = await genderService.getGender();
            setgender(gender);
        } catch (error) {
            console.error("Error fetching gender:", error);
        }
    };

    const [partyMasterIdList, setPartyMasterIdList] = useState<number[]>([]);

    const fetchPartylist = async () => {
        try {
            const partylist = await partyservices.getparty();
            setparty(partylist);
        } catch (error) {
            console.error('Error fetching associated list:', error);
        }
    };

    const fetchComapnymasterlist = async () => {
        try {
            const comapnymasterlist = await companymasterservices.getCompanyMaster();
            setcompanymaster(comapnymasterlist);
        } catch (error) {
            console.error('Error fetching associated list:', error);
        }
    };

    const fetchAssociatedList = async () => {
        try {
            const associatedListData = await associatedListService.getAssociatedList();
            setAssociatedList(associatedListData);
        } catch (error) {
            console.error('Error fetching associated list:', error);
        }
    };

    const fetchListOfCompany = async () => {
        try {
            const listCompanyData = await associatedListService.getListOfCompany();
            setListOfCompany(listCompanyData);
        } catch (error) {
            console.error('Error fetching listOfCompany List:', error);
        }
    };

    const fetchDesignationList = async () => {
        try {
            const designationlistData = await DesignationlistService.getDesignation();
            setDesignationlist(designationlistData);
        } catch (error) {
            console.error('Error fetching designation list:', error);
        }
    };

    const [associatedDetails, setAssociatedDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleDinChange = async (din: string) => {
        try {
            const response = await dinService.getdincompany(din);
            if (response && response.data) {
                const formDatas = response.data.map((item: any) => ({
                    companyName: item.companyDTO.companyName,
                }));
                setformDatas(formDatas);
            }
        } catch (error) {
            console.error("Error fetching associated details:", error);
        }
    };

    useEffect(() => {
        const handleDinChange = async (din: string) => {
            try {
                const response = await dinService.getdincompany(din);
                if (response && response.data) {
                    const formDatas = response.data.map((item: any) => ({
                        companyName: item.companyDTO.companyName,
                    }));
                    setformDatas(formDatas);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        handleDinChange('122024');
    }, []);

    const handleInputChangeFamily = (
        personIndex: number,
        field: 'relativeName' | 'pan' | 'childrenName' | 'name' | 'childrenPan',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(RelativeformData));
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        if (index !== null) {
            if (field === 'name' || field === 'pan') {
                if (!updatedPeople.relativeCombineDTO[personIndex].relativeDetDTOS[index]) {
                    updatedPeople.relativeCombineDTO[personIndex].relativeDetDTOS[index] = {
                        pepId: 0,
                        relativeId: 0,
                        name: '',
                        pan: '',
                    };
                }
                updatedPeople.relativeCombineDTO[personIndex].relativeDetDTOS[index][field] = event.target.value;
                if (field === 'pan' && !panRegex.test(event.target.value)) {
                    console.error('Invalid PAN Format');
                    setSpousePanTouched(true);
                }
            } else if (field === 'childrenName' || field === 'childrenPan') {
                if (!updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index]) {
                    updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index] = {
                        pepId: 0,
                        relativeDetId: 0,
                        childrenName: '',
                        childrenPan: '',
                    };
                }
                updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index][field] = event.target.value;
                if (field === 'childrenPan' && !panRegex.test(event.target.value)) {
                    console.error('Invalid PAN Format');
                    setChildrenPanTouched(true);
                }
            }
        } else {
            if (field === 'relativeName' || field === 'pan') {
                updatedPeople.relativeCombineDTO[personIndex].relativeDTO[field] = field === 'relativeName' ? event.target.value : event.target.value.toUpperCase();
                if (field === 'pan' && !panRegex.test(updatedPeople.relativeCombineDTO[personIndex].relativeDTO[field])) {
                    console.error('Invalid PAN Format');
                    setRelativePanTouched(true);
                }
            }
        }
        setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
        setTouched(true);
    };

    const handleInputChangchilderpan = (
        personIndex: number,
        field: 'pan' | 'childrenName',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(RelativeformData));
        const value = field === 'childrenName' ? event.target.value : event.target.value.toUpperCase();
        if (index !== null) {
            if (field === 'childrenName' || field === 'pan') {
                if (!updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index]) {
                    updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index] = {
                        pepId: 0,
                        relativeDetId: 0,
                        childrenName: '',
                        childrenPan: '',
                    };
                }
                updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index][field] = value;
                if (field === 'pan') {
                    validatePan(value, index);
                }
            }
        }
        setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
    };

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

    const validatePan = (pan: string, index: number | null) => {
        const errors = [...panErrors];
        const isValid = panRegex.test(pan);
        if (index !== null) {
            if (!isValid) {
                errors[index] = 'Invalid PAN Format';
            } else {
                errors[index] = '';
            }
        }
        setPanErrors(errors);
    };

    const handleRemoveBoxFamily = (personIndex: number) => {
        setRelativeFormData((prevData) => {
            const updatedPeople = [...prevData.relativeCombineDTO];
            updatedPeople.splice(personIndex, 1);
            return { relativeCombineDTO: updatedPeople };
        });
    };

    const handleAddFieldFamily = (personIndex: number, fieldType: 'Spouse' | 'children') => {
        const updatedPeople = { ...RelativeformData };
        if (fieldType === 'Spouse') {
            updatedPeople.relativeCombineDTO[personIndex].relativeDetDTOS.push({
                pepId: 0,
                relativeId: 0,
                name: '',
                pan: '',
            });
        }
        else if (fieldType === 'children') {
            updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS.push({
                pepId: 0,
                relativeDetId: 0,
                relativeId: 0,
                childrenName: '',
                pan: '',
            });
        }
        setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
    };

    const handleAddDoc = (personIndex: number, fieldType: 'image') => {
        const updatedPeople = { ...formDatas };
        if (fieldType === 'image') {
            updatedPeople.combinedDTO[personIndex].companyDocumentsDTOS.push({
                companyId: 0,
                documentTypeId: 1,
                documentType: '',
                imageName3: '',
                uid: 0,
                euid: 0,
                files3: [],
                path: [4, 5, 6],
            });
        }
        setformDatas({ combinedDTO: [...updatedPeople.combinedDTO] });
    };

    const handleDeleteFieldFamily = (
        personIndex: number,
        field1: 'relativeName' | 'pan' | 'childrenName',
        index: number
    ) => {
        const updatedPeople = [...RelativeformData.relativeCombineDTO];
        if (field1 === 'relativeName' || field1 === 'pan') {
            updatedPeople[personIndex].relativeDetDTOS.splice(index, 1);
        } else if (field1 === 'childrenName' || field1 === 'pan') {
            updatedPeople[personIndex].relativeChildrenDTOS.splice(index, 1);
        }
        setRelativeFormData({ relativeCombineDTO: updatedPeople });
    };

    const handleDeleteDoc = (
        personIndex: number,
        field1: 'documentType',
        index: number
    ) => {
        const updatedPeople = [...formDatas.combinedDTO];
        if (field1 === 'documentType') {
            updatedPeople[personIndex].companyDocumentsDTOS.splice(index, 1);
        }
        setformDatas({ combinedDTO: updatedPeople });
    };

    const handleDeleteFieldchilder = (
        personIndex: number,
        field1: 'pan' | 'childrenName',
        index: number
    ) => {
        const updatedPeople = [...RelativeformData.relativeCombineDTO];
        if (field1 === 'childrenName' || field1 === 'pan') {
            updatedPeople[personIndex].relativeChildrenDTOS.splice(index, 1);
        }
        setRelativeFormData({ relativeCombineDTO: updatedPeople });
    };

    const fetchRelative = async () => {
        try {
            const relativeData = await relatives.getRelative();
            setRelative(relativeData);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const handlecompanyChange = (personIndex: number, value: any) => {
        const updatedPeople = JSON.parse(JSON.stringify(formDatas));
        updatedPeople.combinedDTO[personIndex].companiesDirectorsDTOS.designationId = value;
        setformDatas({ combinedDTO: updatedPeople.combinedDTO });
    };

    const handleassociatedListChange = (personIndex: number, value: any) => {
        const updatedPeople = JSON.parse(JSON.stringify(formDatas));
        updatedPeople.combinedDTO[personIndex].relativeDTO.relativeMasterId = value;
        setformDatas({ combinedDTO: updatedPeople.combinedDTO });
    };

    const handleRemoveBoxPhoneNumbers = (index: number) => {
        const updatedPhoneNumberss = [...PhoneNumberss];
        updatedPhoneNumberss.splice(index, 1);
        setPhoneNumberss(updatedPhoneNumberss);
    };

    const handleAddPhoneNumbersNameField = () => {
        setPhoneNumberss([...PhoneNumberss, { pepId: 0, communicationDt: '', communicationTypeId: 4 }]);
    };

    const handlePhoneNumbersNameChange = (value: string, index: number) => {
        if (/^[0-9+-]*$/.test(value) || value === '') {
            const updatedPhoneNumberss = [...PhoneNumberss];
            updatedPhoneNumberss[index].communicationDt = value;
            setPhoneNumberss(updatedPhoneNumberss);
            setIsValidInput(true);
        } else {
            setIsEditing(index);
            setIsValidInput(false);
        }
    };

    const handleFocus = (index: number) => {
        setIsEditing(index);
    };

    const handleBlur = () => {
        setIsEditing(null);
    };

    const handleRemoveBoxEmailids = (index: number) => {
        const updatedEmailidss = [...Emailidss];
        updatedEmailidss.splice(index, 1);
        setEmailidss(updatedEmailidss);
    };

    const handleAddEmailidsNameField = () => {
        setEmailidss([...Emailidss, { pepId: 0, communicationDt: '', communicationTypeId: 0 }]);
    };

    const handleEmailidsNameChange = (value: string, index: number) => {
        const updatedEmailidss = [...Emailidss];
        updatedEmailidss[index].communicationDt = value;
        setEmailidss(updatedEmailidss);
        const updatedTouchedFields = [...touchedFields];
        updatedTouchedFields[index] = true;
        setTouchedFields(updatedTouchedFields);
    };

    // const handleRemovePartyformData = (index: number) => {
    //     const updatedFormData = [...PartyformData];
    //     updatedFormData.splice(index, 1);
    //     setPartyFormData(updatedFormData);
    // };

    const handleRemovePartyFormData = (index: number) => {
        setPartyData((prevData) => {
            const updatedFormData = [...prevData.partyCommonDto];
            updatedFormData.splice(index, 1);
            return { ...prevData, partyCommonDto: updatedFormData };
        });
    };
    // const handlePartyformDataChange = (value: string, index: number) => {
    //     const updatedFormData = [...prevData.partyCommonDto];
    //     updatedFormData[index].formerAndCurrent = value;
    //     setPartyFormData(updatedFormData);
    // };

    // const handlePartyformDatasChanges = (value: string, index: number) => {
    //     const updatedFormData = [...prevData.partyCommonDto];
    //     updatedFormData[index].positionInTheParty = value;
    //     setPartyFormData(updatedFormData);
    // };

    const handlePartyFormDataChange = (value: string, index: number) => {
        setPartyData((prevData) => {
            const updatedFormData = [...prevData.partyCommonDto];
            updatedFormData[index].partyDetailsDTO[0].formerAndCurrent = value;
            return { ...prevData, partyCommonDto: updatedFormData };
        });
    };
    const handlePartyFormDatasChanges = (value: string, index: number) => {
        setPartyData((prevData) => {
            const updatedFormData = [...prevData.partyCommonDto];
            updatedFormData[index].partyDetailsDTO[0].positionInTheParty = value;
            return { ...prevData, partyCommonDto: updatedFormData };
        });
    };


    // const handleAddPartyformDataField = () => {
    //     setPartyFormData([...prevData.partyCommonDto, { formerAndCurrent: '', stateId: '', countryId: '', otherInformation: '', died: '', permanentAddress: '', positionInTheGovernment: '', partyMasterId: '', positionInTheParty: '' }]);
    // };

    // const handleRemovePartyformstate = (index: number) => {
    //     const updatedFormData = [...prevData.partyCommonDto];
    //     updatedFormData.splice(index, 1);
    //     const updatedStates = [...selectedState];
    //     updatedStates.splice(index, 1);
    //     setPartyFormData(updatedFormData);
    //     setselectedState(updatedStates);
    // };

    const handlePartyFormStateChange = (
        personIndex: number,
        index: number | null,
        field: 'partyMasterId' | 'formerAndCurrent' | 'positionInTheParty',
        event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<number>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(partyData));
        const value = event.target.value;

        if (index !== null) {
            if (field === 'partyMasterId' || field === 'formerAndCurrent' || field === 'positionInTheParty') {
                if (!updatedPeople.partyCommonDto[personIndex].partyDetailsDTO[index]) {
                    updatedPeople.partyCommonDto[personIndex].partyDetailsDTO[index] = {
                        pepId: 0,
                        partyMasterId: 0,
                        formerAndCurrent: '',
                        partyCandidateId: 0,
                        positionInTheParty: '',
                    };
                }
                updatedPeople.partyCommonDto[personIndex].partyDetailsDTO[index][field] = value;
            }
        }
        setPartyData({ partyCommonDto: updatedPeople.partyCommonDto });
    };
    // const handlePartyformstateChange = (value: string, index: number) => {
    //     const updatedStates = [...selectedParty];
    //     updatedStates[index] = value;
    //     setselecteParty(updatedStates);
    //     const updatedFormData = [...prevData.partyCommonDto];
    //     updatedFormData[index].stateId = value;
    //     setPartyFormData(updatedFormData);
    // };

    // const handleAddPartyformstateField = () => {
    //     setPartyFormData([
    //         ...PartyformData,
    //         {
    //             formerAndCurrent: '',
    //             stateId: '',
    //             countryId: '',
    //             otherInformation: '',
    //             died: '',
    //             permanentAddress: '',
    //             positionInTheGovernment: '',
    //             partyMasterId: '',
    //             positionInTheParty: ''
    //         },
    //     ]);
    //     setselectedState([...selectedState, '']);
    // };

    // const handleOtherInformationChange = (value: string) => {
    //     const updatedFormData = [...PartyformData];
    //     updatedFormData[0].otherInformation = value;
    //     setPartyFormData(updatedFormData);
    // };

    const handleOtherInformationChange = (value: string) => {
        setPartyData((prevState) => {
            const newPartyCommonDto = [...prevState.partyCommonDto];
            if (newPartyCommonDto[0]) {
                newPartyCommonDto[0].partyCandidateDetailsDTO.otherInformation = value;
            }
            return { ...prevState, partyCommonDto: newPartyCommonDto };
        });
    };
    // const handlePermanentAddressChange = (value: string) => {
    //     const updatedFormData = [...PartyformData];
    //     updatedFormData[0].permanentAddress = value;
    //     setPartyFormData(updatedFormData);
    // };
    // const handlepositionInTheGovernment = (value: string) => {
    //     const updatedFormData = [...PartyformData];
    //     updatedFormData[0].positionInTheGovernment = value;
    //     setPartyFormData(updatedFormData);
    // };

    // const handlediedChange = (value: string) => {
    //     const updatedFormData = [...PartyformData];
    //     updatedFormData[0].died = value;
    //     setPartyFormData(updatedFormData);
    // };

    const handleDeleteparty = (
        personIndex: number,
        field1: 'formerAndCurrent' | 'positionInTheParty',
        index: number
    ) => {
        const updatedPeople = [...partyData.partyCommonDto];
        if (field1 === 'formerAndCurrent' || field1 === 'positionInTheParty') {
            updatedPeople[personIndex].partyDetailsDTO.splice(index, 1);
        }
        setPartyData({ partyCommonDto: updatedPeople });
    };

    const handleAddFieldpartydetails = (personIndex: number, fieldType: 'party') => {
        const updatedPeople = { ...partyData };

        if (fieldType === 'party') {
            updatedPeople.partyCommonDto[personIndex].partyDetailsDTO.push({
                pepId: 0,
                partyMasterId: 0,
                formerAndCurrent: '',
                partyCandidateId: 0,
                positionInTheParty: '',
            });

        };
        setPartyData({ partyCommonDto: updatedPeople.partyCommonDto });

    };
    const handlePermanentAddressChange = (value: string) => {
        setPartyData((prevState) => {
            const newPartyCommonDto = [...prevState.partyCommonDto];
            if (newPartyCommonDto[0]) {
                newPartyCommonDto[0].partyCandidateDetailsDTO.permanentAddress = value;
            }
            return { ...prevState, partyCommonDto: newPartyCommonDto };
        });
    };

    const handlePositionintheGovernmentChange = (value: string) => {
        setPartyData((prevState) => {
            const newPartyCommonDto = [...prevState.partyCommonDto];
            if (newPartyCommonDto[0]) {
                newPartyCommonDto[0].partyCandidateDetailsDTO.positionInTheGovernment = value;
            }
            return { ...prevState, partyCommonDto: newPartyCommonDto };
        });
    };


    const handlediedChange = (value: string) => {
        setPartyData((prevState) => {
            const newPartyCommonDto = [...prevState.partyCommonDto];
            if (newPartyCommonDto[0]) {
                newPartyCommonDto[0].partyCandidateDetailsDTO.died = value;
            }
            return { ...prevState, partyCommonDto: newPartyCommonDto };
        });
    };
    const handlegender = (event: SelectChangeEvent<string>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            genderId: parseInt(event.target.value, 10),
        }));
    };

    const isValidPAN = (pan: string) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        return panRegex.test(pan);
    };

    const [panValue, setPanValue] = useState<Pan>({
        pan: '',


    });

    const checkPANExists = async (pan: string) => {
        try {

            const fetchedPanValue = await dinService.getPan(pan);

            if (fetchedPanValue !== '') {
                setPopupVisible(true);
            } else {
                setPopupVisible(false);
            }
        } catch (error) {

            setPanError('PAN Value already exists ');
        }


    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name: string; value: unknown }> | SelectChangeEvent<string>,
        index: number
    ) => {
        const { name, value } = e.target as HTMLInputElement;
        const containsSpecialChars = (input: string) => /[!@#$%^&*(),.?":{}|<>]/.test(input);
        if (name === 'pan') {
            const uppercaseValue = value.toUpperCase();
            const isValid = isValidPAN(uppercaseValue);
            const limitedValue = uppercaseValue.slice(0, 10);
            setFormData((prevData) =>
            ({
                ...prevData,
                [name]: limitedValue,
            }));
            setPanError(isValid ? '' : 'Invalid PAN Format');
            checkPANExists(limitedValue);
        } else if (name === 'name') {
            if (!containsSpecialChars(value as string)) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            }
        } else if (name in formData) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (name === 'countryId') {
            setSelectedCountry(value as string);
        } else if (name in partyData) {
            setPartyData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }

    };
    const handleClose = () => {
        setPopupVisible(false);
    };

    // const handleChange = (
    //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name: string; value: unknown }> | SelectChangeEvent<string>,
    //     index: number
    // ) => {
    //     const { name, value } = e.target as HTMLInputElement;
    //     const containsSpecialChars = (input: string) => /[!@#$%^&*(),.?":{}|<>]/.test(input);
    //     if (name === 'pan') {
    //         const uppercaseValue = value.toUpperCase();
    //         const isValid = isValidPAN(uppercaseValue);
    //         const limitedValue = uppercaseValue.slice(0, 10);
    //         setFormData((prevData) =>
    //         ({
    //             ...prevData,
    //             [name]: limitedValue,
    //         }));
    //         setPanError(isValid ? '' : 'Invalid PAN Format');
    //         checkPANExists(limitedValue);
    //     } else if (name === 'name') {
    //         if (!containsSpecialChars(value as string)) {
    //             setFormData((prevData) => ({
    //                 ...prevData,
    //                 [name]: value,
    //             }));
    //         }
    //
    //     } else if (name in formData) {
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             [name]: value,
    //         }));
    //     } else if (name === 'countryId') {
    //         setSelectedCountry(value as string);
    //     } else if (name in PartyformData) {
    //         setPartyFormData((prevData) => ({
    //             ...prevData,
    //             [name]: value,
    //         }));
    //     }

    // };

    // const handleClose = () => {
    //     setPopupVisible(false);
    // };

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const selectedDate = e.target.value;
        const formattedDate = formatToCustomFormat(selectedDate);
        setFormData((prevData) => ({
            ...prevData,
            dob: formattedDate,
        }));
    };

    const formatToCustomFormat = (selectedDate: string): string => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        const dateObject = new Date(selectedDate);
        return dateObject.toLocaleDateString('en-US', options);
    };

    const userId = location.state?.userId || "";
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setIsSuccessOpen(true);
    };

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setIsErrorOpen(true);
    };

    const handleKeyPress = (e: { key: string }) => {
        if (e.key === 'Enter') {
            handleSubmit(0, 0, 0, 0, 0, 0, '',);
        }
    };

    const resetSourceLinkError = () => {
        setSourceLinkError(false);
    };

    const resetNameError = () => {
        setNameError(false);
    };

    const resetGenderError = () => {
        setGenderError(false);
    };

    const resetCompanyFileError = () => {
        setCompanyFileTypeError(false);
    };

    const resetAllErrors = () => {
        setSourceLinkError(false);
        setNameError(false);
        setGenderError(false);
    };

    const [typeId, setTypeId] = useState('');

    useEffect(() => {
    }, [formDatas.combinedDTO[0].companyDTO.typeId]);

    // Use the inactivity timeout hook
    //   useInactivityTimeout(60000); // 1 minute inactivity timeout
    const handleSubmit = async (
        index: number,
        index1: number,
        index2: number,
        personIndex: number,
        index3: number,
        index4: number,
        cinfcrn: string
    ) => {
        try {
            resetAllErrors();
            let hasError = false;
            const adverseInformation = adverseInformationCheckValue ? 1 : 0;
            const regulatoryAction = regulatoryActionCheckValue ? 1 : 0;
            const selectedListofCompanyID = selectedListofCompany;
            const listAdverseInformation = listAdverseInfromationCheckValue ? 1 : 0;
            const listRegulatoryAction = includeListRegulatoryAction ? 1 : 0;
            const listGovernment = includeGovernment ? 1 : 0;

            if (
                formData.sourceLink.trim() === '' ||
                formData.name.trim() === '' ||
                !formData.genderId
            ) {
                if (formData.sourceLink.trim() === '') {
                    setSourceLinkError(true);
                    if (sourceLinkRef.current) {
                        sourceLinkRef.current.focus();
                    }
                }
                if (formData.name.trim() === '') {
                    setNameError(true);
                    if (nameRef.current) {
                        nameRef.current.focus();
                    }
                }
                if (!formData.genderId) {
                    setGenderError(true);
                    if (genderRef.current) {
                        genderRef.current.focus();
                    }
                }
                return;
            }
            const companySizes = clickCount;

            const PepDetailsWriteDTO = {
                combinedDTO: formDatas.combinedDTO.map((person) => ({
                    companyDTO: {
                        ...person.companyDTO,
                        listAdverseInformation: person.companyDTO.listAdverseInformation ? 1 : 0,
                        listRegulatoryAction: person.companyDTO.listRegulatoryAction ? 1 : 0,
                        listGovernment: person.companyDTO.listGovernment ? 1 : 0,
                    },
                    addressDTOS: person.addressDTOS.map((address) => ({ ...address })),
                    contactDTOS: person.contactDTOS.map((contact) => ({ ...contact })),
                    companiesDirectorsDTOS: person.companiesDirectorsDTOS.map((directors) => ({ ...directors })),
                    companyDocumentsDTOS: person.companyDocumentsDTOS.map((doc) => ({ ...doc })),
                    companyAssociationDTOS: person.companyAssociationDTOS.map((permedia) => ({ ...permedia })),

                })),
                createCustomerRequest: {
                    name: formData.name,
                    sourceLink: formData.sourceLink,
                    education: formData.education,
                    dob: formData.dob,
                    pan: formData.pan,
                    directorsIdentificationNumber: formData.directorsIdentificationNumber,
                    regulatoryAction: regulatoryAction,
                    adverseInformation: adverseInformation,
                    genderId: formData.genderId,
                    placeOfBirth: formData.placeOfBirth,
                    uid: loginDetails.id,
                },
                createAkaDetRequest: akaformData
                    .filter(aka => aka.akaName !== null && aka.akaName !== '')
                    .map(aka => ({
                        akaName: aka.akaName,
                        uid: loginDetails.id,
                    })),
                createContactsDetailsRequest: [
                    ...PhoneNumberss
                        .filter((PhoneNumber) => PhoneNumber.communicationDt !== null && PhoneNumber.communicationDt !== '')
                        .map((PhoneNumber) => ({
                            id: PhoneNumber.pepId,
                            pepId: PhoneNumber.pepId,
                            communicationTypeId: 1,
                            communicationDt: PhoneNumber.communicationDt,
                            uid: loginDetails.id,
                        })),
                    //
                    ...Emailidss
                        .filter((Emailids) => Emailids.communicationDt !== null && Emailids.communicationDt !== '')
                        .map((Emailids) => ({
                            id: Emailids.pepId,
                            pepId: Emailids.pepId,
                            communicationTypeId: 2,
                            communicationDt: Emailids.communicationDt,
                            uid: loginDetails.id,
                        })),
                ],
                partyCommonDtoList: partyData.partyCommonDto,
                createOtherAssociationRequest: PerMediaformData
                    .filter(person => person.otherAssociationAsPerMedia !== null && person.otherAssociationAsPerMedia !== '')
                    .map(person => ({
                        otherAssociationAsPerMedia: person.otherAssociationAsPerMedia,
                        uid: loginDetails.id,
                    })),
                relativeCombineDTOList: RelativeformData.relativeCombineDTO,
                familyCombinedDTOList: FamilyformData.familyCombinedDTO,
                spouseCommonDTOList: SpouseFamilyformData.spouseCommonDTO,
                uid: loginDetails.id,
            };
            const numericFileTypeId: number = parseInt(fields[index].fileType, 10) || 1;
            const numericFileTypeId1: number = parseInt(fields1[index1].fileType, 10) || 2;
            const numericFileTypeId2: number = parseInt(fields2[index2].fileType, 10) || 3;
            const numericFileTypeId4: number = parseInt(fields4[index4].fileType, 10) || 4;
            const fileInput = document.getElementById(`image-upload-input-${index}`) as HTMLInputElement;
            const fileInput1 = document.getElementById(`image-upload-input1-${index1}`) as HTMLInputElement;
            const fileInput2 = document.getElementById(`image-upload-input2-${index2}`) as HTMLInputElement;
            const fileInput4 = document.getElementById(`image-upload-input4-${index4}`) as HTMLInputElement;
            const companyDocumentArray: File[] = [];
            const pathArray: number[] = [];
            const companyArray: string[] = [];
            for (let i = 0; i <= companySizes; i++) {
                let fileInput3 = document.getElementById(`image-upload-input3-${i}-${index3}`) as HTMLInputElement;
                let cinfcrn = document.getElementById(`cinfcrn-${i}`) as HTMLInputElement;
                if (fileInput3.files) {
                    const filesArray3: File[] = Array.from(fileInput3.files);
                    const updatedPeople = { ...formDatas };
                    const filePathValue: string | undefined = updatedPeople.combinedDTO?.[i]?.companyDocumentsDTOS?.[index3]?.path?.join('') ?? '';
                    const cinfcrnValue: string = cinfcrn.value;
                    companyDocumentArray.push(...filesArray3);
                    pathArray.push(parseInt(filePathValue, 10));
                    companyArray.push(cinfcrnValue);
                }
            }
            const addressApiService = new AddressApiService();
            const filesArray: File[] = fileInput.files ? Array.from(fileInput.files) : [];
            const filesArray1: File[] = fileInput1.files ? Array.from(fileInput1.files) : [];
            const filesArray2: File[] = fileInput2.files ? Array.from(fileInput2.files) : [];
            const filesArray4: File[] = fileInput4.files ? Array.from(fileInput4.files) : [];
            const response = await addressApiService.saveCustomerRequest(
                PepDetailsWriteDTO,
                filesArray,
                [numericFileTypeId],
                filesArray1,
                [numericFileTypeId1],
                filesArray2,
                [numericFileTypeId2],
                filesArray4,
                [numericFileTypeId4],
                companyDocumentArray,
                pathArray,
                companyArray
            );
            if (
                formData.sourceLink.trim() !== '' &&
                formData.name.trim() !== '' &&
                formData.genderId
            ) {
                setSubmissionSuccess(true);
                setDisabled(true);

            }
            return true;
        } catch (error) {
            console.error('Error submitting:', error);
            setSubmissionSuccess(false);
            return false;
        }
    };

    const handleFileChangedoc = (personIndex: number, emailIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedPeople = JSON.parse(JSON.stringify(RelativeformData));
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            updatedPeople.relativeCombineDTO[personIndex].relativeDocumentsDTOS[emailIndex].documentNameList = selectedFile.name;
            setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
        }
    };

    const handleSelectChange = (selectedValue: string, index: number) => {
        setFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index] = {
                ...updatedFields[index],
                fileType: selectedValue,
            };
            return updatedFields;
        });
    };

    const handleSelectChange1 = (selectedValue: string, index: number) => {
        setFields1((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index] = {
                ...updatedFields[index],
                fileType: selectedValue,
            };
            return updatedFields;
        });
    };

    const handleSelectChange2 = (selectedValue: string, index: number) => {
        setFields2((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index] = {
                ...updatedFields[index],
                fileType: selectedValue,
            };
            return updatedFields;
        });
    };

    const handleSelectChange4 = (selectedValue: string, index: number) => {
        setFields4((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index] = {
                ...updatedFields[index],
                fileType: selectedValue,
            };
            return updatedFields;
        });
    };

    const handleSelectChange5 = (selectedValue: string, index: number) => {
        setFields5((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index] = {
                ...updatedFields[index],
                fileType: selectedValue,
            };
            return updatedFields;
        });
    };


    const allowedFileTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const [fileErrors1, setFileErrors1] = useState<string[]>([]);
    const [fileErrors2, setFileErrors2] = useState<string[]>([]);
    const [fileErrors3, setFileErrors3] = useState<string[]>([]);

    const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFiles = Array.from(event.target.files) as File[];
            // const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
            // const fileType = selectedFiles[0].name.split('.').pop();
            const selectedFile = selectedFiles[0];
            const fileType = selectedFile.type;

            if (!allowedFileTypes.includes(fileType)) {
                // File not supported, show error message near TextField
                setFileErrors((prevErrors) => {
                    const updatedErrors = [...prevErrors];
                    updatedErrors[index] = 'File not supported. Please select a PNG,JPG file.';
                    return updatedErrors;
                });
                return;
            }
            const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '');

            setFields(prevFields => {
                const updatedFields = [...prevFields];
                updatedFields[index] = {
                    ...updatedFields[index],
                    imageName: nameWithoutExtension,
                    fileType: updatedFields[index].fileType || fileType || '',
                    uploading: false,
                    uploadSuccess: false,
                };
                return updatedFields;
            });
            setIsFileSelected(true);
            setFileErrors((prevErrors) => {
                const updatedErrors = [...prevErrors];
                updatedErrors[index] = '';
                return updatedErrors;
            });
        } else {
            setIsFileSelected(false);
        }
    };

    const handleFileChange1 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFiles = Array.from(event.target.files) as File[];
            // const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
            // const fileType = selectedFiles[0].name.split('.').pop();
            const selectedFile = selectedFiles[0];
            const fileType = selectedFile.type;

            if (!allowedFileTypes.includes(fileType)) {

                setFileErrors1((prevErrors) => {
                    const updatedErrors = [...prevErrors];
                    updatedErrors[index] = 'File not supported. Please select a PNG, JPG file.';
                    return updatedErrors;
                });
                return;
            }
            const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '');

            setFields1(prevFields => {
                const updatedFields = [...prevFields];
                updatedFields[index] = {
                    ...updatedFields[index],
                    imageName1: nameWithoutExtension,
                    fileType: updatedFields[index].fileType || fileType || '',
                    uploading: false,
                    uploadSuccess: false,
                };
                return updatedFields;
            });
            setIsFileSelected(true);
            setFileErrors1((prevErrors) => {
                const updatedErrors = [...prevErrors];
                updatedErrors[index] = '';
                return updatedErrors;
            });
        } else {
            setIsFileSelected(false);
        }
    };

    const handleFileChange2 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFiles = Array.from(event.target.files) as File[];
            // const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
            // const fileType = selectedFiles[0].name.split('.').pop();

            const selectedFile = selectedFiles[0];
            const fileType = selectedFile.type;

            if (!allowedFileTypes.includes(fileType)) {

                setFileErrors2((prevErrors) => {
                    const updatedErrors = [...prevErrors];
                    updatedErrors[index] = 'File not supported. Please select a PNG,JPG file.';
                    return updatedErrors;
                });
                return;
            }
            const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '');

            setFields2(prevFields => {
                const updatedFields = [...prevFields];
                updatedFields[index] = {
                    ...updatedFields[index],
                    imageName2: nameWithoutExtension,
                    fileType: updatedFields[index].fileType || fileType || '',
                    uploading: false,
                    uploadSuccess: false,
                };
                return updatedFields;
            });
            setIsFileSelected(true);
            setFileErrors2((prevErrors) => {
                const updatedErrors = [...prevErrors];
                updatedErrors[index] = '';
                return updatedErrors;
            });
        } else {
            setIsFileSelected(false);
        }
    };

    const handleFileChange4 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFiles = Array.from(event.target.files) as File[];
            // const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
            // const fileType = selectedFiles[0].name.split('.').pop();

            const selectedFile = selectedFiles[0];
            const fileType = selectedFile.type;

            if (!allowedFileTypes.includes(fileType)) {

                setFileErrors3((prevErrors) => {
                    const updatedErrors = [...prevErrors];
                    updatedErrors[index] = 'File not supported. Please select a PNG,JPG file.';
                    return updatedErrors;
                });
                return;
            }
            const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '');

            setFields4(prevFields => {
                const updatedFields = [...prevFields];
                updatedFields[index] = {
                    ...updatedFields[index],
                    imageName4: nameWithoutExtension,
                    fileType: updatedFields[index].fileType || fileType || '',
                    uploading: false,
                    uploadSuccess: false,
                };
                return updatedFields;
            });
            setIsFileSelected(true);
            setFileErrors3((prevErrors) => {
                const updatedErrors = [...prevErrors];
                updatedErrors[index] = '';
                return updatedErrors;
            })
        } else {
            setIsFileSelected(false);
        }
    };

    const handleFileChange5 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFiles = Array.from(event.target.files) as File[];
            const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
            const fileType = selectedFiles[0].name.split('.').pop();
            setFields5(prevFields => {
                const updatedFields = [...prevFields];
                updatedFields[index] = {
                    ...updatedFields[index],
                    imageName5: nameWithoutExtension,
                    fileType: updatedFields[index].fileType || fileType || '',
                    uploading: false,
                    uploadSuccess: false,
                };
                return updatedFields;
            });
            setIsFileSelected(true);
        } else {
            setIsFileSelected(false);
        }
    };

    const [selectedPath, setSelectedPath] = useState<string[]>([]);

    const handleSelectChange3 = (personIndex: number, index: number, selectedValue: number) => {
        const updatedPeople = { ...formDatas };
        const selectedFileType = selectedValue;
        if (selectedFileType != 0) {
            updatedPeople.combinedDTO[personIndex].companyDocumentsDTOS[index].documentTypeId = selectedFileType;
            let myArr = String(selectedValue).split("").map((selectedValue) => {
                return Number(selectedValue);
            });
            updatedPeople.combinedDTO[personIndex].companyDocumentsDTOS[index].path = myArr;
            if (Array.isArray(updatedPeople.combinedDTO)) {
                setformDatas({ ...updatedPeople });
            }
        }
    };

    const handleChooseImagesClick = (index: number) => {
        document.getElementById(`image-upload-input-${index}`)?.click();
    };

    const handleChooseImagesClick1 = (index1: number) => {
        document.getElementById(`image-upload-input1-${index1}`)?.click();
    };

    const handleChooseImagesClick2 = (index2: number) => {
        document.getElementById(`image-upload-input2-${index2}`)?.click();
    };

    const handleChooseImagesClick4 = (index4: number) => {
        document.getElementById(`image-upload-input4-${index4}`)?.click();
    };

    const handleChooseImagesClick5 = (index5: number) => {
        document.getElementById(`image-upload-input5-${index5}`)?.click();
    };

    const [fileSizeError, setFileSizeError] = useState<string | null>(null);

    const handleChooseImagesClick3 = (personIndex: number, index3: number) => {
        if (fields3 && fields3[index3]) {
            const selectedImageStoreNumber = fields3[index3].fileType;
            document.getElementById(`image-upload-input3-${personIndex}-${index3}`)?.click();
        } else {
            console.error('Invalid index or missing data in fields3 array.');
        }
    };

    const [imageString, setImageString] = useState<string | null>(null);

    const handleFileChange3 = (
        personIndex: number,
        index: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const updatedData = { ...formDatas };
            const nameWithoutExtension = files[0].name.replace(/\.[^/.]+$/, '');
            const updatedCompanyDocumentsDTO = {
                ...updatedData.combinedDTO[personIndex].companyDocumentsDTOS[index],
            };
            const allowedFileTypes = ['application/pdf', 'application/vnd.ms-excel', 'image/jpeg'];
            const uploadedFiles: MultipartFile[] = [];
            for (let i = 0; i < files.length; i++) {
                uploadedFiles.push({
                    name: files[i].name,
                    size: files[i].size,
                    type: files[i].type,
                });
            }
            const file = files[0];
            const fileType = file.type;
            const fileType1 = fileType.split("/")[1];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        const resultParts = reader.result.split(',');
                        const base64String = resultParts[1];
                        const fileMimeType = resultParts[0].split(':')[1].split(';')[0];
                        setImageString(base64String);
                        updatedCompanyDocumentsDTO.files3 = [base64String];
                        updatedCompanyDocumentsDTO.documentType = fileType1;
                    }
                };
                reader.readAsDataURL(file);
            }
            updatedCompanyDocumentsDTO.imageName3 = nameWithoutExtension;
            updatedData.combinedDTO[personIndex].companyDocumentsDTOS[index] = updatedCompanyDocumentsDTO;
            setformDatas(updatedData);
        } else {
        }
    };

    const handleDeleteFieldDocument = (personIndex: number, index: number) => {
        const updatedData = { ...formDatas };
        updatedData.combinedDTO[personIndex].companyDocumentsDTOS.splice(index, 1);
        setformDatas(updatedData);
    };

    const handleAddDocument = (personIndex: number) => {
        const updatedPeople = [...formDatas.combinedDTO];
        if (personIndex >= 0 && personIndex < updatedPeople.length) {
            const updatedCompanyDocumentsDTOS: CompanyDocumentsDTO[] = [
                ...updatedPeople[personIndex].companyDocumentsDTOS,
                {
                    companyId: 0,
                    uid: 0,
                    euid: 0,
                    documentTypeId: 0,
                    files3: [],
                    imageName3: '',
                    documentType: '',
                    path: [],
                },
            ];
            updatedPeople[personIndex].companyDocumentsDTOS = updatedCompanyDocumentsDTOS;
            setformDatas((prevData) => ({ ...prevData, combinedDTO: updatedPeople }));
        }
    };

    const handleRemoveBoxAddress = (index: number) => {
        const updatedAddress = [...Address];
        updatedAddress.splice(index, 1);
        setAddress(updatedAddress);
    };

    const handleAddAddressField = () => {
        const newAddress = {
            permanentAddress: "",
        };
        setAddress([...Address, newAddress]);
    };

    const handleAddressNameChange = (value: string, index: number) => {
        const updatedAddress = [...Address];
        updatedAddress[index].permanentAddress = value;
        setAddress(updatedAddress);
    };

    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRemoveBoxFamilydetails = (personIndex: number) => {
        setFamilyFormData((prevData) => {
            const updatedPeople = [...prevData.familyCombinedDTO];
            updatedPeople.splice(personIndex, 1);
            return { familyCombinedDTO: updatedPeople };
        });
    };

    const handleAddFieldFamilydetails = (personIndex: number, fieldType: 'huf' | 'Spouse' | 'father' | 'mother') => {
        const updatedPeople = { ...FamilyformData };
        if (fieldType === 'huf') {
            updatedPeople.familyCombinedDTO[personIndex].hufDTO.push({
                pepId: 0,
                hufName: '',
                hufPan: '',
            });
        }
        else if (fieldType === 'father') {
            updatedPeople.familyCombinedDTO[personIndex].fatherDTOS.push({
                pepId: 0,
                fatherName: '',
                fatherPan: '',
            });
        }
        else if (fieldType === 'mother') {
            updatedPeople.familyCombinedDTO[personIndex].motherDTOS.push({
                pepId: 0,
                motherName: '',
                motherPan: '',
            });
        }
        setFamilyFormData({ familyCombinedDTO: updatedPeople.familyCombinedDTO });
    };

    const handleInputChangeHuf = (
        personIndex: number,
        field: 'hufName' | 'hufPan',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
        const value = field === 'hufName' ? event.target.value : event.target.value.toUpperCase();
        if (index !== null) {
            if (field === 'hufName' || field === 'hufPan') {
                if (!updatedPeople.familyCombinedDTO[personIndex].hufDTO[index]) {
                    updatedPeople.familyCombinedDTO[personIndex].hufDTO[index] = {
                        pepId: 0,
                        HUF: '',
                        HUFPan: '',
                    };
                }
                updatedPeople.familyCombinedDTO[personIndex].hufDTO[index][field] = value;
                if (field === 'hufPan') {
                    validateHUFpan(value, index);
                }
            }
        }
        setFamilyFormData({ familyCombinedDTO: updatedPeople.familyCombinedDTO });
    };

    const validateHUFpan = (HUFPan: string, index: number | null) => {
        const errors = [...panErrors];
        const isValid = panRegex.test(HUFPan);
        if (index !== null) {
            if (!isValid) {
                errors[index] = 'Invalid PAN Format';
            } else {
                errors[index] = '';
            }
        }
        setHUFPanErrors(errors);
    };

    const handleDeleteFieldHuf = (
        personIndex: number,
        field1: 'HUFPan' | 'HUF',
        index: number
    ) => {
        const updatedPeople = [...FamilyformData.familyCombinedDTO];
        if (field1 === 'HUF' || field1 === 'HUFPan') {
            updatedPeople[personIndex].hufDTO.splice(index, 1);
        }
        setFamilyFormData({ familyCombinedDTO: updatedPeople });
    };

    const handletPerMediaChangsse = (
        personIndex: number,
        field: keyof Payload['combinedDTO'][0]['companyAssociationDTOS'][0],
        index: number | null,
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const updatedatPerMedia = (index: number, field: keyof AddressDTO, value: string) => {
        };
        setformDatas((prevData) => {
            const updatedCombinedDTO = [...prevData.combinedDTO];
            const updatedPerson = { ...updatedCombinedDTO[personIndex] };
            const updatedCompanyAssociationDTOS = [...updatedPerson.companyAssociationDTOS];
            const permedia = updatedCompanyAssociationDTOS[index!];
            const updatedPermedia = { ...permedia, [field]: event.target.value as string };
            updatedCompanyAssociationDTOS[index!] = updatedPermedia;
            updatedPerson.companyAssociationDTOS = updatedCompanyAssociationDTOS;
            updatedCombinedDTO[personIndex] = updatedPerson;
            return { combinedDTO: updatedCombinedDTO };
        });
    };

    const handleDeleteFieldfather = (
        personIndex: number,
        field1: 'fatherPan' | 'fatherName',
        index: number
    ) => {
        const updatedPeople = [...FamilyformData.familyCombinedDTO];
        if (field1 === 'fatherName' || field1 === 'fatherPan') {
            updatedPeople[personIndex].fatherDTOS.splice(index, 1);
        }
        setFamilyFormData({ familyCombinedDTO: updatedPeople });
    };

    const handleDeleteFieldmother = (
        personIndex: number,
        field1: 'motherPan' | 'motherName',
        index: number
    ) => {
        const updatedPeople = [...FamilyformData.familyCombinedDTO];
        if (field1 === 'motherName' || field1 === 'motherPan') {
            updatedPeople[personIndex].motherDTOS.splice(index, 1);
        }
        setFamilyFormData({ familyCombinedDTO: updatedPeople });
    };

    const handleInputChangspousechilderpan = (
        personIndex: number,
        field: 'spousePan' | 'spouseName',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
        const value = field === 'spouseName' ? event.target.value : event.target.value.toUpperCase();
        if (index !== null) {
            if (field === 'spouseName' || field === 'spousePan') {
                if (!updatedPeople.familyCombinedDTO[personIndex].familySpouseDTOS[index]) {
                    updatedPeople.familyCombinedDTO[personIndex].familySpouseDTOS[index] = {
                        pepId: 0,
                        hufId: 0,
                        spouseName: '',
                        spousePan: '',
                    };
                }
                updatedPeople.familyCombinedDTO[personIndex].familySpouseDTOS[index][field] = value;
                if (field === 'spousePan') {
                    validatePan(value, index);
                }
            }
        }
        setFamilyFormData({ familyCombinedDTO: updatedPeople.familyCombinedDTO });
    };

    const handleInputChangfatherpan = (
        personIndex: number,
        field: 'fatherPan' | 'fatherName',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
        const value = field === 'fatherName' ? event.target.value : event.target.value.toUpperCase();
        if (index !== null) {
            if (field === 'fatherName' || field === 'fatherPan') {
                if (!updatedPeople.familyCombinedDTO[personIndex].fatherDTOS[index]) {
                    updatedPeople.familyCombinedDTO[personIndex].fatherDTOS[index] = {
                        pepId: 0,
                        hufId: 0,
                        fatherName: '',
                        fatherPan: '',
                    };
                }
                updatedPeople.familyCombinedDTO[personIndex].fatherDTOS[index][field] = value;
                if (field === 'fatherPan') {
                    validatefatherPan(value, index);
                }
            }
        }
        setFamilyFormData({ familyCombinedDTO: updatedPeople.familyCombinedDTO });
    };

    const validatefatherPan = (fatherPan: string, index: number | null) => {
        const errors = [...panErrors];
        const isValid = panRegex.test(fatherPan);
        if (index !== null) {
            if (!isValid) {
                errors[index] = 'Invalid PAN Format';
            } else {
                errors[index] = '';
            }
        }
        setfatherPanErrors(errors);
    };

    const handleInputChangmotherpan = (
        personIndex: number,
        field: 'motherPan' | 'motherName',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
        const value = field === 'motherName' ? event.target.value : event.target.value.toUpperCase();
        if (index !== null) {
            if (field === 'motherName' || field === 'motherPan') {
                if (!updatedPeople.familyCombinedDTO[personIndex].motherDTOS[index]) {
                    updatedPeople.familyCombinedDTO[personIndex].motherDTOS[index] = {
                        pepId: 0,
                        hufId: 0,
                        motherName: '',
                        motherPan: '',
                    };
                }
                updatedPeople.familyCombinedDTO[personIndex].motherDTOS[index][field] = value;
                if (field === 'motherPan') {
                    validatemotherPan(value, index);
                }
            }
        }
        setFamilyFormData({ familyCombinedDTO: updatedPeople.familyCombinedDTO });
    };

    const validatemotherPan = (motherPan: string, index: number | null) => {
        const errors = [...panErrors];
        const isValid = panRegex.test(motherPan);
        if (index !== null) {
            if (!isValid) {
                errors[index] = 'Invalid PAN Format';
            } else {
                errors[index] = '';
            }
        }
        setmotherPanErrors(errors);
    };

    const handleRemoveBoxSpouseFamily = (personIndex: number) => {
        setSpouseFamilyFormData((prevData) => {
            const updatedPeople = [...prevData.spouseCommonDTO];
            updatedPeople.splice(personIndex, 1);
            return { spouseCommonDTO: updatedPeople };
        });
    };

    const handleAddFieldSpouseFamily = (personIndex: number, fieldType: 'huf' | 'Spouse' | 'father' | 'mother') => {
        const updatedPeople = { ...SpouseFamilyformData };
        if (fieldType === 'huf') {
            updatedPeople.spouseCommonDTO[personIndex].spouseHufDTOS.push({
                pepId: 0,
                spouseId: 0,
                hufName: '',
                hufPan: '',
            });
        }
        else if (fieldType === 'father') {
            updatedPeople.spouseCommonDTO[personIndex].spouseFatherDTOS.push({
                pepId: 0,
                spouseId: 0,
                fatherName: '',
                fatherPan: '',
            });
        }
        else if (fieldType === 'mother') {
            updatedPeople.spouseCommonDTO[personIndex].spouseMotherDTOS.push({
                pepId: 0,
                spouseId: 0,
                motherName: '',
                motherPan: '',
            });
        }
        setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
    };

    const handlerelativeChange = (personIndex: number, value: any) => {
        const updatedPeople = JSON.parse(JSON.stringify(RelativeformData));
        updatedPeople.relativeCombineDTO[personIndex].relativeDTO.relativeMasterId = value;
        setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
    };

    const handleInputChangeSpouseHuf = (
        personIndex: number,
        field: 'hufName' | 'hufPan',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(SpouseFamilyformData));
        const value = field === 'hufName' ? event.target.value : event.target.value.toUpperCase();
        if (index !== null) {
            if (field === 'hufName' || field === 'hufPan') {
                if (!updatedPeople.spouseCommonDTO[personIndex].spouseHufDTOS[index]) {
                    updatedPeople.spouseCommonDTO[personIndex].spouseHufDTOS[index] = {
                        pepId: 0,
                        spouseId: 0,
                        hufName: '',
                        hufPan: '',
                    };
                }
                updatedPeople.spouseCommonDTO[personIndex].spouseHufDTOS[index][field] = value;
                if (field === 'hufPan') {
                    validateHUFPan(value, index);
                }
            }
        }
        setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
    };

    const validateHUFPan = (HUFPan: string, index: number | null) => {
        const errors = [...panhufErrors];
        const isValid = panRegex.test(HUFPan);
        if (index !== null) {
            if (!isValid) {
                errors[index] = 'Invalid PAN Format';
            } else {
                errors[index] = '';
            }
        }
        setPanhufErrors(errors);
    };

    const handleDeleteFieldspouseHuf = (
        personIndex: number,
        field1: 'hufName' | 'hufPan',
        index: number
    ) => {
        const updatedPeople = [...SpouseFamilyformData.spouseCommonDTO];
        if (field1 === 'hufName' || field1 === 'hufPan') {
            updatedPeople[personIndex].spouseHufDTOS.splice(index, 1);
        }
        setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople });
    };

    const handleDeleteFieldspousefather = (
        personIndex: number,
        field1: 'fatherPan' | 'fatherName',
        index: number
    ) => {
        const updatedPeople = [...SpouseFamilyformData.spouseCommonDTO];
        if (field1 === 'fatherName' || field1 === 'fatherPan') {
            updatedPeople[personIndex].spouseFatherDTOS.splice(index, 1);
        }
        setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople });
    };

    const handleDeleteFieldspousemother = (
        personIndex: number,
        field1: 'motherPan' | 'motherName',
        index: number
    ) => {
        const updatedPeople = [...SpouseFamilyformData.spouseCommonDTO];
        if (field1 === 'motherName' || field1 === 'motherPan') {
            updatedPeople[personIndex].spouseMotherDTOS.splice(index, 1);
        }
        setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople });
    };

    const handleInputChangspousefatherpan = (
        personIndex: number,
        field: 'fatherPan' | 'fatherName',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(SpouseFamilyformData));
        const value = field === 'fatherName' ? event.target.value : event.target.value.toUpperCase();
        if (index !== null) {
            if (field === 'fatherName' || field === 'fatherPan') {
                if (!updatedPeople.spouseCommonDTO[personIndex].spouseFatherDTOS[index]) {
                    updatedPeople.spouseCommonDTO[personIndex].spouseFatherDTOS[index] = {
                        pepId: 0,
                        spouseId: 0,
                        fatherName: '',
                        fatherPan: '',
                    };
                }
                updatedPeople.spouseCommonDTO[personIndex].spouseFatherDTOS[index][field] = value;
                if (field === 'fatherPan') {
                    validatePanfather(value, index);
                }
            }
        }
        setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
    };

    const validatePanfather = (pan: string, index: number | null) => {
        const errors = [...panfatherErrors];
        const isValid = panRegex.test(pan);
        if (index !== null) {
            if (!isValid) {
                errors[index] = 'Invalid PAN Format';
            } else {
                errors[index] = '';
            }
        }
        setPanfatherErrors(errors);
    };

    const handleInputChangspousemotherpan = (
        personIndex: number,
        field: 'motherPan' | 'motherName',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(SpouseFamilyformData));
        const value = field === 'motherName' ? event.target.value : event.target.value.toUpperCase();
        if (index !== null) {
            if (field === 'motherName' || field === 'motherPan') {
                if (!updatedPeople.spouseCommonDTO[personIndex].spouseMotherDTOS[index]) {
                    updatedPeople.spouseCommonDTO[personIndex].spouseMotherDTOS[index] = {
                        pepId: 0,
                        spouseId: 0,
                        motherName: '',
                        motherPan: '',
                    };
                }
                updatedPeople.spouseCommonDTO[personIndex].spouseMotherDTOS[index][field] = value;
                if (field === 'motherPan') {
                    validatePanmother(value, index);
                }
            }
        }
        setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
    };

    const validatePanmother = (pan: string, index: number | null) => {
        const errors = [...panmotherErrors];
        const isValid = panRegex.test(pan);
        if (index !== null) {
            if (!isValid) {
                errors[index] = 'Invalid PAN Format';
            } else {
                errors[index] = '';
            }
        }
        setPanmotherErrors(errors);
    };

    const handleInputChangespouseFamily = (
        personIndex: number,
        field: 'spouseName' | 'spousePan',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(SpouseFamilyformData));
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        if (field === 'spouseName' || field === 'spousePan') {
            updatedPeople.spouseCommonDTO[personIndex].spouseDetailsDTO[field] = field === 'spouseName' ? event.target.value : event.target.value.toUpperCase();
            if (field === 'spousePan' && !panRegex.test(updatedPeople.spouseCommonDTO[personIndex].spouseDetailsDTO[field])) {
                console.error('Invalid PAN Format');
                setRelativePanspouseTouched(true);
            }
        }
        setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
        setTouched(true);
    };

    const resetListOfCompanyError = () => {
        setListOfCompanyError(false);
    };

    const listOfCompanyRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const viewPageDetailsService = new ViewPageDetailsService
    const [checkedCompanies, setCheckedCompanies] = React.useState<string[]>([]);
    const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<CompanyDetailsItem | null>(null);
    const [companyDetailsMessage, setCompanyDetailsMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [open, setOpen] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [cinfcrn, setCinfcrn] = useState('');
    const [originalDateOfAppointment, setOriginalDateOfAppointment] = useState('');
    const [emailID, setEmailId] = useState('');
    const [registeredAddress, setRegisteredAddress] = useState('');
    const [directorId, setDirectors] = useState('');
    const [din, setDin] = useState('');
    const [designationId, setDesignation] = useState('');
    const [directorName, setDirectorStatus] = useState('');
    const [appointmentDate, setAppointmentDateAtCurrent] = useState('');
    const [cessationDate, setCessationDate] = useState('');

    const [formdatas, setFormDatas] = useState<Payload>({
        combinedDTO: [
            {
                companyDTO: {
                    id: 0,
                    associateMasterId: 0,
                    companyName: '',
                    listAdverseInformation: 0,
                    listRegulatoryAction: 0,
                    listGovernment: 0,
                    sourceLink: '',
                    originalDateOfAppointment: '',
                    typeId: 0,
                    cinfcrn: '',
                    document: '',
                },
                addressDTOS: [
                    {
                        id: 0,
                        companyId: 0,
                        registeredAddress: '',
                    },
                ],
                contactDTOS: [
                    {
                        companyId: 0,
                        emailID: '',
                    },
                ],
                companiesDirectorsDTOS: [
                    {
                        id: 0,
                        din: '',
                        companyId: 0,
                        directorId: 0,
                        designationId: 0,
                        companyMasterId: 0,
                        appointmentDate: '',
                        cessationDate: '',
                        designation: '',
                        directorStatus: '',
                        directorName: '',
                    },
                ],
                companyDocumentsDTOS: [
                    {
                        companyId: 0,
                        documentTypeId: 0,
                        documentType: '',
                        imageName3: '',
                        uid: loginDetails.id,
                        files3: [],
                        path: [],
                        euid: 0,
                    },
                ],
                companyAssociationDTOS: [
                    {
                        id: 0,
                        companyId: 0,
                        companyAssociation: '',
                        uid: loginDetails.id,
                    },
                ],
            },
        ],
    });

    const handleSearch = async (din: string) => {
        try {
            setIsLoading(true);
            const companyDetails = await viewPageDetailsService.getCompany(din);
            if (companyDetails && companyDetails.length > 0) {
                setSelectedCompanyDetails(companyDetails);
                setShowSuccessPopup(true);
                setCompanyDetailsMessage('');
            } else {
                setCompanyDetailsMessage('Company not found. Please check the information and try again.');
                setShowSuccessPopup(false);
            }
        } catch (error: any) {
            console.error('Error fetching company details:', error);
            setCompanyDetailsMessage('An error occurred while fetching company details. Please try again later.');
            setShowSuccessPopup(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckbox = (companyName: string) => {
        if (selectedCompanyDetails) {
            if (checkedCompanies.includes(companyName)) {
                setCheckedCompanies(checkedCompanies.filter((company) => company !== companyName));
            } else {
                setCheckedCompanies([...checkedCompanies, companyName]);
            }
        }
    };

    const handleDialogSubmit = () => {
        if (Array.isArray(selectedCompanyDetails)) {
            const updatedFormDatas = { ...formDatas };
            selectedCompanyDetails.forEach((companyDetails) => {
                const companyName = companyDetails?.companyDTO?.companyName;
                if (checkedCompanies.includes(companyName)) {
                    const filteredAddresses = companyDetails.addressDTOS.filter(
                        (address: AddressDTO) => address.registeredAddress
                    );
                    const filteredContacts = companyDetails.contactDTOS.filter(
                        (contact: ContactDTO) => contact.emailID
                    );
                    if (filteredAddresses.length > 0 && filteredContacts.length > 0) {
                        const existingEntryIndex = updatedFormDatas.combinedDTO.findIndex(
                            (entry) => entry.companyDTO.companyName === companyName
                        );
                        if (existingEntryIndex !== -1) {
                            console.log('Updating existing entry:', existingEntryIndex);
                            updatedFormDatas.combinedDTO[existingEntryIndex].addressDTOS.push(
                                ...filteredAddresses
                            );
                            updatedFormDatas.combinedDTO[existingEntryIndex].contactDTOS.push(
                                ...filteredContacts
                            );
                            updatedFormDatas.combinedDTO[existingEntryIndex].addressDTOS = Array.from(
                                new Set(
                                    updatedFormDatas.combinedDTO[existingEntryIndex].addressDTOS.map(
                                        (address: AddressDTO) => JSON.stringify(address)
                                    )
                                ),
                                (str) => JSON.parse(str) as AddressDTO
                            );
                            updatedFormDatas.combinedDTO[existingEntryIndex].contactDTOS = Array.from(
                                new Set(
                                    updatedFormDatas.combinedDTO[existingEntryIndex].contactDTOS.map(
                                        (contact: ContactDTO) => JSON.stringify(contact)
                                    )
                                ),
                                (str) => JSON.parse(str) as ContactDTO
                            );
                        } else {
                            updatedFormDatas.combinedDTO.push({
                                companyDTO: { ...companyDetails.companyDTO },
                                addressDTOS: filteredAddresses,
                                contactDTOS: filteredContacts,
                                companiesDirectorsDTOS: [...companyDetails.companiesDirectorsDTOS],
                                companyDocumentsDTOS: Array.isArray(companyDetails.companyDocumentsDTOS)
                                    ? [...companyDetails.companyDocumentsDTOS]
                                    : [],
                                companyAssociationDTOS: [...companyDetails.companyAssociationDTOS],
                            });
                            console.log('updatedFormDatas:', updatedFormDatas);
                        }
                    }
                }
            });
            setformDatas(updatedFormDatas);
        }
    };

    const handleCompanySearchClick = () => {
        setOpen(true);
    };

    const handleModalClose = () => {
        setDin('');
        setCompanyName('');
        setCompanyDetailsMessage('');
        setOpen(false);
    };

    const handleClosePopup = (popupType: string) => {
        if (popupType === 'success') {
            setShowSuccessPopup(false);
            setSelectedCompanyDetails(null);
        }
    };
    function getDesignationName(associateMasterdId: number) {
        switch (associateMasterdId) {
            case 1:
                return 'Managing Director';
            case 2:
                return 'Manager';
            case 3:
                return 'Nominee Director';
            case 4:
                return 'Director';
            case 5:
                return 'Company Secretary';
            case 6:
                return 'CFO';
            case 7:
                return 'Additional Director';
            case 8:
                return 'CEO';
        }
    };

    const [includeAdverseInformation, setIncludeAdverseInformation] = useState(false);
    const [includeRegulatoryAction, setIncludeRegulatoryAction] = useState(false);
    const [adverseInformationCheckValue, setAdverseInformationCheckValue] = useState(0);
    const [regulatoryActionCheckValue, setRegulatoryActionCheckValue] = useState(0);
    const [includeListAdverseInfromation, setIncludeListAdverseInfromation] = useState(false);
    const [listAdverseInfromationCheckValue, setListAdverseInfromationCheckValue] = useState(0);
    const [includeListRegulatoryAction, setIncludeListRegulatoryAction] = useState(false);
    const [listRegulatoryActionCheckValue, setListRegulatoryActionCheckValue] = useState(0);
    const [includeGovernment, setIncludeGovernment] = useState(false);
    const [listgovernmentCheckValue, setGovernmentCheckValue] = useState(0);

    const handleAdverseInformationChange = (event: { target: { checked: any; }; }) => {
        const isChecked = event.target.checked;
        setIncludeAdverseInformation(isChecked);
        setAdverseInformationCheckValue(1);
        setIsCheckboxChecked(isChecked || includeRegulatoryAction);
        if (isChecked) {
            setErrorMsg("");
        }
    };

    const handleRegulatoryActionChange = (event: { target: { checked: any; }; }) => {
        const isChecked = event.target.checked;
        setIncludeRegulatoryAction(isChecked);
        setRegulatoryActionCheckValue(1);
        setIsCheckboxChecked(isChecked || includeAdverseInformation);
        if (isChecked) {
            setErrorMsg("");
        }
    };

    const handleListAdverseInfromation = (event: { target: { checked: any; }; }) => {
        if (event.target.checked) {
            setIncludeListAdverseInfromation(true);
            setListAdverseInfromationCheckValue(1);
        } else {
            setIncludeListAdverseInfromation(false);
            setListAdverseInfromationCheckValue(0);
        }
    }

    const handleListRegulatoryAction = (event: { target: { checked: any; }; }) => {
        if (event.target.checked) {
            setIncludeListRegulatoryAction(true);
            setListRegulatoryActionCheckValue(1);
        } else {
            setIncludeListRegulatoryAction(false);
            setListRegulatoryActionCheckValue(0);
        }
    };

    const handleGovernment = (event: { target: { checked: any; }; }) => {
        if (event.target.checked) {
            setIncludeGovernment(true);
            setGovernmentCheckValue(1);
        } else {
            setIncludeGovernment(false);
            setGovernmentCheckValue(0);
        }
    };

    const [selectedListofCompany, setSelectedListofCompany] = useState<string>('');

    const handleCheckboxChange = (personIndex: number, fieldName: string, value: boolean) => {
        setformDatas((prevFormDatas) => {
            const updatedFormDatas = {
                ...prevFormDatas,
                combinedDTO: prevFormDatas.combinedDTO.map((person, index) => {
                    if (index !== personIndex) {
                        return person;
                    }
                    return {
                        ...person,
                        companyDTO: {
                            ...person.companyDTO,
                            [fieldName]: value ? 1 : 0,
                        },
                    };
                }),
            };
            const isChecked = value || checkIfAnyCheckboxChecked(updatedFormDatas.combinedDTO);
            setIsCheckboxCheckeds(isChecked);
            return updatedFormDatas;
        });
    };

    const checkIfAnyCheckboxChecked = (combinedDTO: Payload['combinedDTO']) => {
        for (const person of combinedDTO) {
            if (person.companyDTO.listAdverseInformation === 1 || person.companyDTO.listRegulatoryAction === 1 || person.companyDTO.listGovernment === 1) {
                return true;
            }
        }
        return false;
    };

    const handleTextareaKeyPress = () => {
        if (!isCheckboxChecked) {
            setErrorMsg("Please select atleast one checkbox");
        } else {
            setErrorMsg("");
        }
    };

    const handleTextareaKeyPresss = () => {
        const isChecked = checkIfAnyCheckboxChecked(formDatas.combinedDTO);
        if (!isChecked) {
            setErrorMsgs("Please select atleast one checkbox");
        } else {
            setErrorMsgs("");
        }
    };

    return (
        <>
            <Header />
            <Box style={{ marginTop: '7%' }}>
                <div className="card-body">
                    <div className="upload-contact-container">
                        <div className="card-body">
                            <Box m={1}>
                                <div className="key">
                                    <div className="details-containers">
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="outlined-multiline-static"
                                                    label="Source Link"
                                                    variant="standard"
                                                    type="text"
                                                    fullWidth
                                                    size="small"
                                                    name="sourceLink"
                                                    multiline
                                                    value={formData.sourceLink}
                                                    onChange={(e) => {
                                                        resetSourceLinkError();
                                                        handleChange(e, 0);
                                                    }}
                                                    error={sourceLinkError}
                                                    helperText={sourceLinkError ? 'Source Link is required' : ''}
                                                    inputRef={sourceLinkRef}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={3}>
                                            <Grid item xs={4}>
                                                <div className="key">
                                                    <div className="person-container">
                                                        <div className="field-group-column">
                                                            <TextField
                                                                style={{ width: '100%' }}
                                                                label="Name"
                                                                id="Name"
                                                                variant="standard"
                                                                type="text"
                                                                name="name"
                                                                autoComplete="off"
                                                                value={formData.name}
                                                                onChange={(e) => {
                                                                    resetNameError();
                                                                    handleChange(e, 0);
                                                                }}
                                                                error={nameError}
                                                                helperText={nameError ? 'Name is required' : ''}
                                                                inputRef={nameRef}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <div className="key">
                                                    <div className="person-container">
                                                        <div className="field-group-column">
                                                            <TextField
                                                                style={{ width: '50%' }}
                                                                id="dob"
                                                                name="dob"
                                                                type="date"
                                                                value={formData.dob}
                                                                onChange={(e) => handleChange(e, 0)}
                                                                label="Date of Birth"
                                                                required
                                                                variant="standard"
                                                                size="small"
                                                            />
                                                            <TextField
                                                                style={{ width: '50%' }}
                                                                label="Education"
                                                                variant="standard"
                                                                type="text"
                                                                autoComplete="off"
                                                                name="education"
                                                                value={formData.education}
                                                                onChange={(e) => handleChange(e, 0)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <div className="key">
                                                    <div className="person-container">
                                                        <div className="field-group-column">
                                                            <TextField
                                                                style={{ width: '100%' }}
                                                                label="Place of Birth"
                                                                variant="standard"
                                                                type="text"
                                                                name="placeOfBirth"
                                                                autoComplete="off"
                                                                value={formData.placeOfBirth}
                                                                onChange={(e) => {
                                                                    handleChange(e, 0);
                                                                }}
                                                            />
                                                            <FormControl style={{ width: '55%' }} error={genderError}>
                                                                <InputLabel htmlFor="gender">Gender</InputLabel>
                                                                <Select
                                                                    label="Gender"
                                                                    variant="standard"
                                                                    value={formData.genderId.toString()}
                                                                    onChange={(event: SelectChangeEvent<string>) => {
                                                                        resetGenderError();
                                                                        handlegender(event);
                                                                    }}
                                                                    inputRef={genderRef}
                                                                >
                                                                    {gender.map((item) => (
                                                                        <MenuItem key={item.id} value={item.id.toString()}>
                                                                            {item.gender}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                                {genderError && <FormHelperText>Gender is required</FormHelperText>}
                                                            </FormControl>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className="key">
                                                    <div className="person-container">
                                                        <div className="field-group-column">
                                                            <TextField
                                                                style={{ width: '50%' }}
                                                                label="PAN"
                                                                variant="standard"
                                                                type="text"
                                                                name="pan"
                                                                autoComplete="off"
                                                                value={formData.pan}
                                                                onChange={(e) => {
                                                                    handleChange(e, 0);
                                                                    // checkPANExists(e.target.value);
                                                                }}

                                                                inputProps={{ maxLength: 10 }}
                                                            />


                                                            {panError && <div style={{ color: 'red' }}>{panError}</div>}
                                                            <TextField
                                                                style={{ width: '50%' }}
                                                                label="Directors Identification Number"
                                                                variant="standard"
                                                                type="text"
                                                                autoComplete="off"
                                                                name="directorsIdentificationNumber"
                                                                value={formData.directorsIdentificationNumber}
                                                                onChange={(e) => {
                                                                    handleChange(e, 0);
                                                                    handleDinChange(e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <div className="key">
                                                    <div className="scroll-box">
                                                        {PerMediaformData.map((perMediaformData, index) => (
                                                            <div key={index} className="person-container">
                                                                {PerMediaformData.length > 1 && (
                                                                    <div className="close-button" onClick={() => handleRemoveBoxtPerMedia(index)}>
                                                                        <FontAwesomeIcon icon={faTimes} />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <TextareaAutosize
                                                                        style={{ minHeight: '100px', maxHeight: '250px', width: '100%', resize: 'none' }}
                                                                        placeholder="Type here..."
                                                                        autoFocus
                                                                        id="outlined-multiline-static"
                                                                        value={PerMediaformData[index].otherAssociationAsPerMedia}
                                                                        onChange={(e) => handletPerMediaChange(e.target.value, index)}
                                                                        minRows={3}
                                                                        onKeyPress={handleTextareaKeyPress}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="field-group">
                                                        <div className="field-group-container">
                                                            <div className="field-group-row">
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={handleAddtPerMediaField}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More command
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    control={<Checkbox checked={includeAdverseInformation} onChange={handleAdverseInformationChange} name="includeAdverseInformation" />}
                                                    label="Adverse Information"
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox checked={includeRegulatoryAction} onChange={handleRegulatoryActionChange} name="includeRegulatoryAction" />}
                                                    label="Regulatory Action"
                                                />
                                                <div>
                                                    {errorMsg && <div className="error-message" style={{ color: "red" }}>{errorMsg}</div>}
                                                </div>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <div className="key">
                                                    <div className="scroll-box">
                                                        {akaformData.map((Aka, index) => (
                                                            <div key={index} className="person-container">
                                                                {akaformData.length > 1 && (
                                                                    <div className="close-button" onClick={() => handleRemoveBoxakaName(index)}>
                                                                        <FontAwesomeIcon icon={faTimes} />
                                                                    </div>
                                                                )}
                                                                <div className="field-group-column">
                                                                    <TextField
                                                                        style={{ width: '100%' }}
                                                                        label="Aka Name"
                                                                        variant="standard"
                                                                        type="text"
                                                                        size="small"
                                                                        autoComplete="off"
                                                                        value={Aka.akaName}
                                                                        onChange={(e) => {
                                                                            handleakaNameChange(e.target.value, index);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="field-group">
                                                        <div className="field-group-container">
                                                            <div className="field-group-row">
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={handleAddakaNameField}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Aka Name
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <div className="key">
                                                    <div className="scroll-box">
                                                        {PhoneNumberss.map((PhoneNumber, index) => (
                                                            <div key={index} className="person-container">
                                                                {PhoneNumberss.length > 1 && (
                                                                    <div className="close-button" onClick={() => handleRemoveBoxPhoneNumbers(index)}>
                                                                        <FontAwesomeIcon icon={faTimes} />
                                                                    </div>
                                                                )}
                                                                <div className="field-group-column">
                                                                    <TextField
                                                                        style={{ width: '100%' }}
                                                                        label="Phone Number"
                                                                        variant="standard"
                                                                        type="text"
                                                                        size="small"
                                                                        autoComplete="off"
                                                                        value={PhoneNumber.communicationDt}
                                                                        onChange={(e) => handlePhoneNumbersNameChange(e.target.value, index)}
                                                                        onFocus={() => handleFocus(index)}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                    {isEditing === index && !isValidInput && (
                                                                        <div style={{ color: 'red' }}>Please enter only numeric characters.</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="field-group">
                                                        <div className="field-group-container">
                                                            <div className="field-group-row">
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={handleAddPhoneNumbersNameField}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Phone Numbers
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <div className="key">
                                                    <div className="scroll-box">
                                                        {Emailidss.map((Emailids, index) => (
                                                            <div key={index} className="person-container">
                                                                {Emailidss.length > 1 && (
                                                                    <div className="close-button" onClick={() => handleRemoveBoxEmailids(index)}>
                                                                        <FontAwesomeIcon icon={faTimes} />
                                                                    </div>
                                                                )}
                                                                <div className="scrollable-box">
                                                                    <div className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Email Id"
                                                                            variant="standard"
                                                                            type="text"
                                                                            size="small"
                                                                            autoComplete="off"
                                                                            value={Emailids.communicationDt}
                                                                            onChange={(e) => handleEmailidsNameChange(e.target.value, index)}
                                                                            onBlur={() => {
                                                                                if (!isEmailValid(Emailids.communicationDt) && touchedFields[index]) {
                                                                                    console.error('Invalid email');
                                                                                }
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    {touchedFields[index] && !isEmailValid(Emailids.communicationDt) && (
                                                                        <div style={{ color: 'red' }}>Invalid email Format</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="field-group">
                                                        <div className="field-group-container">
                                                            <div className="field-group-row">
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={handleAddEmailidsNameField}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Email Ids
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </div>
                            </Box>
                        </div>
                    </div>
                    <Box m={1}>
                        <div className="key">
                            <h4>FAMILY DETAILS</h4>
                            <div className="details-containers">
                                <div className="scrollablebox">
                                    {FamilyformData.familyCombinedDTO.map((person, personIndex) => (
                                        <div key={personIndex} className="person-container">
                                            {FamilyformData.familyCombinedDTO.length > 1 && (
                                                <div className="close-button" onClick={() => handleRemoveBoxFamilydetails(personIndex)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </div>
                                            )}
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}>
                                                    <div className="field-group">
                                                        <div className="field-group-container">
                                                            <div className="field-group-row">
                                                                <div className="scrollable-box">
                                                                    {person.hufDTO.map((huf, hufIndex) => (
                                                                        <div key={hufIndex} className="field-group-column">
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label="HUF Name"
                                                                                variant="standard"
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={huf.hufName}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangeHuf(personIndex, 'hufName', hufIndex, event)
                                                                                }
                                                                            />
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label="PAN"
                                                                                variant="standard"
                                                                                type="text"
                                                                                name="pan1"
                                                                                autoComplete="off"
                                                                                value={huf.hufPan}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangeHuf(personIndex, 'hufPan', hufIndex, event)
                                                                                }
                                                                                inputProps={{ maxLength: 10 }}
                                                                            />
                                                                            {HUFPanErrors[hufIndex] && (
                                                                                <div style={{ color: 'red' }}>{HUFPanErrors[hufIndex]}</div>
                                                                            )}
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteFieldHuf(personIndex, 'HUFPan', hufIndex)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    <div className="field label">
                                                                        <div className="add-button" onClick={() => handleAddFieldFamilydetails(personIndex, 'huf')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More HUF Name
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <div className="field-group">
                                                        <div className="field-group-row">
                                                            <div className="field-group-container">
                                                                <div className="scrollable-box">
                                                                    {person.fatherDTOS.map((child, childIndex) => (
                                                                        <div key={childIndex} className="field-group-column">
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label="Father Name"
                                                                                variant="standard"
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={child.fatherName}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangfatherpan(personIndex, 'fatherName', childIndex, event)
                                                                                }
                                                                            />
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label=" Father PAN"
                                                                                variant="standard"
                                                                                type="text"
                                                                                name="fatherPan"
                                                                                value={child.fatherPan}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangfatherpan(personIndex, 'fatherPan', childIndex, event)
                                                                                }
                                                                                inputProps={{ maxLength: 10 }}
                                                                            />
                                                                            {fatherPanErrors[childIndex] && (
                                                                                <div style={{ color: 'red' }}>{fatherPanErrors[childIndex]}</div>
                                                                            )}
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteFieldfather(personIndex, 'fatherPan', childIndex)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    <div className="field label">
                                                                        <div className="add-button" onClick={() => handleAddFieldFamilydetails(personIndex, 'father')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Father
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <div className="field-group">
                                                        <div className="field-group-row">
                                                            <div className="field-group-container">
                                                                <div className="scrollable-box">
                                                                    {person.motherDTOS.map((child, childIndex) => (
                                                                        <div key={childIndex} className="field-group-column">
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label="Mother Name "
                                                                                variant="standard"
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={child.motherName}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangmotherpan(personIndex, 'motherName', childIndex, event)
                                                                                }
                                                                            />
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label=" Mother PAN"
                                                                                variant="standard"
                                                                                type="text"
                                                                                name="motherPan"
                                                                                value={child.motherPan}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangmotherpan(personIndex, 'motherPan', childIndex, event)
                                                                                }
                                                                                inputProps={{ maxLength: 10 }}
                                                                            />
                                                                            {motherPanErrors[childIndex] && (
                                                                                <div style={{ color: 'red' }}>{motherPanErrors[childIndex]}</div>
                                                                            )}
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteFieldmother(personIndex, 'motherPan', childIndex)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    <div className="field label">
                                                                        <div className="add-button" onClick={() => handleAddFieldFamilydetails(personIndex, 'mother')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Mother
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <br></br>
                                            </Grid>
                                        </div>
                                    ))}
                                    <div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                    <Box m={1}>
                        <div className="key">
                            <h4>SPOUSE FAMILY DETAILS</h4>
                            <div className="details-containers">
                                <div className="scrollablebox">
                                    {SpouseFamilyformData.spouseCommonDTO.map((person, personIndex) => (
                                        <div key={personIndex} className="person-container">
                                            {SpouseFamilyformData.spouseCommonDTO.length > 1 && (
                                                <div className="close-button" onClick={() => handleRemoveBoxSpouseFamily(personIndex)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </div>
                                            )}
                                            <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                                <TextField style={{ width: '20%' }}
                                                    label="Spouse Name"
                                                    variant="standard"
                                                    type="text"
                                                    name="relativeName"
                                                    autoComplete="off"
                                                    value={person.spouseDetailsDTO.spouseName}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleInputChangespouseFamily(personIndex, 'spouseName', null, event)
                                                    }
                                                />
                                                <TextField
                                                    style={{ width: '25%' }}
                                                    label="Spouse PAN"
                                                    variant="standard"
                                                    type="text"
                                                    name="pan"
                                                    autoComplete="off"
                                                    value={person.spouseDetailsDTO.spousePan}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleInputChangespouseFamily(personIndex, 'spousePan', null, event)
                                                    }
                                                    onBlur={() => setTouched(true)}
                                                    inputProps={{ maxLength: 10 }}
                                                />
                                                {relativePanspouseTouched && !isValidPAN(person.spouseDetailsDTO.spousePan) && (
                                                    <div style={{ color: 'red' }}>Invalid PAN Format</div>
                                                )}
                                            </div>
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}>
                                                    <div className="field-group">
                                                        <div className="field-group-container">
                                                            <div className="field-group-row">
                                                                <div className="scrollable-box">
                                                                    {person.spouseHufDTOS.map((huf, hufIndex) => (
                                                                        <div key={hufIndex} className="field-group-column">
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label="HUF Name"
                                                                                variant="standard"
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={huf.hufName}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangeSpouseHuf(personIndex, 'hufName', hufIndex, event)
                                                                                }
                                                                            />
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label="PAN"
                                                                                variant="standard"
                                                                                type="text"
                                                                                name="pan1"
                                                                                autoComplete="off"
                                                                                value={huf.hufPan}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangeSpouseHuf(personIndex, 'hufPan', hufIndex, {
                                                                                        ...event,
                                                                                        target: { ...event.target, value: event.target.value.toUpperCase() },
                                                                                    })
                                                                                }
                                                                                inputProps={{ maxLength: 10 }}
                                                                            />
                                                                            {panhufErrors[hufIndex] && (
                                                                                <div style={{ color: 'red' }}>{panhufErrors[hufIndex]}</div>
                                                                            )}
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteFieldspouseHuf(personIndex, 'hufPan', hufIndex)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    <div className="field label">
                                                                        <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More HUF
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <div className="field-group">
                                                        <div className="field-group-row">
                                                            <div className="field-group-container">
                                                                <div className="scrollable-box">
                                                                    {person.spouseFatherDTOS.map((child, childIndex) => (
                                                                        <div key={childIndex} className="field-group-column">
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label="Father Name"
                                                                                variant="standard"
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={child.fatherName}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangspousefatherpan(personIndex, 'fatherName', childIndex, event)
                                                                                }
                                                                            />
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label=" Father PAN"
                                                                                variant="standard"
                                                                                type="text"
                                                                                name="fatherPan"
                                                                                value={child.fatherPan}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangspousefatherpan(personIndex, 'fatherPan', childIndex, event)
                                                                                }
                                                                                inputProps={{ maxLength: 10 }}
                                                                            />
                                                                            {panfatherErrors[childIndex] && (
                                                                                <div style={{ color: 'red' }}>{panfatherErrors[childIndex]}</div>
                                                                            )}
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteFieldspousefather(personIndex, 'fatherPan', childIndex)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    <div className="field label">
                                                                        <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'father')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Father
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <div className="field-group">
                                                        <div className="field-group-row">
                                                            <div className="field-group-container">
                                                                <div className="scrollable-box">
                                                                    {person.spouseMotherDTOS.map((child, childIndex) => (
                                                                        <div key={childIndex} className="field-group-column">
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label="Mother Name "
                                                                                variant="standard"
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={child.motherName}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangspousemotherpan(personIndex, 'motherName', childIndex, event)
                                                                                }
                                                                            />
                                                                            <TextField
                                                                                style={{ width: '50%' }}
                                                                                label=" Mother PAN"
                                                                                variant="standard"
                                                                                type="text"
                                                                                name="motherPan"
                                                                                value={child.motherPan}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangspousemotherpan(personIndex, 'motherPan', childIndex, event)
                                                                                }
                                                                                inputProps={{ maxLength: 10 }}
                                                                            />
                                                                            {panmotherErrors[childIndex] && (
                                                                                <div style={{ color: 'red' }}>{panmotherErrors[childIndex]}</div>
                                                                            )}
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteFieldspousemother(personIndex, 'motherPan', childIndex)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    <div className="field label">
                                                                        <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'mother')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Mother
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <br></br>
                                            </Grid>
                                        </div>
                                    ))}
                                    <div className="button-container">
                                        <Button
                                            className="add-people"
                                            variant="contained"
                                            startIcon={<FontAwesomeIcon icon={faPlus} />}
                                            onClick={() =>
                                                setSpouseFamilyFormData({
                                                    spouseCommonDTO: [
                                                        ...SpouseFamilyformData.spouseCommonDTO,
                                                        {
                                                            spouseDetailsDTO: {
                                                                pepId: 0,
                                                                spouseName: '',
                                                                spousePan: '',
                                                            },
                                                            spouseHufDTOS: [
                                                                {
                                                                    pepId: 0,
                                                                    spouseId: 0,
                                                                    hufName: '',
                                                                    hufPan: '',
                                                                },
                                                            ],
                                                            spouseFatherDTOS: [
                                                                {
                                                                    pepId: 0,
                                                                    spouseId: 0,
                                                                    fatherName: '',
                                                                    fatherPan: '',
                                                                },
                                                            ],
                                                            spouseMotherDTOS: [
                                                                {
                                                                    pepId: 0,
                                                                    spouseId: 0,
                                                                    motherName: '',
                                                                    motherPan: '',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                })
                                            }
                                        >
                                            Add Spouse Family Details
                                        </Button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                    <div className="card-body">
                        <Box m={1}>
                            <div className="key">
                                <h4>RELATIVE DETAILS</h4>
                                <div className="details-containers">
                                    <div className="scrollablebox">
                                        {RelativeformData.relativeCombineDTO.map((person, personIndex) => (
                                            <div key={personIndex} className="person-container">
                                                {RelativeformData.relativeCombineDTO.length > 1 && (
                                                    <div className="close-button" onClick={() => handleRemoveBoxFamily(personIndex)}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </div>
                                                )}
                                                <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                                    <FormControl style={{ width: '50%' }}>
                                                        <InputLabel htmlFor="type">Relative List</InputLabel>
                                                        <Select
                                                            label="Relative"
                                                            value={person.relativeDTO.relativeMasterId}
                                                            onChange={(e) => handlerelativeChange(personIndex, e.target.value)}
                                                            variant="standard"
                                                            type="text"
                                                        >
                                                            {Array.isArray(relative) &&
                                                                relative.map((lists: any) => (
                                                                    <MenuItem key={lists.id} value={lists.id}>
                                                                        {lists.name}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    </FormControl>
                                                    <TextField style={{ width: '20%' }}
                                                        label="Relative Name"
                                                        variant="standard"
                                                        type="text"
                                                        name="relativeName"
                                                        autoComplete="off"
                                                        value={person.relativeDTO.relativeName}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleInputChangeFamily(personIndex, 'relativeName', null, event)
                                                        }
                                                    />
                                                    <TextField
                                                        style={{ width: '25%' }}
                                                        label="PAN"
                                                        variant="standard"
                                                        type="text"
                                                        name="pan"
                                                        autoComplete="off"
                                                        value={person.relativeDTO.pan}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleInputChangeFamily(personIndex, 'pan', null, event)
                                                        }
                                                        onBlur={() => setTouched(true)}
                                                        inputProps={{ maxLength: 10 }}
                                                    />
                                                    {relativePanTouched && !isValidPAN(person.relativeDTO.pan) && (
                                                        <div style={{ color: 'red' }}>Invalid PAN Format</div>
                                                    )}
                                                </div>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <div className="field-group">
                                                            <div className="field-group-container">
                                                                <div className="field-group-row">
                                                                    <div className="scrollable-box">
                                                                        {person.relativeDetDTOS.map((email, emailIndex) => (
                                                                            <div key={emailIndex} className="field-group-column">
                                                                                <TextField
                                                                                    style={{ width: '50%' }}
                                                                                    label="Name"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    autoComplete="off"
                                                                                    value={email.name}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangeFamily(personIndex, 'name', emailIndex, event)
                                                                                    }
                                                                                />
                                                                                <TextField
                                                                                    style={{ width: '50%' }}
                                                                                    label="PAN"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    name="pan1"
                                                                                    autoComplete="off"
                                                                                    value={email.pan}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangeFamily(personIndex, 'pan', emailIndex, {
                                                                                            ...event,
                                                                                            target: { ...event.target, value: event.target.value.toUpperCase() },
                                                                                        })
                                                                                    }
                                                                                    inputProps={{ maxLength: 10 }}
                                                                                />
                                                                                {spousePanTouched && !isValidPAN(email.pan) && (
                                                                                    <div style={{ color: 'red' }}>Invalid PAN Format</div>
                                                                                )}
                                                                                <FontAwesomeIcon
                                                                                    icon={faTrash}
                                                                                    className="delete-icon"
                                                                                    onClick={() => handleDeleteFieldFamily(personIndex, 'pan', emailIndex)}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                        <div className="field label">
                                                                            <div className="add-button" onClick={() => handleAddFieldFamily(personIndex, 'Spouse')}>
                                                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Spouse
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <div className="field-group">
                                                            <div className="field-group-row">
                                                                <div className="field-group-container">
                                                                    <div className="scrollable-box">
                                                                        {person.relativeChildrenDTOS.map((child, childIndex) => (
                                                                            <div key={childIndex} className="field-group-column">
                                                                                <TextField
                                                                                    style={{ width: '50%' }}
                                                                                    label="Children Name"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    autoComplete="off"
                                                                                    value={child.childrenName}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangchilderpan(personIndex, 'childrenName', childIndex, event)
                                                                                    }
                                                                                />
                                                                                <TextField
                                                                                    style={{ width: '50%' }}
                                                                                    label="Children PAN"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    name="childrenPan"
                                                                                    value={child.pan}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangchilderpan(personIndex, 'pan', childIndex, event)
                                                                                    }
                                                                                    inputProps={{ maxLength: 10 }}
                                                                                />
                                                                                {panErrors[childIndex] && (
                                                                                    <div style={{ color: 'red' }}>{panErrors[childIndex]}</div>
                                                                                )}
                                                                                <FontAwesomeIcon
                                                                                    icon={faTrash}
                                                                                    className="delete-icon"
                                                                                    onClick={() => handleDeleteFieldchilder(personIndex, 'pan', childIndex)}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                        <div className="field label">
                                                                            <div className="add-button" onClick={() => handleAddFieldFamily(personIndex, 'children')}>
                                                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Children
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <br></br>
                                                </Grid>
                                            </div>
                                        ))}
                                        <div className="button-container">
                                            <Button
                                                className="add-people"
                                                variant="contained"
                                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                                onClick={() =>
                                                    setRelativeFormData({
                                                        relativeCombineDTO: [
                                                            ...RelativeformData.relativeCombineDTO,
                                                            {
                                                                relativeDTO: {
                                                                    pepId: 0,
                                                                    relativeMasterId: '',
                                                                    relativeName: '',
                                                                    pan: '',
                                                                },
                                                                relativeDetDTOS: [
                                                                    {
                                                                        pepId: 0,
                                                                        relativeId: 0,
                                                                        name: '',
                                                                        pan: '',
                                                                    },
                                                                ],
                                                                relativeChildrenDTOS: [
                                                                    {
                                                                        pepId: 0,
                                                                        relativeDetId: 0,
                                                                        childrenName: '',
                                                                        relativeId: 0,
                                                                        pan: '',
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    })
                                                }
                                            >
                                                Add Family details
                                            </Button>
                                        </div>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>

                    <div className="card-body">
                        <Box m={1}>
                            <div className="key">
                                <h4>PARTY</h4>

                                <div className="details-containers">
                                    <div className="scrollablebox">
                                        {partyData.partyCommonDto.map((person, personIndex) => (
                                            <div key={personIndex} className="person-container">
                                                <Grid container spacing={2}>
                                                    <Grid item xs={8}>
                                                        <div className="field-group">
                                                            <div className="field-group-container">
                                                                <div className="field-group-row">
                                                                    <div className="scrollable-box">
                                                                        {person.partyDetailsDTO.map((party, partyIndex) => (
                                                                            <div key={partyIndex} className="field-group-column">
                                                                                <FormControl
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    margin="dense"
                                                                                    className="text-field"
                                                                                >
                                                                                    <InputLabel htmlFor={`Party-${partyIndex}`}>Party</InputLabel>
                                                                                    <Select
                                                                                        label={`Party ${partyIndex + 1}`}
                                                                                        value={partyData.partyCommonDto[personIndex].partyDetailsDTO[partyIndex].partyMasterId}
                                                                                        onChange={(event: SelectChangeEvent<number>) =>
                                                                                            handlePartyFormStateChange(personIndex, partyIndex, 'partyMasterId', event)
                                                                                        }
                                                                                        name={`partyMasterId-${partyIndex}`}
                                                                                        variant="standard"
                                                                                        type="text"
                                                                                        size="small"
                                                                                        required
                                                                                    >
                                                                                        {Party.map((party) => (
                                                                                            <MenuItem key={party.id} value={party.id}>
                                                                                                {party.partyName}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </Select>
                                                                                </FormControl>

                                                                                <TextField
                                                                                    style={{ width: '90%' }}
                                                                                    label="Party Name"
                                                                                    variant="standard"
                                                                                    multiline
                                                                                    type="text"
                                                                                    name="formerAndCurrent"
                                                                                    value={party.formerAndCurrent}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handlePartyFormStateChange(personIndex, partyIndex, 'formerAndCurrent', event)
                                                                                    }

                                                                                />
                                                                                <TextField
                                                                                    style={{ width: '90%' }}
                                                                                    label="Position in the Party"
                                                                                    multiline
                                                                                    id="outlined-multiline-static"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    name="positionInTheParty"
                                                                                    value={party.positionInTheParty}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handlePartyFormStateChange(personIndex, partyIndex, 'positionInTheParty', event)
                                                                                    }


                                                                                />

                                                                                <FontAwesomeIcon
                                                                                    icon={faTrash}
                                                                                    className="delete-icon"
                                                                                    onClick={() => handleDeleteparty(personIndex, 'positionInTheParty', partyIndex)}
                                                                                />
                                                                            </div>
                                                                        ))}

                                                                    </div>
                                                                    <div className="field label">

                                                                        <div className="add-button" onClick={() => handleAddFieldpartydetails(personIndex, 'party')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More party
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                {partyData.partyCommonDto.length > 1 && (
                                                    <div className="close-button"
                                                        onClick={() => handleRemovePartyFormData(personIndex)}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </div>
                                                )}
                                                <div className="field-group-column" style={{ marginBottom: '10px' }}>



                                                    <TextField
                                                        style={{ width: '100%' }}
                                                        autoFocus
                                                        margin="dense"
                                                        id="outlined-multiline-static"
                                                        label="Position in the Government"
                                                        variant="standard"
                                                        type="text"
                                                        multiline
                                                        name="positionInTheGovernment"
                                                        value={person.partyCandidateDetailsDTO.positionInTheGovernment}
                                                        onChange={(e) => handlePositionintheGovernmentChange(e.target.value)}

                                                    />


                                                    <TextField
                                                        autoFocus
                                                        margin="dense"
                                                        id="outlined-multiline-static"
                                                        style={{ width: '100%' }}
                                                        label="Address"
                                                        variant="standard"
                                                        type="text"
                                                        multiline
                                                        name="permanentAddress"
                                                        value={person.partyCandidateDetailsDTO.permanentAddress}
                                                        onChange={(e) => handlePermanentAddressChange(e.target.value)}

                                                    />

                                                    <TextField
                                                        style={{ width: '100%' }}
                                                        label="Other Information"
                                                        variant="standard"
                                                        multiline
                                                        type="text"
                                                        name="otherInformation"
                                                        value={person.partyCandidateDetailsDTO.otherInformation}
                                                        onChange={(e) => handleOtherInformationChange(e.target.value)}

                                                    />

                                                    <TextField
                                                        style={{ width: '100%' }}
                                                        label="Died"
                                                        variant="standard"
                                                        type="text"
                                                        name="died"
                                                        value={person.partyCandidateDetailsDTO.died}
                                                        onChange={(e) => handlediedChange(e.target.value)}

                                                    />

                                                </div>


                                            </div>

                                            // </div>
                                        ))}

                                    </div>
                                    <div>
                                    </div>

                                </div>

                            </div>



                        </Box>
                    </div>
                    <div className="card-body">
                        <Box m={1}>
                            <div className="key">
                                <h4>LIST OF ASSOCIATED DETAILS</h4>
                                <Col xs={1} style={{ marginBottom: '1%' }}>
                                    <Button variant="contained" color="primary" onClick={handleCompanySearchClick}>
                                        Company
                                    </Button>
                                </Col>
                                <Modal open={open} onClose={handleModalClose}>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '80%',
                                            maxWidth: 'lg',
                                            bgcolor: 'background.paper',
                                            boxShadow: 24,
                                            p: 4,
                                        }}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="Company Name"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={companyName}
                                                    onChange={(e) => {
                                                        setCompanyName(e.target.value);
                                                        setCompanyDetailsMessage('');
                                                    }}
                                                    error={Boolean(companyDetailsMessage)}
                                                    helperText={companyDetailsMessage}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="DIN Number"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={din}
                                                    onChange={(e) => setDin(e.target.value)}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                                            <Button variant="contained" color="primary" onClick={() => handleSearch(din)}>
                                                Search
                                            </Button>
                                        </Box>
                                        {isLoading && <CircularProgress sx={{ mt: 2 }} />}
                                        {companyDetailsMessage && <div >{companyDetailsMessage}</div>}
                                    </Box>
                                </Modal>
                                <Dialog open={showSuccessPopup} onClose={() => handleClosePopup('success')} fullWidth maxWidth="lg">
                                    <DialogTitle>Company Details</DialogTitle>
                                    <DialogContent>
                                        {Array.isArray(selectedCompanyDetails) && selectedCompanyDetails.map((item, index) => (
                                            <div key={index} style={{ marginBottom: '20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Checkbox
                                                        checked={checkedCompanies.includes(item.companyDTO.companyName)}
                                                        onChange={() => handleCheckbox(item.companyDTO.companyName)}
                                                    />
                                                    <Typography style={{ marginLeft: '10px' }}>
                                                        <strong>Company Name:</strong> {item.companyDTO.companyName || 'Not Available'}
                                                    </Typography>
                                                </div>
                                                <div style={{ marginLeft: '10px' }}>
                                                    <Typography>
                                                        <strong>CINFCRN:</strong> {item.companyDTO.cinfcrn || 'Not Available'}
                                                    </Typography>
                                                    <Typography>
                                                        <strong>Original Date Of Appointment:</strong>{' '}
                                                        {item.companyDTO.originalDateOfAppointment || 'Not Available'}
                                                    </Typography>
                                                    <Typography>
                                                        {item.contactDTOS && item.contactDTOS.length > 0
                                                            ? item.contactDTOS.map((email: { emailID: any; }, addressIndex: React.Key | null | undefined) => (
                                                                <div key={addressIndex}><strong>EmailID:</strong> {email.emailID || 'Not Available'}</div>
                                                            ))
                                                            : 'Not Available'}
                                                    </Typography>
                                                    <Typography>
                                                        {item.addressDTOS && item.addressDTOS.length > 0
                                                            ? item.addressDTOS.map((address: { registeredAddress: any; }, addressIndex: React.Key | null | undefined) => (
                                                                <div key={addressIndex}><strong>Registered Address:</strong> {address.registeredAddress || 'Not Available'}</div>
                                                            ))
                                                            : 'Not Available'}
                                                    </Typography>
                                                    <Typography>
                                                        {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
                                                            ? item.companiesDirectorsDTOS.map((director: { directorName: any; }, addressIndex: React.Key | null | undefined) => (
                                                                <div key={addressIndex}><strong>Directors:</strong> {director.directorName || 'Not Available'}</div>
                                                            ))
                                                            : 'Not Available'}
                                                    </Typography>
                                                    <Typography>
                                                        {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
                                                            ? item.companiesDirectorsDTOS.map((director: { din: any; }, addressIndex: React.Key | null | undefined) => (
                                                                <div key={addressIndex}><strong>Din:</strong> {director.din || 'Not Available'}</div>
                                                            ))
                                                            : 'Not Available'}
                                                    </Typography>
                                                    <Typography>
                                                        {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
                                                            ? item.companiesDirectorsDTOS.map((director: { designationId: any; }, addressIndex: React.Key | null | undefined) => (
                                                                <div key={addressIndex}><strong>Designation:</strong> {getDesignationName(director.designationId as number) || 'Not Available'}</div>
                                                            ))
                                                            : 'Not Available'}
                                                    </Typography>
                                                    <Typography>
                                                        {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
                                                            ? item.companiesDirectorsDTOS.map((director: { directorStatus: any; }, addressIndex: React.Key | null | undefined) => (
                                                                <div key={addressIndex}><strong>Director Status:</strong> {director.directorStatus || 'Not Available'}</div>
                                                            ))
                                                            : 'Not Available'}
                                                    </Typography>
                                                    <Typography>
                                                        {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
                                                            ? item.companiesDirectorsDTOS.map((director: { appointmentDate: any; }, addressIndex: React.Key | null | undefined) => (
                                                                <div key={addressIndex}><strong>Date of appointment at Current:</strong> {director.appointmentDate || 'Not Available'}</div>
                                                            ))
                                                            : 'Not Available'}
                                                    </Typography>
                                                    <Typography>
                                                        {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
                                                            ? item.companiesDirectorsDTOS.map((director: { cessationDate: any; }, addressIndex: React.Key | null | undefined) => (
                                                                <div key={addressIndex}><strong>Date of Cessation:</strong> {director.cessationDate || 'Not Available'}</div>
                                                            ))
                                                            : 'Not Available'}
                                                    </Typography>
                                                </div>
                                            </div>
                                        ))}
                                    </DialogContent>
                                    <DialogActions>
                                        <Button variant="contained" color="primary" onClick={handleDialogSubmit}>
                                            Submit
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={() => handleClosePopup('success')}>
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <div className="details-containers">
                                    <div className="scrollablebox">
                                        {formDatas.combinedDTO.map((person, personIndex) => (
                                            <div key={personIndex} className="person-container">
                                                {formDatas.combinedDTO.length > 1 && (
                                                    <div className="close-button" onClick={() => handleRemoveBoxCompanies(personIndex)}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </div>
                                                )}
                                                <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                                    <TextField
                                                        style={{ width: '100%' }}
                                                        autoFocus
                                                        margin="dense"
                                                        id="outlined-multiline-static"
                                                        label="Source Link"
                                                        variant="standard"
                                                        type="text"
                                                        fullWidth
                                                        size="small"
                                                        name="sourceLink"
                                                        multiline
                                                        value={person.companyDTO.sourceLink}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleInputChangeCompanies(personIndex, 'sourceLink', null, event)
                                                        }
                                                    />
                                                </div>
                                                <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                                    <FormControl style={{ width: '15%' }}>
                                                        <InputLabel htmlFor="typeId">List Of Company Details</InputLabel>
                                                        <Select
                                                            label="AssociatedList"
                                                            variant="standard"
                                                            type="text"
                                                            value={person.companyDTO.typeId.toString()}
                                                            onChange={(event: SelectChangeEvent<string>) =>
                                                                handleInputChangeCompanies(
                                                                    personIndex,
                                                                    'typeId',
                                                                    null,
                                                                    event
                                                                )
                                                            }
                                                        >
                                                            {listOfCompanyDetails.map((item) => (
                                                                <MenuItem key={item.id} value={item.id.toString()}>
                                                                    {item.type}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl style={{ width: '15%' }}>
                                                        <InputLabel htmlFor="type">AssociatedList</InputLabel>
                                                        <Select
                                                            label="AssociatedList"
                                                            variant="standard"
                                                            type="text"
                                                            value={person.companyDTO.associateMasterId.toString()}
                                                            onChange={(event: SelectChangeEvent<string>) =>
                                                                handleInputChangeCompanies(
                                                                    personIndex,
                                                                    'associateMasterId',
                                                                    null,
                                                                    event
                                                                )
                                                            }
                                                        >
                                                            {associatedList.map((item) => (
                                                                <MenuItem key={item.id} value={item.id.toString()}>
                                                                    {item.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <TextField
                                                        style={{ width: '25%' }}
                                                        label="Company Name"
                                                        variant="standard"
                                                        type="text"
                                                        name="companyName"
                                                        id={`companyName-${personIndex}`}
                                                        value={person.companyDTO.companyName}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleInputChangeCompanies(personIndex, 'companyName', null, event)
                                                        }}
                                                    />
                                                    <TextField
                                                        style={{ width: '25%' }}
                                                        label="CINFCRN"
                                                        variant="standard"
                                                        id={`cinfcrn-${personIndex}`}
                                                        name="cinfcrn"
                                                        value={person.companyDTO.cinfcrn}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleInputChangeCompanies(personIndex, 'cinfcrn', null, event)
                                                        }
                                                    />
                                                    <TextField
                                                        style={{ width: '25%' }}
                                                        label="Original Date of Appointment"
                                                        variant="standard"
                                                        type="date"
                                                        name="dob"
                                                        required
                                                        value={person.companyDTO.originalDateOfAppointment}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleInputChangeCompanies(personIndex, 'originalDateOfAppointment', null, event)
                                                        }
                                                    />
                                                </div>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <div className="field-group">
                                                            <div className="field-group-container">
                                                                <div className="field-group-row">
                                                                    <div className="scrollable-box">
                                                                        {person.contactDTOS.map((email, emailIndex) => (
                                                                            <div key={emailIndex} className="field-group-column">
                                                                                <TextField
                                                                                    style={{ width: '100%' }}
                                                                                    label="Email Id"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    value={email.emailID}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangeCompanies(personIndex, 'emailID', emailIndex, event)
                                                                                    }
                                                                                />
                                                                                {emailErrors[emailIndex] && (
                                                                                    <div style={{ color: 'red' }}>{emailErrors[emailIndex]}</div>
                                                                                )}
                                                                                <FontAwesomeIcon
                                                                                    icon={faTrash}
                                                                                    className="delete-icon"
                                                                                    onClick={() =>
                                                                                        handleDeleteFieldCompanies(personIndex, 'emailID', emailIndex)
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                        <div className="field label">
                                                                            <div className="add-button" onClick={() => handleAddFieldCompanies(personIndex, 'email')}>
                                                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Email Ids
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <div className="field-group">
                                                            <div className="field-group-row">
                                                                <div className="field-group-container">
                                                                    <div className="scrollable-box">
                                                                        {person.addressDTOS.map((address, addressIndex) => (
                                                                            <div key={addressIndex} className="field-group-column">
                                                                                <TextField
                                                                                    style={{ width: '100%' }}
                                                                                    label="Registered address"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    value={address.registeredAddress}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangeCompanies(personIndex, 'registeredAddress', addressIndex, event)
                                                                                    }
                                                                                />
                                                                                <FontAwesomeIcon
                                                                                    icon={faTrash}
                                                                                    className="delete-icon"
                                                                                    onClick={() =>
                                                                                        handleDeleteFieldCompanies(personIndex, 'registeredAddress', addressIndex)
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                        <div className="field label">
                                                                            <div className="add-button" onClick={() => handleAddFieldCompanies(personIndex, 'address')}>
                                                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Registered Address
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <div className="field-group">
                                                            <div className="field-group-row">
                                                                <div className="field-group-container">
                                                                    <div className="scrollable-box">
                                                                        {person.companiesDirectorsDTOS.map((directors, directorsIndex) => (
                                                                            <div key={directorsIndex} className="field-group-column">
                                                                                <TextField
                                                                                    style={{ width: '20%' }}
                                                                                    label="Director Name"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    value={directors.directorName} // Update this line
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangeCompanies(personIndex, 'directorName', directorsIndex, event)
                                                                                    }
                                                                                />
                                                                                <TextField
                                                                                    style={{ width: '20%' }}
                                                                                    label="DIN"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    value={directors.din} // Update this line
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangeCompanies(personIndex, 'din', directorsIndex, event)
                                                                                    }
                                                                                />
                                                                                <FormControl style={{ width: '15%' }}>
                                                                                    <InputLabel htmlFor="type">Designation</InputLabel>
                                                                                    <Select
                                                                                        label="Designation"
                                                                                        variant="standard"
                                                                                        value={directors.designationId.toString()}
                                                                                        onChange={(event: SelectChangeEvent<string>) =>
                                                                                            handleInputChangeCompanies(
                                                                                                personIndex,
                                                                                                'designationId',
                                                                                                directorsIndex,
                                                                                                event
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {Designationlist.map((item) => (
                                                                                            <MenuItem key={item.id} value={item.id.toString()}>
                                                                                                {item.name}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </Select>
                                                                                </FormControl>
                                                                                <FormControl style={{ width: '15%' }}>
                                                                                    <InputLabel htmlFor="type">Director Status</InputLabel>
                                                                                    <Select
                                                                                        label="Director Status"
                                                                                        variant="standard"
                                                                                        type="text"
                                                                                        value={directors.companyMasterId.toString()}
                                                                                        onChange={(event: SelectChangeEvent<string>) =>
                                                                                            handleInputChangeCompanies(
                                                                                                personIndex,
                                                                                                'companyMasterId',
                                                                                                directorsIndex,
                                                                                                event
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {companymaster.map((item) => (
                                                                                            <MenuItem key={item.id} value={item.id.toString()}>
                                                                                                {item.name}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </Select>
                                                                                </FormControl>
                                                                                <TextField
                                                                                    label="Date of Appointment at Current Designation"
                                                                                    variant="standard"
                                                                                    type="date"
                                                                                    name="dob"
                                                                                    required
                                                                                    value={directors.appointmentDate}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangeCompanies(
                                                                                            personIndex,
                                                                                            'appointmentDate',
                                                                                            directorsIndex,
                                                                                            event
                                                                                        )
                                                                                    }
                                                                                />
                                                                                <TextField
                                                                                    label="Date of Cessation"
                                                                                    variant="standard"
                                                                                    type="date"
                                                                                    name="dob"
                                                                                    required
                                                                                    value={directors.cessationDate}

                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangeCompanies(personIndex, 'cessationDate', directorsIndex, event)
                                                                                    }
                                                                                />
                                                                                <FontAwesomeIcon
                                                                                    icon={faTrash}
                                                                                    className="delete-icon"
                                                                                    onClick={() => handleDeleteFieldCompanies(personIndex, 'din', directorsIndex)}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                        <div className="field label">
                                                                            <div className="add-button" onClick={() => handleAddFieldCompanies(personIndex, 'directors')}>
                                                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Directors & DIN
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid item xs={4}>
                                                        <div className="key">
                                                            <div className="field-group">
                                                                {person.companyDocumentsDTOS.map((field3, index3) => (
                                                                    <form key={index3} encType="multipart/form-data">
                                                                        <div className="person-container">
                                                                            <div className="field-group-column">
                                                                                <FormControl style={{ width: '67%' }}>
                                                                                    <InputLabel id={`demo-simple-select-label-${index3}`}>File Type</InputLabel>
                                                                                    <Select
                                                                                        labelId={`demo-simple-select-label-${index3}`}
                                                                                        id={`demo-simple-select-${personIndex}-${index3}`}
                                                                                        label="FileType"
                                                                                        size="small"
                                                                                        variant="standard"
                                                                                        value={field3.documentTypeId || 0}
                                                                                        onChange={(event) => handleSelectChange3(personIndex, index3, Number(event.target.value))}
                                                                                    >
                                                                                        {filetype3
                                                                                            .filter((_, dataIndex1) => dataIndex1 === 4 || dataIndex1 === 5)
                                                                                            .map((data) => (
                                                                                                <MenuItem key={data.id} value={data.id}>
                                                                                                    {data.name}
                                                                                                </MenuItem>
                                                                                            ))}
                                                                                    </Select>
                                                                                </FormControl>
                                                                                <input
                                                                                    id={`image-upload-input3-${personIndex}-${index3}`}
                                                                                    type="file"
                                                                                    onChange={(event) => handleFileChange3(personIndex, index3, event)}
                                                                                    style={{ display: 'none' }}
                                                                                    multiple
                                                                                />
                                                                                <Button
                                                                                    size='small'
                                                                                    variant="outlined"
                                                                                    onClick={() =>
                                                                                        handleChooseImagesClick3(
                                                                                            personIndex,
                                                                                            index3
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Choose Images
                                                                                </Button>
                                                                                <TextField label="Image Name" type="text" size="small" variant="outlined" value={field3.imageName3} disabled />
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <div className="field-group">
                                                            <div className="field-group-row">
                                                                <div className="field-group-container">
                                                                    <div className="scrollable-box">
                                                                        {person.companyAssociationDTOS.map((permedia, permediaindex) => (
                                                                            <div key={permediaindex} className="field-group-column">
                                                                                <TextareaAutosize
                                                                                    style={{ minHeight: '100px', maxHeight: '250px', width: '100%', resize: 'none' }}
                                                                                    placeholder="Type here..."
                                                                                    autoFocus
                                                                                    id="outlined-multiline-static"
                                                                                    value={permedia.companyAssociation}
                                                                                    onKeyPress={handleTextareaKeyPresss}
                                                                                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                                                        handletPerMediaChangsse(personIndex, 'companyAssociation', permediaindex, event)
                                                                                    }
                                                                                    minRows={3}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={person.companyDTO.listAdverseInformation === 1}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleCheckboxChange(personIndex, 'listAdverseInformation', event.target.checked)
                                                                    }
                                                                />
                                                            }
                                                            label="Adverse Information"
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={person.companyDTO.listRegulatoryAction === 1}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleCheckboxChange(personIndex, 'listRegulatoryAction', event.target.checked)
                                                                    }
                                                                />
                                                            }
                                                            label="Regulatory Action"
                                                        />
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={person.companyDTO.listGovernment === 1}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleCheckboxChange(personIndex, 'listGovernment', event.target.checked)
                                                                    }
                                                                />
                                                            }
                                                            label="Government"
                                                        />
                                                        <div>
                                                            {errorMsgs && <div className="error-message" style={{ color: "red" }}>{errorMsgs}</div>}
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        ))}
                                        <div className="button-container">
                                            <Button
                                                className="add-people"
                                                variant="contained"
                                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                                onClick={() => {
                                                    setClickCount(prevCount => prevCount + 1);
                                                    setformDatas({
                                                        combinedDTO: [
                                                            ...formDatas.combinedDTO,
                                                            {
                                                                companyDTO: {
                                                                    id: 0,
                                                                    sourceLink: '',
                                                                    associateMasterId: 0,
                                                                    companyName: '',
                                                                    listAdverseInformation: false,
                                                                    listRegulatoryAction: false,
                                                                    listGovernment: false,
                                                                    originalDateOfAppointment: '',
                                                                    typeId: 0,
                                                                    cinfcrn: '',
                                                                    document: '',
                                                                },
                                                                addressDTOS: [
                                                                    {
                                                                        id: 0,
                                                                        companyId: 0,
                                                                        registeredAddress: '',
                                                                    },
                                                                ],
                                                                contactDTOS: [
                                                                    {
                                                                        companyId: 0,
                                                                        emailID: '',
                                                                    },
                                                                ],
                                                                companiesDirectorsDTOS: [
                                                                    {
                                                                        id: 0,
                                                                        din: '',
                                                                        companyId: 0,
                                                                        directorId: 0,
                                                                        designationId: 0,
                                                                        companyMasterId: 0,
                                                                        appointmentDate: '',
                                                                        cessationDate: '',
                                                                        designation: '',
                                                                        directorStatus: '',
                                                                        directorName: '',
                                                                    },
                                                                ],
                                                                companyDocumentsDTOS: [
                                                                    {
                                                                        companyId: 0,
                                                                        documentTypeId: 0,
                                                                        documentType: '',
                                                                        imageName3: '',
                                                                        uid: 0,
                                                                        files3: [],
                                                                        path: [],
                                                                        euid: 0,
                                                                    },
                                                                ],
                                                                companyAssociationDTOS: [
                                                                    {
                                                                        id: 0,
                                                                        companyId: 0,
                                                                        companyAssociation: '',
                                                                        uid: loginDetails.id,
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    });
                                                }}
                                            >
                                                Add List of Associated Companies
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                </div >
                <div className="card-body">
                    <Box m={1}>
                        <div className="key">
                            <div className="scroll-box">
                                <Grid item xs={12}>
                                    <Grid item xs={4}>
                                        <div className="key">
                                            <div className="person-container">
                                                <div className="field-group">
                                                    {fields.map((field, index) => (
                                                        <form key={index} encType="multipart/form-data">
                                                            <div className="person-container">
                                                                <div className="field-group-column">
                                                                    <FormControl style={{ width: '50%' }}>
                                                                        <InputLabel id={`demo-simple-select-label-${index}`}>File Type</InputLabel>
                                                                        {filetype && filetype2.length > 0 && (
                                                                            <Select
                                                                                labelId={`demo-simple-select-label-${index}`}
                                                                                id={`demo-simple-select-${index}`}
                                                                                label="FileType"
                                                                                type="text"
                                                                                size="small"
                                                                                variant="standard"
                                                                                value={filetype.length > 0 ? filetype[0].id : ''}
                                                                                onChange={(event) => handleSelectChange(event.target.value as string, index)}
                                                                                disabled={field.uploading}
                                                                            >
                                                                                {filetype
                                                                                    .filter((_, dataIndex) => dataIndex === 0) // Include only the first item
                                                                                    .map((data) => (
                                                                                        <MenuItem key={data.id} value={data.id}>
                                                                                            {data.name}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                            </Select>
                                                                        )}
                                                                    </FormControl>
                                                                    <input
                                                                        id={`image-upload-input-${index}`}
                                                                        type="file"
                                                                        onChange={(event) => handleFileChange(index, event)}
                                                                        style={{ display: 'none' }}
                                                                        multiple
                                                                    />
                                                                    <Button variant="outlined" onClick={() => handleChooseImagesClick(index)}>Choose Imagess</Button>
                                                                    <TextField label="Image Name" type="text" size="small" variant="outlined" value={field.imageName} disabled />
                                                                    {fileErrors[index] && (
                                                                        <Typography style={{ color: 'red', marginTop: '8px' }}>
                                                                            {fileErrors[index]}
                                                                        </Typography>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </form>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Box>
                </div>
                <div className="card-body">
                    <Box m={1}>
                        <div className="key">
                            <div className="scroll-box">
                                <Grid item xs={12}>
                                    <Grid item xs={4}>
                                        <div className="key">
                                            <div className="person-container">
                                                <div className="field-group">
                                                    {fields1.map((field1, index) => (
                                                        <form key={index} encType="multipart/form-data">
                                                            <div className="person-container">
                                                                <div className="field-group-column">
                                                                    <FormControl style={{ width: '50%' }}>
                                                                        <InputLabel id={`demo-simple-select-label-${index}`}>File Type</InputLabel>
                                                                        {filetype1 && filetype2.length > 0 && (
                                                                            <Select
                                                                                labelId={`demo-simple-select-label-${index}`}
                                                                                id={`demo-simple-select-${index}`}
                                                                                label="FileType"
                                                                                type="text"
                                                                                size="small"
                                                                                variant="standard"
                                                                                value={filetype1.length > 0 ? filetype[1].id : ''}
                                                                                onChange={(event) => handleSelectChange1(event.target.value as string, index)}
                                                                                disabled={field1.uploading}>
                                                                                {filetype1
                                                                                    .filter((_, dataIndex1) => dataIndex1 === 1) // Include only the first item
                                                                                    .map((data) => (
                                                                                        <MenuItem key={data.id} value={data.id}>
                                                                                            {data.name}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                            </Select>
                                                                        )}
                                                                    </FormControl>
                                                                    <input
                                                                        id={`image-upload-input1-${index}`}
                                                                        type="file"
                                                                        onChange={(event) => handleFileChange1(index, event)}
                                                                        style={{ display: 'none' }}
                                                                        multiple
                                                                    />
                                                                    <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>Choose Images</Button>
                                                                    <TextField label="Image Name" type="text" size="small" variant="outlined" value={field1.imageName1} disabled />
                                                                    {fileErrors1[index] && (
                                                                        <Typography style={{ color: 'red', marginTop: '8px' }}>
                                                                            {fileErrors1[index]}
                                                                        </Typography>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </form>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Box>
                </div>
                <div className="card-body">
                    <Box m={3}>
                        <div className="key">
                            <div className="scroll-box">
                                <Grid item xs={12}>
                                    <Grid item xs={4}>
                                        <div className="key">
                                            {fields2.map((field2, index) => (
                                                <form key={index} encType="multipart/form-data">
                                                    <div className="person-container">
                                                        <div className="field-group-column">
                                                            <FormControl style={{ width: '50%' }}>
                                                                <InputLabel id={`demo-simple-select-label-${index}`}>File Type</InputLabel>
                                                                {filetype2 && filetype2.length > 0 && (
                                                                    <Select
                                                                        labelId={`demo-simple-select-label-${index}`}
                                                                        id={`demo-simple-select-${index}`}
                                                                        label="FileType"
                                                                        type="text"
                                                                        size="small"
                                                                        variant="standard"
                                                                        value={filetype2.length > 0 ? filetype[2].id : ''}
                                                                        onChange={(event) => handleSelectChange2(event.target.value as string, index)}
                                                                        disabled={field2.uploading}>
                                                                        {filetype2
                                                                            .filter((_, dataIndex2) => dataIndex2 === 2)
                                                                            .map((data) => (
                                                                                <MenuItem key={data.id} value={data.id}>
                                                                                    {data.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                )}
                                                            </FormControl>
                                                            <input
                                                                id={`image-upload-input2-${index}`}
                                                                type="file"
                                                                onChange={(event) => handleFileChange2(index, event)}
                                                                style={{ display: 'none' }}
                                                                multiple
                                                            />
                                                            <Button variant="outlined" onClick={() => handleChooseImagesClick2(index)}>Choose Images</Button>
                                                            <Grid xs={2}>
                                                                <TextField label="Image Name" type="text" size="small" variant="outlined" value={field2.imageName2} disabled />
                                                                {fileErrors2[index] && (
                                                                    <Typography style={{ color: 'red', marginTop: '8px' }}>
                                                                        {fileErrors2[index]}
                                                                    </Typography>
                                                                )}
                                                            </Grid>
                                                        </div>
                                                    </div>
                                                </form>
                                            ))}
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Box>
                </div>
                <div className="card-body">
                    <Box m={3}>
                        <div className="key">
                            <div className="scroll-box">
                                <Grid item xs={12}>
                                    <Grid item xs={4}>
                                        <div className="key">
                                            {fields4.map((field4, index) => (
                                                <form key={index} encType="multipart/form-data">
                                                    <div className="person-container">
                                                        <div className="field-group-column">
                                                            <FormControl style={{ width: '50%' }}>
                                                                <InputLabel id={`demo-simple-select-label-${index}`}>File Type</InputLabel>
                                                                {filetype4 && filetype2.length > 0 && (
                                                                    <Select
                                                                        labelId={`demo-simple-select-label-${index}`}
                                                                        id={`demo-simple-select-${index}`}
                                                                        label="FileType"
                                                                        type="text"
                                                                        size="small"
                                                                        variant="standard"

                                                                        // value={fields4[index].fileType}
                                                                        value={filetype4.length > 0 ? filetype[3].id : ''}
                                                                        onChange={(event) => handleSelectChange4(event.target.value as string, index)}
                                                                        disabled={field4.uploading}>
                                                                        {filetype4
                                                                            .filter((_, dataIndex3) => dataIndex3 === 3) // Include only the first item
                                                                            .map((data) => (
                                                                                <MenuItem key={data.id} value={data.id}>
                                                                                    {data.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>)}
                                                            </FormControl>
                                                            <input
                                                                id={`image-upload-input4-${index}`}
                                                                type="file"
                                                                onChange={(event) => handleFileChange4(index, event)}
                                                                style={{ display: 'none' }}
                                                                multiple
                                                            />
                                                            <Button variant="outlined" onClick={() => handleChooseImagesClick4(index)}>Choose Images</Button><Grid xs={2}>
                                                                <TextField label="Image Name" type="text" size="small" variant="outlined" value={field4.imageName4} disabled />
                                                                {fileErrors3[index] && (
                                                                    <Typography style={{ color: 'red', marginTop: '8px' }}>
                                                                        {fileErrors3[index]}
                                                                    </Typography>
                                                                )}
                                                            </Grid>
                                                        </div>
                                                    </div>
                                                </form>
                                            ))}
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Box>
                </div>
                < div>
                    <Box m={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                                const success = await handleSubmit(0, 0, 0, 0, 0, 0, '');
                                if (success) {
                                    setDisabled(true);
                                    navigate(`/details/:taskId`);
                                }
                            }}
                            onKeyPress={handleKeyPress}
                            disabled={disabled}
                        >
                            Submit
                        </Button>
                    </Box>
                </div >
            </Box >
        </>
    );
};
export default Details;


// import React, { useState, useRef, useEffect } from 'react';
// import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Typography, Dialog, TextareaAutosize, DialogTitle, DialogContent, DialogActions, Modal, FormControlLabel, CircularProgress } from '@mui/material';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes, faPlusCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// import './Details.css';
// import { SelectChangeEvent } from '@mui/material/Select';
// import FormHelperText from '@mui/material/FormHelperText';
// import AddressApiService from '../../data/services/insert/address-api-service';
// import RelativeApiService from '../../data/services/master/relative/relative-api-serivces';
// import StateApiService from '../../data/services/master/State/state_api_service';
// import CountryApiService from '../../data/services/master/Country/country_api_service';
// import Header from '../../layouts/header/header';
// import AssociatedListApiService from '../../data/services/AssociatedList/associatedlist-api-service';
// import { AddressDTO, Pan, AkaDetRequest, AssociatedlistPayload, PartyPayload, CompaniesDirectorsDTO, CompanyDTO, ContactDTO, Country, CustomerRequest, Emailids, OtherAssociationRequest, PartyRequest, PartyAddress, Payload, PhoneNumbers, CompanyMasterPayload, Relative, RelativePayload, State, DesignationPayload, CompanyDocumentsDTO, Gender, FamilyPayload, SpouseFamilyPayload, ListOfCompanyPayload, PartysPayload } from '../../data/services/viewpage/viewpagedetails-payload';
// import FileUpload from '../../data/services/Fileupload/fileupload_api_service';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import DesignationService from '../../data/services/master/designation/designation_api_service';
// import { Col } from 'react-bootstrap';
// import PartyApiService from '../../data/services/master/party/party_api_serivces';
// import CompanyMasterApiService from '../../data/services/master/companymaster/companymaster_api_service';
// import { useParams } from 'react-router-dom';
// import GenderApiService from '../../data/services/master/Gender/gender_api_service';
// import ViewPageDetailsService from '../../data/services/viewpage/viewpagedetails-api-service';
// import Checkbox from '@mui/material/Checkbox';

// interface FieldState {
//     imageName: string;
//     fileType: string;
//     uploading: boolean;
//     uploadSuccess: boolean;
// }

// interface FieldState1 {
//     imageName1: string;
//     fileType: string;
//     uploading: boolean;
//     uploadSuccess: boolean;
// }

// interface FieldState2 {
//     imageName2: string;
//     fileType: string;
//     uploading: boolean;
//     uploadSuccess: boolean;
// }

// interface FieldState3 {
//     imageName3: string;
//     fileType: string;
//     uploading: boolean;
//     uploadSuccess: boolean;
// }

// interface FieldState4 {
//     imageName4: string;
//     fileType: string;
//     uploading: boolean;
//     uploadSuccess: boolean;
// }

// interface FieldState5 {
//     imageName5: string;
//     fileType: string;
//     uploading: boolean;
//     uploadSuccess: boolean;
// }

// interface FileType {
//     id: string;
//     name: string;
// }

// interface MultipartFile {
//     name: string;
//     size: number;
//     type: string;
// }

// interface CombinedDTOSS {
//     companyDTO: CompanyDTO;
// }

// interface CompanyDetailsItem {
//     companyDTO: {
//         id: number;
//         associateMasterId: number;
//         companyName: string;
//         originalDateOfAppointment: string;
//         cinfcrn: string;
//         document: string;
//     };
//     addressDTOS: Array<{
//         id: number;
//         companyId: number;
//         registeredAddress: string;
//     }>;
//     contactDTOS: Array<{
//         companyId: number;
//         emailID: string;
//     }>;
//     companiesDirectorsDTOS: Array<{
//         id: number;
//         din: string;
//         companyId: number;
//         directorId: number;
//         designationId: number;
//         companyMasterId: number;
//         appointmentDate: string;
//         cessationDate: string;
//         designation: string;
//         directorStatus: string;
//         directorName: string;
//     }>;
//     companyDocumentsDTOS: Array<{
//         companyId: number;
//         documentTypeId: number;
//         documentType: string;
//         imageName3: string;
//         uid: number;
//         files3: string[];
//         path: number[];
//         euid: number;
//     }>;
// }

// const Details: React.FC = () => {

//     const navigate = useNavigate();
//     const [listofcompanyError, setListOfCompanyError] = useState(false);

//     const initialFieldState: FieldState = {
//         imageName: '',
//         fileType: '',
//         uploading: false,
//         uploadSuccess: false,
//     };

//     const initialFieldState1: FieldState1 = {
//         imageName1: '',
//         fileType: '',
//         uploading: false,
//         uploadSuccess: false,
//     };

//     const initialFieldState2: FieldState2 = {
//         imageName2: '',
//         fileType: '',
//         uploading: false,
//         uploadSuccess: false,
//     };

//     const initialFieldState3: FieldState3 = {
//         imageName3: '',
//         fileType: '',
//         uploading: false,
//         uploadSuccess: false,
//     };

//     const initialFieldState4: FieldState4 = {
//         imageName4: '',
//         fileType: '',
//         uploading: false,
//         uploadSuccess: false,
//     };

//     const initialFieldState5: FieldState5 = {
//         imageName5: '',
//         fileType: '',
//         uploading: false,
//         uploadSuccess: false,
//     };

//     const [formData, setFormData] = useState<CustomerRequest>({
//         name: '',
//         sourceLink: '',
//         education: '',
//         dob: '',
//         placeOfBirth: '',
//         pan: '',
//         directorsIdentificationNumber: '',
//         adverseInformation: 0,
//         regulatoryAction: 0,
//         uid: '',
//         genderId: 0,
//         createdAt: '',
//     });

//     const [akaformData, setAkaFormData] = useState<AkaDetRequest[]>([{ akaName: '' }]);
//     const [PerMediaformData, setPerMediaData] = useState<OtherAssociationRequest[]>([{ otherAssociationAsPerMedia: '' }]);
//     const [imageFiles, setImageFiles] = useState<{ data: any; name: string; ext: string }[]>([]);
//     const location = useLocation();
//     const countryName = sessionStorage.getItem('countryName');
//     const stateName = sessionStorage.getItem('stateName');
//     const [disabled, setDisabled] = useState(false);

//     const [partyData, setPartyData] = useState<PartysPayload>({
//         partyCommonDto: [
//             {
//                 partyCandidateDetailsDTO: {
//                     pepId: 0,
//                     positionInTheGovernment: '',
//                     otherInformation: '',
//                     died: '',
//                     permanentAddress: '',
//                 },
//                 partyDetailsDTO: [
//                     {
//                         pepId: 0,
//                         partyMasterId: 0,
//                         formerAndCurrent: '',
//                         positionInTheParty: '',
//                         partyCandidateId: 0,
//                     },
//                 ],
//             },
//         ],
//     });

//     const [Address, setAddress] = useState<PartyAddress[]>([{
//         permanentAddress: '',
//     },]);

//     const [RelativeformData, setRelativeFormData] = useState<RelativePayload>({
//         relativeCombineDTO: [
//             {
//                 relativeDTO: {
//                     pepId: 0,
//                     relativeMasterId: '',
//                     relativeName: '',
//                     pan: '',
//                 },
//                 relativeDetDTOS: [
//                     {
//                         pepId: 0,
//                         relativeId: 0,
//                         name: '',
//                         pan: '',
//                     },
//                 ],
//                 relativeChildrenDTOS: [
//                     {
//                         pepId: 0,
//                         relativeDetId: 0,
//                         relativeId: 0,
//                         childrenName: '',
//                         pan: '',
//                     },
//                 ],
//             },
//         ],
//     });

//     const [FamilyformData, setFamilyFormData] = useState<FamilyPayload>({
//         familyCombinedDTO: [
//             {
//                 hufDTO: [
//                     {
//                         pepId: 0,
//                         hufPan: '',
//                         hufName: '',
//                     },
//                 ],
//                 fatherDTOS: [
//                     {
//                         pepId: 0,
//                         fatherName: '',
//                         fatherPan: '',
//                     },
//                 ],
//                 motherDTOS: [
//                     {
//                         pepId: 0,
//                         motherName: '',
//                         motherPan: '',
//                     },
//                 ],
//             },
//         ],
//     });

//     const [SpouseFamilyformData, setSpouseFamilyFormData] = useState<SpouseFamilyPayload>({
//         spouseCommonDTO: [
//             {
//                 spouseDetailsDTO: {
//                     pepId: 0,
//                     spouseName: '',
//                     spousePan: '',
//                 },
//                 spouseHufDTOS: [
//                     {
//                         pepId: 0,
//                         spouseId: 0,
//                         hufName: '',
//                         hufPan: '',
//                     },
//                 ],
//                 spouseFatherDTOS: [
//                     {
//                         pepId: 0,
//                         spouseId: 0,
//                         fatherName: '',
//                         fatherPan: '',
//                     },
//                 ],
//                 spouseMotherDTOS: [
//                     {
//                         pepId: 0,
//                         spouseId: 0,
//                         motherName: '',
//                         motherPan: '',
//                     },
//                 ],
//             },
//         ],
//     });

//     const [motherPanErrors, setmotherPanErrors] = useState<string[]>([]);
//     const [fatherPanErrors, setfatherPanErrors] = useState<string[]>([]);
//     const [HUFPanErrors, setHUFPanErrors] = useState<string[]>([]);
//     const [relative, setRelative] = useState<Relative[]>([]);
//     const [PhoneNumberss, setPhoneNumberss] = useState<PhoneNumbers[]>([{ pepId: 0, communicationDt: '', communicationTypeId: 0 }]);
//     const [Emailidss, setEmailidss] = useState<Emailids[]>([{ pepId: 0, communicationDt: '', communicationTypeId: 0 }]);
//     const relatives = new RelativeApiService();
//     const [selectedCountry, setSelectedCountry] = useState('');
//     const [countries, setCountries] = useState<Country[]>([]);
//     const [selectedState, setselectedState] = useState<string[]>(['']);
//     const [states, setStates] = useState<State[]>([]);
//     const authService = new StateApiService();
//     const countryService = new CountryApiService();
//     const genderService = new GenderApiService();
//     const partyservices = new PartyApiService();
//     const [Party, setparty] = useState<PartyPayload[]>([]);
//     const companymasterservices = new CompanyMasterApiService();
//     const [companymaster, setcompanymaster] = useState<CompanyMasterPayload[]>([]);
//     const [listOfCompanyDetails, setListOfCompany] = useState<ListOfCompanyPayload[]>([]);
//     const [selectedParty, setselecteParty] = useState<string[]>(['']);
//     const [gender, setgender] = useState<Gender[]>([]);
//     const fileUpload = new FileUpload();
//     const [filetype, Setfiletype] = useState<FileType[]>([]);
//     const [filetype1, setFiletype1] = useState<FileType[]>([]);
//     const [filetype2, setFiletype2] = useState<FileType[]>([]);
//     const [filetype3, setFiletype3] = useState<FileType[]>([]);
//     const [filetype4, setFiletype4] = useState<FileType[]>([]);
//     const [filetype5, setFiletype5] = useState<FileType[]>([]);
//     const [filteredFileTypes, setFilteredFileTypes] = useState<FileType[]>([]);
//     const [fields, setFields] = useState<FieldState[]>([initialFieldState]);
//     const [fields1, setFields1] = useState<FieldState1[]>([initialFieldState1]);
//     const [fields2, setFields2] = useState<FieldState2[]>([initialFieldState2]);
//     const [fields3, setFields3] = useState<FieldState3[]>([initialFieldState3]);
//     const [fields4, setFields4] = useState<FieldState4[]>([initialFieldState4]);
//     const [fields5, setFields5] = useState<FieldState5[]>([initialFieldState5]);
//     const { pepId, stateId, countryId } = useParams();
//     const [error, setError] = useState<string | null>(null);
//     const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
//     const selectedField = fields[selectedFileIndex || 0];
//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const loginDetails = userDetails.loginDetails;
//     const [submissionSuccess, setSubmissionSuccess] = useState(false);
//     const [fileErrorMessage, setFileErrorMessage] = useState<string | null>(null);
//     const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
//     const sourceLinkRef = useRef<HTMLInputElement | null>(null);
//     const nameRef = useRef<HTMLInputElement | null>(null);
//     const genderRef = useRef<HTMLInputElement | null>(null);
//     const companynameRef = useRef<HTMLInputElement | null>(null);
//     const companyFileTypeRef = useRef<HTMLInputElement | null>(null);
//     const [sourceLinkError, setSourceLinkError] = useState(false);
//     const [nameError, setNameError] = useState(false);
//     const [genderError, setGenderError] = useState(false);
//     const [companyFileTypeError, setCompanyFileTypeError] = useState(false);
//     const [panError, setPanError] = useState('');
//     const [panfatherError, setPanfatherError] = useState('');
//     const [panmotherError, setPanmotherError] = useState('');
//     const [emailErrors, setEmailErrors] = useState<string[]>([]);
//     const [panErrors, setPanErrors] = useState<string[]>([]);
//     const [panfatherErrors, setPanfatherErrors] = useState<string[]>([]);
//     const [panhufErrors, setPanhufErrors] = useState<string[]>([]);
//     const [panmotherErrors, setPanmotherErrors] = useState<string[]>([]);
//     const [isValidInput, setIsValidInput] = useState(true);
//     const [relativePanTouched, setRelativePanTouched] = useState(false);
//     const [relativePanspouseTouched, setRelativePanspouseTouched] = useState(false);
//     const [spousePanTouched, setSpousePanTouched] = useState(false);
//     const [spousePanhufTouched, setSpousePanhufTouched] = useState(false);
//     const [childrenPanTouched, setChildrenPanTouched] = useState(false);
//     const [isEditing, setIsEditing] = useState<number | null>(null);
//     const [touchedFields, setTouchedFields] = useState<boolean[]>([false]);
//     const [touched, setTouched] = useState(false);

//     useEffect(() => {
//         fetchListOfCompany();
//         fetchAssociatedList();
//         setSelectedCountry('');
//         fetchDesignationList();
//         fetchCountries();
//         fetchRelative();
//         fetchStates();
//         fetchfiletype();
//         fetchPartylist();
//         fetchgender();
//         fetchComapnymasterlist();
//         window.scrollTo(0, 0);
//     }, []);

//     useEffect(() => {
//     }, [countryName, stateName]);

//     const fetchfiletype = async () => {
//         try {
//             const response: FileType[] = await fileUpload.getfiletype();
//             const response1: FileType[] = await fileUpload.getfiletype1();
//             const response2: FileType[] = await fileUpload.getfiletype2();
//             const response3: FileType[] = await fileUpload.getfiletype3();
//             const response4: FileType[] = await fileUpload.getfiletype4();
//             setFiletype1(response1);
//             setFiletype2(response2);
//             setFiletype3(response3);
//             setFiletype4(response4);
//             Setfiletype(response);
//         } catch (error) {
//             console.error('Error fetching filetype:', error);
//         }
//     };

//     const [combinedDTOList, setCombinedDTOList] = useState<CombinedDTOSS[]>([]);

//     const [formDatas, setformDatas] = useState<Payload>({
//         combinedDTO: [
//             {
//                 companyDTO: {
//                     id: 0,
//                     sourceLink: '',
//                     associateMasterId: 0,
//                     companyName: '',
//                     listAdverseInformation: 0,
//                     listRegulatoryAction: 0,
//                     listGovernment: 0,
//                     originalDateOfAppointment: '',
//                     typeId: 0,
//                     cinfcrn: '',
//                     document: '',
//                 },
//                 addressDTOS: [
//                     {
//                         id: 0,
//                         companyId: 0,
//                         registeredAddress: '',
//                     },
//                 ],
//                 contactDTOS: [
//                     {
//                         companyId: 0,
//                         emailID: '',
//                     },
//                 ],
//                 companiesDirectorsDTOS: [
//                     {
//                         id: 0,
//                         din: '',
//                         companyId: 0,
//                         directorId: 0,
//                         designationId: 0,
//                         companyMasterId: 0,
//                         appointmentDate: '',
//                         cessationDate: '',
//                         designation: '',
//                         directorStatus: '',
//                         directorName: '',
//                     },
//                 ],
//                 companyDocumentsDTOS: [
//                     {
//                         companyId: 0,
//                         documentTypeId: 0,
//                         documentType: '',
//                         imageName3: '',
//                         uid: loginDetails.id,
//                         files3: [],
//                         path: [],
//                         euid: 0,
//                     },
//                 ],
//                 companyAssociationDTOS: [
//                     {
//                         id: 0,
//                         companyId: 0,
//                         companyAssociation: '',
//                         uid: loginDetails.id,
//                     },
//                 ],
//             },
//         ],
//     });
//     const [isPANExists, setIsPANExists] = useState(false); // State to manage PAN existence
//     const [popupVisible, setPopupVisible] = useState<boolean>(false);


//     const [clickCount, setClickCount] = useState(0);
//     const [selectedFiles, setSelectedFiles] = useState<Array<File[]>>([]);
//     const authServices = new AddressApiService();
//     const [associatedList, setAssociatedList] = useState<AssociatedlistPayload[]>([]);
//     const associatedListService = new AssociatedListApiService();
//     const [Designationlist, setDesignationlist] = useState<DesignationPayload[]>([]);
//     const DesignationlistService = new DesignationService();
//     const dinService = new ViewPageDetailsService();
//     const [errorMsg, setErrorMsg] = useState("");
//     const [errorMsgs, setErrorMsgs] = useState("");
//     const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
//     const [isCheckboxCheckeds, setIsCheckboxCheckeds] = useState(false);

//     const handleInputChangeCompanies = (
//         personIndex: number,
//         field:
//             | keyof Payload['combinedDTO'][0]['companyDTO']
//             | keyof Payload['combinedDTO'][0]['contactDTOS'][0]
//             | keyof Payload['combinedDTO'][0]['addressDTOS'][0]
//             | keyof Payload['combinedDTO'][0]['companiesDirectorsDTOS'][0],
//         index: number | null,
//         event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
//     ) => {
//         const updatedPeople = [...formDatas.combinedDTO];

//         const updateContactField = (index: number, field: keyof ContactDTO) => {
//             const value = event.target.value as string;
//             updateNestedField(updatedPeople[personIndex].contactDTOS, index, field, value);
//             validateEmail(value, index);
//         };

//         const updateAddressField = (index: number, field: keyof AddressDTO) => {
//             updateNestedField(updatedPeople[personIndex].addressDTOS, index, field, event.target.value as string);
//         };

//         const updateDirectorsField = (index: number, field: keyof CompaniesDirectorsDTO) => {
//             if (field === 'appointmentDate' || field === 'cessationDate') {
//                 updateNestedField(updatedPeople[personIndex].companiesDirectorsDTOS, index, field, event.target.value as string);
//             } else {
//                 const value = typeof event.target.value === 'string' ? event.target.value : Number(event.target.value);
//                 updateNestedField(updatedPeople[personIndex].companiesDirectorsDTOS, index, field, value);
//             }
//         };
//         if (index !== null) {
//             if (field === 'emailID') {
//                 updateContactField(index, field);
//             } else if (field === 'companyId' || field === 'registeredAddress') {
//                 updateAddressField(index, field);
//             } else if (field === 'directorName' || field === 'din') {
//                 updateDirectorsField(index, field);
//             } else if (field === 'appointmentDate' || field === 'cessationDate' || field === 'designationId' || field === 'companyMasterId') {
//                 updateDirectorsField(index, field);
//             }
//             if (index !== null && field === 'emailID') {
//                 updateContactField(index, field);
//             }
//         } else {
//             const companyDTO = updatedPeople[personIndex].companyDTO;
//             if (field === 'companyId' && 'companyId' in companyDTO) {
//                 companyDTO[field] = event.target.value as string;
//             } else {
//                 const fieldType = getFieldInputType(field);
//                 (companyDTO as any)[field] = convertInputValue(event.target.value as string, fieldType);
//             }
//         }
//         setformDatas({ combinedDTO: updatedPeople });
//     };

//     const updateNestedField = <T, K extends keyof T>(array: T[], index: number, key: K, value: T[K]) => {
//         array[index][key] = value;
//     };

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     const validateEmail = (email: string, index: number) => {
//         const errors = [...emailErrors];
//         const isValid = emailRegex.test(email);
//         if (!isValid) {
//             errors[index] = 'Invalid email Format';
//         } else {
//             errors[index] = '';
//         }
//         setEmailErrors(errors);
//     };

//     const getFieldInputType = (field: string): string => {
//         switch (field) {
//             case 'cinfcrn':
//             case 'companyName':
//             case 'designation':
//             case 'sourceLink':
//             case 'originalDateOfAppointment':
//                 return 'text';
//             default:
//                 return 'text';
//         }
//     };

//     const convertInputValue = (
//         value: string,
//         type: string
//     ): any => {
//         switch (type) {
//             case 'text':
//                 return value;
//             default:
//                 return value;
//         }
//     };

//     const handleAddFieldCompanies = (
//         personIndex: number,
//         fieldType: string
//     ) => {
//         const updatedPeople = [...formDatas.combinedDTO];
//         if (fieldType === 'email') {
//             updatedPeople[personIndex].contactDTOS.push({
//                 companyId: 0,
//                 emailID: '',
//             });
//         } else if (fieldType === 'address') {
//             updatedPeople[personIndex].addressDTOS.push({
//                 id: 0,
//                 companyId: 0,
//                 registeredAddress: '',
//             });
//         } else if (fieldType === 'directors') {
//             updatedPeople[personIndex].companiesDirectorsDTOS.push({
//                 id: 0,
//                 din: '',
//                 companyId: 0,
//                 directorId: 0,
//                 designationId: 0,
//                 companyMasterId: 0,
//                 appointmentDate: '',
//                 cessationDate: '',
//                 designation: '',
//                 directorStatus: '',
//                 directorName: '',
//             });
//         }
//         setformDatas({ combinedDTO: updatedPeople });
//     };

//     const handleDeleteFieldCompanies = (
//         personIndex: number,
//         field1:
//             | keyof Payload['combinedDTO'][0]['contactDTOS'][0]
//             | keyof Payload['combinedDTO'][0]['addressDTOS'][0]
//             | keyof Payload['combinedDTO'][0]['companiesDirectorsDTOS'][0],
//         index: number
//     ) => {
//         const updatedPeople = [...formDatas.combinedDTO];
//         if (field1 === 'emailID') {
//             updatedPeople[personIndex].contactDTOS.splice(index, 1);
//         } else if (field1 === 'companyId' || field1 === 'registeredAddress') {
//             updatedPeople[personIndex].addressDTOS.splice(index, 1);
//         } else if (field1 === 'directorName' || field1 === 'din') {
//             updatedPeople[personIndex].companiesDirectorsDTOS.splice(index, 1);
//         }
//         setformDatas({ combinedDTO: updatedPeople });
//     };

//     const handleRemoveBoxCompanies = (personIndex: number) => {
//         const updatedPeople = [...formDatas.combinedDTO];
//         updatedPeople.splice(personIndex, 1);
//         setformDatas({ combinedDTO: updatedPeople });
//         setClickCount(prevCount => Math.max(0, prevCount - 1));
//     };

//     const handleRemoveBoxakaName = (index: number) => {
//         const updatedakaName = [...akaformData];
//         updatedakaName.splice(index, 1);
//         setAkaFormData(updatedakaName);
//     };

//     const handleAddakaNameField = () => {
//         setAkaFormData([...akaformData, { akaName: '' }]);
//     };

//     const handleakaNameChange = (value: string, index: number) => {
//         const updatedakaName = [...akaformData];
//         updatedakaName[index].akaName = value;
//         setAkaFormData(updatedakaName);
//     };

//     const [akaNameError, setAkaNameError] = useState(false);
//     const resetAkaNameError = () => setAkaNameError(false);

//     const handleRemoveBoxtPerMedia = (index: number) => {
//         const updatedatPerMedia = [...PerMediaformData];
//         updatedatPerMedia.splice(index, 1);
//         setPerMediaData(updatedatPerMedia);
//     };

//     const handleRemoveBoximage = (index: number) => {
//         const updatedatimage = [...fields];
//         updatedatimage.splice(index, 1);
//         setFields(updatedatimage);
//     };

//     const handleAddtPerMediaField = () => {
//         setPerMediaData([...PerMediaformData, { otherAssociationAsPerMedia: '' }]);
//     };

//     const handletPerMediaChange = (value: string, index: number) => {
//         const updatedatPerMedia = [...PerMediaformData];
//         updatedatPerMedia[index].otherAssociationAsPerMedia = value;
//         setPerMediaData(updatedatPerMedia);
//     };

//     const fetchStates = async () => {
//         try {
//             const States = await authService.getStateDataByCountryId();
//             setStates(States);
//         } catch (error) {
//             console.error("Error fetching states:", error);
//         }
//     };

//     const fetchCountries = async () => {
//         try {
//             const Countries = await countryService.getCountryOptions();
//             setCountries(Countries);
//         } catch (error) {
//             console.error("Error fetching Country:", error);
//         }
//     };

//     const fetchgender = async () => {
//         try {
//             const gender = await genderService.getGender();
//             setgender(gender);
//         } catch (error) {
//             console.error("Error fetching gender:", error);
//         }
//     };

//     const [partyMasterIdList, setPartyMasterIdList] = useState<number[]>([]);

//     const fetchPartylist = async () => {
//         try {
//             const partylist = await partyservices.getparty();
//             setparty(partylist);
//         } catch (error) {
//             console.error('Error fetching associated list:', error);
//         }
//     };

//     const fetchComapnymasterlist = async () => {
//         try {
//             const comapnymasterlist = await companymasterservices.getCompanyMaster();
//             setcompanymaster(comapnymasterlist);
//         } catch (error) {
//             console.error('Error fetching associated list:', error);
//         }
//     };

//     const fetchAssociatedList = async () => {
//         try {
//             const associatedListData = await associatedListService.getAssociatedList();
//             setAssociatedList(associatedListData);
//         } catch (error) {
//             console.error('Error fetching associated list:', error);
//         }
//     };

//     const fetchListOfCompany = async () => {
//         try {
//             const listCompanyData = await associatedListService.getListOfCompany();
//             setListOfCompany(listCompanyData);
//         } catch (error) {
//             console.error('Error fetching listOfCompany List:', error);
//         }
//     };

//     const fetchDesignationList = async () => {
//         try {
//             const designationlistData = await DesignationlistService.getDesignation();
//             setDesignationlist(designationlistData);
//         } catch (error) {
//             console.error('Error fetching designation list:', error);
//         }
//     };

//     const [associatedDetails, setAssociatedDetails] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const handleDinChange = async (din: string) => {
//         try {
//             const response = await dinService.getdincompany(din);
//             if (response && response.data) {
//                 const formDatas = response.data.map((item: any) => ({
//                     companyName: item.companyDTO.companyName,
//                 }));
//                 setformDatas(formDatas);
//             }
//         } catch (error) {
//             console.error("Error fetching associated details:", error);
//         }
//     };

//     useEffect(() => {
//         const handleDinChange = async (din: string) => {
//             try {
//                 const response = await dinService.getdincompany(din);
//                 if (response && response.data) {
//                     const formDatas = response.data.map((item: any) => ({
//                         companyName: item.companyDTO.companyName,
//                     }));
//                     setformDatas(formDatas);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };
//         handleDinChange('122024');
//     }, []);

//     const handleInputChangeFamily = (
//         personIndex: number,
//         field: 'relativeName' | 'pan' | 'childrenName' | 'name' | 'childrenPan',
//         index: number | null,
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const updatedPeople = JSON.parse(JSON.stringify(RelativeformData));
//         const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
//         if (index !== null) {
//             if (field === 'name' || field === 'pan') {
//                 if (!updatedPeople.relativeCombineDTO[personIndex].relativeDetDTOS[index]) {
//                     updatedPeople.relativeCombineDTO[personIndex].relativeDetDTOS[index] = {
//                         pepId: 0,
//                         relativeId: 0,
//                         name: '',
//                         pan: '',
//                     };
//                 }
//                 updatedPeople.relativeCombineDTO[personIndex].relativeDetDTOS[index][field] = event.target.value;
//                 if (field === 'pan' && !panRegex.test(event.target.value)) {
//                     console.error('Invalid PAN Format');
//                     setSpousePanTouched(true);
//                 }
//             } else if (field === 'childrenName' || field === 'childrenPan') {
//                 if (!updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index]) {
//                     updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index] = {
//                         pepId: 0,
//                         relativeDetId: 0,
//                         childrenName: '',
//                         childrenPan: '',
//                     };
//                 }
//                 updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index][field] = event.target.value;
//                 if (field === 'childrenPan' && !panRegex.test(event.target.value)) {
//                     console.error('Invalid PAN Format');
//                     setChildrenPanTouched(true);
//                 }
//             }
//         } else {
//             if (field === 'relativeName' || field === 'pan') {
//                 updatedPeople.relativeCombineDTO[personIndex].relativeDTO[field] = field === 'relativeName' ? event.target.value : event.target.value.toUpperCase();
//                 if (field === 'pan' && !panRegex.test(updatedPeople.relativeCombineDTO[personIndex].relativeDTO[field])) {
//                     console.error('Invalid PAN Format');
//                     setRelativePanTouched(true);
//                 }
//             }
//         }
//         setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
//         setTouched(true);
//     };

//     const handleInputChangchilderpan = (
//         personIndex: number,
//         field: 'pan' | 'childrenName',
//         index: number | null,
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const updatedPeople = JSON.parse(JSON.stringify(RelativeformData));
//         const value = field === 'childrenName' ? event.target.value : event.target.value.toUpperCase();
//         if (index !== null) {
//             if (field === 'childrenName' || field === 'pan') {
//                 if (!updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index]) {
//                     updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index] = {
//                         pepId: 0,
//                         relativeDetId: 0,
//                         childrenName: '',
//                         childrenPan: '',
//                     };
//                 }
//                 updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index][field] = value;
//                 if (field === 'pan') {
//                     validatePan(value, index);
//                 }
//             }
//         }
//         setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
//     };

//     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

//     const validatePan = (pan: string, index: number | null) => {
//         const errors = [...panErrors];
//         const isValid = panRegex.test(pan);
//         if (index !== null) {
//             if (!isValid) {
//                 errors[index] = 'Invalid PAN Format';
//             } else {
//                 errors[index] = '';
//             }
//         }
//         setPanErrors(errors);
//     };

//     const handleRemoveBoxFamily = (personIndex: number) => {
//         setRelativeFormData((prevData) => {
//             const updatedPeople = [...prevData.relativeCombineDTO];
//             updatedPeople.splice(personIndex, 1);
//             return { relativeCombineDTO: updatedPeople };
//         });
//     };

//     const handleAddFieldFamily = (personIndex: number, fieldType: 'Spouse' | 'children') => {
//         const updatedPeople = { ...RelativeformData };
//         if (fieldType === 'Spouse') {
//             updatedPeople.relativeCombineDTO[personIndex].relativeDetDTOS.push({
//                 pepId: 0,
//                 relativeId: 0,
//                 name: '',
//                 pan: '',
//             });
//         }
//         else if (fieldType === 'children') {
//             updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS.push({
//                 pepId: 0,
//                 relativeDetId: 0,
//                 relativeId: 0,
//                 childrenName: '',
//                 pan: '',
//             });
//         }
//         setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
//     };

//     const handleAddDoc = (personIndex: number, fieldType: 'image') => {
//         const updatedPeople = { ...formDatas };
//         if (fieldType === 'image') {
//             updatedPeople.combinedDTO[personIndex].companyDocumentsDTOS.push({
//                 companyId: 0,
//                 documentTypeId: 1,
//                 documentType: '',
//                 imageName3: '',
//                 uid: 0,
//                 euid: 0,
//                 files3: [],
//                 path: [4, 5, 6],
//             });
//         }
//         setformDatas({ combinedDTO: [...updatedPeople.combinedDTO] });
//     };

//     const handleDeleteFieldFamily = (
//         personIndex: number,
//         field1: 'relativeName' | 'pan' | 'childrenName',
//         index: number
//     ) => {
//         const updatedPeople = [...RelativeformData.relativeCombineDTO];
//         if (field1 === 'relativeName' || field1 === 'pan') {
//             updatedPeople[personIndex].relativeDetDTOS.splice(index, 1);
//         } else if (field1 === 'childrenName' || field1 === 'pan') {
//             updatedPeople[personIndex].relativeChildrenDTOS.splice(index, 1);
//         }
//         setRelativeFormData({ relativeCombineDTO: updatedPeople });
//     };

//     const handleDeleteDoc = (
//         personIndex: number,
//         field1: 'documentType',
//         index: number
//     ) => {
//         const updatedPeople = [...formDatas.combinedDTO];
//         if (field1 === 'documentType') {
//             updatedPeople[personIndex].companyDocumentsDTOS.splice(index, 1);
//         }
//         setformDatas({ combinedDTO: updatedPeople });
//     };

//     const handleDeleteFieldchilder = (
//         personIndex: number,
//         field1: 'pan' | 'childrenName',
//         index: number
//     ) => {
//         const updatedPeople = [...RelativeformData.relativeCombineDTO];
//         if (field1 === 'childrenName' || field1 === 'pan') {
//             updatedPeople[personIndex].relativeChildrenDTOS.splice(index, 1);
//         }
//         setRelativeFormData({ relativeCombineDTO: updatedPeople });
//     };

//     const fetchRelative = async () => {
//         try {
//             const relativeData = await relatives.getRelative();
//             setRelative(relativeData);
//         }
//         catch (error) {
//             console.error("Error fetching associated list:", error);
//         }
//     };

//     const handlecompanyChange = (personIndex: number, value: any) => {
//         const updatedPeople = JSON.parse(JSON.stringify(formDatas));
//         updatedPeople.combinedDTO[personIndex].companiesDirectorsDTOS.designationId = value;
//         setformDatas({ combinedDTO: updatedPeople.combinedDTO });
//     };

//     const handleassociatedListChange = (personIndex: number, value: any) => {
//         const updatedPeople = JSON.parse(JSON.stringify(formDatas));
//         updatedPeople.combinedDTO[personIndex].relativeDTO.relativeMasterId = value;
//         setformDatas({ combinedDTO: updatedPeople.combinedDTO });
//     };

//     const handleRemoveBoxPhoneNumbers = (index: number) => {
//         const updatedPhoneNumberss = [...PhoneNumberss];
//         updatedPhoneNumberss.splice(index, 1);
//         setPhoneNumberss(updatedPhoneNumberss);
//     };

//     const handleAddPhoneNumbersNameField = () => {
//         setPhoneNumberss([...PhoneNumberss, { pepId: 0, communicationDt: '', communicationTypeId: 4 }]);
//     };

//     const handlePhoneNumbersNameChange = (value: string, index: number) => {
//         if (/^[0-9+-]*$/.test(value) || value === '') {
//             const updatedPhoneNumberss = [...PhoneNumberss];
//             updatedPhoneNumberss[index].communicationDt = value;
//             setPhoneNumberss(updatedPhoneNumberss);
//             setIsValidInput(true);
//         } else {
//             setIsEditing(index);
//             setIsValidInput(false);
//         }
//     };

//     const handleFocus = (index: number) => {
//         setIsEditing(index);
//     };

//     const handleBlur = () => {
//         setIsEditing(null);
//     };

//     const handleRemoveBoxEmailids = (index: number) => {
//         const updatedEmailidss = [...Emailidss];
//         updatedEmailidss.splice(index, 1);
//         setEmailidss(updatedEmailidss);
//     };

//     const handleAddEmailidsNameField = () => {
//         setEmailidss([...Emailidss, { pepId: 0, communicationDt: '', communicationTypeId: 0 }]);
//     };

//     const handleEmailidsNameChange = (value: string, index: number) => {
//         const updatedEmailidss = [...Emailidss];
//         updatedEmailidss[index].communicationDt = value;
//         setEmailidss(updatedEmailidss);
//         const updatedTouchedFields = [...touchedFields];
//         updatedTouchedFields[index] = true;
//         setTouchedFields(updatedTouchedFields);
//     };

//     // const handleRemovePartyformData = (index: number) => {
//     //     const updatedFormData = [...PartyformData];
//     //     updatedFormData.splice(index, 1);
//     //     setPartyFormData(updatedFormData);
//     // };

//       const handleRemovePartyFormData = (index: number) => {
//         setPartyData((prevData) => {
//             const updatedFormData = [...prevData.partyCommonDto];
//             updatedFormData.splice(index, 1);
//             return { ...prevData, partyCommonDto: updatedFormData };
//         });
//     };
//     // const handlePartyformDataChange = (value: string, index: number) => {
//     //     const updatedFormData = [...prevData.partyCommonDto];
//     //     updatedFormData[index].formerAndCurrent = value;
//     //     setPartyFormData(updatedFormData);
//     // };
    
//     // const handlePartyformDatasChanges = (value: string, index: number) => {
//     //     const updatedFormData = [...prevData.partyCommonDto];
//     //     updatedFormData[index].positionInTheParty = value;
//     //     setPartyFormData(updatedFormData);
//     // };

//     const handlePartyFormDataChange = (value: string, index: number) => {
//         setPartyData((prevData) => {
//             const updatedFormData = [...prevData.partyCommonDto];
//             updatedFormData[index].partyDetailsDTO[0].formerAndCurrent = value;
//             return { ...prevData, partyCommonDto: updatedFormData };
//         });
//     };
//     const handlePartyFormDatasChanges = (value: string, index: number) => {
//         setPartyData((prevData) => {
//             const updatedFormData = [...prevData.partyCommonDto];
//             updatedFormData[index].partyDetailsDTO[0].positionInTheParty = value;
//             return { ...prevData, partyCommonDto: updatedFormData };
//         });
//     };


//     // const handleAddPartyformDataField = () => {
//     //     setPartyFormData([...prevData.partyCommonDto, { formerAndCurrent: '', stateId: '', countryId: '', otherInformation: '', died: '', permanentAddress: '', positionInTheGovernment: '', partyMasterId: '', positionInTheParty: '' }]);
//     // };

//     // const handleRemovePartyformstate = (index: number) => {
//     //     const updatedFormData = [...prevData.partyCommonDto];
//     //     updatedFormData.splice(index, 1);
//     //     const updatedStates = [...selectedState];
//     //     updatedStates.splice(index, 1);
//     //     setPartyFormData(updatedFormData);
//     //     setselectedState(updatedStates);
//     // };

//     const handlePartyFormStateChange = (
//         personIndex: number,
//         index: number | null,
//         field: 'partyMasterId' | 'formerAndCurrent' | 'positionInTheParty',
//         event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<number>
//     ) => {
//         const updatedPeople = JSON.parse(JSON.stringify(partyData));
//         const value = event.target.value;

//         if (index !== null) {
//             if (field === 'partyMasterId' || field === 'formerAndCurrent' || field === 'positionInTheParty') {
//                 if (!updatedPeople.partyCommonDto[personIndex].partyDetailsDTO[index]) {
//                     updatedPeople.partyCommonDto[personIndex].partyDetailsDTO[index] = {
//                         pepId: 0,
//                         partyMasterId: 0,
//                         formerAndCurrent: '',
//                         partyCandidateId: 0,
//                         positionInTheParty: '',
//                     };
//                 }
//                 updatedPeople.partyCommonDto[personIndex].partyDetailsDTO[index][field] = value;
//             }
//         }
//         setPartyData({ partyCommonDto: updatedPeople.partyCommonDto });
//     };
//     // const handlePartyformstateChange = (value: string, index: number) => {
//     //     const updatedStates = [...selectedParty];
//     //     updatedStates[index] = value;
//     //     setselecteParty(updatedStates);
//     //     const updatedFormData = [...prevData.partyCommonDto];
//     //     updatedFormData[index].stateId = value;
//     //     setPartyFormData(updatedFormData);
//     // };

//     // const handleAddPartyformstateField = () => {
//     //     setPartyFormData([
//     //         ...PartyformData,
//     //         {
//     //             formerAndCurrent: '',
//     //             stateId: '',
//     //             countryId: '',
//     //             otherInformation: '',
//     //             died: '',
//     //             permanentAddress: '',
//     //             positionInTheGovernment: '',
//     //             partyMasterId: '',
//     //             positionInTheParty: ''
//     //         },
//     //     ]);
//     //     setselectedState([...selectedState, '']);
//     // };

//     // const handleOtherInformationChange = (value: string) => {
//     //     const updatedFormData = [...PartyformData];
//     //     updatedFormData[0].otherInformation = value;
//     //     setPartyFormData(updatedFormData);
//     // };

//     const handleOtherInformationChange = (value: string) => {
//         setPartyData((prevState) => {
//             const newPartyCommonDto = [...prevState.partyCommonDto];
//             if (newPartyCommonDto[0]) {
//                 newPartyCommonDto[0].partyCandidateDetailsDTO.otherInformation = value;
//             }
//             return { ...prevState, partyCommonDto: newPartyCommonDto };
//         });
//     };
//     // const handlePermanentAddressChange = (value: string) => {
//     //     const updatedFormData = [...PartyformData];
//     //     updatedFormData[0].permanentAddress = value;
//     //     setPartyFormData(updatedFormData);
//     // };
//     // const handlepositionInTheGovernment = (value: string) => {
//     //     const updatedFormData = [...PartyformData];
//     //     updatedFormData[0].positionInTheGovernment = value;
//     //     setPartyFormData(updatedFormData);
//     // };

//     // const handlediedChange = (value: string) => {
//     //     const updatedFormData = [...PartyformData];
//     //     updatedFormData[0].died = value;
//     //     setPartyFormData(updatedFormData);
//     // };

//     const handleDeleteparty = (
//         personIndex: number,
//         field1: 'formerAndCurrent' | 'positionInTheParty',
//         index: number
//       ) => {
//         const updatedPeople = [...partyData.partyCommonDto];
//         if (field1 === 'formerAndCurrent' || field1 === 'positionInTheParty') {
//           updatedPeople[personIndex].partyDetailsDTO.splice(index, 1);
//         }
//         setPartyData({ partyCommonDto: updatedPeople });
//       };

//       const handleAddFieldpartydetails = (personIndex: number, fieldType: 'party') => {
//         const updatedPeople = { ...partyData };
    
//         if (fieldType === 'party') {
//             updatedPeople.partyCommonDto[personIndex].partyDetailsDTO.push({
//                 pepId: 0,
//                 partyMasterId: 0,
//                 formerAndCurrent: '',
//                 partyCandidateId: 0,
//                 positionInTheParty: '',
//             });
    
//         };
//         setPartyData({ partyCommonDto: updatedPeople.partyCommonDto });
    
//     };
//     const handlePermanentAddressChange = (value: string) => {
//         setPartyData((prevState) => {
//             const newPartyCommonDto = [...prevState.partyCommonDto];
//             if (newPartyCommonDto[0]) {
//                 newPartyCommonDto[0].partyCandidateDetailsDTO.permanentAddress = value;
//             }
//             return { ...prevState, partyCommonDto: newPartyCommonDto };
//         });
//     };

//     const handlePositionintheGovernmentChange = (value: string) => {
//         setPartyData((prevState) => {
//             const newPartyCommonDto = [...prevState.partyCommonDto];
//             if (newPartyCommonDto[0]) {
//                 newPartyCommonDto[0].partyCandidateDetailsDTO.positionInTheGovernment = value;
//             }
//             return { ...prevState, partyCommonDto: newPartyCommonDto };
//         });
//     };

 
//     const handlediedChange = (value: string) => {
//         setPartyData((prevState) => {
//             const newPartyCommonDto = [...prevState.partyCommonDto];
//             if (newPartyCommonDto[0]) {
//                 newPartyCommonDto[0].partyCandidateDetailsDTO.died = value;
//             }
//             return { ...prevState, partyCommonDto: newPartyCommonDto };
//         });
//     };
//     const handlegender = (event: SelectChangeEvent<string>) => {
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             genderId: parseInt(event.target.value, 10),
//         }));
//     };

//     const isValidPAN = (pan: string) => {
//         const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
//         return panRegex.test(pan);
//     };

//     const [panValue, setPanValue] = useState<Pan>({
//         pan: '',


//     });

//     const checkPANExists = async (pan: string) => {
//         try {

//             const fetchedPanValue = await dinService.getPan(pan);

//             if (fetchedPanValue !== '') {
//                 setPopupVisible(true);
//             } else {
//                 setPopupVisible(false);
//             }
//         } catch (error) {

//             setPanError('PAN Value already exists ');
//         }


//     }

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name: string; value: unknown }> | SelectChangeEvent<string>,
//         index: number
//     ) => {
//         const { name, value } = e.target as HTMLInputElement;
//         const containsSpecialChars = (input: string) => /[!@#$%^&*(),.?":{}|<>]/.test(input);
//         if (name === 'pan') {
//             const uppercaseValue = value.toUpperCase();
//             const isValid = isValidPAN(uppercaseValue);
//             const limitedValue = uppercaseValue.slice(0, 10);
//             setFormData((prevData) =>
//             ({
//                 ...prevData,
//                 [name]: limitedValue,
//             }));
//             setPanError(isValid ? '' : 'Invalid PAN Format');
//             checkPANExists(limitedValue);
//         } else if (name === 'name') {
//             if (!containsSpecialChars(value as string)) {
//                 setFormData((prevData) => ({
//                     ...prevData,
//                     [name]: value,
//                 }));
//             }
//         } else if (name in formData) {
//             setFormData((prevData) => ({
//                 ...prevData,
//                 [name]: value,
//             }));
//         } else if (name === 'countryId') {
//             setSelectedCountry(value as string);
//         } else if (name in partyData) {
//             setPartyData((prevData) => ({
//                 ...prevData,
//                 [name]: value,
//             }));
//         }

//     };
//     const handleClose = () => {
//         setPopupVisible(false);
//     };
    
//     // const handleChange = (
//     //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name: string; value: unknown }> | SelectChangeEvent<string>,
//     //     index: number
//     // ) => {
//     //     const { name, value } = e.target as HTMLInputElement;
//     //     const containsSpecialChars = (input: string) => /[!@#$%^&*(),.?":{}|<>]/.test(input);
//     //     if (name === 'pan') {
//     //         const uppercaseValue = value.toUpperCase();
//     //         const isValid = isValidPAN(uppercaseValue);
//     //         const limitedValue = uppercaseValue.slice(0, 10);
//     //         setFormData((prevData) =>
//     //         ({
//     //             ...prevData,
//     //             [name]: limitedValue,
//     //         }));
//     //         setPanError(isValid ? '' : 'Invalid PAN Format');
//     //         checkPANExists(limitedValue);
//     //     } else if (name === 'name') {
//     //         if (!containsSpecialChars(value as string)) {
//     //             setFormData((prevData) => ({
//     //                 ...prevData,
//     //                 [name]: value,
//     //             }));
//     //         }
//     //
//     //     } else if (name in formData) {
//     //         setFormData((prevData) => ({
//     //             ...prevData,
//     //             [name]: value,
//     //         }));
//     //     } else if (name === 'countryId') {
//     //         setSelectedCountry(value as string);
//     //     } else if (name in PartyformData) {
//     //         setPartyFormData((prevData) => ({
//     //             ...prevData,
//     //             [name]: value,
//     //         }));
//     //     }

//     // };

//     // const handleClose = () => {
//     //     setPopupVisible(false);
//     // };

//     const handleChanges = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//         const selectedDate = e.target.value;
//         const formattedDate = formatToCustomFormat(selectedDate);
//         setFormData((prevData) => ({
//             ...prevData,
//             dob: formattedDate,
//         }));
//     };

//     const formatToCustomFormat = (selectedDate: string): string => {
//         const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
//         const dateObject = new Date(selectedDate);
//         return dateObject.toLocaleDateString('en-US', options);
//     };

//     const userId = location.state?.userId || "";
//     const [isSuccessOpen, setIsSuccessOpen] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [isErrorOpen, setIsErrorOpen] = useState(false);

//     const showSuccessMessage = (message: string) => {
//         setSuccessMessage(message);
//         setIsSuccessOpen(true);
//     };

//     const showErrorMessage = (message: string) => {
//         setErrorMessage(message);
//         setIsErrorOpen(true);
//     };

//     const handleKeyPress = (e: { key: string }) => {
//         if (e.key === 'Enter') {
//             handleSubmit(0, 0, 0, 0, 0, 0, '',);
//         }
//     };

//     const resetSourceLinkError = () => {
//         setSourceLinkError(false);
//     };

//     const resetNameError = () => {
//         setNameError(false);
//     };

//     const resetGenderError = () => {
//         setGenderError(false);
//     };

//     const resetCompanyFileError = () => {
//         setCompanyFileTypeError(false);
//     };

//     const resetAllErrors = () => {
//         setSourceLinkError(false);
//         setNameError(false);
//         setGenderError(false);
//     };

//     const [typeId, setTypeId] = useState('');

//     useEffect(() => {
//     }, [formDatas.combinedDTO[0].companyDTO.typeId]);

//     // Use the inactivity timeout hook
//     //   useInactivityTimeout(60000); // 1 minute inactivity timeout
//     const handleSubmit = async (
//         index: number,
//         index1: number,
//         index2: number,
//         personIndex: number,
//         index3: number,
//         index4: number,
//         cinfcrn: string
//     ) => {
//         try {
//             resetAllErrors();
//             let hasError = false;
//             const adverseInformation = adverseInformationCheckValue ? 1 : 0;
//             const regulatoryAction = regulatoryActionCheckValue ? 1 : 0;
//             const selectedListofCompanyID = selectedListofCompany;
//             const listAdverseInformation = listAdverseInfromationCheckValue ? 1 : 0;
//             const listRegulatoryAction = includeListRegulatoryAction ? 1 : 0;
//             const listGovernment = includeGovernment ? 1 : 0;

//             if (
//                 formData.sourceLink.trim() === '' ||
//                 formData.name.trim() === '' ||
//                 !formData.genderId
//             ) {
//                 if (formData.sourceLink.trim() === '') {
//                     setSourceLinkError(true);
//                     if (sourceLinkRef.current) {
//                         sourceLinkRef.current.focus();
//                     }
//                 }
//                 if (formData.name.trim() === '') {
//                     setNameError(true);
//                     if (nameRef.current) {
//                         nameRef.current.focus();
//                     }
//                 }
//                 if (!formData.genderId) {
//                     setGenderError(true);
//                     if (genderRef.current) {
//                         genderRef.current.focus();
//                     }
//                 }
//                 return;
//             }
//             const companySizes = clickCount;
          
//             const PepDetailsWriteDTO = {
//                 combinedDTO: formDatas.combinedDTO.map((person) => ({
//                     companyDTO: {
//                         ...person.companyDTO,
//                         listAdverseInformation: person.companyDTO.listAdverseInformation ? 1 : 0,
//                         listRegulatoryAction: person.companyDTO.listRegulatoryAction ? 1 : 0,
//                         listGovernment: person.companyDTO.listGovernment ? 1 : 0,
//                     },
//                     addressDTOS: person.addressDTOS.map((address) => ({ ...address })),
//                     contactDTOS: person.contactDTOS.map((contact) => ({ ...contact })),
//                     companiesDirectorsDTOS: person.companiesDirectorsDTOS.map((directors) => ({ ...directors })),
//                     companyDocumentsDTOS: person.companyDocumentsDTOS.map((doc) => ({ ...doc })),
//                     companyAssociationDTOS: person.companyAssociationDTOS.map((permedia) => ({ ...permedia })),

//                 })),
//                 createCustomerRequest: {
//                     name: formData.name,
//                     sourceLink: formData.sourceLink,
//                     education: formData.education,
//                     dob: formData.dob,
//                     pan: formData.pan,
//                     directorsIdentificationNumber: formData.directorsIdentificationNumber,
//                     regulatoryAction: regulatoryAction,
//                     adverseInformation: adverseInformation,
//                     genderId: formData.genderId,
//                     placeOfBirth: formData.placeOfBirth,
//                     uid: loginDetails.id,
//                 },
//                 createAkaDetRequest: akaformData
//                     .filter(aka => aka.akaName !== null && aka.akaName !== '')
//                     .map(aka => ({
//                         akaName: aka.akaName,
//                         uid: loginDetails.id,
//                     })),
//                 createContactsDetailsRequest: [
//                     ...PhoneNumberss
//                         .filter((PhoneNumber) => PhoneNumber.communicationDt !== null && PhoneNumber.communicationDt !== '')
//                         .map((PhoneNumber) => ({
//                             id: PhoneNumber.pepId,
//                             pepId: PhoneNumber.pepId,
//                             communicationTypeId: 1,
//                             communicationDt: PhoneNumber.communicationDt,
//                             uid: loginDetails.id,
//                         })),
//                         //
//                     ...Emailidss
//                         .filter((Emailids) => Emailids.communicationDt !== null && Emailids.communicationDt !== '')
//                         .map((Emailids) => ({
//                             id: Emailids.pepId,
//                             pepId: Emailids.pepId,
//                             communicationTypeId: 2,
//                             communicationDt: Emailids.communicationDt,
//                             uid: loginDetails.id,
//                         })),
//                 ],
//                 partyCommonDtoList: partyData.partyCommonDto,
//                 createOtherAssociationRequest: PerMediaformData
//                     .filter(person => person.otherAssociationAsPerMedia !== null && person.otherAssociationAsPerMedia !== '')
//                     .map(person => ({
//                         otherAssociationAsPerMedia: person.otherAssociationAsPerMedia,
//                         uid: loginDetails.id,
//                     })),
//                 relativeCombineDTOList: RelativeformData.relativeCombineDTO,
//                 familyCombinedDTOList: FamilyformData.familyCombinedDTO,
//                 spouseCommonDTOList: SpouseFamilyformData.spouseCommonDTO,
//                 uid: loginDetails.id,
//             };
//             const numericFileTypeId: number = parseInt(fields[index].fileType, 10) || 1;
//             const numericFileTypeId1: number = parseInt(fields1[index1].fileType, 10) || 2;
//             const numericFileTypeId2: number = parseInt(fields2[index2].fileType, 10) || 3;
//             const numericFileTypeId4: number = parseInt(fields4[index4].fileType, 10) || 4;
//             const fileInput = document.getElementById(`image-upload-input-${index}`) as HTMLInputElement;
//             const fileInput1 = document.getElementById(`image-upload-input1-${index1}`) as HTMLInputElement;
//             const fileInput2 = document.getElementById(`image-upload-input2-${index2}`) as HTMLInputElement;
//             const fileInput4 = document.getElementById(`image-upload-input4-${index4}`) as HTMLInputElement;
//             const companyDocumentArray: File[] = [];
//             const pathArray: number[] = [];
//             const companyArray: string[] = [];
//             for (let i = 0; i <= companySizes; i++) {
//                 let fileInput3 = document.getElementById(`image-upload-input3-${i}-${index3}`) as HTMLInputElement;
//                 let cinfcrn = document.getElementById(`cinfcrn-${i}`) as HTMLInputElement;
//                 if (fileInput3.files) {
//                     const filesArray3: File[] = Array.from(fileInput3.files);
//                     const updatedPeople = { ...formDatas };
//                     const filePathValue: string | undefined = updatedPeople.combinedDTO?.[i]?.companyDocumentsDTOS?.[index3]?.path?.join('') ?? '';
//                     const cinfcrnValue: string = cinfcrn.value;
//                     companyDocumentArray.push(...filesArray3);
//                     pathArray.push(parseInt(filePathValue, 10));
//                     companyArray.push(cinfcrnValue);
//                 }
//             }
//             const addressApiService = new AddressApiService();
//             const filesArray: File[] = fileInput.files ? Array.from(fileInput.files) : [];
//             const filesArray1: File[] = fileInput1.files ? Array.from(fileInput1.files) : [];
//             const filesArray2: File[] = fileInput2.files ? Array.from(fileInput2.files) : [];
//             const filesArray4: File[] = fileInput4.files ? Array.from(fileInput4.files) : [];
//             const response = await addressApiService.saveCustomerRequest(
//                 PepDetailsWriteDTO,
//                 filesArray,
//                 [numericFileTypeId],
//                 filesArray1,
//                 [numericFileTypeId1],
//                 filesArray2,
//                 [numericFileTypeId2],
//                 filesArray4,
//                 [numericFileTypeId4],
//                 companyDocumentArray,
//                 pathArray,
//                 companyArray
//             );
//             if (
//                 formData.sourceLink.trim() !== '' &&
//                 formData.name.trim() !== '' &&
//                 formData.genderId
//             ) {
//                 setSubmissionSuccess(true);
//                 setDisabled(true);

//             }
//             return true;
//         } catch (error) {
//             console.error('Error submitting:', error);
//             setSubmissionSuccess(false);
//             return false;
//         }
//     };

//     const handleFileChangedoc = (personIndex: number, emailIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
//         const updatedPeople = JSON.parse(JSON.stringify(RelativeformData));
//         const selectedFile = event.target.files?.[0];
//         if (selectedFile) {
//             updatedPeople.relativeCombineDTO[personIndex].relativeDocumentsDTOS[emailIndex].documentNameList = selectedFile.name;
//             setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
//         }
//     };

//     const handleSelectChange = (selectedValue: string, index: number) => {
//         setFields((prevFields) => {
//             const updatedFields = [...prevFields];
//             updatedFields[index] = {
//                 ...updatedFields[index],
//                 fileType: selectedValue,
//             };
//             return updatedFields;
//         });
//     };

//     const handleSelectChange1 = (selectedValue: string, index: number) => {
//         setFields1((prevFields) => {
//             const updatedFields = [...prevFields];
//             updatedFields[index] = {
//                 ...updatedFields[index],
//                 fileType: selectedValue,
//             };
//             return updatedFields;
//         });
//     };

//     const handleSelectChange2 = (selectedValue: string, index: number) => {
//         setFields2((prevFields) => {
//             const updatedFields = [...prevFields];
//             updatedFields[index] = {
//                 ...updatedFields[index],
//                 fileType: selectedValue,
//             };
//             return updatedFields;
//         });
//     };

//     const handleSelectChange4 = (selectedValue: string, index: number) => {
//         setFields4((prevFields) => {
//             const updatedFields = [...prevFields];
//             updatedFields[index] = {
//                 ...updatedFields[index],
//                 fileType: selectedValue,
//             };
//             return updatedFields;
//         });
//     };

//     const handleSelectChange5 = (selectedValue: string, index: number) => {
//         setFields5((prevFields) => {
//             const updatedFields = [...prevFields];
//             updatedFields[index] = {
//                 ...updatedFields[index],
//                 fileType: selectedValue,
//             };
//             return updatedFields;
//         });
//     };

//     const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             const selectedFiles = Array.from(event.target.files) as File[];
//             const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
//             const fileType = selectedFiles[0].name.split('.').pop();
//             setFields(prevFields => {
//                 const updatedFields = [...prevFields];
//                 updatedFields[index] = {
//                     ...updatedFields[index],
//                     imageName: nameWithoutExtension,
//                     fileType: updatedFields[index].fileType || fileType || '',
//                     uploading: false,
//                     uploadSuccess: false,
//                 };
//                 return updatedFields;
//             });
//             setIsFileSelected(true);
//         } else {
//             setIsFileSelected(false);
//         }
//     };

//     const handleFileChange1 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             const selectedFiles = Array.from(event.target.files) as File[];
//             const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
//             const fileType = selectedFiles[0].name.split('.').pop();
//             setFields1(prevFields => {
//                 const updatedFields = [...prevFields];
//                 updatedFields[index] = {
//                     ...updatedFields[index],
//                     imageName1: nameWithoutExtension,
//                     fileType: updatedFields[index].fileType || fileType || '',
//                     uploading: false,
//                     uploadSuccess: false,
//                 };
//                 return updatedFields;
//             });
//             setIsFileSelected(true);
//         } else {
//             setIsFileSelected(false);
//         }
//     };

//     const handleFileChange2 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             const selectedFiles = Array.from(event.target.files) as File[];
//             const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
//             const fileType = selectedFiles[0].name.split('.').pop();
//             setFields2(prevFields => {
//                 const updatedFields = [...prevFields];
//                 updatedFields[index] = {
//                     ...updatedFields[index],
//                     imageName2: nameWithoutExtension,
//                     fileType: updatedFields[index].fileType || fileType || '',
//                     uploading: false,
//                     uploadSuccess: false,
//                 };
//                 return updatedFields;
//             });
//             setIsFileSelected(true);
//         } else {
//             setIsFileSelected(false);
//         }
//     };

//     const handleFileChange4 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             const selectedFiles = Array.from(event.target.files) as File[];
//             const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
//             const fileType = selectedFiles[0].name.split('.').pop();
//             setFields4(prevFields => {
//                 const updatedFields = [...prevFields];
//                 updatedFields[index] = {
//                     ...updatedFields[index],
//                     imageName4: nameWithoutExtension,
//                     fileType: updatedFields[index].fileType || fileType || '',
//                     uploading: false,
//                     uploadSuccess: false,
//                 };
//                 return updatedFields;
//             });
//             setIsFileSelected(true);
//         } else {
//             setIsFileSelected(false);
//         }
//     };

//     const handleFileChange5 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             const selectedFiles = Array.from(event.target.files) as File[];
//             const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
//             const fileType = selectedFiles[0].name.split('.').pop();
//             setFields5(prevFields => {
//                 const updatedFields = [...prevFields];
//                 updatedFields[index] = {
//                     ...updatedFields[index],
//                     imageName5: nameWithoutExtension,
//                     fileType: updatedFields[index].fileType || fileType || '',
//                     uploading: false,
//                     uploadSuccess: false,
//                 };
//                 return updatedFields;
//             });
//             setIsFileSelected(true);
//         } else {
//             setIsFileSelected(false);
//         }
//     };

//     const [selectedPath, setSelectedPath] = useState<string[]>([]);

//     const handleSelectChange3 = (personIndex: number, index: number, selectedValue: number) => {
//         const updatedPeople = { ...formDatas };
//         const selectedFileType = selectedValue;
//         if (selectedFileType != 0) {
//             updatedPeople.combinedDTO[personIndex].companyDocumentsDTOS[index].documentTypeId = selectedFileType;
//             let myArr = String(selectedValue).split("").map((selectedValue) => {
//                 return Number(selectedValue);
//             });
//             updatedPeople.combinedDTO[personIndex].companyDocumentsDTOS[index].path = myArr;
//             if (Array.isArray(updatedPeople.combinedDTO)) {
//                 setformDatas({ ...updatedPeople });
//             }
//         }
//     };

//     const handleChooseImagesClick = (index: number) => {
//         document.getElementById(`image-upload-input-${index}`)?.click();
//     };

//     const handleChooseImagesClick1 = (index1: number) => {
//         document.getElementById(`image-upload-input1-${index1}`)?.click();
//     };

//     const handleChooseImagesClick2 = (index2: number) => {
//         document.getElementById(`image-upload-input2-${index2}`)?.click();
//     };

//     const handleChooseImagesClick4 = (index4: number) => {
//         document.getElementById(`image-upload-input4-${index4}`)?.click();
//     };

//     const handleChooseImagesClick5 = (index5: number) => {
//         document.getElementById(`image-upload-input5-${index5}`)?.click();
//     };

//     const [fileSizeError, setFileSizeError] = useState<string | null>(null);

//     const handleChooseImagesClick3 = (personIndex: number, index3: number) => {
//         if (fields3 && fields3[index3]) {
//             const selectedImageStoreNumber = fields3[index3].fileType;
//             document.getElementById(`image-upload-input3-${personIndex}-${index3}`)?.click();
//         } else {
//             console.error('Invalid index or missing data in fields3 array.');
//         }
//     };

//     const [imageString, setImageString] = useState<string | null>(null);

//     const handleFileChange3 = (
//         personIndex: number,
//         index: number,
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const files = event.target.files;
//         if (files && files.length > 0) {
//             const updatedData = { ...formDatas };
//             const nameWithoutExtension = files[0].name.replace(/\.[^/.]+$/, '');
//             const updatedCompanyDocumentsDTO = {
//                 ...updatedData.combinedDTO[personIndex].companyDocumentsDTOS[index],
//             };
//             const allowedFileTypes = ['application/pdf', 'application/vnd.ms-excel', 'image/jpeg'];
//             const uploadedFiles: MultipartFile[] = [];
//             for (let i = 0; i < files.length; i++) {
//                 uploadedFiles.push({
//                     name: files[i].name,
//                     size: files[i].size,
//                     type: files[i].type,
//                 });
//             }
//             const file = files[0];
//             const fileType = file.type;
//             const fileType1 = fileType.split("/")[1];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                     if (typeof reader.result === 'string') {
//                         const resultParts = reader.result.split(',');
//                         const base64String = resultParts[1];
//                         const fileMimeType = resultParts[0].split(':')[1].split(';')[0];
//                         setImageString(base64String);
//                         updatedCompanyDocumentsDTO.files3 = [base64String];
//                         updatedCompanyDocumentsDTO.documentType = fileType1;
//                     }
//                 };
//                 reader.readAsDataURL(file);
//             }
//             updatedCompanyDocumentsDTO.imageName3 = nameWithoutExtension;
//             updatedData.combinedDTO[personIndex].companyDocumentsDTOS[index] = updatedCompanyDocumentsDTO;
//             setformDatas(updatedData);
//         } else {
//         }
//     };

//     const handleDeleteFieldDocument = (personIndex: number, index: number) => {
//         const updatedData = { ...formDatas };
//         updatedData.combinedDTO[personIndex].companyDocumentsDTOS.splice(index, 1);
//         setformDatas(updatedData);
//     };

//     const handleAddDocument = (personIndex: number) => {
//         const updatedPeople = [...formDatas.combinedDTO];
//         if (personIndex >= 0 && personIndex < updatedPeople.length) {
//             const updatedCompanyDocumentsDTOS: CompanyDocumentsDTO[] = [
//                 ...updatedPeople[personIndex].companyDocumentsDTOS,
//                 {
//                     companyId: 0,
//                     uid: 0,
//                     euid: 0,
//                     documentTypeId: 0,
//                     files3: [],
//                     imageName3: '',
//                     documentType: '',
//                     path: [],
//                 },
//             ];
//             updatedPeople[personIndex].companyDocumentsDTOS = updatedCompanyDocumentsDTOS;
//             setformDatas((prevData) => ({ ...prevData, combinedDTO: updatedPeople }));
//         }
//     };

//     const handleRemoveBoxAddress = (index: number) => {
//         const updatedAddress = [...Address];
//         updatedAddress.splice(index, 1);
//         setAddress(updatedAddress);
//     };

//     const handleAddAddressField = () => {
//         const newAddress = {
//             permanentAddress: "",
//         };
//         setAddress([...Address, newAddress]);
//     };

//     const handleAddressNameChange = (value: string, index: number) => {
//         const updatedAddress = [...Address];
//         updatedAddress[index].permanentAddress = value;
//         setAddress(updatedAddress);
//     };

//     const isEmailValid = (email: string) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     const handleRemoveBoxFamilydetails = (personIndex: number) => {
//         setFamilyFormData((prevData) => {
//             const updatedPeople = [...prevData.familyCombinedDTO];
//             updatedPeople.splice(personIndex, 1);
//             return { familyCombinedDTO: updatedPeople };
//         });
//     };

//     const handleAddFieldFamilydetails = (personIndex: number, fieldType: 'huf' | 'Spouse' | 'father' | 'mother') => {
//         const updatedPeople = { ...FamilyformData };
//         if (fieldType === 'huf') {
//             updatedPeople.familyCombinedDTO[personIndex].hufDTO.push({
//                 pepId: 0,
//                 hufName: '',
//                 hufPan: '',
//             });
//         }
//         else if (fieldType === 'father') {
//             updatedPeople.familyCombinedDTO[personIndex].fatherDTOS.push({
//                 pepId: 0,
//                 fatherName: '',
//                 fatherPan: '',
//             });
//         }
//         else if (fieldType === 'mother') {
//             updatedPeople.familyCombinedDTO[personIndex].motherDTOS.push({
//                 pepId: 0,
//                 motherName: '',
//                 motherPan: '',
//             });
//         }
//         setFamilyFormData({ familyCombinedDTO: updatedPeople.familyCombinedDTO });
//     };

//     const handleInputChangeHuf = (
//         personIndex: number,
//         field: 'hufName' | 'hufPan',
//         index: number | null,
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
//         const value = field === 'hufName' ? event.target.value : event.target.value.toUpperCase();
//         if (index !== null) {
//             if (field === 'hufName' || field === 'hufPan') {
//                 if (!updatedPeople.familyCombinedDTO[personIndex].hufDTO[index]) {
//                     updatedPeople.familyCombinedDTO[personIndex].hufDTO[index] = {
//                         pepId: 0,
//                         HUF: '',
//                         HUFPan: '',
//                     };
//                 }
//                 updatedPeople.familyCombinedDTO[personIndex].hufDTO[index][field] = value;
//                 if (field === 'hufPan') {
//                     validateHUFpan(value, index);
//                 }
//             }
//         }
//         setFamilyFormData({ familyCombinedDTO: updatedPeople.familyCombinedDTO });
//     };

//     const validateHUFpan = (HUFPan: string, index: number | null) => {
//         const errors = [...panErrors];
//         const isValid = panRegex.test(HUFPan);
//         if (index !== null) {
//             if (!isValid) {
//                 errors[index] = 'Invalid PAN Format';
//             } else {
//                 errors[index] = '';
//             }
//         }
//         setHUFPanErrors(errors);
//     };

//     const handleDeleteFieldHuf = (
//         personIndex: number,
//         field1: 'HUFPan' | 'HUF',
//         index: number
//     ) => {
//         const updatedPeople = [...FamilyformData.familyCombinedDTO];
//         if (field1 === 'HUF' || field1 === 'HUFPan') {
//             updatedPeople[personIndex].hufDTO.splice(index, 1);
//         }
//         setFamilyFormData({ familyCombinedDTO: updatedPeople });
//     };

//     const handletPerMediaChangsse = (
//         personIndex: number,
//         field: keyof Payload['combinedDTO'][0]['companyAssociationDTOS'][0],
//         index: number | null,
//         event: React.ChangeEvent<HTMLTextAreaElement>
//     ) => {
//         const updatedatPerMedia = (index: number, field: keyof AddressDTO, value: string) => {
//         };
//         setformDatas((prevData) => {
//             const updatedCombinedDTO = [...prevData.combinedDTO];
//             const updatedPerson = { ...updatedCombinedDTO[personIndex] };
//             const updatedCompanyAssociationDTOS = [...updatedPerson.companyAssociationDTOS];
//             const permedia = updatedCompanyAssociationDTOS[index!];
//             const updatedPermedia = { ...permedia, [field]: event.target.value as string };
//             updatedCompanyAssociationDTOS[index!] = updatedPermedia;
//             updatedPerson.companyAssociationDTOS = updatedCompanyAssociationDTOS;
//             updatedCombinedDTO[personIndex] = updatedPerson;
//             return { combinedDTO: updatedCombinedDTO };
//         });
//     };

//     const handleDeleteFieldfather = (
//         personIndex: number,
//         field1: 'fatherPan' | 'fatherName',
//         index: number
//     ) => {
//         const updatedPeople = [...FamilyformData.familyCombinedDTO];
//         if (field1 === 'fatherName' || field1 === 'fatherPan') {
//             updatedPeople[personIndex].fatherDTOS.splice(index, 1);
//         }
//         setFamilyFormData({ familyCombinedDTO: updatedPeople });
//     };

//     const handleDeleteFieldmother = (
//         personIndex: number,
//         field1: 'motherPan' | 'motherName',
//         index: number
//     ) => {
//         const updatedPeople = [...FamilyformData.familyCombinedDTO];
//         if (field1 === 'motherName' || field1 === 'motherPan') {
//             updatedPeople[personIndex].motherDTOS.splice(index, 1);
//         }
//         setFamilyFormData({ familyCombinedDTO: updatedPeople });
//     };

//     const handleInputChangspousechilderpan = (
//         personIndex: number,
//         field: 'spousePan' | 'spouseName',
//         index: number | null,
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
//         const value = field === 'spouseName' ? event.target.value : event.target.value.toUpperCase();
//         if (index !== null) {
//             if (field === 'spouseName' || field === 'spousePan') {
//                 if (!updatedPeople.familyCombinedDTO[personIndex].familySpouseDTOS[index]) {
//                     updatedPeople.familyCombinedDTO[personIndex].familySpouseDTOS[index] = {
//                         pepId: 0,
//                         hufId: 0,
//                         spouseName: '',
//                         spousePan: '',
//                     };
//                 }
//                 updatedPeople.familyCombinedDTO[personIndex].familySpouseDTOS[index][field] = value;
//                 if (field === 'spousePan') {
//                     validatePan(value, index);
//                 }
//             }
//         }
//         setFamilyFormData({ familyCombinedDTO: updatedPeople.familyCombinedDTO });
//     };

//     const handleInputChangfatherpan = (
//         personIndex: number,
//         field: 'fatherPan' | 'fatherName',
//         index: number | null,
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
//         const value = field === 'fatherName' ? event.target.value : event.target.value.toUpperCase();
//         if (index !== null) {
//             if (field === 'fatherName' || field === 'fatherPan') {
//                 if (!updatedPeople.familyCombinedDTO[personIndex].fatherDTOS[index]) {
//                     updatedPeople.familyCombinedDTO[personIndex].fatherDTOS[index] = {
//                         pepId: 0,
//                         hufId: 0,
//                         fatherName: '',
//                         fatherPan: '',
//                     };
//                 }
//                 updatedPeople.familyCombinedDTO[personIndex].fatherDTOS[index][field] = value;
//                 if (field === 'fatherPan') {
//                     validatefatherPan(value, index);
//                 }
//             }
//         }
//         setFamilyFormData({ familyCombinedDTO: updatedPeople.familyCombinedDTO });
//     };

//     const validatefatherPan = (fatherPan: string, index: number | null) => {
//         const errors = [...panErrors];
//         const isValid = panRegex.test(fatherPan);
//         if (index !== null) {
//             if (!isValid) {
//                 errors[index] = 'Invalid PAN Format';
//             } else {
//                 errors[index] = '';
//             }
//         }
//         setfatherPanErrors(errors);
//     };

//     const handleInputChangmotherpan = (
//         personIndex: number,
//         field: 'motherPan' | 'motherName',
//         index: number | null,
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
//         const value = field === 'motherName' ? event.target.value : event.target.value.toUpperCase();
//         if (index !== null) {
//             if (field === 'motherName' || field === 'motherPan') {
//                 if (!updatedPeople.familyCombinedDTO[personIndex].motherDTOS[index]) {
//                     updatedPeople.familyCombinedDTO[personIndex].motherDTOS[index] = {
//                         pepId: 0,
//                         hufId: 0,
//                         motherName: '',
//                         motherPan: '',
//                     };
//                 }
//                 updatedPeople.familyCombinedDTO[personIndex].motherDTOS[index][field] = value;
//                 if (field === 'motherPan') {
//                     validatemotherPan(value, index);
//                 }
//             }
//         }
//         setFamilyFormData({ familyCombinedDTO: updatedPeople.familyCombinedDTO });
//     };

//     const validatemotherPan = (motherPan: string, index: number | null) => {
//         const errors = [...panErrors];
//         const isValid = panRegex.test(motherPan);
//         if (index !== null) {
//             if (!isValid) {
//                 errors[index] = 'Invalid PAN Format';
//             } else {
//                 errors[index] = '';
//             }
//         }
//         setmotherPanErrors(errors);
//     };

//     const handleRemoveBoxSpouseFamily = (personIndex: number) => {
//         setSpouseFamilyFormData((prevData) => {
//             const updatedPeople = [...prevData.spouseCommonDTO];
//             updatedPeople.splice(personIndex, 1);
//             return { spouseCommonDTO: updatedPeople };
//         });
//     };

//     const handleAddFieldSpouseFamily = (personIndex: number, fieldType: 'huf' | 'Spouse' | 'father' | 'mother') => {
//         const updatedPeople = { ...SpouseFamilyformData };
//         if (fieldType === 'huf') {
//             updatedPeople.spouseCommonDTO[personIndex].spouseHufDTOS.push({
//                 pepId: 0,
//                 spouseId: 0,
//                 hufName: '',
//                 hufPan: '',
//             });
//         }
//         else if (fieldType === 'father') {
//             updatedPeople.spouseCommonDTO[personIndex].spouseFatherDTOS.push({
//                 pepId: 0,
//                 spouseId: 0,
//                 fatherName: '',
//                 fatherPan: '',
//             });
//         }
//         else if (fieldType === 'mother') {
//             updatedPeople.spouseCommonDTO[personIndex].spouseMotherDTOS.push({
//                 pepId: 0,
//                 spouseId: 0,
//                 motherName: '',
//                 motherPan: '',
//             });
//         }
//         setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
//     };

//     const handlerelativeChange = (personIndex: number, value: any) => {
//         const updatedPeople = JSON.parse(JSON.stringify(RelativeformData));
//         updatedPeople.relativeCombineDTO[personIndex].relativeDTO.relativeMasterId = value;
//         setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
//     };

//     const handleInputChangeSpouseHuf = (
//         personIndex: number,
//         field: 'hufName' | 'hufPan',
//         index: number | null,
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const updatedPeople = JSON.parse(JSON.stringify(SpouseFamilyformData));
//         const value = field === 'hufName' ? event.target.value : event.target.value.toUpperCase();
//         if (index !== null) {
//             if (field === 'hufName' || field === 'hufPan') {
//                 if (!updatedPeople.spouseCommonDTO[personIndex].spouseHufDTOS[index]) {
//                     updatedPeople.spouseCommonDTO[personIndex].spouseHufDTOS[index] = {
//                         pepId: 0,
//                         spouseId: 0,
//                         hufName: '',
//                         hufPan: '',
//                     };
//                 }
//                 updatedPeople.spouseCommonDTO[personIndex].spouseHufDTOS[index][field] = value;
//                 if (field === 'hufPan') {
//                     validateHUFPan(value, index);
//                 }
//             }
//         }
//         setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
//     };

//     const validateHUFPan = (HUFPan: string, index: number | null) => {
//         const errors = [...panhufErrors];
//         const isValid = panRegex.test(HUFPan);
//         if (index !== null) {
//             if (!isValid) {
//                 errors[index] = 'Invalid PAN Format';
//             } else {
//                 errors[index] = '';
//             }
//         }
//         setPanhufErrors(errors);
//     };

//     const handleDeleteFieldspouseHuf = (
//         personIndex: number,
//         field1: 'hufName' | 'hufPan',
//         index: number
//     ) => {
//         const updatedPeople = [...SpouseFamilyformData.spouseCommonDTO];
//         if (field1 === 'hufName' || field1 === 'hufPan') {
//             updatedPeople[personIndex].spouseHufDTOS.splice(index, 1);
//         }
//         setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople });
//     };

//     const handleDeleteFieldspousefather = (
//         personIndex: number,
//         field1: 'fatherPan' | 'fatherName',
//         index: number
//     ) => {
//         const updatedPeople = [...SpouseFamilyformData.spouseCommonDTO];
//         if (field1 === 'fatherName' || field1 === 'fatherPan') {
//             updatedPeople[personIndex].spouseFatherDTOS.splice(index, 1);
//         }
//         setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople });
//     };

//     const handleDeleteFieldspousemother = (
//         personIndex: number,
//         field1: 'motherPan' | 'motherName',
//         index: number
//     ) => {
//         const updatedPeople = [...SpouseFamilyformData.spouseCommonDTO];
//         if (field1 === 'motherName' || field1 === 'motherPan') {
//             updatedPeople[personIndex].spouseMotherDTOS.splice(index, 1);
//         }
//         setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople });
//     };

//     const handleInputChangspousefatherpan = (
//         personIndex: number,
//         field: 'fatherPan' | 'fatherName',
//         index: number | null,
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const updatedPeople = JSON.parse(JSON.stringify(SpouseFamilyformData));
//         const value = field === 'fatherName' ? event.target.value : event.target.value.toUpperCase();
//         if (index !== null) {
//             if (field === 'fatherName' || field === 'fatherPan') {
//                 if (!updatedPeople.spouseCommonDTO[personIndex].spouseFatherDTOS[index]) {
//                     updatedPeople.spouseCommonDTO[personIndex].spouseFatherDTOS[index] = {
//                         pepId: 0,
//                         spouseId: 0,
//                         fatherName: '',
//                         fatherPan: '',
//                     };
//                 }
//                 updatedPeople.spouseCommonDTO[personIndex].spouseFatherDTOS[index][field] = value;
//                 if (field === 'fatherPan') {
//                     validatePanfather(value, index);
//                 }
//             }
//         }
//         setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
//     };

//     const validatePanfather = (pan: string, index: number | null) => {
//         const errors = [...panfatherErrors];
//         const isValid = panRegex.test(pan);
//         if (index !== null) {
//             if (!isValid) {
//                 errors[index] = 'Invalid PAN Format';
//             } else {
//                 errors[index] = '';
//             }
//         }
//         setPanfatherErrors(errors);
//     };

//     const handleInputChangspousemotherpan = (
//         personIndex: number,
//         field: 'motherPan' | 'motherName',
//         index: number | null,
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const updatedPeople = JSON.parse(JSON.stringify(SpouseFamilyformData));
//         const value = field === 'motherName' ? event.target.value : event.target.value.toUpperCase();
//         if (index !== null) {
//             if (field === 'motherName' || field === 'motherPan') {
//                 if (!updatedPeople.spouseCommonDTO[personIndex].spouseMotherDTOS[index]) {
//                     updatedPeople.spouseCommonDTO[personIndex].spouseMotherDTOS[index] = {
//                         pepId: 0,
//                         spouseId: 0,
//                         motherName: '',
//                         motherPan: '',
//                     };
//                 }
//                 updatedPeople.spouseCommonDTO[personIndex].spouseMotherDTOS[index][field] = value;
//                 if (field === 'motherPan') {
//                     validatePanmother(value, index);
//                 }
//             }
//         }
//         setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
//     };

//     const validatePanmother = (pan: string, index: number | null) => {
//         const errors = [...panmotherErrors];
//         const isValid = panRegex.test(pan);
//         if (index !== null) {
//             if (!isValid) {
//                 errors[index] = 'Invalid PAN Format';
//             } else {
//                 errors[index] = '';
//             }
//         }
//         setPanmotherErrors(errors);
//     };

//     const handleInputChangespouseFamily = (
//         personIndex: number,
//         field: 'spouseName' | 'spousePan',
//         index: number | null,
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const updatedPeople = JSON.parse(JSON.stringify(SpouseFamilyformData));
//         const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
//         if (field === 'spouseName' || field === 'spousePan') {
//             updatedPeople.spouseCommonDTO[personIndex].spouseDetailsDTO[field] = field === 'spouseName' ? event.target.value : event.target.value.toUpperCase();
//             if (field === 'spousePan' && !panRegex.test(updatedPeople.spouseCommonDTO[personIndex].spouseDetailsDTO[field])) {
//                 console.error('Invalid PAN Format');
//                 setRelativePanspouseTouched(true);
//             }
//         }
//         setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
//         setTouched(true);
//     };

//     const resetListOfCompanyError = () => {
//         setListOfCompanyError(false);
//     };

//     const listOfCompanyRef = useRef<HTMLDivElement>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const viewPageDetailsService = new ViewPageDetailsService
//     const [checkedCompanies, setCheckedCompanies] = React.useState<string[]>([]);
//     const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<CompanyDetailsItem | null>(null);
//     const [companyDetailsMessage, setCompanyDetailsMessage] = useState('');
//     const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//     const [open, setOpen] = useState(false);
//     const [companyName, setCompanyName] = useState('');
//     const [cinfcrn, setCinfcrn] = useState('');
//     const [originalDateOfAppointment, setOriginalDateOfAppointment] = useState('');
//     const [emailID, setEmailId] = useState('');
//     const [registeredAddress, setRegisteredAddress] = useState('');
//     const [directorId, setDirectors] = useState('');
//     const [din, setDin] = useState('');
//     const [designationId, setDesignation] = useState('');
//     const [directorName, setDirectorStatus] = useState('');
//     const [appointmentDate, setAppointmentDateAtCurrent] = useState('');
//     const [cessationDate, setCessationDate] = useState('');

//     const [formdatas, setFormDatas] = useState<Payload>({
//         combinedDTO: [
//             {
//                 companyDTO: {
//                     id: 0,
//                     associateMasterId: 0,
//                     companyName: '',
//                     listAdverseInformation: 0,
//                     listRegulatoryAction: 0,
//                     listGovernment: 0,
//                     sourceLink: '',
//                     originalDateOfAppointment: '',
//                     typeId: 0,
//                     cinfcrn: '',
//                     document: '',
//                 },
//                 addressDTOS: [
//                     {
//                         id: 0,
//                         companyId: 0,
//                         registeredAddress: '',
//                     },
//                 ],
//                 contactDTOS: [
//                     {
//                         companyId: 0,
//                         emailID: '',
//                     },
//                 ],
//                 companiesDirectorsDTOS: [
//                     {
//                         id: 0,
//                         din: '',
//                         companyId: 0,
//                         directorId: 0,
//                         designationId: 0,
//                         companyMasterId: 0,
//                         appointmentDate: '',
//                         cessationDate: '',
//                         designation: '',
//                         directorStatus: '',
//                         directorName: '',
//                     },
//                 ],
//                 companyDocumentsDTOS: [
//                     {
//                         companyId: 0,
//                         documentTypeId: 0,
//                         documentType: '',
//                         imageName3: '',
//                         uid: loginDetails.id,
//                         files3: [],
//                         path: [],
//                         euid: 0,
//                     },
//                 ],
//                 companyAssociationDTOS: [
//                     {
//                         id: 0,
//                         companyId: 0,
//                         companyAssociation: '',
//                         uid: loginDetails.id,
//                     },
//                 ],
//             },
//         ],
//     });

//     const handleSearch = async (din: string) => {
//         try {
//             setIsLoading(true);
//             const companyDetails = await viewPageDetailsService.getCompany(din);
//             if (companyDetails && companyDetails.length > 0) {
//                 setSelectedCompanyDetails(companyDetails);
//                 setShowSuccessPopup(true);
//                 setCompanyDetailsMessage('');
//             } else {
//                 setCompanyDetailsMessage('Company not found. Please check the information and try again.');
//                 setShowSuccessPopup(false);
//             }
//         } catch (error: any) {
//             console.error('Error fetching company details:', error);
//             setCompanyDetailsMessage('An error occurred while fetching company details. Please try again later.');
//             setShowSuccessPopup(false);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleCheckbox = (companyName: string) => {
//         if (selectedCompanyDetails) {
//             if (checkedCompanies.includes(companyName)) {
//                 setCheckedCompanies(checkedCompanies.filter((company) => company !== companyName));
//             } else {
//                 setCheckedCompanies([...checkedCompanies, companyName]);
//             }
//         }
//     };

//     const handleDialogSubmit = () => {
//         if (Array.isArray(selectedCompanyDetails)) {
//             const updatedFormDatas = { ...formDatas };
//             selectedCompanyDetails.forEach((companyDetails) => {
//                 const companyName = companyDetails?.companyDTO?.companyName;
//                 if (checkedCompanies.includes(companyName)) {
//                     const filteredAddresses = companyDetails.addressDTOS.filter(
//                         (address: AddressDTO) => address.registeredAddress
//                     );
//                     const filteredContacts = companyDetails.contactDTOS.filter(
//                         (contact: ContactDTO) => contact.emailID
//                     );
//                     if (filteredAddresses.length > 0 && filteredContacts.length > 0) {
//                         const existingEntryIndex = updatedFormDatas.combinedDTO.findIndex(
//                             (entry) => entry.companyDTO.companyName === companyName
//                         );
//                         if (existingEntryIndex !== -1) {
//                             console.log('Updating existing entry:', existingEntryIndex);
//                             updatedFormDatas.combinedDTO[existingEntryIndex].addressDTOS.push(
//                                 ...filteredAddresses
//                             );
//                             updatedFormDatas.combinedDTO[existingEntryIndex].contactDTOS.push(
//                                 ...filteredContacts
//                             );
//                             updatedFormDatas.combinedDTO[existingEntryIndex].addressDTOS = Array.from(
//                                 new Set(
//                                     updatedFormDatas.combinedDTO[existingEntryIndex].addressDTOS.map(
//                                         (address: AddressDTO) => JSON.stringify(address)
//                                     )
//                                 ),
//                                 (str) => JSON.parse(str) as AddressDTO
//                             );
//                             updatedFormDatas.combinedDTO[existingEntryIndex].contactDTOS = Array.from(
//                                 new Set(
//                                     updatedFormDatas.combinedDTO[existingEntryIndex].contactDTOS.map(
//                                         (contact: ContactDTO) => JSON.stringify(contact)
//                                     )
//                                 ),
//                                 (str) => JSON.parse(str) as ContactDTO
//                             );
//                         } else {
//                             updatedFormDatas.combinedDTO.push({
//                                 companyDTO: { ...companyDetails.companyDTO },
//                                 addressDTOS: filteredAddresses,
//                                 contactDTOS: filteredContacts,
//                                 companiesDirectorsDTOS: [...companyDetails.companiesDirectorsDTOS],
//                                 companyDocumentsDTOS: Array.isArray(companyDetails.companyDocumentsDTOS)
//                                     ? [...companyDetails.companyDocumentsDTOS]
//                                     : [],
//                                 companyAssociationDTOS: [...companyDetails.companyAssociationDTOS],
//                             });
//                             console.log('updatedFormDatas:', updatedFormDatas);
//                         }
//                     }
//                 }
//             });
//             setformDatas(updatedFormDatas);
//         }
//     };

//     const handleCompanySearchClick = () => {
//         setOpen(true);
//     };

//     const handleModalClose = () => {
//         setDin('');
//         setCompanyName('');
//         setCompanyDetailsMessage('');
//         setOpen(false);
//     };

//     const handleClosePopup = (popupType: string) => {
//         if (popupType === 'success') {
//             setShowSuccessPopup(false);
//             setSelectedCompanyDetails(null);
//         }
//     };
//     function getDesignationName(associateMasterdId: number) {
//         switch (associateMasterdId) {
//             case 1:
//                 return 'Managing Director';
//             case 2:
//                 return 'Manager';
//             case 3:
//                 return 'Nominee Director';
//             case 4:
//                 return 'Director';
//             case 5:
//                 return 'Company Secretary';
//             case 6:
//                 return 'CFO';
//             case 7:
//                 return 'Additional Director';
//             case 8:
//                 return 'CEO';
//         }
//     };

//     const [includeAdverseInformation, setIncludeAdverseInformation] = useState(false);
//     const [includeRegulatoryAction, setIncludeRegulatoryAction] = useState(false);
//     const [adverseInformationCheckValue, setAdverseInformationCheckValue] = useState(0);
//     const [regulatoryActionCheckValue, setRegulatoryActionCheckValue] = useState(0);
//     const [includeListAdverseInfromation, setIncludeListAdverseInfromation] = useState(false);
//     const [listAdverseInfromationCheckValue, setListAdverseInfromationCheckValue] = useState(0);
//     const [includeListRegulatoryAction, setIncludeListRegulatoryAction] = useState(false);
//     const [listRegulatoryActionCheckValue, setListRegulatoryActionCheckValue] = useState(0);
//     const [includeGovernment, setIncludeGovernment] = useState(false);
//     const [listgovernmentCheckValue, setGovernmentCheckValue] = useState(0);

//     const handleAdverseInformationChange = (event: { target: { checked: any; }; }) => {
//         const isChecked = event.target.checked;
//         setIncludeAdverseInformation(isChecked);
//         setAdverseInformationCheckValue(1);
//         setIsCheckboxChecked(isChecked || includeRegulatoryAction);
//         if (isChecked) {
//             setErrorMsg("");
//         }
//     };

//     const handleRegulatoryActionChange = (event: { target: { checked: any; }; }) => {
//         const isChecked = event.target.checked;
//         setIncludeRegulatoryAction(isChecked);
//         setRegulatoryActionCheckValue(1);
//         setIsCheckboxChecked(isChecked || includeAdverseInformation);
//         if (isChecked) {
//             setErrorMsg("");
//         }
//     };

//     const handleListAdverseInfromation = (event: { target: { checked: any; }; }) => {
//         if (event.target.checked) {
//             setIncludeListAdverseInfromation(true);
//             setListAdverseInfromationCheckValue(1);
//         } else {
//             setIncludeListAdverseInfromation(false);
//             setListAdverseInfromationCheckValue(0);
//         }
//     }

//     const handleListRegulatoryAction = (event: { target: { checked: any; }; }) => {
//         if (event.target.checked) {
//             setIncludeListRegulatoryAction(true);
//             setListRegulatoryActionCheckValue(1);
//         } else {
//             setIncludeListRegulatoryAction(false);
//             setListRegulatoryActionCheckValue(0);
//         }
//     };

//     const handleGovernment = (event: { target: { checked: any; }; }) => {
//         if (event.target.checked) {
//             setIncludeGovernment(true);
//             setGovernmentCheckValue(1);
//         } else {
//             setIncludeGovernment(false);
//             setGovernmentCheckValue(0);
//         }
//     };

//     const [selectedListofCompany, setSelectedListofCompany] = useState<string>('');

//     const handleCheckboxChange = (personIndex: number, fieldName: string, value: boolean) => {
//         setformDatas((prevFormDatas) => {
//             const updatedFormDatas = {
//                 ...prevFormDatas,
//                 combinedDTO: prevFormDatas.combinedDTO.map((person, index) => {
//                     if (index !== personIndex) {
//                         return person;
//                     }
//                     return {
//                         ...person,
//                         companyDTO: {
//                             ...person.companyDTO,
//                             [fieldName]: value ? 1 : 0,
//                         },
//                     };
//                 }),
//             };
//             const isChecked = value || checkIfAnyCheckboxChecked(updatedFormDatas.combinedDTO);
//             setIsCheckboxCheckeds(isChecked);
//             return updatedFormDatas;
//         });
//     };

//     const checkIfAnyCheckboxChecked = (combinedDTO: Payload['combinedDTO']) => {
//         for (const person of combinedDTO) {
//             if (person.companyDTO.listAdverseInformation === 1 || person.companyDTO.listRegulatoryAction === 1 || person.companyDTO.listGovernment === 1) {
//                 return true;
//             }
//         }
//         return false;
//     };

//     const handleTextareaKeyPress = () => {
//         if (!isCheckboxChecked) {
//             setErrorMsg("Please select atleast one checkbox");
//         } else {
//             setErrorMsg("");
//         }
//     };

//     const handleTextareaKeyPresss = () => {
//         const isChecked = checkIfAnyCheckboxChecked(formDatas.combinedDTO);
//         if (!isChecked) {
//             setErrorMsgs("Please select atleast one checkbox");
//         } else {
//             setErrorMsgs("");
//         }
//     };

//     return (
//         <>
//             <Header />
//             <Box style={{ marginTop: '7%' }}>
//                 <div className="card-body">
//                     <div className="upload-contact-container">
//                         <div className="card-body">
//                             <Box m={1}>
//                                 <div className="key">
//                                     <div className="details-containers">
//                                         <Grid container spacing={2}>
//                                             <Grid item xs={12}>
//                                                 <TextField
//                                                     autoFocus
//                                                     margin="dense"
//                                                     id="outlined-multiline-static"
//                                                     label="Source Link"
//                                                     variant="standard"
//                                                     type="text"
//                                                     fullWidth
//                                                     size="small"
//                                                     name="sourceLink"
//                                                     multiline
//                                                     value={formData.sourceLink}
//                                                     onChange={(e) => {
//                                                         resetSourceLinkError();
//                                                         handleChange(e, 0);
//                                                     }}
//                                                     error={sourceLinkError}
//                                                     helperText={sourceLinkError ? 'Source Link is required' : ''}
//                                                     inputRef={sourceLinkRef}
//                                                 />
//                                             </Grid>
//                                         </Grid>
//                                         <Grid container spacing={3}>
//                                             <Grid item xs={4}>
//                                                 <div className="key">
//                                                     <div className="person-container">
//                                                         <div className="field-group-column">
//                                                             <TextField
//                                                                 style={{ width: '100%' }}
//                                                                 label="Name"
//                                                                 id="Name"
//                                                                 variant="standard"
//                                                                 type="text"
//                                                                 name="name"
//                                                                 autoComplete="off"
//                                                                 value={formData.name}
//                                                                 onChange={(e) => {
//                                                                     resetNameError();
//                                                                     handleChange(e, 0);
//                                                                 }}
//                                                                 error={nameError}
//                                                                 helperText={nameError ? 'Name is required' : ''}
//                                                                 inputRef={nameRef}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Grid>
//                                             <Grid item xs={4}>
//                                                 <div className="key">
//                                                     <div className="person-container">
//                                                         <div className="field-group-column">
//                                                             <TextField
//                                                                 style={{ width: '50%' }}
//                                                                 id="dob"
//                                                                 name="dob"
//                                                                 type="date"
//                                                                 value={formData.dob}
//                                                                 onChange={(e) => handleChange(e, 0)}
//                                                                 label="Date of Birth"
//                                                                 required
//                                                                 variant="standard"
//                                                                 size="small"
//                                                             />
//                                                             <TextField
//                                                                 style={{ width: '50%' }}
//                                                                 label="Education"
//                                                                 variant="standard"
//                                                                 type="text"
//                                                                 autoComplete="off"
//                                                                 name="education"
//                                                                 value={formData.education}
//                                                                 onChange={(e) => handleChange(e, 0)}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Grid>
//                                             <Grid item xs={4}>
//                                                 <div className="key">
//                                                     <div className="person-container">
//                                                         <div className="field-group-column">
//                                                             <TextField
//                                                                 style={{ width: '100%' }}
//                                                                 label="Place of Birth"
//                                                                 variant="standard"
//                                                                 type="text"
//                                                                 name="placeOfBirth"
//                                                                 autoComplete="off"
//                                                                 value={formData.placeOfBirth}
//                                                                 onChange={(e) => {
//                                                                     handleChange(e, 0);
//                                                                 }}
//                                                             />
//                                                             <FormControl style={{ width: '55%' }} error={genderError}>
//                                                                 <InputLabel htmlFor="gender">Gender</InputLabel>
//                                                                 <Select
//                                                                     label="Gender"
//                                                                     variant="standard"
//                                                                     value={formData.genderId.toString()}
//                                                                     onChange={(event: SelectChangeEvent<string>) => {
//                                                                         resetGenderError();
//                                                                         handlegender(event);
//                                                                     }}
//                                                                     inputRef={genderRef}
//                                                                 >
//                                                                     {gender.map((item) => (
//                                                                         <MenuItem key={item.id} value={item.id.toString()}>
//                                                                             {item.gender}
//                                                                         </MenuItem>
//                                                                     ))}
//                                                                 </Select>
//                                                                 {genderError && <FormHelperText>Gender is required</FormHelperText>}
//                                                             </FormControl>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Grid>
//                                         </Grid>
//                                         <Grid container spacing={2}>
//                                             <Grid item xs={12}>
//                                                 <div className="key">
//                                                     <div className="person-container">
//                                                         <div className="field-group-column">
//                                                             <TextField
//                                                                 style={{ width: '50%' }}
//                                                                 label="PAN"
//                                                                 variant="standard"
//                                                                 type="text"
//                                                                 name="pan"
//                                                                 autoComplete="off"
//                                                                 value={formData.pan}
//                                                                 onChange={(e) => {
//                                                                     handleChange(e, 0);
//                                                                     // checkPANExists(e.target.value);
//                                                                 }}

//                                                                 inputProps={{ maxLength: 10 }}
//                                                             />


//                                                             {panError && <div style={{ color: 'red' }}>{panError}</div>}
//                                                             <TextField
//                                                                 style={{ width: '50%' }}
//                                                                 label="Directors Identification Number"
//                                                                 variant="standard"
//                                                                 type="text"
//                                                                 autoComplete="off"
//                                                                 name="directorsIdentificationNumber"
//                                                                 value={formData.directorsIdentificationNumber}
//                                                                 onChange={(e) => {
//                                                                     handleChange(e, 0);
//                                                                     handleDinChange(e.target.value);
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Grid>
//                                         </Grid>
//                                         <Grid container spacing={2}>
//                                             <Grid item xs={6}>
//                                                 <div className="key">
//                                                     <div className="scroll-box">
//                                                         {PerMediaformData.map((perMediaformData, index) => (
//                                                             <div key={index} className="person-container">
//                                                                 {PerMediaformData.length > 1 && (
//                                                                     <div className="close-button" onClick={() => handleRemoveBoxtPerMedia(index)}>
//                                                                         <FontAwesomeIcon icon={faTimes} />
//                                                                     </div>
//                                                                 )}
//                                                                 <div>
//                                                                     <TextareaAutosize
//                                                                         style={{ minHeight: '100px', maxHeight: '250px', width: '100%', resize: 'none' }}
//                                                                         placeholder="Type here..."
//                                                                         autoFocus
//                                                                         id="outlined-multiline-static"
//                                                                         value={PerMediaformData[index].otherAssociationAsPerMedia}
//                                                                         onChange={(e) => handletPerMediaChange(e.target.value, index)}
//                                                                         minRows={3}
//                                                                         onKeyPress={handleTextareaKeyPress}
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                     <div className="field-group">
//                                                         <div className="field-group-container">
//                                                             <div className="field-group-row">
//                                                                 <div className="field label">
//                                                                     <div className="add-button" onClick={handleAddtPerMediaField}>
//                                                                         <FontAwesomeIcon icon={faPlusCircle} /> Add More command
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Grid>
//                                             <Grid item xs={6}>
//                                                 <FormControlLabel
//                                                     control={<Checkbox checked={includeAdverseInformation} onChange={handleAdverseInformationChange} name="includeAdverseInformation" />}
//                                                     label="Adverse Information"
//                                                 />
//                                                 <FormControlLabel
//                                                     control={<Checkbox checked={includeRegulatoryAction} onChange={handleRegulatoryActionChange} name="includeRegulatoryAction" />}
//                                                     label="Regulatory Action"
//                                                 />
//                                                 <div>
//                                                     {errorMsg && <div className="error-message" style={{ color: "red" }}>{errorMsg}</div>}
//                                                 </div>
//                                             </Grid>
//                                         </Grid>
//                                         <Grid container spacing={2}>
//                                             <Grid item xs={4}>
//                                                 <div className="key">
//                                                     <div className="scroll-box">
//                                                         {akaformData.map((Aka, index) => (
//                                                             <div key={index} className="person-container">
//                                                                 {akaformData.length > 1 && (
//                                                                     <div className="close-button" onClick={() => handleRemoveBoxakaName(index)}>
//                                                                         <FontAwesomeIcon icon={faTimes} />
//                                                                     </div>
//                                                                 )}
//                                                                 <div className="field-group-column">
//                                                                     <TextField
//                                                                         style={{ width: '100%' }}
//                                                                         label="Aka Name"
//                                                                         variant="standard"
//                                                                         type="text"
//                                                                         size="small"
//                                                                         autoComplete="off"
//                                                                         value={Aka.akaName}
//                                                                         onChange={(e) => {
//                                                                             handleakaNameChange(e.target.value, index);
//                                                                         }}
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                     <div className="field-group">
//                                                         <div className="field-group-container">
//                                                             <div className="field-group-row">
//                                                                 <div className="field label">
//                                                                     <div className="add-button" onClick={handleAddakaNameField}>
//                                                                         <FontAwesomeIcon icon={faPlusCircle} /> Add More Aka Name
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Grid>
//                                             <Grid item xs={4}>
//                                                 <div className="key">
//                                                     <div className="scroll-box">
//                                                         {PhoneNumberss.map((PhoneNumber, index) => (
//                                                             <div key={index} className="person-container">
//                                                                 {PhoneNumberss.length > 1 && (
//                                                                     <div className="close-button" onClick={() => handleRemoveBoxPhoneNumbers(index)}>
//                                                                         <FontAwesomeIcon icon={faTimes} />
//                                                                     </div>
//                                                                 )}
//                                                                 <div className="field-group-column">
//                                                                     <TextField
//                                                                         style={{ width: '100%' }}
//                                                                         label="Phone Number"
//                                                                         variant="standard"
//                                                                         type="text"
//                                                                         size="small"
//                                                                         autoComplete="off"
//                                                                         value={PhoneNumber.communicationDt}
//                                                                         onChange={(e) => handlePhoneNumbersNameChange(e.target.value, index)}
//                                                                         onFocus={() => handleFocus(index)}
//                                                                         onBlur={handleBlur}
//                                                                     />
//                                                                     {isEditing === index && !isValidInput && (
//                                                                         <div style={{ color: 'red' }}>Please enter only numeric characters.</div>
//                                                                     )}
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                     <div className="field-group">
//                                                         <div className="field-group-container">
//                                                             <div className="field-group-row">
//                                                                 <div className="field label">
//                                                                     <div className="add-button" onClick={handleAddPhoneNumbersNameField}>
//                                                                         <FontAwesomeIcon icon={faPlusCircle} /> Add More Phone Numbers
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Grid>
//                                             <Grid item xs={4}>
//                                                 <div className="key">
//                                                     <div className="scroll-box">
//                                                         {Emailidss.map((Emailids, index) => (
//                                                             <div key={index} className="person-container">
//                                                                 {Emailidss.length > 1 && (
//                                                                     <div className="close-button" onClick={() => handleRemoveBoxEmailids(index)}>
//                                                                         <FontAwesomeIcon icon={faTimes} />
//                                                                     </div>
//                                                                 )}
//                                                                 <div className="scrollable-box">
//                                                                     <div className="field-group-column">
//                                                                         <TextField
//                                                                             style={{ width: '100%' }}
//                                                                             label="Email Id"
//                                                                             variant="standard"
//                                                                             type="text"
//                                                                             size="small"
//                                                                             autoComplete="off"
//                                                                             value={Emailids.communicationDt}
//                                                                             onChange={(e) => handleEmailidsNameChange(e.target.value, index)}
//                                                                             onBlur={() => {
//                                                                                 if (!isEmailValid(Emailids.communicationDt) && touchedFields[index]) {
//                                                                                     console.error('Invalid email');
//                                                                                 }
//                                                                             }}
//                                                                         />
//                                                                     </div>
//                                                                     {touchedFields[index] && !isEmailValid(Emailids.communicationDt) && (
//                                                                         <div style={{ color: 'red' }}>Invalid email Format</div>
//                                                                     )}
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                     <div className="field-group">
//                                                         <div className="field-group-container">
//                                                             <div className="field-group-row">
//                                                                 <div className="field label">
//                                                                     <div className="add-button" onClick={handleAddEmailidsNameField}>
//                                                                         <FontAwesomeIcon icon={faPlusCircle} /> Add More Email Ids
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Grid>
//                                         </Grid>
//                                     </div>
//                                 </div>
//                             </Box>
//                         </div>
//                     </div>
//                     <Box m={1}>
//                         <div className="key">
//                             <h4>FAMILY DETAILS</h4>
//                             <div className="details-containers">
//                                 <div className="scrollablebox">
//                                     {FamilyformData.familyCombinedDTO.map((person, personIndex) => (
//                                         <div key={personIndex} className="person-container">
//                                             {FamilyformData.familyCombinedDTO.length > 1 && (
//                                                 <div className="close-button" onClick={() => handleRemoveBoxFamilydetails(personIndex)}>
//                                                     <FontAwesomeIcon icon={faTimes} />
//                                                 </div>
//                                             )}
//                                             <Grid container spacing={2}>
//                                                 <Grid item xs={4}>
//                                                     <div className="field-group">
//                                                         <div className="field-group-container">
//                                                             <div className="field-group-row">
//                                                                 <div className="scrollable-box">
//                                                                     {person.hufDTO.map((huf, hufIndex) => (
//                                                                         <div key={hufIndex} className="field-group-column">
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label="HUF Name"
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 autoComplete="off"
//                                                                                 value={huf.hufName}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangeHuf(personIndex, 'hufName', hufIndex, event)
//                                                                                 }
//                                                                             />
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label="PAN"
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 name="pan1"
//                                                                                 autoComplete="off"
//                                                                                 value={huf.hufPan}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangeHuf(personIndex, 'hufPan', hufIndex, event)
//                                                                                 }
//                                                                                 inputProps={{ maxLength: 10 }}
//                                                                             />
//                                                                             {HUFPanErrors[hufIndex] && (
//                                                                                 <div style={{ color: 'red' }}>{HUFPanErrors[hufIndex]}</div>
//                                                                             )}
//                                                                             <FontAwesomeIcon
//                                                                                 icon={faTrash}
//                                                                                 className="delete-icon"
//                                                                                 onClick={() => handleDeleteFieldHuf(personIndex, 'HUFPan', hufIndex)}
//                                                                             />
//                                                                         </div>
//                                                                     ))}
//                                                                     <div className="field label">
//                                                                         <div className="add-button" onClick={() => handleAddFieldFamilydetails(personIndex, 'huf')}>
//                                                                             <FontAwesomeIcon icon={faPlusCircle} /> Add More HUF Name
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </Grid>
//                                                 <Grid item xs={4}>
//                                                     <div className="field-group">
//                                                         <div className="field-group-row">
//                                                             <div className="field-group-container">
//                                                                 <div className="scrollable-box">
//                                                                     {person.fatherDTOS.map((child, childIndex) => (
//                                                                         <div key={childIndex} className="field-group-column">
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label="Father Name"
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 autoComplete="off"
//                                                                                 value={child.fatherName}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangfatherpan(personIndex, 'fatherName', childIndex, event)
//                                                                                 }
//                                                                             />
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label=" Father PAN"
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 name="fatherPan"
//                                                                                 value={child.fatherPan}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangfatherpan(personIndex, 'fatherPan', childIndex, event)
//                                                                                 }
//                                                                                 inputProps={{ maxLength: 10 }}
//                                                                             />
//                                                                             {fatherPanErrors[childIndex] && (
//                                                                                 <div style={{ color: 'red' }}>{fatherPanErrors[childIndex]}</div>
//                                                                             )}
//                                                                             <FontAwesomeIcon
//                                                                                 icon={faTrash}
//                                                                                 className="delete-icon"
//                                                                                 onClick={() => handleDeleteFieldfather(personIndex, 'fatherPan', childIndex)}
//                                                                             />
//                                                                         </div>
//                                                                     ))}
//                                                                     <div className="field label">
//                                                                         <div className="add-button" onClick={() => handleAddFieldFamilydetails(personIndex, 'father')}>
//                                                                             <FontAwesomeIcon icon={faPlusCircle} /> Add More Father
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </Grid>
//                                                 <Grid item xs={4}>
//                                                     <div className="field-group">
//                                                         <div className="field-group-row">
//                                                             <div className="field-group-container">
//                                                                 <div className="scrollable-box">
//                                                                     {person.motherDTOS.map((child, childIndex) => (
//                                                                         <div key={childIndex} className="field-group-column">
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label="Mother Name "
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 autoComplete="off"
//                                                                                 value={child.motherName}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangmotherpan(personIndex, 'motherName', childIndex, event)
//                                                                                 }
//                                                                             />
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label=" Mother PAN"
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 name="motherPan"
//                                                                                 value={child.motherPan}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangmotherpan(personIndex, 'motherPan', childIndex, event)
//                                                                                 }
//                                                                                 inputProps={{ maxLength: 10 }}
//                                                                             />
//                                                                             {motherPanErrors[childIndex] && (
//                                                                                 <div style={{ color: 'red' }}>{motherPanErrors[childIndex]}</div>
//                                                                             )}
//                                                                             <FontAwesomeIcon
//                                                                                 icon={faTrash}
//                                                                                 className="delete-icon"
//                                                                                 onClick={() => handleDeleteFieldmother(personIndex, 'motherPan', childIndex)}
//                                                                             />
//                                                                         </div>
//                                                                     ))}
//                                                                     <div className="field label">
//                                                                         <div className="add-button" onClick={() => handleAddFieldFamilydetails(personIndex, 'mother')}>
//                                                                             <FontAwesomeIcon icon={faPlusCircle} /> Add More Mother
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </Grid>
//                                                 <br></br>
//                                             </Grid>
//                                         </div>
//                                     ))}
//                                     <div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </Box>
//                     <Box m={1}>
//                         <div className="key">
//                             <h4>SPOUSE FAMILY DETAILS</h4>
//                             <div className="details-containers">
//                                 <div className="scrollablebox">
//                                     {SpouseFamilyformData.spouseCommonDTO.map((person, personIndex) => (
//                                         <div key={personIndex} className="person-container">
//                                             {SpouseFamilyformData.spouseCommonDTO.length > 1 && (
//                                                 <div className="close-button" onClick={() => handleRemoveBoxSpouseFamily(personIndex)}>
//                                                     <FontAwesomeIcon icon={faTimes} />
//                                                 </div>
//                                             )}
//                                             <div className="field-group-column" style={{ marginBottom: '10px' }}>
//                                                 <TextField style={{ width: '20%' }}
//                                                     label="Spouse Name"
//                                                     variant="standard"
//                                                     type="text"
//                                                     name="relativeName"
//                                                     autoComplete="off"
//                                                     value={person.spouseDetailsDTO.spouseName}
//                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                         handleInputChangespouseFamily(personIndex, 'spouseName', null, event)
//                                                     }
//                                                 />
//                                                 <TextField
//                                                     style={{ width: '25%' }}
//                                                     label="Spouse PAN"
//                                                     variant="standard"
//                                                     type="text"
//                                                     name="pan"
//                                                     autoComplete="off"
//                                                     value={person.spouseDetailsDTO.spousePan}
//                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                         handleInputChangespouseFamily(personIndex, 'spousePan', null, event)
//                                                     }
//                                                     onBlur={() => setTouched(true)}
//                                                     inputProps={{ maxLength: 10 }}
//                                                 />
//                                                 {relativePanspouseTouched && !isValidPAN(person.spouseDetailsDTO.spousePan) && (
//                                                     <div style={{ color: 'red' }}>Invalid PAN Format</div>
//                                                 )}
//                                             </div>
//                                             <Grid container spacing={2}>
//                                                 <Grid item xs={4}>
//                                                     <div className="field-group">
//                                                         <div className="field-group-container">
//                                                             <div className="field-group-row">
//                                                                 <div className="scrollable-box">
//                                                                     {person.spouseHufDTOS.map((huf, hufIndex) => (
//                                                                         <div key={hufIndex} className="field-group-column">
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label="HUF Name"
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 autoComplete="off"
//                                                                                 value={huf.hufName}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangeSpouseHuf(personIndex, 'hufName', hufIndex, event)
//                                                                                 }
//                                                                             />
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label="PAN"
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 name="pan1"
//                                                                                 autoComplete="off"
//                                                                                 value={huf.hufPan}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangeSpouseHuf(personIndex, 'hufPan', hufIndex, {
//                                                                                         ...event,
//                                                                                         target: { ...event.target, value: event.target.value.toUpperCase() },
//                                                                                     })
//                                                                                 }
//                                                                                 inputProps={{ maxLength: 10 }}
//                                                                             />
//                                                                             {panhufErrors[hufIndex] && (
//                                                                                 <div style={{ color: 'red' }}>{panhufErrors[hufIndex]}</div>
//                                                                             )}
//                                                                             <FontAwesomeIcon
//                                                                                 icon={faTrash}
//                                                                                 className="delete-icon"
//                                                                                 onClick={() => handleDeleteFieldspouseHuf(personIndex, 'hufPan', hufIndex)}
//                                                                             />
//                                                                         </div>
//                                                                     ))}
//                                                                     <div className="field label">
//                                                                         <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
//                                                                             <FontAwesomeIcon icon={faPlusCircle} /> Add More HUF
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </Grid>
//                                                 <Grid item xs={4}>
//                                                     <div className="field-group">
//                                                         <div className="field-group-row">
//                                                             <div className="field-group-container">
//                                                                 <div className="scrollable-box">
//                                                                     {person.spouseFatherDTOS.map((child, childIndex) => (
//                                                                         <div key={childIndex} className="field-group-column">
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label="Father Name"
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 autoComplete="off"
//                                                                                 value={child.fatherName}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangspousefatherpan(personIndex, 'fatherName', childIndex, event)
//                                                                                 }
//                                                                             />
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label=" Father PAN"
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 name="fatherPan"
//                                                                                 value={child.fatherPan}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangspousefatherpan(personIndex, 'fatherPan', childIndex, event)
//                                                                                 }
//                                                                                 inputProps={{ maxLength: 10 }}
//                                                                             />
//                                                                             {panfatherErrors[childIndex] && (
//                                                                                 <div style={{ color: 'red' }}>{panfatherErrors[childIndex]}</div>
//                                                                             )}
//                                                                             <FontAwesomeIcon
//                                                                                 icon={faTrash}
//                                                                                 className="delete-icon"
//                                                                                 onClick={() => handleDeleteFieldspousefather(personIndex, 'fatherPan', childIndex)}
//                                                                             />
//                                                                         </div>
//                                                                     ))}
//                                                                     <div className="field label">
//                                                                         <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'father')}>
//                                                                             <FontAwesomeIcon icon={faPlusCircle} /> Add More Father
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </Grid>
//                                                 <Grid item xs={4}>
//                                                     <div className="field-group">
//                                                         <div className="field-group-row">
//                                                             <div className="field-group-container">
//                                                                 <div className="scrollable-box">
//                                                                     {person.spouseMotherDTOS.map((child, childIndex) => (
//                                                                         <div key={childIndex} className="field-group-column">
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label="Mother Name "
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 autoComplete="off"
//                                                                                 value={child.motherName}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangspousemotherpan(personIndex, 'motherName', childIndex, event)
//                                                                                 }
//                                                                             />
//                                                                             <TextField
//                                                                                 style={{ width: '50%' }}
//                                                                                 label=" Mother PAN"
//                                                                                 variant="standard"
//                                                                                 type="text"
//                                                                                 name="motherPan"
//                                                                                 value={child.motherPan}
//                                                                                 onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                     handleInputChangspousemotherpan(personIndex, 'motherPan', childIndex, event)
//                                                                                 }
//                                                                                 inputProps={{ maxLength: 10 }}
//                                                                             />
//                                                                             {panmotherErrors[childIndex] && (
//                                                                                 <div style={{ color: 'red' }}>{panmotherErrors[childIndex]}</div>
//                                                                             )}
//                                                                             <FontAwesomeIcon
//                                                                                 icon={faTrash}
//                                                                                 className="delete-icon"
//                                                                                 onClick={() => handleDeleteFieldspousemother(personIndex, 'motherPan', childIndex)}
//                                                                             />
//                                                                         </div>
//                                                                     ))}
//                                                                     <div className="field label">
//                                                                         <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'mother')}>
//                                                                             <FontAwesomeIcon icon={faPlusCircle} /> Add More Mother
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </Grid>
//                                                 <br></br>
//                                             </Grid>
//                                         </div>
//                                     ))}
//                                     <div className="button-container">
//                                         <Button
//                                             className="add-people"
//                                             variant="contained"
//                                             startIcon={<FontAwesomeIcon icon={faPlus} />}
//                                             onClick={() =>
//                                                 setSpouseFamilyFormData({
//                                                     spouseCommonDTO: [
//                                                         ...SpouseFamilyformData.spouseCommonDTO,
//                                                         {
//                                                             spouseDetailsDTO: {
//                                                                 pepId: 0,
//                                                                 spouseName: '',
//                                                                 spousePan: '',
//                                                             },
//                                                             spouseHufDTOS: [
//                                                                 {
//                                                                     pepId: 0,
//                                                                     spouseId: 0,
//                                                                     hufName: '',
//                                                                     hufPan: '',
//                                                                 },
//                                                             ],
//                                                             spouseFatherDTOS: [
//                                                                 {
//                                                                     pepId: 0,
//                                                                     spouseId: 0,
//                                                                     fatherName: '',
//                                                                     fatherPan: '',
//                                                                 },
//                                                             ],
//                                                             spouseMotherDTOS: [
//                                                                 {
//                                                                     pepId: 0,
//                                                                     spouseId: 0,
//                                                                     motherName: '',
//                                                                     motherPan: '',
//                                                                 },
//                                                             ],
//                                                         },
//                                                     ],
//                                                 })
//                                             }
//                                         >
//                                             Add Spouse Family Details
//                                         </Button>
//                                     </div>
//                                     <div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </Box>
//                     <div className="card-body">
//                         <Box m={1}>
//                             <div className="key">
//                                 <h4>RELATIVE DETAILS</h4>
//                                 <div className="details-containers">
//                                     <div className="scrollablebox">
//                                         {RelativeformData.relativeCombineDTO.map((person, personIndex) => (
//                                             <div key={personIndex} className="person-container">
//                                                 {RelativeformData.relativeCombineDTO.length > 1 && (
//                                                     <div className="close-button" onClick={() => handleRemoveBoxFamily(personIndex)}>
//                                                         <FontAwesomeIcon icon={faTimes} />
//                                                     </div>
//                                                 )}
//                                                 <div className="field-group-column" style={{ marginBottom: '10px' }}>
//                                                     <FormControl style={{ width: '50%' }}>
//                                                         <InputLabel htmlFor="type">Relative List</InputLabel>
//                                                         <Select
//                                                             label="Relative"
//                                                             value={person.relativeDTO.relativeMasterId}
//                                                             onChange={(e) => handlerelativeChange(personIndex, e.target.value)}
//                                                             variant="standard"
//                                                             type="text"
//                                                         >
//                                                             {Array.isArray(relative) &&
//                                                                 relative.map((lists: any) => (
//                                                                     <MenuItem key={lists.id} value={lists.id}>
//                                                                         {lists.name}
//                                                                     </MenuItem>
//                                                                 ))}
//                                                         </Select>
//                                                     </FormControl>
//                                                     <TextField style={{ width: '20%' }}
//                                                         label="Relative Name"
//                                                         variant="standard"
//                                                         type="text"
//                                                         name="relativeName"
//                                                         autoComplete="off"
//                                                         value={person.relativeDTO.relativeName}
//                                                         onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                             handleInputChangeFamily(personIndex, 'relativeName', null, event)
//                                                         }
//                                                     />
//                                                     <TextField
//                                                         style={{ width: '25%' }}
//                                                         label="PAN"
//                                                         variant="standard"
//                                                         type="text"
//                                                         name="pan"
//                                                         autoComplete="off"
//                                                         value={person.relativeDTO.pan}
//                                                         onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                             handleInputChangeFamily(personIndex, 'pan', null, event)
//                                                         }
//                                                         onBlur={() => setTouched(true)}
//                                                         inputProps={{ maxLength: 10 }}
//                                                     />
//                                                     {relativePanTouched && !isValidPAN(person.relativeDTO.pan) && (
//                                                         <div style={{ color: 'red' }}>Invalid PAN Format</div>
//                                                     )}
//                                                 </div>
//                                                 <Grid container spacing={2}>
//                                                     <Grid item xs={6}>
//                                                         <div className="field-group">
//                                                             <div className="field-group-container">
//                                                                 <div className="field-group-row">
//                                                                     <div className="scrollable-box">
//                                                                         {person.relativeDetDTOS.map((email, emailIndex) => (
//                                                                             <div key={emailIndex} className="field-group-column">
//                                                                                 <TextField
//                                                                                     style={{ width: '50%' }}
//                                                                                     label="Name"
//                                                                                     variant="standard"
//                                                                                     type="text"
//                                                                                     autoComplete="off"
//                                                                                     value={email.name}
//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handleInputChangeFamily(personIndex, 'name', emailIndex, event)
//                                                                                     }
//                                                                                 />
//                                                                                 <TextField
//                                                                                     style={{ width: '50%' }}
//                                                                                     label="PAN"
//                                                                                     variant="standard"
//                                                                                     type="text"
//                                                                                     name="pan1"
//                                                                                     autoComplete="off"
//                                                                                     value={email.pan}
//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handleInputChangeFamily(personIndex, 'pan', emailIndex, {
//                                                                                             ...event,
//                                                                                             target: { ...event.target, value: event.target.value.toUpperCase() },
//                                                                                         })
//                                                                                     }
//                                                                                     inputProps={{ maxLength: 10 }}
//                                                                                 />
//                                                                                 {spousePanTouched && !isValidPAN(email.pan) && (
//                                                                                     <div style={{ color: 'red' }}>Invalid PAN Format</div>
//                                                                                 )}
//                                                                                 <FontAwesomeIcon
//                                                                                     icon={faTrash}
//                                                                                     className="delete-icon"
//                                                                                     onClick={() => handleDeleteFieldFamily(personIndex, 'pan', emailIndex)}
//                                                                                 />
//                                                                             </div>
//                                                                         ))}
//                                                                         <div className="field label">
//                                                                             <div className="add-button" onClick={() => handleAddFieldFamily(personIndex, 'Spouse')}>
//                                                                                 <FontAwesomeIcon icon={faPlusCircle} /> Add More Spouse
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </Grid>
//                                                     <Grid item xs={6}>
//                                                         <div className="field-group">
//                                                             <div className="field-group-row">
//                                                                 <div className="field-group-container">
//                                                                     <div className="scrollable-box">
//                                                                         {person.relativeChildrenDTOS.map((child, childIndex) => (
//                                                                             <div key={childIndex} className="field-group-column">
//                                                                                 <TextField
//                                                                                     style={{ width: '50%' }}
//                                                                                     label="Children Name"
//                                                                                     variant="standard"
//                                                                                     type="text"
//                                                                                     autoComplete="off"
//                                                                                     value={child.childrenName}
//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handleInputChangchilderpan(personIndex, 'childrenName', childIndex, event)
//                                                                                     }
//                                                                                 />
//                                                                                 <TextField
//                                                                                     style={{ width: '50%' }}
//                                                                                     label="Children PAN"
//                                                                                     variant="standard"
//                                                                                     type="text"
//                                                                                     name="childrenPan"
//                                                                                     value={child.pan}
//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handleInputChangchilderpan(personIndex, 'pan', childIndex, event)
//                                                                                     }
//                                                                                     inputProps={{ maxLength: 10 }}
//                                                                                 />
//                                                                                 {panErrors[childIndex] && (
//                                                                                     <div style={{ color: 'red' }}>{panErrors[childIndex]}</div>
//                                                                                 )}
//                                                                                 <FontAwesomeIcon
//                                                                                     icon={faTrash}
//                                                                                     className="delete-icon"
//                                                                                     onClick={() => handleDeleteFieldchilder(personIndex, 'pan', childIndex)}
//                                                                                 />
//                                                                             </div>
//                                                                         ))}
//                                                                         <div className="field label">
//                                                                             <div className="add-button" onClick={() => handleAddFieldFamily(personIndex, 'children')}>
//                                                                                 <FontAwesomeIcon icon={faPlusCircle} /> Add More Children
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </Grid>
//                                                     <br></br>
//                                                 </Grid>
//                                             </div>
//                                         ))}
//                                         <div className="button-container">
//                                             <Button
//                                                 className="add-people"
//                                                 variant="contained"
//                                                 startIcon={<FontAwesomeIcon icon={faPlus} />}
//                                                 onClick={() =>
//                                                     setRelativeFormData({
//                                                         relativeCombineDTO: [
//                                                             ...RelativeformData.relativeCombineDTO,
//                                                             {
//                                                                 relativeDTO: {
//                                                                     pepId: 0,
//                                                                     relativeMasterId: '',
//                                                                     relativeName: '',
//                                                                     pan: '',
//                                                                 },
//                                                                 relativeDetDTOS: [
//                                                                     {
//                                                                         pepId: 0,
//                                                                         relativeId: 0,
//                                                                         name: '',
//                                                                         pan: '',
//                                                                     },
//                                                                 ],
//                                                                 relativeChildrenDTOS: [
//                                                                     {
//                                                                         pepId: 0,
//                                                                         relativeDetId: 0,
//                                                                         childrenName: '',
//                                                                         relativeId: 0,
//                                                                         pan: '',
//                                                                     },
//                                                                 ],
//                                                             },
//                                                         ],
//                                                     })
//                                                 }
//                                             >
//                                                 Add Family details
//                                             </Button>
//                                         </div>
//                                         <div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Box>
//                     </div>

//                     <div className="card-body">
//                         <Box m={1}>
//                             <div className="key">
//                                 <h4>PARTY</h4>

//                                 <div className="details-containers">
//                                     <div className="scrollablebox">
//                                         {partyData.partyCommonDto.map((person, personIndex) => (
//                                             <div key={personIndex} className="person-container">
//                                                 <Grid container spacing={2}>
//                                                     <Grid item xs={8}>
//                                                         <div className="field-group">
//                                                             <div className="field-group-container">
//                                                                 <div className="field-group-row">
//                                                                     <div className="scrollable-box">
//                                                                         {person.partyDetailsDTO.map((party, partyIndex) => (
//                                                                             <div key={partyIndex} className="field-group-column">
//                                                                                 <FormControl
//                                                                                     fullWidth
//                                                                                     variant="outlined"
//                                                                                     margin="dense"
//                                                                                     className="text-field"
//                                                                                 >
//                                                                                     <InputLabel htmlFor={`Party-${partyIndex}`}>Party</InputLabel>
//                                                                                     <Select
//                                                                                         label={`Party ${partyIndex + 1}`}
//                                                                                         value={partyData.partyCommonDto[personIndex].partyDetailsDTO[partyIndex].partyMasterId}
//                                                                                         onChange={(event: SelectChangeEvent<number>) =>
//                                                                                             handlePartyFormStateChange(personIndex, partyIndex, 'partyMasterId', event)
//                                                                                         }
//                                                                                         name={`partyMasterId-${partyIndex}`}
//                                                                                         variant="standard"
//                                                                                         type="text"
//                                                                                         size="small"
//                                                                                         required
//                                                                                     >
//                                                                                         {Party.map((party) => (
//                                                                                             <MenuItem key={party.id} value={party.id}>
//                                                                                                 {party.partyName}
//                                                                                             </MenuItem>
//                                                                                         ))}
//                                                                                     </Select>
//                                                                                 </FormControl>

//                                                                                 <TextField
//                                                                                     style={{ width: '90%' }}
//                                                                                     label="Party Name"
//                                                                                     variant="standard"
//                                                                                     multiline
//                                                                                     type="text"
//                                                                                     name="formerAndCurrent"
//                                                                                     value={party.formerAndCurrent}
//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handlePartyFormStateChange(personIndex, partyIndex, 'formerAndCurrent', event)
//                                                                                     }

//                                                                                 />
//                                                                                 <TextField
//                                                                                     style={{ width: '90%' }}
//                                                                                     label="Position in the Party"
//                                                                                     multiline
//                                                                                     id="outlined-multiline-static"
//                                                                                     variant="standard"
//                                                                                     type="text"
//                                                                                     name="positionInTheParty"
//                                                                                     value={party.positionInTheParty}
//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handlePartyFormStateChange(personIndex, partyIndex, 'positionInTheParty', event)
//                                                                                     }


//                                                                                 />

//                                                                                 <FontAwesomeIcon
//                                                                                     icon={faTrash}
//                                                                                     className="delete-icon"
//                                                                                     onClick={() => handleDeleteparty(personIndex, 'positionInTheParty', partyIndex)}
//                                                                                 />
//                                                                             </div>
//                                                                         ))}

//                                                                     </div>
//                                                                     <div className="field label">

//                                                                         <div className="add-button" onClick={() => handleAddFieldpartydetails(personIndex, 'party')}>
//                                                                             <FontAwesomeIcon icon={faPlusCircle} /> Add More party
//                                                                         </div>

//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </Grid>
//                                                 </Grid>
//                                                 {partyData.partyCommonDto.length > 1 && (
//                                                     <div className="close-button"
//                                                         onClick={() => handleRemovePartyFormData(personIndex)}
//                                                     >
//                                                         <FontAwesomeIcon icon={faTimes} />
//                                                     </div>
//                                                 )}
//                                                 <div className="field-group-column" style={{ marginBottom: '10px' }}>



//                                                     <TextField
//                                                         style={{ width: '100%' }}
//                                                         autoFocus
//                                                         margin="dense"
//                                                         id="outlined-multiline-static"
//                                                         label="Position in the Government"
//                                                         variant="standard"
//                                                         type="text"
//                                                         multiline
//                                                         name="positionInTheGovernment"
//                                                         value={person.partyCandidateDetailsDTO.positionInTheGovernment}
//                                                         onChange={(e) => handlePositionintheGovernmentChange(e.target.value)}

//                                                     />


//                                                     <TextField
//                                                         autoFocus
//                                                         margin="dense"
//                                                         id="outlined-multiline-static"
//                                                         style={{ width: '100%' }}
//                                                         label="Address"
//                                                         variant="standard"
//                                                         type="text"
//                                                         multiline
//                                                         name="permanentAddress"
//                                                         value={person.partyCandidateDetailsDTO.permanentAddress}
//                                                         onChange={(e) => handlePermanentAddressChange(e.target.value)}

//                                                     />

//                                                     <TextField
//                                                         style={{ width: '100%' }}
//                                                         label="Other Information"
//                                                         variant="standard"
//                                                         multiline
//                                                         type="text"
//                                                         name="otherInformation"
//                                                         value={person.partyCandidateDetailsDTO.otherInformation}
//                                                         onChange={(e) => handleOtherInformationChange(e.target.value)}

//                                                     />

//                                                     <TextField
//                                                         style={{ width: '100%' }}
//                                                         label="Died"
//                                                         variant="standard"
//                                                         type="text"
//                                                         name="died"
//                                                         value={person.partyCandidateDetailsDTO.died}
//                                                         onChange={(e) => handlediedChange(e.target.value)}

//                                                     />

//                                                 </div>


//                                             </div>

//                                             // </div>
//                                         ))}

//                                     </div>
//                                     <div>
//                                     </div>

//                                 </div>

//                             </div>



//                         </Box>
//                     </div>
//                     <div className="card-body">
//                         <Box m={1}>
//                             <div className="key">
//                                 <h4>LIST OF ASSOCIATED DETAILS</h4>
//                                 <Col xs={1} style={{ marginBottom: '1%' }}>
//                                     <Button variant="contained" color="primary" onClick={handleCompanySearchClick}>
//                                         Company
//                                     </Button>
//                                 </Col>
//                                 <Modal open={open} onClose={handleModalClose}>
//                                     <Box
//                                         sx={{
//                                             position: 'absolute',
//                                             top: '50%',
//                                             left: '50%',
//                                             transform: 'translate(-50%, -50%)',
//                                             width: '80%',
//                                             maxWidth: 'lg',
//                                             bgcolor: 'background.paper',
//                                             boxShadow: 24,
//                                             p: 4,
//                                         }}
//                                     >
//                                         <Grid container spacing={2}>
//                                             <Grid item xs={12} md={6}>
//                                                 <TextField
//                                                     label="Company Name"
//                                                     variant="outlined"
//                                                     fullWidth
//                                                     value={companyName}
//                                                     onChange={(e) => {
//                                                         setCompanyName(e.target.value);
//                                                         setCompanyDetailsMessage('');
//                                                     }}
//                                                     error={Boolean(companyDetailsMessage)}
//                                                     helperText={companyDetailsMessage}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={12} md={6}>
//                                                 <TextField
//                                                     label="DIN Number"
//                                                     variant="outlined"
//                                                     fullWidth
//                                                     value={din}
//                                                     onChange={(e) => setDin(e.target.value)}
//                                                 />
//                                             </Grid>
//                                         </Grid>
//                                         <Box sx={{ mt: 2, textAlign: 'right' }}>
//                                             <Button variant="contained" color="primary" onClick={() => handleSearch(din)}>
//                                                 Search
//                                             </Button>
//                                         </Box>
//                                         {isLoading && <CircularProgress sx={{ mt: 2 }} />}
//                                         {companyDetailsMessage && <div >{companyDetailsMessage}</div>}
//                                     </Box>
//                                 </Modal>
//                                 <Dialog open={showSuccessPopup} onClose={() => handleClosePopup('success')} fullWidth maxWidth="lg">
//                                     <DialogTitle>Company Details</DialogTitle>
//                                     <DialogContent>
//                                         {Array.isArray(selectedCompanyDetails) && selectedCompanyDetails.map((item, index) => (
//                                             <div key={index} style={{ marginBottom: '20px' }}>
//                                                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                                                     <Checkbox
//                                                         checked={checkedCompanies.includes(item.companyDTO.companyName)}
//                                                         onChange={() => handleCheckbox(item.companyDTO.companyName)}
//                                                     />
//                                                     <Typography style={{ marginLeft: '10px' }}>
//                                                         <strong>Company Name:</strong> {item.companyDTO.companyName || 'Not Available'}
//                                                     </Typography>
//                                                 </div>
//                                                 <div style={{ marginLeft: '10px' }}>
//                                                     <Typography>
//                                                         <strong>CINFCRN:</strong> {item.companyDTO.cinfcrn || 'Not Available'}
//                                                     </Typography>
//                                                     <Typography>
//                                                         <strong>Original Date Of Appointment:</strong>{' '}
//                                                         {item.companyDTO.originalDateOfAppointment || 'Not Available'}
//                                                     </Typography>
//                                                     <Typography>
//                                                         {item.contactDTOS && item.contactDTOS.length > 0
//                                                             ? item.contactDTOS.map((email: { emailID: any; }, addressIndex: React.Key | null | undefined) => (
//                                                                 <div key={addressIndex}><strong>EmailID:</strong> {email.emailID || 'Not Available'}</div>
//                                                             ))
//                                                             : 'Not Available'}
//                                                     </Typography>
//                                                     <Typography>
//                                                         {item.addressDTOS && item.addressDTOS.length > 0
//                                                             ? item.addressDTOS.map((address: { registeredAddress: any; }, addressIndex: React.Key | null | undefined) => (
//                                                                 <div key={addressIndex}><strong>Registered Address:</strong> {address.registeredAddress || 'Not Available'}</div>
//                                                             ))
//                                                             : 'Not Available'}
//                                                     </Typography>
//                                                     <Typography>
//                                                         {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
//                                                             ? item.companiesDirectorsDTOS.map((director: { directorName: any; }, addressIndex: React.Key | null | undefined) => (
//                                                                 <div key={addressIndex}><strong>Directors:</strong> {director.directorName || 'Not Available'}</div>
//                                                             ))
//                                                             : 'Not Available'}
//                                                     </Typography>
//                                                     <Typography>
//                                                         {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
//                                                             ? item.companiesDirectorsDTOS.map((director: { din: any; }, addressIndex: React.Key | null | undefined) => (
//                                                                 <div key={addressIndex}><strong>Din:</strong> {director.din || 'Not Available'}</div>
//                                                             ))
//                                                             : 'Not Available'}
//                                                     </Typography>
//                                                     <Typography>
//                                                         {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
//                                                             ? item.companiesDirectorsDTOS.map((director: { designationId: any; }, addressIndex: React.Key | null | undefined) => (
//                                                                 <div key={addressIndex}><strong>Designation:</strong> {getDesignationName(director.designationId as number) || 'Not Available'}</div>
//                                                             ))
//                                                             : 'Not Available'}
//                                                     </Typography>
//                                                     <Typography>
//                                                         {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
//                                                             ? item.companiesDirectorsDTOS.map((director: { directorStatus: any; }, addressIndex: React.Key | null | undefined) => (
//                                                                 <div key={addressIndex}><strong>Director Status:</strong> {director.directorStatus || 'Not Available'}</div>
//                                                             ))
//                                                             : 'Not Available'}
//                                                     </Typography>
//                                                     <Typography>
//                                                         {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
//                                                             ? item.companiesDirectorsDTOS.map((director: { appointmentDate: any; }, addressIndex: React.Key | null | undefined) => (
//                                                                 <div key={addressIndex}><strong>Date of appointment at Current:</strong> {director.appointmentDate || 'Not Available'}</div>
//                                                             ))
//                                                             : 'Not Available'}
//                                                     </Typography>
//                                                     <Typography>
//                                                         {item.companiesDirectorsDTOS && item.companiesDirectorsDTOS.length > 0
//                                                             ? item.companiesDirectorsDTOS.map((director: { cessationDate: any; }, addressIndex: React.Key | null | undefined) => (
//                                                                 <div key={addressIndex}><strong>Date of Cessation:</strong> {director.cessationDate || 'Not Available'}</div>
//                                                             ))
//                                                             : 'Not Available'}
//                                                     </Typography>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </DialogContent>
//                                     <DialogActions>
//                                         <Button variant="contained" color="primary" onClick={handleDialogSubmit}>
//                                             Submit
//                                         </Button>
//                                         <Button variant="contained" color="primary" onClick={() => handleClosePopup('success')}>
//                                             Close
//                                         </Button>
//                                     </DialogActions>
//                                 </Dialog>
//                                 <div className="details-containers">
//                                     <div className="scrollablebox">
//                                         {formDatas.combinedDTO.map((person, personIndex) => (
//                                             <div key={personIndex} className="person-container">
//                                                 {formDatas.combinedDTO.length > 1 && (
//                                                     <div className="close-button" onClick={() => handleRemoveBoxCompanies(personIndex)}>
//                                                         <FontAwesomeIcon icon={faTimes} />
//                                                     </div>
//                                                 )}
//                                                 <div className="field-group-column" style={{ marginBottom: '10px' }}>
//                                                     <TextField
//                                                         style={{ width: '100%' }}
//                                                         autoFocus
//                                                         margin="dense"
//                                                         id="outlined-multiline-static"
//                                                         label="Source Link"
//                                                         variant="standard"
//                                                         type="text"
//                                                         fullWidth
//                                                         size="small"
//                                                         name="sourceLink"
//                                                         multiline
//                                                         value={person.companyDTO.sourceLink}
//                                                         onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                             handleInputChangeCompanies(personIndex, 'sourceLink', null, event)
//                                                         }
//                                                     />
//                                                 </div>
//                                                 <div className="field-group-column" style={{ marginBottom: '10px' }}>
//                                                     <FormControl style={{ width: '15%' }}>
//                                                         <InputLabel htmlFor="typeId">List Of Company Details</InputLabel>
//                                                         <Select
//                                                             label="AssociatedList"
//                                                             variant="standard"
//                                                             type="text"
//                                                             value={person.companyDTO.typeId.toString()}
//                                                             onChange={(event: SelectChangeEvent<string>) =>
//                                                                 handleInputChangeCompanies(
//                                                                     personIndex,
//                                                                     'typeId',
//                                                                     null,
//                                                                     event
//                                                                 )
//                                                             }
//                                                         >
//                                                             {listOfCompanyDetails.map((item) => (
//                                                                 <MenuItem key={item.id} value={item.id.toString()}>
//                                                                     {item.type}
//                                                                 </MenuItem>
//                                                             ))}
//                                                         </Select>
//                                                     </FormControl>
//                                                     <FormControl style={{ width: '15%' }}>
//                                                         <InputLabel htmlFor="type">AssociatedList</InputLabel>
//                                                         <Select
//                                                             label="AssociatedList"
//                                                             variant="standard"
//                                                             type="text"
//                                                             value={person.companyDTO.associateMasterId.toString()}
//                                                             onChange={(event: SelectChangeEvent<string>) =>
//                                                                 handleInputChangeCompanies(
//                                                                     personIndex,
//                                                                     'associateMasterId',
//                                                                     null,
//                                                                     event
//                                                                 )
//                                                             }
//                                                         >
//                                                             {associatedList.map((item) => (
//                                                                 <MenuItem key={item.id} value={item.id.toString()}>
//                                                                     {item.name}
//                                                                 </MenuItem>
//                                                             ))}
//                                                         </Select>
//                                                     </FormControl>
//                                                     <TextField
//                                                         style={{ width: '25%' }}
//                                                         label="Company Name"
//                                                         variant="standard"
//                                                         type="text"
//                                                         name="companyName"
//                                                         id={`companyName-${personIndex}`}
//                                                         value={person.companyDTO.companyName}
//                                                         onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//                                                             handleInputChangeCompanies(personIndex, 'companyName', null, event)
//                                                         }}
//                                                     />
//                                                     <TextField
//                                                         style={{ width: '25%' }}
//                                                         label="CINFCRN"
//                                                         variant="standard"
//                                                         id={`cinfcrn-${personIndex}`}
//                                                         name="cinfcrn"
//                                                         value={person.companyDTO.cinfcrn}
//                                                         onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                             handleInputChangeCompanies(personIndex, 'cinfcrn', null, event)
//                                                         }
//                                                     />
//                                                     <TextField
//                                                         style={{ width: '25%' }}
//                                                         label="Original Date of Appointment"
//                                                         variant="standard"
//                                                         type="date"
//                                                         name="dob"
//                                                         required
//                                                         value={person.companyDTO.originalDateOfAppointment}
//                                                         onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                             handleInputChangeCompanies(personIndex, 'originalDateOfAppointment', null, event)
//                                                         }
//                                                     />
//                                                 </div>
//                                                 <Grid container spacing={2}>
//                                                     <Grid item xs={6}>
//                                                         <div className="field-group">
//                                                             <div className="field-group-container">
//                                                                 <div className="field-group-row">
//                                                                     <div className="scrollable-box">
//                                                                         {person.contactDTOS.map((email, emailIndex) => (
//                                                                             <div key={emailIndex} className="field-group-column">
//                                                                                 <TextField
//                                                                                     style={{ width: '100%' }}
//                                                                                     label="Email Id"
//                                                                                     variant="standard"
//                                                                                     type="text"
//                                                                                     value={email.emailID}
//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handleInputChangeCompanies(personIndex, 'emailID', emailIndex, event)
//                                                                                     }
//                                                                                 />
//                                                                                 {emailErrors[emailIndex] && (
//                                                                                     <div style={{ color: 'red' }}>{emailErrors[emailIndex]}</div>
//                                                                                 )}
//                                                                                 <FontAwesomeIcon
//                                                                                     icon={faTrash}
//                                                                                     className="delete-icon"
//                                                                                     onClick={() =>
//                                                                                         handleDeleteFieldCompanies(personIndex, 'emailID', emailIndex)
//                                                                                     }
//                                                                                 />
//                                                                             </div>
//                                                                         ))}
//                                                                         <div className="field label">
//                                                                             <div className="add-button" onClick={() => handleAddFieldCompanies(personIndex, 'email')}>
//                                                                                 <FontAwesomeIcon icon={faPlusCircle} /> Add More Email Ids
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </Grid>
//                                                     <Grid item xs={6}>
//                                                         <div className="field-group">
//                                                             <div className="field-group-row">
//                                                                 <div className="field-group-container">
//                                                                     <div className="scrollable-box">
//                                                                         {person.addressDTOS.map((address, addressIndex) => (
//                                                                             <div key={addressIndex} className="field-group-column">
//                                                                                 <TextField
//                                                                                     style={{ width: '100%' }}
//                                                                                     label="Registered address"
//                                                                                     variant="standard"
//                                                                                     type="text"
//                                                                                     value={address.registeredAddress}
//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handleInputChangeCompanies(personIndex, 'registeredAddress', addressIndex, event)
//                                                                                     }
//                                                                                 />
//                                                                                 <FontAwesomeIcon
//                                                                                     icon={faTrash}
//                                                                                     className="delete-icon"
//                                                                                     onClick={() =>
//                                                                                         handleDeleteFieldCompanies(personIndex, 'registeredAddress', addressIndex)
//                                                                                     }
//                                                                                 />
//                                                                             </div>
//                                                                         ))}
//                                                                         <div className="field label">
//                                                                             <div className="add-button" onClick={() => handleAddFieldCompanies(personIndex, 'address')}>
//                                                                                 <FontAwesomeIcon icon={faPlusCircle} /> Add More Registered Address
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </Grid>
//                                                     <Grid item xs={12}>
//                                                         <div className="field-group">
//                                                             <div className="field-group-row">
//                                                                 <div className="field-group-container">
//                                                                     <div className="scrollable-box">
//                                                                         {person.companiesDirectorsDTOS.map((directors, directorsIndex) => (
//                                                                             <div key={directorsIndex} className="field-group-column">
//                                                                                 <TextField
//                                                                                     style={{ width: '20%' }}
//                                                                                     label="Director Name"
//                                                                                     variant="standard"
//                                                                                     type="text"
//                                                                                     value={directors.directorName} // Update this line
//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handleInputChangeCompanies(personIndex, 'directorName', directorsIndex, event)
//                                                                                     }
//                                                                                 />
//                                                                                 <TextField
//                                                                                     style={{ width: '20%' }}
//                                                                                     label="DIN"
//                                                                                     variant="standard"
//                                                                                     type="text"
//                                                                                     value={directors.din} // Update this line
//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handleInputChangeCompanies(personIndex, 'din', directorsIndex, event)
//                                                                                     }
//                                                                                 />
//                                                                                 <FormControl style={{ width: '15%' }}>
//                                                                                     <InputLabel htmlFor="type">Designation</InputLabel>
//                                                                                     <Select
//                                                                                         label="Designation"
//                                                                                         variant="standard"
//                                                                                         value={directors.designationId.toString()}
//                                                                                         onChange={(event: SelectChangeEvent<string>) =>
//                                                                                             handleInputChangeCompanies(
//                                                                                                 personIndex,
//                                                                                                 'designationId',
//                                                                                                 directorsIndex,
//                                                                                                 event
//                                                                                             )
//                                                                                         }
//                                                                                     >
//                                                                                         {Designationlist.map((item) => (
//                                                                                             <MenuItem key={item.id} value={item.id.toString()}>
//                                                                                                 {item.name}
//                                                                                             </MenuItem>
//                                                                                         ))}
//                                                                                     </Select>
//                                                                                 </FormControl>
//                                                                                 <FormControl style={{ width: '15%' }}>
//                                                                                     <InputLabel htmlFor="type">Director Status</InputLabel>
//                                                                                     <Select
//                                                                                         label="Director Status"
//                                                                                         variant="standard"
//                                                                                         type="text"
//                                                                                         value={directors.companyMasterId.toString()}
//                                                                                         onChange={(event: SelectChangeEvent<string>) =>
//                                                                                             handleInputChangeCompanies(
//                                                                                                 personIndex,
//                                                                                                 'companyMasterId',
//                                                                                                 directorsIndex,
//                                                                                                 event
//                                                                                             )
//                                                                                         }
//                                                                                     >
//                                                                                         {companymaster.map((item) => (
//                                                                                             <MenuItem key={item.id} value={item.id.toString()}>
//                                                                                                 {item.name}
//                                                                                             </MenuItem>
//                                                                                         ))}
//                                                                                     </Select>
//                                                                                 </FormControl>
//                                                                                 <TextField
//                                                                                     label="Date of Appointment at Current Designation"
//                                                                                     variant="standard"
//                                                                                     type="date"
//                                                                                     name="dob"
//                                                                                     required
//                                                                                     value={directors.appointmentDate}
//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handleInputChangeCompanies(
//                                                                                             personIndex,
//                                                                                             'appointmentDate',
//                                                                                             directorsIndex,
//                                                                                             event
//                                                                                         )
//                                                                                     }
//                                                                                 />
//                                                                                 <TextField
//                                                                                     label="Date of Cessation"
//                                                                                     variant="standard"
//                                                                                     type="date"
//                                                                                     name="dob"
//                                                                                     required
//                                                                                     value={directors.cessationDate}

//                                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                                         handleInputChangeCompanies(personIndex, 'cessationDate', directorsIndex, event)
//                                                                                     }
//                                                                                 />
//                                                                                 <FontAwesomeIcon
//                                                                                     icon={faTrash}
//                                                                                     className="delete-icon"
//                                                                                     onClick={() => handleDeleteFieldCompanies(personIndex, 'din', directorsIndex)}
//                                                                                 />
//                                                                             </div>
//                                                                         ))}
//                                                                         <div className="field label">
//                                                                             <div className="add-button" onClick={() => handleAddFieldCompanies(personIndex, 'directors')}>
//                                                                                 <FontAwesomeIcon icon={faPlusCircle} /> Add More Directors & DIN
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </Grid>
//                                                 </Grid>
//                                                 <Grid item xs={12}>
//                                                     <Grid item xs={4}>
//                                                         <div className="key">
//                                                             <div className="field-group">
//                                                                 {person.companyDocumentsDTOS.map((field3, index3) => (
//                                                                     <form key={index3} encType="multipart/form-data">
//                                                                         <div className="person-container">
//                                                                             <div className="field-group-column">
//                                                                                 <FormControl style={{ width: '67%' }}>
//                                                                                     <InputLabel id={`demo-simple-select-label-${index3}`}>File Type</InputLabel>
//                                                                                     <Select
//                                                                                         labelId={`demo-simple-select-label-${index3}`}
//                                                                                         id={`demo-simple-select-${personIndex}-${index3}`}
//                                                                                         label="FileType"
//                                                                                         size="small"
//                                                                                         variant="standard"
//                                                                                         value={field3.documentTypeId || 0}
//                                                                                         onChange={(event) => handleSelectChange3(personIndex, index3, Number(event.target.value))}
//                                                                                     >
//                                                                                         {filetype3
//                                                                                             .filter((_, dataIndex1) => dataIndex1 === 4)
//                                                                                             .map((data) => (
//                                                                                                 <MenuItem key={data.id} value={data.id}>
//                                                                                                     {data.name}
//                                                                                                 </MenuItem>
//                                                                                             ))}
//                                                                                     </Select>
//                                                                                 </FormControl>
//                                                                                 <input
//                                                                                     id={`image-upload-input3-${personIndex}-${index3}`}
//                                                                                     type="file"
//                                                                                     onChange={(event) => handleFileChange3(personIndex, index3, event)}
//                                                                                     style={{ display: 'none' }}
//                                                                                     multiple
//                                                                                 />
//                                                                                 <Button
//                                                                                     size='small'
//                                                                                     variant="outlined"
//                                                                                     onClick={() =>
//                                                                                         handleChooseImagesClick3(
//                                                                                             personIndex,
//                                                                                             index3
//                                                                                         )
//                                                                                     }
//                                                                                 >
//                                                                                     Choose Images
//                                                                                 </Button>
//                                                                                 <TextField label="Image Name" type="text" size="small" variant="outlined" value={field3.imageName3} disabled />
//                                                                             </div>
//                                                                         </div>
//                                                                     </form>
//                                                                 ))}
//                                                             </div>
//                                                         </div>
//                                                     </Grid>
//                                                 </Grid>
//                                                 <Grid container spacing={2}>
//                                                     <Grid item xs={6}>
//                                                         <div className="field-group">
//                                                             <div className="field-group-row">
//                                                                 <div className="field-group-container">
//                                                                     <div className="scrollable-box">
//                                                                         {person.companyAssociationDTOS.map((permedia, permediaindex) => (
//                                                                             <div key={permediaindex} className="field-group-column">
//                                                                                 <TextareaAutosize
//                                                                                     style={{ minHeight: '100px', maxHeight: '250px', width: '100%', resize: 'none' }}
//                                                                                     placeholder="Type here..."
//                                                                                     autoFocus
//                                                                                     id="outlined-multiline-static"
//                                                                                     value={permedia.companyAssociation}
//                                                                                     onKeyPress={handleTextareaKeyPresss}
//                                                                                     onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
//                                                                                         handletPerMediaChangsse(personIndex, 'companyAssociation', permediaindex, event)
//                                                                                     }
//                                                                                     minRows={3}
//                                                                                 />
//                                                                             </div>
//                                                                         ))}
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </Grid>
//                                                     <Grid item xs={6}>
//                                                         <FormControlLabel
//                                                             control={
//                                                                 <Checkbox
//                                                                     checked={person.companyDTO.listAdverseInformation === 1}
//                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                         handleCheckboxChange(personIndex, 'listAdverseInformation', event.target.checked)
//                                                                     }
//                                                                 />
//                                                             }
//                                                             label="Adverse Information"
//                                                         />
//                                                         <FormControlLabel
//                                                             control={
//                                                                 <Checkbox
//                                                                     checked={person.companyDTO.listRegulatoryAction === 1}
//                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                         handleCheckboxChange(personIndex, 'listRegulatoryAction', event.target.checked)
//                                                                     }
//                                                                 />
//                                                             }
//                                                             label="Regulatory Action"
//                                                         />
//                                                         <FormControlLabel
//                                                             control={
//                                                                 <Checkbox
//                                                                     checked={person.companyDTO.listGovernment === 1}
//                                                                     onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
//                                                                         handleCheckboxChange(personIndex, 'listGovernment', event.target.checked)
//                                                                     }
//                                                                 />
//                                                             }
//                                                             label="Government"
//                                                         />
//                                                         <div>
//                                                             {errorMsgs && <div className="error-message" style={{ color: "red" }}>{errorMsgs}</div>}
//                                                         </div>
//                                                     </Grid>
//                                                 </Grid>
//                                             </div>
//                                         ))}
//                                         <div className="button-container">
//                                             <Button
//                                                 className="add-people"
//                                                 variant="contained"
//                                                 startIcon={<FontAwesomeIcon icon={faPlus} />}
//                                                 onClick={() => {
//                                                     setClickCount(prevCount => prevCount + 1);
//                                                     setformDatas({
//                                                         combinedDTO: [
//                                                             ...formDatas.combinedDTO,
//                                                             {
//                                                                 companyDTO: {
//                                                                     id: 0,
//                                                                     sourceLink: '',
//                                                                     associateMasterId: 0,
//                                                                     companyName: '',
//                                                                     listAdverseInformation: false,
//                                                                     listRegulatoryAction: false,
//                                                                     listGovernment: false,
//                                                                     originalDateOfAppointment: '',
//                                                                     typeId: 0,
//                                                                     cinfcrn: '',
//                                                                     document: '',
//                                                                 },
//                                                                 addressDTOS: [
//                                                                     {
//                                                                         id: 0,
//                                                                         companyId: 0,
//                                                                         registeredAddress: '',
//                                                                     },
//                                                                 ],
//                                                                 contactDTOS: [
//                                                                     {
//                                                                         companyId: 0,
//                                                                         emailID: '',
//                                                                     },
//                                                                 ],
//                                                                 companiesDirectorsDTOS: [
//                                                                     {
//                                                                         id: 0,
//                                                                         din: '',
//                                                                         companyId: 0,
//                                                                         directorId: 0,
//                                                                         designationId: 0,
//                                                                         companyMasterId: 0,
//                                                                         appointmentDate: '',
//                                                                         cessationDate: '',
//                                                                         designation: '',
//                                                                         directorStatus: '',
//                                                                         directorName: '',
//                                                                     },
//                                                                 ],
//                                                                 companyDocumentsDTOS: [
//                                                                     {
//                                                                         companyId: 0,
//                                                                         documentTypeId: 0,
//                                                                         documentType: '',
//                                                                         imageName3: '',
//                                                                         uid: 0,
//                                                                         files3: [],
//                                                                         path: [],
//                                                                         euid: 0,
//                                                                     },
//                                                                 ],
//                                                                 companyAssociationDTOS: [
//                                                                     {
//                                                                         id: 0,
//                                                                         companyId: 0,
//                                                                         companyAssociation: '',
//                                                                         uid: loginDetails.id,
//                                                                     },
//                                                                 ],
//                                                             },
//                                                         ],
//                                                     });
//                                                 }}
//                                             >
//                                                 Add List of Associated Companies
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Box>
//                     </div>
//                 </div >
//                 <div className="card-body">
//                     <Box m={1}>
//                         <div className="key">
//                             <div className="scroll-box">
//                                 <Grid item xs={12}>
//                                     <Grid item xs={4}>
//                                         <div className="key">
//                                             <div className="person-container">
//                                                 <div className="field-group">
//                                                     {fields.map((field, index) => (
//                                                         <form key={index} encType="multipart/form-data">
//                                                             <div className="person-container">
//                                                                 <div className="field-group-column">
//                                                                     <FormControl style={{ width: '50%' }}>
//                                                                         <InputLabel id={`demo-simple-select-label-${index}`}>File Type</InputLabel>
//                                                                         {filetype && filetype2.length > 0 && (
//                                                                             <Select
//                                                                                 labelId={`demo-simple-select-label-${index}`}
//                                                                                 id={`demo-simple-select-${index}`}
//                                                                                 label="FileType"
//                                                                                 type="text"
//                                                                                 size="small"
//                                                                                 variant="standard"
//                                                                                 value={filetype.length > 0 ? filetype[0].id : ''}
//                                                                                 onChange={(event) => handleSelectChange(event.target.value as string, index)}
//                                                                                 disabled={field.uploading}
//                                                                             >
//                                                                                 {filetype
//                                                                                     .filter((_, dataIndex) => dataIndex === 0) // Include only the first item
//                                                                                     .map((data) => (
//                                                                                         <MenuItem key={data.id} value={data.id}>
//                                                                                             {data.name}
//                                                                                         </MenuItem>
//                                                                                     ))}
//                                                                             </Select>
//                                                                         )}
//                                                                     </FormControl>
//                                                                     <input
//                                                                         id={`image-upload-input-${index}`}
//                                                                         type="file"
//                                                                         onChange={(event) => handleFileChange(index, event)}
//                                                                         style={{ display: 'none' }}
//                                                                         multiple
//                                                                     />
//                                                                     <Button variant="outlined" onClick={() => handleChooseImagesClick(index)}>Choose Images</Button>
//                                                                     <TextField label="Image Name" type="text" size="small" variant="outlined" value={field.imageName} disabled />
//                                                                 </div>
//                                                             </div>
//                                                         </form>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </Grid>
//                                 </Grid>
//                             </div>
//                         </div>
//                     </Box>
//                 </div>
//                 <div className="card-body">
//                     <Box m={1}>
//                         <div className="key">
//                             <div className="scroll-box">
//                                 <Grid item xs={12}>
//                                     <Grid item xs={4}>
//                                         <div className="key">
//                                             <div className="person-container">
//                                                 <div className="field-group">
//                                                     {fields1.map((field1, index) => (
//                                                         <form key={index} encType="multipart/form-data">
//                                                             <div className="person-container">
//                                                                 <div className="field-group-column">
//                                                                     <FormControl style={{ width: '50%' }}>
//                                                                         <InputLabel id={`demo-simple-select-label-${index}`}>File Type</InputLabel>
//                                                                         {filetype1 && filetype2.length > 0 && (
//                                                                             <Select
//                                                                                 labelId={`demo-simple-select-label-${index}`}
//                                                                                 id={`demo-simple-select-${index}`}
//                                                                                 label="FileType"
//                                                                                 type="text"
//                                                                                 size="small"
//                                                                                 variant="standard"
//                                                                                 value={filetype1.length > 0 ? filetype[1].id : ''}
//                                                                                 onChange={(event) => handleSelectChange1(event.target.value as string, index)}
//                                                                                 disabled={field1.uploading}>
//                                                                                 {filetype1
//                                                                                     .filter((_, dataIndex1) => dataIndex1 === 1) // Include only the first item
//                                                                                     .map((data) => (
//                                                                                         <MenuItem key={data.id} value={data.id}>
//                                                                                             {data.name}
//                                                                                         </MenuItem>
//                                                                                     ))}
//                                                                             </Select>
//                                                                         )}
//                                                                     </FormControl>
//                                                                     <input
//                                                                         id={`image-upload-input1-${index}`}
//                                                                         type="file"
//                                                                         onChange={(event) => handleFileChange1(index, event)}
//                                                                         style={{ display: 'none' }}
//                                                                         multiple
//                                                                     />
//                                                                     <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>Choose Images</Button>
//                                                                     <TextField label="Image Name" type="text" size="small" variant="outlined" value={field1.imageName1} disabled />
//                                                                 </div>
//                                                             </div>
//                                                         </form>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </Grid>
//                                 </Grid>
//                             </div>
//                         </div>
//                     </Box>
//                 </div>
//                 <div className="card-body">
//                     <Box m={3}>
//                         <div className="key">
//                             <div className="scroll-box">
//                                 <Grid item xs={12}>
//                                     <Grid item xs={4}>
//                                         <div className="key">
//                                             {fields2.map((field2, index) => (
//                                                 <form key={index} encType="multipart/form-data">
//                                                     <div className="person-container">
//                                                         <div className="field-group-column">
//                                                             <FormControl style={{ width: '50%' }}>
//                                                                 <InputLabel id={`demo-simple-select-label-${index}`}>File Type</InputLabel>
//                                                                 {filetype2 && filetype2.length > 0 && (
//                                                                     <Select
//                                                                         labelId={`demo-simple-select-label-${index}`}
//                                                                         id={`demo-simple-select-${index}`}
//                                                                         label="FileType"
//                                                                         type="text"
//                                                                         size="small"
//                                                                         variant="standard"
//                                                                         value={filetype2.length > 0 ? filetype[2].id : ''}
//                                                                         onChange={(event) => handleSelectChange2(event.target.value as string, index)}
//                                                                         disabled={field2.uploading}>
//                                                                         {filetype2
//                                                                             .filter((_, dataIndex2) => dataIndex2 === 2)
//                                                                             .map((data) => (
//                                                                                 <MenuItem key={data.id} value={data.id}>
//                                                                                     {data.name}
//                                                                                 </MenuItem>
//                                                                             ))}
//                                                                     </Select>
//                                                                 )}
//                                                             </FormControl>
//                                                             <input
//                                                                 id={`image-upload-input2-${index}`}
//                                                                 type="file"
//                                                                 onChange={(event) => handleFileChange2(index, event)}
//                                                                 style={{ display: 'none' }}
//                                                                 multiple
//                                                             />
//                                                             <Button variant="outlined" onClick={() => handleChooseImagesClick2(index)}>Choose Images</Button>
//                                                             <Grid xs={2}>
//                                                                 <TextField label="Image Name" type="text" size="small" variant="outlined" value={field2.imageName2} disabled />
//                                                             </Grid>
//                                                         </div>
//                                                     </div>
//                                                 </form>
//                                             ))}
//                                         </div>
//                                     </Grid>
//                                 </Grid>
//                             </div>
//                         </div>
//                     </Box>
//                 </div>
//                 <div className="card-body">
//                     <Box m={3}>
//                         <div className="key">
//                             <div className="scroll-box">
//                                 <Grid item xs={12}>
//                                     <Grid item xs={4}>
//                                         <div className="key">
//                                             {fields4.map((field4, index) => (
//                                                 <form key={index} encType="multipart/form-data">
//                                                     <div className="person-container">
//                                                         <div className="field-group-column">
//                                                             <FormControl style={{ width: '50%' }}>
//                                                                 <InputLabel id={`demo-simple-select-label-${index}`}>File Type</InputLabel>
//                                                                 {filetype4 && filetype2.length > 0 && (
//                                                                     <Select
//                                                                         labelId={`demo-simple-select-label-${index}`}
//                                                                         id={`demo-simple-select-${index}`}
//                                                                         label="FileType"
//                                                                         type="text"
//                                                                         size="small"
//                                                                         variant="standard"

//                                                                         // value={fields4[index].fileType}
//                                                                         value={filetype4.length > 0 ? filetype[3].id : ''}
//                                                                         onChange={(event) => handleSelectChange4(event.target.value as string, index)}
//                                                                         disabled={field4.uploading}>
//                                                                         {filetype4
//                                                                             .filter((_, dataIndex3) => dataIndex3 === 3) // Include only the first item
//                                                                             .map((data) => (
//                                                                                 <MenuItem key={data.id} value={data.id}>
//                                                                                     {data.name}
//                                                                                 </MenuItem>
//                                                                             ))}
//                                                                     </Select>)}
//                                                             </FormControl>
//                                                             <input
//                                                                 id={`image-upload-input4-${index}`}
//                                                                 type="file"
//                                                                 onChange={(event) => handleFileChange4(index, event)}
//                                                                 style={{ display: 'none' }}
//                                                                 multiple
//                                                             />
//                                                             <Button variant="outlined" onClick={() => handleChooseImagesClick4(index)}>Choose Images</Button><Grid xs={2}>
//                                                                 <TextField label="Image Name" type="text" size="small" variant="outlined" value={field4.imageName4} disabled />
//                                                             </Grid>
//                                                         </div>
//                                                     </div>
//                                                 </form>
//                                             ))}
//                                         </div>
//                                     </Grid>
//                                 </Grid>
//                             </div>
//                         </div>
//                     </Box>
//                 </div>
//                 < div>
//                     <Box m={4}>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={async () => {
//                                 const success = await handleSubmit(0, 0, 0, 0, 0, 0, '');
//                                 if (success) {
//                                     setDisabled(true);
//                                     navigate(`/details/:taskId`);
//                                 }
//                             }}
//                             onKeyPress={handleKeyPress}
//                             disabled={disabled}
//                         >
//                             Submit
//                         </Button>
//                     </Box>
//                 </div >
//             </Box >
//         </>
//     );
// };
// export default Details;


