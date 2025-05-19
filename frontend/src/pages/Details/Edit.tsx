import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Box, TextField, Grid, Button, InputLabel, FormControl, Select, MenuItem, FormControlLabel, Checkbox, Container, Paper, Typography, TextareaAutosize } from '@mui/material';
import { Button as BootstrapButton } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { useLocation } from 'react-router-dom';
import './Details.css';
import CustomerRequestApiService from '../../data/services/customerrequest/customerrequest-api-services';
import RelativeApiService from '../../data/services/master/relative/relative-api-serivces';
import StateApiService from '../../data/services/master/State/state_api_service';
import CountryApiService from '../../data/services/master/Country/country_api_service';
import AssociatedListApiService from '../../data/services/AssociatedList/associatedlist-api-service';
import Header from '../../layouts/header/header';
import { useParams } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddressApiService from '../../data/services/insert/address-api-service';
import { useSelector } from 'react-redux';
import { AddressDTO, AkaDetRequest, AssociatedlistPayload, CompaniesDirectorsDTO, CompanyDTO, ContactDTO, PartyPayload, PartysPayload, CompanyMasterPayload, Country, CustomerRequest, Emailids, Father, Mother, NumberofHUTs, OtherAssociationRequest, PartyRequest, Payload, Payloads, PhoneNumbers, Relative, RelativePayload, Spouse, State, DesignationPayload, RelativeCombineDTO, Gender, FamilyPayload, SpouseFamilyPayload, ListOfCompanyPayload } from '../../data/services/viewpage/viewpagedetails-payload';
import EditDetailsApiService from '../../data/services/editdetails/editdetails-api-service';
import FileUpload from '../../data/services/Fileupload/fileupload_api_service';
import searchIdentifyApiService from '../../data/services/searchIdentify/searchIdentify_api_service';
import { searchIdentify } from '../../data/services/searchIdentify/searchIdentify_payload';
import DesignationService from '../../data/services/master/designation/designation_api_service';
import { Form, Card, Col, Row, Image } from 'react-bootstrap';
import PartyApiService from '../../data/services/master/party/party_api_serivces';
import CompanyMasterApiService from '../../data/services/master/companymaster/companymaster_api_service';
import GenderApiService from '../../data/services/master/Gender/gender_api_service';
import ViewPageDetailsService from '../../data/services/viewpage/viewpagedetails-api-service';
import PdfModal from './displayPDF';
import FileEditCompany from './FileEditCompany';

interface UpdateCheckingData {
  customerRequestEdit?: boolean;
  perMediaForm?: boolean;
  akaDetRequest?: boolean;
  contactEmailEdit?: boolean;
  familyEdit?: boolean;
  spouseFamilyEdit?: boolean;
  relativeformDataEdit?: boolean;
  partyEdit?: boolean;
  listofAssociatedCompaniesEdit?: boolean;
}

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
  [key: string]: any;
}

interface FieldState3 {
  imageName3: string;
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

interface FieldState4 {
  imageName4: string;
  fileType: string;
  uploading: boolean;
  uploadSuccess: boolean;
}

const Details: React.FC = () => {

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

  interface CompanyData {
    id: number;
    companyId: number;
    pathId: number;
    documentType: string;
    concatenated: string;
    companyName: string;
    url: string;
  };

  interface Company {
    companyId: number;
    directorId: number;
    companyName: string;
    documentId: number;
  };

  const location = useLocation();
  const { pepId, uid } = useParams();

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
  const [PhoneNumberss, setPhoneNumberss] = useState<PhoneNumbers[]>([{ pepId: 0, communicationDt: '', communicationTypeId: 0 }]);
  const [Emailidss, setEmailidss] = useState<Emailids[]>([{ pepId: 0, communicationDt: '', communicationTypeId: 0 }]);
  const [includeCustomerRequest, setIncludeCustomerRequest] = useState(false);
  const [includeAkaDetRequest, setIncludeAkaDetRequest] = useState(false);
  const customer = new CustomerRequestApiService();
  const [includeNumberofHUTss, setNumberofHUT] = useState(false);
  const [includePhoneNumber, setPhoneNumber] = useState(false);
  const [includeEmailidss, setEmailids] = useState(false);
  const [includeRelativeformDatar, setincludeRelativeFormData] = useState(false);
  const [includeformDatas, setincludeformDatas] = useState(false);
  const [includePartyformData, setincludePartyformData] = useState(false);
  const [includePerMediaform, setincludePerMediaform] = useState(false);
  const [includeimage2, setincludeimage2] = useState(false);
  const [includeimage1, setincludeimage1] = useState(false);
  const [includeimage, setincludeimage] = useState(false);
  const [includeimage3, setincludeimage3] = useState(false);
  const [includeFamilyformData, setincludeFamilyformData] = useState(false);
  const [includeSpouseFamilyformData, setincludeSpouseFamilyformData] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const editdetailsApiService = new EditDetailsApiService();
  const queryParams = new URLSearchParams(location.search);
  const hideHeaderParam = queryParams.get('hideHeader');
  const isHeaderVisible = hideHeaderParam !== 'true';

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
            childrenName: '',
            relativeId: 0,
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

  const [relative, setRelative] = useState<Relative[]>([]);

  const [PartyformData, setPartyFormData] = useState<PartysPayload>({
    partyCommonDto: [
      {
        partyCandidateDetailsDTO: {
          pepId: 0,
          otherInformation: '',
          positionInTheGovernment: '',
          died: '',
          permanentAddress: "",
        },
        partyDetailsDTO: [
          {
            pepId: 0,
            partyMasterId: 0,
            formerAndCurrent: '',
            partyCandidateId: 0,
            positionInTheParty: '',
          },
        ],
      },
    ],
  });

  const relatives = new RelativeApiService();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedState, setselectedState] = useState<string[]>(['']);
  const [states, setStates] = useState<State[]>([]);
  const authService = new StateApiService();
  const [data, setData] = useState<searchIdentify[]>([]);
  const countryService = new CountryApiService();

  // useEffect(() => {
  //   fetchData();
  //   fetchListOfCompany();
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
      fetchListOfCompany();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const fetchData = async () => {
    try {
      const apiService = new searchIdentifyApiService();
      const response = await apiService.getSearchIdentify(loginDetails.id);
      setData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deactiveRelativeId = async (pepId: string, euid: number, relativeMasterId: string) => {
    try {
      const response = await editdetailsApiService.deactivateRelativeId(pepId, euid, relativeMasterId);
      return response;
    } catch (error) {
      console.log('Error deactivating the relativeId:', error);
      throw error;
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

  const [formDatas, setformDatas] = useState<Payload>({
    combinedDTO: [
      {
        companyDTO: {
          id: 0,
          associateMasterId: 0,
          companyName: '',
          sourceLink: '',
          originalDateOfAppointment: '',
          listAdverseInformation: 0,
          listRegulatoryAction: 0,
          listGovernment: 0,
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
            uid: 0,
          },
        ],
      },
    ],
  });

  const [associatedList, setAssociatedList] = useState<AssociatedlistPayload[]>([]);
  const associatedListService = new AssociatedListApiService();
  const [PerMediaformData, setPerMediaData] = useState<OtherAssociationRequest[]>([{ otherAssociationAsPerMedia: '' }]);
  const genderService = new GenderApiService();
  const [gender, setgender] = useState<Gender[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [euid, setPepId] = useState<string>('');
  const fileUpload = new FileUpload();
  const [fileTypes, setFileTypes] = useState<FileType[]>([]);
  const [filetype, Setfiletype] = useState<FileType[]>([]);
  const [filetype1, setFiletype1] = useState<FileType[]>([]);
  const [filetype2, setFiletype2] = useState<FileType[]>([]);
  const [filetype3, setFiletype3] = useState<FileType[]>([]);
  const [filetype4, setFiletype4] = useState<FileType[]>([]);
  const [filteredFileTypes, setFilteredFileTypes] = useState<FileType[]>([]);
  const [fields, setFields] = useState<FieldState[]>([initialFieldState]);
  const [fields1, setFields1] = useState<FieldState1[]>([initialFieldState1]);
  const [fields2, setFields2] = useState<FieldState2[]>([initialFieldState2]);
  const [fields3, setFields3] = useState<FieldState3[]>([initialFieldState3]);
  const [fields4, setFields4] = useState<FieldState4[]>([initialFieldState4]);
  const partyservices = new PartyApiService();
  const [Party, setparty] = useState<PartyPayload[]>([]);
  const [selectedParty, setselecteParty] = useState<string[]>(['']);
  const companymasterservices = new CompanyMasterApiService();
  const [companymaster, setcompanymaster] = useState<CompanyMasterPayload[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [Designationlist, setDesignationlist] = useState<DesignationPayload[]>([]);
  const DesignationlistService = new DesignationService();
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const countryName = sessionStorage.getItem('countryName');
  const stateName = sessionStorage.getItem('stateName');
  const [panError, setPanError] = useState('');
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [panErrors, setPanErrors] = useState<string[]>([]);
  const [isValidInput, setIsValidInput] = useState(true);
  const [relativePanTouched, setRelativePanTouched] = useState(false);
  const [spousePanTouched, setSpousePanTouched] = useState(false);
  const [childrenPanTouched, setChildrenPanTouched] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [touchedFields, setTouchedFields] = useState<boolean[]>([false]);
  const [touched, setTouched] = useState(false);
  const [motherPanErrors, setmotherPanErrors] = useState<string[]>([]);
  const [fatherPanErrors, setfatherPanErrors] = useState<string[]>([]);
  const [HUFPanErrors, setHUFPanErrors] = useState<string[]>([]);
  const [listOfCompanyDetails, setListOfCompany] = useState<ListOfCompanyPayload[]>([]);

  useEffect(() => {
    const fetchCustomer = async (pepId: string, uid: string) => {
      try {
        const customerData = await customer.getcustomer(pepId);
        requestAnimationFrame(() => {
          if (customerData.createCustomerRequest) {
            const {
              name,
              sourceLink,
              education,
              dob,
              placeOfBirth,
              pan,
              directorsIdentificationNumber,
              genderId,
              createdAt,
              adverseInformation,
              regulatoryAction
            } = customerData.createCustomerRequest;
            setFormData({
              name: name || '',
              sourceLink: sourceLink || '',
              education: education || '',
              placeOfBirth: placeOfBirth || '',
              dob: dob || '',
              pan: pan || '',
              genderId: genderId || '',
              directorsIdentificationNumber: directorsIdentificationNumber || '',
              uid: uid,
              createdAt: createdAt || '',
              adverseInformation: adverseInformation || '',
              regulatoryAction: regulatoryAction
            });
          }
          {
            formData.sourceLink && (
              <a href={formData.sourceLink} target="_blank" rel="noopener noreferrer">
                {formData.sourceLink}
              </a>
            )
          }
          if (customerData.akaDetDataList) {
            setAkaFormData(
              customerData.akaDetDataList.map((aka: { akaName: string }) => ({ akaName: aka.akaName || '' }))
            );
          }
          if (customerData.otherAssociationDataList) {
            setPerMediaData(
              customerData.otherAssociationDataList.map((aka: { otherAssociationAsPerMedia: string }) => ({ otherAssociationAsPerMedia: aka.otherAssociationAsPerMedia || '' }))
            );
          }
          if (customerData.combinedDTO) {
            setformDatas({
              combinedDTO: customerData.combinedDTO
            });
          }
          if (customerData.Relative) {
            setRelative(
              customerData.Relative.map((aka: { name: string }) => ({ name: aka.name || '' }))
            );
          }
          if (customerData.contactsDetailsDataList) {
            setPhoneNumberss(
              customerData.contactsDetailsDataList
                .filter((PhoneNumbers: PhoneNumbers) => PhoneNumbers.communicationTypeId === 1)
                .map((PhoneNumbers: PhoneNumbers) => ({
                  communicationTypeId: 1,
                  communicationDt: PhoneNumbers.communicationDt || '',
                }))
            );
            setEmailidss(
              customerData.contactsDetailsDataList
                .filter((Email: Emailids) => Email.communicationTypeId === 2)
                .map((Email: Emailids) => ({
                  communicationTypeId: 2,
                  communicationDt: Email.communicationDt || '',
                }))
            );
            if (customerData.relativeCombineDTOList) {
              setRelativeFormData({
                relativeCombineDTO: customerData.relativeCombineDTOList,
              });
            }
            if (customerData.familyCombinedDTOList) {
              setFamilyFormData({
                familyCombinedDTO: customerData.familyCombinedDTOList

              });
            }
            if (customerData.spouseCommonDTOList) {
              setSpouseFamilyFormData({
                spouseCommonDTO: customerData.spouseCommonDTOList

              });
            }
            if (customerData.partyCommonDtoList) {
              setPartyFormData({
                partyCommonDto: customerData.partyCommonDtoList
              });
            }
          }
        });
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };
    fetchRelative();
    fetchDesignationList();
    setSelectedCountry('');
    fetchfiletype();
    fetchStates();
    fetchCountries();
    fetchAssociatedList();
    fetchComapnymasterlist();
    fetchPartylist();
    fetchfiletype();
    fetchgender();

    if (pepId && uid) {
      fetchCustomer(pepId, uid);
    }
    window.scrollTo(0, 0);
  }, [pepId, uid]);

  const fetchDesignationList = async () => {
    try {
      const designationlistData = await DesignationlistService.getDesignation();
      setDesignationlist(designationlistData);
    } catch (error) {
      console.error('Error fetching designation list:', error);
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

  const fetchgender = async () => {
    try {
      const gender = await genderService.getGender();
      setgender(gender);
    } catch (error) {
      console.error("Error fetching gender:", error);
    }
  };

  const fetchfiletype = async () => {
    try {
      const response: FileType[] = await fileUpload.getfiletype();
      const response1: FileType[] = await fileUpload.getfiletype1();
      const response2: FileType[] = await fileUpload.getfiletype2();
      const response3: FileType[] = await fileUpload.getfiletype3();
      setFiletype1(response1);
      setFiletype2(response2);
      setFiletype3(response3);
      Setfiletype(response);
    } catch (error) {
      console.error('Error fetching filetype:', error);
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

  const isValidPAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    return panRegex.test(pan);
  };

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
      setFormData((prevData) => ({
        ...prevData,
        [name]: limitedValue,
      }));
      setPanError(isValid ? '' : 'Invalid PAN Format');
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
    } else if (name in PartyformData) {
      setPartyFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handlegender = (event: SelectChangeEvent<string>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      genderId: parseInt(event.target.value, 10),
    }));
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

  const handleRemoveBoxPhoneNumbers = (index: number) => {
    const updatedPhoneNumberss = [...PhoneNumberss];
    updatedPhoneNumberss.splice(index, 1);
    setPhoneNumberss(updatedPhoneNumberss);
  };

  const handleAddPhoneNumbersNameField = () => {
    setPhoneNumberss([...PhoneNumberss, { pepId: 0, communicationDt: '', communicationTypeId: 4 }]);
  };

  const handlePhoneNumbersNameChange = (value: string, index: number) => {
    const updatedPhoneNumberss = [...PhoneNumberss];
    updatedPhoneNumberss[index].communicationDt = value;
    setPhoneNumberss(updatedPhoneNumberss);
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
  };

  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name === 'includeCustomerRequest') {
      setIncludeCustomerRequest(checked);
    } else if (name === 'includeAkaDetRequest') {
      setIncludeAkaDetRequest(checked);
    } else if (name === 'includePhoneNumber') {
      setPhoneNumber(checked);
    } else if (name === 'includeEmailids') {
      setEmailids(checked);
    }
    else if (name === 'includeRelativeFormData') {
      setincludeRelativeFormData(checked);
    }
    else if (name === 'includeFamilyformData') {
      setincludeFamilyformData(checked);
    }
    else if (name === 'includeSpouseFamilyformData') {
      setincludeSpouseFamilyformData(checked);
    }
    else if (name === 'includeformDatas') {
      setincludeformDatas(checked);
    }
    else if (name === 'includePartyformData') {
      setincludePartyformData(checked);
    }
    else if (name === 'includePerMediaform') {
      setincludePerMediaform(checked);
    }
    else if (name === 'includeimage2') {
      setincludeimage2(checked);
    }
    else if (name === 'includeimage1') {
      setincludeimage1(checked);
    }
    else if (name === 'includeimage') {
      setincludeimage(checked);
    }
    else if (name === 'includeimage3') {
      setincludeimage3(checked);
    }
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
    } else if (fieldType === 'children') {
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

  const fetchRelative = async () => {
    try {
      const relativeData = await relatives.getRelative();
      setRelative(relativeData);
    }
    catch (error) {
      console.error("Error fetching associated list:", error);
    }
  };

  const handlerelativeChange = (personIndex: number, value: any) => {
    const updatedPeople = JSON.parse(JSON.stringify(RelativeformData));
    updatedPeople.relativeCombineDTO[personIndex].relativeDTO.relativeMasterId = value;
    setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
    onSelect(value);
  };

  const onSelect = async (value: any) => {
    const { relativeCombineDTO } = RelativeformData;
    const firstRelativeDTO = relativeCombineDTO[0]?.relativeDTO;
    const relativeMasterId = firstRelativeDTO?.relativeMasterId;
    const euid = 1;
    if (pepId && euid && relativeMasterId) {
      try {
        await deactiveRelativeId(pepId, euid, relativeMasterId);
      } catch (error) {
        console.error('Error deactivating relative:', error);
      }
    } else {
      console.error('One or more of the required IDs is undefined.');
    }
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

  const fetchAssociatedList = async () => {
    try {
      const associatedListData = await associatedListService.getAssociatedList();
      setAssociatedList(associatedListData);
    } catch (error) {
      console.error('Error fetching associated list:', error);
    }
  };

  const handleInputChangeCompanies = (
    personIndex: number,
    field:
      | keyof Payload['combinedDTO'][0]['companyDTO']
      | keyof Payload['combinedDTO'][0]['contactDTOS'][0]
      | keyof Payload['combinedDTO'][0]['addressDTOS'][0]
      | keyof Payload['combinedDTO'][0]['companiesDirectorsDTOS'][0],
    index: number | null,
    event: React.ChangeEvent<{ value: unknown }> | SelectChangeEvent<string>
  ) => {
    const updatedPeople = [...formDatas.combinedDTO];
    const updateContactField = (index: number, field: keyof ContactDTO) => {
      updateNestedField(updatedPeople[personIndex].contactDTOS, index, field, event.target.value as string);
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
      } else if (field === 'appointmentDate') {
        updateDirectorsField(index, field);
      }
      else if (field === 'cessationDate') {
        updateDirectorsField(index, field);
      }
      else if (field === 'designationId') {
        updateDirectorsField(index, field);
      }
      else if (field === 'companyMasterId') {
        updateDirectorsField(index, field);
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

  const getFieldInputType = (field: string): string => {
    switch (field) {
      case 'cinfcrn':
      case 'companyName':
      case 'designation':
      case 'originalDateOfAppointment':
      case 'dateOfAppointmentAtCurrentDesignation':
      case 'dateOfCessation':
        return 'text';
      default:
        return 'text';
    }
  };

  const convertInputValue = (value: string, type: string): any => {
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
  };

  const handleRemoveBoxtPerMedia = (index: number) => {
    setPerMediaData(prevData => {
      const updatedPerMedia = [...prevData];
      updatedPerMedia.splice(index, 1);
      return updatedPerMedia;
    });
  };

  const handleAddtPerMediaField = () => {
    console.log('Add More Command clicked');

    setPerMediaData(prevData => [...prevData, { otherAssociationAsPerMedia: '' }]);
  };

  const handletPerMediaChange = (value: string, index: number) => {
    setPerMediaData(prevData =>
      prevData.map((item, idx) => idx === index ? { ...item, otherAssociationAsPerMedia: value } : item)
    );
  };
  const uniquePerMediaData = Array.from(
    new Set(PerMediaformData.map(item => JSON.stringify(item)))
  ).map(item => JSON.parse(item));

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === 'Enter') {
      handleEdit('pepId', 'uid', 0, 0, 0, 0, 0, 0, '');
    }
  };

  const uploadImage = async (filesArray: File[], index: number) => {
    try {
      console.log(`Uploading images for index ${index}:`, filesArray);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };
  const handleCheckboxChang = (event: { target: { name: any; checked: any; }; }) => {
    const { name, checked } = event.target;
    setUpdateCheckingData(prevState => ({
      ...prevState,
      [name]: checked ? 1 : 0
    }));
  };

  const [clickCount, setClickCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [checkboxError, setCheckboxError] = useState<string>('');
  const [updateCheckingData, setUpdateCheckingData] = useState<UpdateCheckingData>({
    customerRequestEdit: false,
    perMediaForm: false,
    akaDetRequest: false,
    contactEmailEdit: false,
    familyEdit: false,
    spouseFamilyEdit: false,
    relativeformDataEdit: false,
    partyEdit: false,
    listofAssociatedCompaniesEdit: false
  });
  const handleEdit = async (pepId: string, uid: string,
    index: number,
    index1: number,
    index2: number,
    personIndex: number,
    index3: number,
    index4: number,
    cinfcrn: string
  ) => {
    try {
      const isAnyCheckboxSelected =
        updateCheckingData ||

        includeRegulatoryAction ||
        includeAdverseInformation ||
        includeListAdverseInformation ||
        includeListRegulatoryAction ||
        includeGovernment ||
        includeformDatas ||

        includeNumberofHUTss ||
        includePhoneNumber ||
        includeEmailidss ||
        includeRelativeformDatar ||
        includeformDatas ||
        includePartyformData ||

        includeimage2 ||
        includeimage1 ||
        includeimage ||
        includeimage3;
      if (!isAnyCheckboxSelected) {
        setCheckboxError('Please select at least any one checkbox to Edit ');
        return;
      }
      const companySizes = clickCount;
      const pepDetailsWriteDTO = {
        combinedDTO: updateCheckingData
          ? formDatas.combinedDTO?.map((person) => ({
            companyDTO: {
              ...person.companyDTO,
              listAdverseInformation: person.companyDTO.listAdverseInformation ? 1 : 0,
              listRegulatoryAction: person.companyDTO.listRegulatoryAction ? 1 : 0,
              listGovernment: person.companyDTO.listGovernment ? 1 : 0,
            },
            addressDTOS: person.addressDTOS?.map((address) => ({ ...address })) || [],
            contactDTOS: person.contactDTOS?.map((contact) => ({ ...contact })) || [],
            companiesDirectorsDTOS: person.companiesDirectorsDTOS?.map((directors) => ({ ...directors })) || [],
            companyDocumentsDTOS: person.companyDocumentsDTOS?.map((doc) => ({ ...doc })) || [],
            companyAssociationDTOS: person.companyAssociationDTOS.map((permedia) => ({ ...permedia })),
          }))
          : [],


        updateCheckingData: {
          customerRequestEdit: updateCheckingData.customerRequestEdit ? 1 : 0,
          perMediaForm: updateCheckingData.perMediaForm ? 1 : 0,
          akaDetRequest: updateCheckingData.akaDetRequest ? 1 : 0,
          contactEmailEdit: updateCheckingData.contactEmailEdit ? 1 : 0,
          familyEdit: updateCheckingData.familyEdit ? 1 : 0,
          spouseFamilyEdit: updateCheckingData.spouseFamilyEdit ? 1 : 0,
          relativeformDataEdit: updateCheckingData.relativeformDataEdit ? 1 : 0,
          partyEdit: updateCheckingData.partyEdit ? 1 : 0,
          listofAssociatedCompaniesEdit: updateCheckingData.listofAssociatedCompaniesEdit ? 1 : 0,
        },



        updateCustomerRequest: updateCheckingData
          ? {
            name: formData.name,
            sourceLink: formData.sourceLink,
            education: formData.education,
            dob: formData.dob,
            pan: formData.pan,

            directorsIdentificationNumber: formData.directorsIdentificationNumber,
            regulatoryAction: formData.regulatoryAction,
            adverseInformation: formData.adverseInformation,

            genderId: formData.genderId,
            placeOfBirth: formData.placeOfBirth,
            uid: loginDetails.id,
          }
          : {},


        createAkaDetRequest: updateCheckingData
          ? akaformData.map((aka) => ({
            akaName: aka.akaName,
            uid: loginDetails.id,
          }))
          : [],
        createContactsDetailsRequest:
          updateCheckingData
            ? [
              ...PhoneNumberss.map((PhoneNumber) => ({
                id: PhoneNumber.pepId,
                pepId: PhoneNumber.pepId,
                communicationTypeId: 1,
                communicationDt: PhoneNumber.communicationDt,
                uid: loginDetails.id,
              })),
              ...Emailidss.map((Emailids) => ({
                id: Emailids.pepId,
                pepId: Emailids.pepId,
                communicationTypeId: 2,
                communicationDt: Emailids.communicationDt,
                uid: loginDetails.id,
              })),
            ]
            : [],

        partyCommonDtoList: updateCheckingData
          ? PartyformData.partyCommonDto
          : [],
        createOtherAssociationRequest: updateCheckingData
          ? PerMediaformData.map((person) => ({
            otherAssociationAsPerMedia: person.otherAssociationAsPerMedia,
            uid: loginDetails.id,
          }))
          : [],
        relativeCombineDTOList: updateCheckingData
          ? RelativeformData.relativeCombineDTO
          : [],
        familyCombinedDTOList: updateCheckingData
          ? FamilyformData.familyCombinedDTO
          : [],
        spouseCommonDTOList: updateCheckingData
          ? SpouseFamilyformData.spouseCommonDTO
          : [],
      };
      const uid = loginDetails.id;
      console.log('pepDetailsWriteDTO:', pepDetailsWriteDTO); // Log filtered data
      console.log('checkboxValues:', updateCheckingData); // Log filtered data
      const numericFileTypeId: number = parseInt(fields[index].fileType, 10) || 1;
      const numericFileTypeId1: number = parseInt(fields1[index1].fileType, 10) || 2;
      const numericFileTypeId2: number = parseInt(fields2[index2].fileType, 10) || 3;
      const numericFileTypeId4: number = parseInt(fields4[index4].fileType, 10) || 4;
      const fileInput = document.getElementById(`image-upload-input-${index}`) as HTMLInputElement;
      const filesArray: File[] = fileInput?.files ? Array.from(fileInput.files) : [];
      const fileInput1 = document.getElementById(`image-upload-input1-${index1}`) as HTMLInputElement;
      const filesArray1: File[] = fileInput1?.files ? Array.from(fileInput1.files) : [];
      const fileInput2 = document.getElementById(`image-upload-input2-${index2}`) as HTMLInputElement;
      const filesArray2: File[] = fileInput2?.files ? Array.from(fileInput2.files) : [];
      const fileInput4 = document.getElementById(`image-upload-input4-${index4}`) as HTMLInputElement;
      const filesArray4: File[] = fileInput4?.files ? Array.from(fileInput4.files) : [];
      if (includeimage && filesArray.length > 0) {
        await uploadImage(filesArray, index);
      }
      if (includeimage1 && filesArray1.length > 0) {
        await uploadImage(filesArray1, index1);
      }
      if (includeimage2 && filesArray2.length > 0) {
        await uploadImage(filesArray2, index2);
      }
      if (includeimage3 && filesArray4.length > 0) {
        await uploadImage(filesArray4, index4);
      }
      const companyDocumentArray: File[] = [];
      const pathArray: number[] = [];
      const companyArray: string[] = [];
      for (let i = 0; i <= companySizes; i++) {
        let fileInput3 = document.getElementById(`image-upload-input3-${i}-${index3}`) as HTMLInputElement;
        let cinfcrn = document.getElementById(`cinfcrn-${i}`) as HTMLInputElement;
        if (fileInput3 && fileInput3.files) {
          const filesArray3: File[] = Array.from(fileInput3.files);
          const updatedPeople = { ...formDatas };
          const filePathValue: string | undefined = updatedPeople.combinedDTO?.[i]?.companyDocumentsDTOS?.[index3]?.path?.join('') ?? '';
          const cinfcrnValue: string = cinfcrn.value;
          companyDocumentArray.push(...filesArray3);
          pathArray.push(parseInt(filePathValue, 10));
          companyArray.push(cinfcrnValue);
        }
      }

      const response = await editdetailsApiService.updateCustomer(
        pepDetailsWriteDTO,
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
        companyArray,
        pepId,
        uid
      );
      setSubmissionSuccess(true);
      setCheckboxError('');

      // Close the tab
      window.close();
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  const handleInputChangeFamily = (
    personIndex: number,
    field: 'relativeName' | 'pan' | 'childrenName' | 'name' | 'childrenPan',
    index: number | null,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedPeople = JSON.parse(JSON.stringify(RelativeformData));
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
      }
    } else {
      if (field === 'relativeName' || field === 'pan') {
        updatedPeople.relativeCombineDTO[personIndex].relativeDTO[field] = event.target.value;
      }
    }
    setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
  };

  const handleInputChangchilderpan = (
    personIndex: number,
    field: 'pan' | 'childrenName',
    index: number | null,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedPeople = JSON.parse(JSON.stringify(RelativeformData));
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
        updatedPeople.relativeCombineDTO[personIndex].relativeChildrenDTOS[index][field] = event.target.value;
      }
    }
    setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
  };

  const handlePartyformDataChange = (
    personIndex: number,
    index: number | null,
    field: 'partyMasterId' | 'formerAndCurrent' | 'positionInTheParty',
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<number>
  ) => {
    const updatedPeople = JSON.parse(JSON.stringify(PartyformData));
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
    setPartyFormData({ partyCommonDto: updatedPeople.partyCommonDto });
  };


  const handleDeleteparty = (
    personIndex: number,
    field1: 'formerAndCurrent' | 'positionInTheParty',
    index: number
  ) => {
    const updatedPeople = [...PartyformData.partyCommonDto];
    if (field1 === 'formerAndCurrent' || field1 === 'positionInTheParty') {
      updatedPeople[personIndex].partyDetailsDTO.splice(index, 1);
    }
    setPartyFormData({ partyCommonDto: updatedPeople });
  };


  const handleAddFieldpartydetails = (personIndex: number, fieldType: 'party') => {
    const updatedPeople = { ...PartyformData };

    if (fieldType === 'party') {
      updatedPeople.partyCommonDto[personIndex].partyDetailsDTO.push({
        pepId: 0,
        partyMasterId: 0,
        formerAndCurrent: '',
        partyCandidateId: 0,
        positionInTheParty: '',
      });

    };
    setPartyFormData({ partyCommonDto: updatedPeople.partyCommonDto });

  };

  const handleRemovePartyformstate = (index: number) => {
    setPartyFormData((prevState) => {
      const newPartyCommonDto = [...prevState.partyCommonDto];
      newPartyCommonDto.splice(index, 1);
      return { ...prevState, partyCommonDto: newPartyCommonDto };
    });
  };

  const handlePositionintheGovernmentChange = (value: string) => {
    setPartyFormData((prevState) => {
      const newPartyCommonDto = [...prevState.partyCommonDto];
      if (newPartyCommonDto[0]) {
        newPartyCommonDto[0].partyCandidateDetailsDTO.positionInTheGovernment = value;
      }
      return { ...prevState, partyCommonDto: newPartyCommonDto };
    });
  };

  const handlePermanentAddressChange = (value: string) => {
    setPartyFormData((prevState) => {
      const newPartyCommonDto = [...prevState.partyCommonDto];
      if (newPartyCommonDto[0]) {
        newPartyCommonDto[0].partyCandidateDetailsDTO.permanentAddress = value;
      }
      return { ...prevState, partyCommonDto: newPartyCommonDto };
    });
  };

  const handleOtherInformationChange = (value: string) => {
    setPartyFormData((prevState) => {
      const newPartyCommonDto = [...prevState.partyCommonDto];
      if (newPartyCommonDto[0]) {
        newPartyCommonDto[0].partyCandidateDetailsDTO.otherInformation = value;
      }
      return { ...prevState, partyCommonDto: newPartyCommonDto };
    });
  };

  const handlediedChange = (value: string) => {
    setPartyFormData((prevState) => {
      const newPartyCommonDto = [...prevState.partyCommonDto];
      if (newPartyCommonDto[0]) {
        newPartyCommonDto[0].partyCandidateDetailsDTO.died = value;
      }
      return { ...prevState, partyCommonDto: newPartyCommonDto };
    });
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

  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files) as File[];
      const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
      const fileType = selectedFiles[0].name.split('.').pop();
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
    } else {
      setIsFileSelected(false);
    }
  };

  const handleChooseImagesClick = (index: number) => {
    document.getElementById(`image-upload-input-${index}`)?.click();
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

  const handleFileChange1 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files) as File[];
      const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
      const fileType = selectedFiles[0].name.split('.').pop();
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
    } else {
      setIsFileSelected(false);
    }
  };

  const handleChooseImagesClick1 = (index1: number) => {
    document.getElementById(`image-upload-input1-${index1}`)?.click();
  };

  const handleRemoveBoximage = (index: number) => {
    const updatedatimage = [...fields];
    updatedatimage.splice(index, 1);
    setFields(updatedatimage);
  };

  const [imageString, setImageString] = useState<string | null>(null);

  const handleFileChange3 = (
    personIndex: number,
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
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

  const handleChooseImagesClick3 = (personIndex: number, index3: number) => {
    if (fields3 && fields3[index3]) {
      const selectedImageStoreNumber = fields3[index3].fileType;
      document.getElementById(`image-upload-input3-${personIndex}-${index3}`)?.click();
    } else {
      console.error('Invalid index or missing data in fields3 array.');
    }
  };

  const handleChoosecompanyImagesClick3 = (personIndex: number, index3: number) => {
    if (fields3 && fields3[index3]) {
      const selectedImageStoreNumber = fields3[index3].fileType;
      document.getElementById(`image-upload-input3-${personIndex}-${index3}`)?.click();
    } else {
      console.error('Invalid index or missing data in fields3 array.');
    }
  };

  const handleSelectChange3 = (personIndex: number, index: number, selectedValue: number) => {
    const updatedPeople = { ...formDatas };
    const selectedFileType = selectedValue;
    if (selectedFileType != 0) {
      updatedPeople.combinedDTO[personIndex].companyDocumentsDTOS[index].documentTypeId = selectedFileType;
      let myArr = String(selectedValue).split("").map((selectedValue) => {
        return Number(selectedValue)
      })
      updatedPeople.combinedDTO[personIndex].companyDocumentsDTOS[index].path = myArr;
      if (Array.isArray(updatedPeople.combinedDTO)) {
        setformDatas({ ...updatedPeople });
      }
    }
  };

  const handleFileChange4 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files) as File[];
      const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
      const fileType = selectedFiles[0].name.split('.').pop();
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
    } else {
      setIsFileSelected(false);
    }
  };

  const handleChooseImagesClick4 = (index4: number) => {
    document.getElementById(`image-upload-input4-${index4}`)?.click();
  };

  const addressApiService = new AddressApiService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({
    base64: null,
    filename: null,
  });
  const [pdfDatas, setPdfDatas] = useState<{ base64: string | null; filename: string | null }>({
    base64: null,
    filename: null,
  });

  const [pdfDataes, setPdfDataes] = useState<{ base64: string | null; filename: string | null }>({
    base64: null,
    filename: null,
  });
  const [companybase64Image, setCompanyBase64Image] = useState<string | null>(null);

  const [companypdfData, setCompanyPdfData] = useState<{ base64: string | null; filename: string | null }>({
    base64: null,
    filename: null,
  });

  const [profileImageData, setProfileImageData] = useState<string | null>(null);

  const [companyDetails, setCompanyDetails] = useState({
    companyName: '',
    id: 0,
    documentType: ''
  });

  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [directorDocumentType, setDirectorDocumentTypes] = useState<string[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [showBlockProfileButton, setShowBlockProfileButton] = useState(false);
  const [showBlockPartyButton, setShowBlockPartyButton] = useState(false);
  const [showBlockDinButton, setShowBlockDinButton] = useState(false);
  const [showBlockCllpButton, setShowBlockCllpButton] = useState(false);
  const [blockButtonDisabled, setBlockButtonDisabled] = useState(false);

  const fetchPDF = async (pepId: number, pathId: number) => {
    try {
      setLoading(true);
      const { data, filename } = await addressApiService.getPDF(pathId, pepId);
      setPdfData({ base64: data, filename });
      const imageData = await addressApiService.getImage(pathId, pepId);
      const base64Image = arrayBufferToBase64(imageData);
      setBase64Image(base64Image);
    } catch (error) {
      setError('Error fetching PDF or image');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfilePicture = async (pepId: number, pathId: number) => {
    try {
      const imageData = await addressApiService.getImage(pathId, pepId);
      const profileImageData = arrayBufferToBase64(imageData);
      setProfileImageData(profileImageData);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const binary = new Uint8Array(buffer);
    const bytes = new Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = String.fromCharCode(binary[i]);
    }
    const base64String = btoa(bytes.join(''));
    return `data:image/png;base64,${base64String}`;
  };
  const arrayBufferToBases64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  const viewPageDetailsService = new ViewPageDetailsService();

  // const [selectedAction, setSelectedAction] = useState(null);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);


  const handleBlockClicke = async (pepId: string, pathId: number) => {
    await viewPageDetailsService.updateBlock(pepId, pathId.toString());
    setBlockButtonDisabled(true);
  };

  const handleBlockClickes = async (pepId: string, pathId: number) => {
    await viewPageDetailsService.updateBlock(pepId, pathId.toString());
    setBlockButtonDisabled(true);
  };

  const handleBlockClicks = async (pepId: string, pathId: number) => {
    await viewPageDetailsService.updateBlock(pepId, pathId.toString());
    setBlockButtonDisabled(true);
  };

  const handleBlockClick = () => {
    if (selectedAction) {
      handleBlockClicks(pepId || '0', selectedAction);
      setSelectedAction(null);
    }
  };



  const handleButtonClick = async (pepId: number, pathId: number, fileType: string) => {
    setError(null);
    setLoading(true);
    setBase64Image(null);
    try {
      let imageData;
      if (fileType === 'image') {
        imageData = await addressApiService.getImage(pathId, pepId);
        if (imageData) {
          const base64Image = arrayBufferToBase64(imageData);
          setBase64Image(base64Image);
          setPdfData({ base64: null, filename: null });
        } else {
          setPdfData({ base64: null, filename: null });
        }
      } else if (fileType === 'pdf') {
        const { data, filename } = await addressApiService.getPDF(pathId, pepId);
        setPdfData({ base64: data, filename });
        setBase64Image(null);
      }
      setShowBlockProfileButton(pathId === 1);
      setShowBlockPartyButton(pathId === 2);
      setShowBlockDinButton(pathId === 3);
      setShowBlockCllpButton(pathId === 4);
      if (imageData) {
        setBlockButtonDisabled(false);
      } else {
        setBlockButtonDisabled(true);
      }
    } catch (error) {
      setError('Not Available');
    } finally {
      setLoading(false);
    }
  };

  const [buttonClicked, setButtonClicked] = useState(false);

  const handleButtonClicks = async (pepId: number, pathId: number) => {
    setError(null);
    setLoading(true);
    setPdfData({ base64: null, filename: null });

    const TIMEOUT_DURATION = 15000;

    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, TIMEOUT_DURATION);

      const imageResponse = await addressApiService.getFiles(pathId, pepId);

      clearTimeout(timeoutId);


      const base64Image = arrayBufferToBases64(imageResponse);

      if (base64Image) {
        setPdfData({ base64: base64Image, filename: null });
      } else {
        console.error('No base64 image data received.');
      }

    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setError(error.message);
      } else {
        console.error('An unknown error occurred');
        setError('An unknown error occurred');
      }

    } finally {
      setLoading(false);
      setButtonClicked(true);
    }
  };

  const handleCompanyButtonClick = async (companyId: number, pathId: number) => {
    setError(null);
    setLoading(true);
    setIsLoading(true);
    try {
      const companyDetailsData: any[] = await addressApiService.getDocumentType(companyId, pathId);
      const types = companyDetailsData.map(documentData => documentData.documentType);
      setCompanyDetails({
        companyName: companyDetailsData[0]?.companyName || 'Not Available',
        id: companyId,
        documentType: types[0] || null,
      });
      setDocumentTypes(types);

      types.forEach(type => handleDocumentTypeClick(type, companyId));
    } catch (error) {
      setError('Error fetching data');
      setImageSrc(null);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const handleblockImage = async (documentId: number) => {
    try {
      const payload = {
        id: 0,
        companyId: 0,
        pathId: 0,
        url: '',
        documentType: '',
        documentCount: 0,
        uid: loginDetails.id,
      };
      await addressApiService.blockDocumentImage(documentId, payload);
    } catch (error) {
      console.error("Error blocking Document:", error);
    }
  };

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdfBase64, setCurrentPdfBase64] = useState<string | null>(null);
  const [blockButtonText, setBlockButtonText] = useState('');
  const [blockButtonDisableds, setBlockButtonDisableds] = useState(false);
  const [pathId, setPathId] = useState<number | undefined>(undefined);
  const [associatedId, setAssociatedId] = useState<number | undefined>(undefined);
  const [companyIds, setcompanyIds] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleDocumentTypeClick = async (imageName: string, companyId: number) => {
    setIsLoading(true);
    try {
      const imagePathId = 5;
      const imageMetadataResponse = await addressApiService.getDocumentType(companyId, imagePathId);

      console.log('LocalImage Response:', imageMetadataResponse);

      if (imageMetadataResponse && imageMetadataResponse.length > 0) {
        const { pathId, documentType: associatedId, companyId } = imageMetadataResponse[0];

        const imageResponse = await addressApiService.getDocumentImage(companyId, imageName, imagePathId);
        const base64Image = arrayBufferToBases64(imageResponse);
        setPdfDatas({ base64: base64Image, filename: imageName });
        setPathId(pathId);
        setAssociatedId(associatedId);
        setcompanyIds(companyId);
        if (base64Image) {
          setCurrentPdfBase64(base64Image);
          setBlockButtonText('Block Company');
          setBlockButtonDisableds(false);
          setShowPdfModal(true);
        }
        setIsLoading(false);
      } else {
        console.error('No metadata found for the document.');
      }
    } catch (error) {
      console.error(`Error fetching document details for Document Type ${imageName}:`, error);
    }
  };

  const [showCompanyList, setShowCompanyList] = useState(false);

  const handleDiretorCompanyButtonClick = async (companyId: number, pathId: number) => {
    setError(null);
    setLoading(true);
    setIsLoading(true);
    try {
      const companyDetailsData: any[] = await addressApiService.getDocumentType(companyId, pathId);
      const types = companyDetailsData.map(documentData => documentData.documentType);
      setCompanyDetails({
        companyName: companyDetailsData[0]?.companyName || 'Not Available',
        id: companyId,
        documentType: types[0] || null,
      });
      setDirectorDocumentTypes(types);
      types.forEach(type => handleDocumentListTypeClick(type, companyId));
    } catch (error) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const handleDocumentListTypeClick = async (imageName: string, companyId: number) => {
    setIsLoading(true);
    try {
      const imagePathId = 6;
      const imageMetadataResponse = await addressApiService.getDocumentType(companyId, imagePathId);
      console.log('LocalImage Response:', imageMetadataResponse);

      if (imageMetadataResponse && imageMetadataResponse.length > 0) {
        const { pathId, documentType: associatedId, companyId } = imageMetadataResponse[0];
        const imageResponse = await addressApiService.getDocumentImage(companyId, imageName, imagePathId);
        const base64Image = arrayBufferToBases64(imageResponse);
        setPdfDataes({ base64: base64Image, filename: imageName });
        setPathId(pathId);
        setAssociatedId(associatedId);
        setcompanyIds(companyId);
        if (pdfDataes.base64) {
          setCurrentPdfBase64(pdfDataes.base64);
          setBlockButtonText('Block Director');
          setBlockButtonDisableds(false);
          setShowPdfModal(true);
        }
        setIsLoading(false);
      } else {
        console.error('No metadata found for the document.');
      }
    } catch (error) {
      console.error('Error fetching document image:', error);
    }
  };

  const [companyNames, setCompanyNames] = useState<CompanyData[]>([]);
  const [selectedDin, setSelectedDin] = useState<string | null>(null);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);



  const handleCompanyFiles = async (din: string) => {
    try {
      const response: CompanyData[] = await addressApiService.getDocumentfile(din);

      if (response && response.length > 0) {
        console.log("Company Data Array: ", response);
        setCompanyNames(response);
        setSelectedDin(din);
      } else {
        console.error('Unexpected API response format:', response);
        setCompanyNames([]);
        setSelectedDin(null);
      }
    } catch (error) {
      console.error('Error fetching company name:', error);
      setCompanyNames([]);
      setSelectedDin(null);
    }
  };

  const [companyData, setCompanyData] = useState<Company[]>([]);

  const fetchCompanyData = async (din: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await addressApiService.getdincompanyemty(din);
      setCompanyData(response);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');

      setLoading(false);
    }
  };

  const handleCompany = async (companyId: number, imageName: string, imagePathId: number) => {
    try {
      setIsLoading(true);

      const imageResponse = await addressApiService.getDocumentImage(companyId, imageName, imagePathId);
      const base64Image = arrayBufferToBases64(imageResponse);

      setPdfDatas({ base64: base64Image, filename: imageName });
      setPathId(imagePathId);
      setAssociatedId(companyId);
      setcompanyIds(companyId);

      if (base64Image) {
        setCurrentPdfBase64(base64Image);
        setBlockButtonText('Block Company');
        setBlockButtonDisabled(false);
        setShowPdfModal(true);
      } else {
        console.error('No base64 image data received.');
      }
    } catch (error) {
      console.error(`Error fetching document for Company ID ${companyId} and Path ID ${imagePathId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const [activeCompanyId, setActiveCompanyId] = useState<number | null>(null);
  const [noDocumentAvailable, setNoDocumentAvailable] = useState<boolean>(false);


  const handleEditClick = () => {
    console.log('Path ID:', pathId, 'Associated ID:', associatedId, 'Company ID:', companyIds);
    if (associatedId) {
      setShowFileUploadModal(true);
    } else {
      console.error('Associated ID is missing, cannot proceed to file upload.');
    }
  };

  const handleCompanyClick = (companyId: number) => {
    setSelectedCompanyId(companyId);
    setShowFileUploadModal(true);
  };


  const [selectedPersonIndex, setSelectedPersonIndex] = useState<number | null>(null);

  const handleFileChange2 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files) as File[];
      const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
      const fileType = selectedFiles[0].name.split('.').pop();
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
    } else {
      setIsFileSelected(false);
    }
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

  const handleChooseImagesClick2 = (index2: number) => {
    document.getElementById(`image-upload-input2-${index2}`)?.click();
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
          validatePan(value, index);
        }
      }
    }
    setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
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
          validatePan(value, index);
        }
      }
    }
    setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
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
        setRelativePanTouched(true);
      }
    }
    setSpouseFamilyFormData({ spouseCommonDTO: updatedPeople.spouseCommonDTO });
    setTouched(true);
  };

  const [adverseInformationCheckValue, setAdverseInformationCheckValue] = useState(0);
  const [regulatoryActionCheckValue, setRegulatoryActionCheckValue] = useState(0);
  const [includeAdverseInformation, setIncludeAdverseInformation] = useState(adverseInformationCheckValue === 1);
  const [includeRegulatoryAction, setIncludeRegulatoryAction] = useState(regulatoryActionCheckValue === 1);
  const [additionalFields, setAdditionalFields] = useState([]);

  const handleCheckboxChanges = (fieldName: string, value: boolean) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [fieldName]: value ? 1 : 0
      };
    });
  };

  const handleCheckboxChangess = (fieldName: string, value: boolean) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [fieldName]: value ? 1 : 0
      };
    });
  };

  const handleAdverseInformationChange = (event: { target: { checked: any; }; }) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setFormData({ ...formData, adverseInformation: 1 });
    } else {
      setFormData({ ...formData, adverseInformation: 0 });
    }
  };

  const handleRegulatoryActionChange = (event: { target: { checked: any; }; }) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setFormData({ ...formData, regulatoryAction: 1 });
    } else {
      setFormData({ ...formData, regulatoryAction: 0 });
    }
  };

  const [includeListAdverseInformation, setIncludeListAdverseInformation] = useState(false); const [includeListRegulatoryAction, setIncludeListRegulatoryAction] = useState(false);
  const [includeGovernment, setIncludeGovernment] = useState(false);
  const [listAdverseInformationCheckValue, setListAdverseInformationCheckValue] = useState(0);
  const [listRegulatoryActionCheckValue, setListRegulatoryActionCheckValue] = useState(0);
  const [listGovernmentCheckValue, setListGovernmentCheckValue] = useState(0);

  const handleListAdverseInformationChange = (event: { target: { checked: any; }; }) => {
    const isChecked = event.target.checked;
    setformDatas(prevState => ({
      ...prevState,
      combinedDTO: prevState.combinedDTO.map(item => ({
        ...item,
        companyDTO: {
          ...item.companyDTO,
          listAdverseInformation: isChecked ? 1 : 0
        }
      }))
    }));
  };

  const handleListRegulatoryActionChange = (event: { target: { checked: any; }; }) => {
    const isChecked = event.target.checked;
    setformDatas(prevState => ({
      ...prevState,
      combinedDTO: prevState.combinedDTO.map(item => ({
        ...item,
        companyDTO: {
          ...item.companyDTO,
          listRegulatoryAction: isChecked ? 1 : 0
        }
      }))
    }));
  };

  const handleGovernmentChange = (event: { target: { checked: any; }; }) => {
    const isChecked = event.target.checked;
    setformDatas(prevState => ({
      ...prevState,
      combinedDTO: prevState.combinedDTO.map(item => ({
        ...item,
        companyDTO: {
          ...item.companyDTO,
          listGovernment: isChecked ? 1 : 0
        }
      }))
    }));
  };

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
      return updatedFormDatas;
    });
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

  return (
    <>
      {isHeaderVisible && <Header />}
      {/* <Box> */}
      <Box>
        <div className="card-body" style={{ marginTop: '6%' }}>
          <div className="upload-contact-container">
            <div className="card-body">
              <Box m={1}>
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
                        defaultValue="Default Value"
                        onChange={(e) => handleChange(e, 0)}
                        disabled={!updateCheckingData.customerRequestEdit}
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
                              variant="standard"
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={(e) => handleChange(e, 0)}
                              disabled={!updateCheckingData.customerRequestEdit}
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
                              disabled={!updateCheckingData.customerRequestEdit}
                              label="Date of Birth"
                              required
                              variant="standard"
                              size="small"
                            />
                            <TextField
                              style={{ width: '50%' }}
                              label="Education"
                              variant="standard"
                              multiline
                              type="text"
                              name="education"
                              value={formData.education}
                              onChange={(e) => handleChange(e, 0)}
                              disabled={!updateCheckingData.customerRequestEdit}
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
                              multiline
                              type="text"
                              name="placeOfBirth"
                              value={formData.placeOfBirth}
                              onChange={(e) => handleChange(e, 0)}
                              disabled={!updateCheckingData.customerRequestEdit}
                            />
                            <FormControl style={{ width: '55%' }}>
                              <InputLabel htmlFor="type">Gender</InputLabel>
                              <Select
                                label="Designation"
                                variant="standard"
                                value={formData.genderId.toString()}
                                onChange={(event: SelectChangeEvent<string>) => handlegender(event)}
                                disabled={!updateCheckingData.customerRequestEdit}
                              >
                                {gender.map((item) => (
                                  <MenuItem key={item.id} value={item.id.toString()}>
                                    {item.gender}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                      </div>
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
                                value={formData.pan}
                                onChange={(e) => handleChange(e, 0)}
                                disabled={!updateCheckingData.customerRequestEdit}
                              />
                              <TextField
                                style={{ width: '50%' }}
                                label="Directors Identification Number"
                                variant="standard"
                                type="text"
                                name="directorsIdentificationNumber"
                                value={formData.directorsIdentificationNumber}
                                onChange={(e) => handleChange(e, 0)}
                                disabled={!updateCheckingData.customerRequestEdit}
                              />
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox style={{ color: 'red' }}
                            checked={updateCheckingData.customerRequestEdit}
                            onChange={handleCheckboxChang}
                            name="customerRequestEdit"
                          />
                        }
                        label=" Customer Request Edit" style={{ color: 'red' }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <div className="key">
                        <div className="scroll-box">
                          {uniquePerMediaData.length > 0 &&
                            uniquePerMediaData.map((item, index) => (
                              <div key={index} className="person-container">
                                {uniquePerMediaData.length > 1 && updateCheckingData.perMediaForm && (
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
                                    value={item.otherAssociationAsPerMedia}
                                    onChange={(e) => handletPerMediaChange(e.target.value, index)}
                                    minRows={3}
                                    disabled={!updateCheckingData.perMediaForm}
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="field-group">
                          <div className="field-group-container">
                            <div className="field-group-row">
                              <div className="field label">
                                {updateCheckingData.perMediaForm && (
                                  <div className="add-button" onClick={handleAddtPerMediaField}>
                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Command
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.adverseInformation === 1}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                              handleCheckboxChanges('adverseInformation', event.target.checked)
                            }
                            disabled={!updateCheckingData.customerRequestEdit}
                          />
                        }
                        label="Adverse Information"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.regulatoryAction === 1}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                              handleCheckboxChangess('regulatoryAction', event.target.checked)
                            }
                            disabled={!updateCheckingData.customerRequestEdit}
                          />
                        }
                        label="Regulatory Action"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControlLabel
                        control={
                          <Checkbox style={{ color: 'red' }}
                            checked={updateCheckingData.perMediaForm}
                            onChange={handleCheckboxChang}
                            name="perMediaForm"
                          />
                        }
                        label=" Per Media Form" style={{ color: 'red' }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <div className="key">
                        <div className="scroll-box">
                          {akaformData.map((Aka, index) => (
                            <div key={index} className="person-container">
                              {akaformData.length > 1 && updateCheckingData.akaDetRequest && (
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
                                  value={Aka.akaName}
                                  onChange={(e) => handleakaNameChange(e.target.value, index)}
                                  disabled={!updateCheckingData.akaDetRequest}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="field-group">
                          <div className="field-group-container">
                            <div className="field-group-row">
                              <div className="field label">
                                {updateCheckingData.akaDetRequest && (
                                  <div className="add-button" onClick={handleAddakaNameField}>
                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Aka Name
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox style={{ color: 'red' }}
                                checked={updateCheckingData.akaDetRequest}
                                onChange={handleCheckboxChang}
                                name="akaDetRequest"
                              />
                            }
                            label=" Aka Det Request Edit" style={{ color: 'red' }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={4}>
                      <div className="key">
                        <div className="scroll-box">
                          {PhoneNumberss.map((PhoneNumber, index) => (
                            <div key={index} className="person-container">
                              {PhoneNumberss.length > 1 && updateCheckingData.contactEmailEdit && (
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
                                  value={PhoneNumber.communicationDt}
                                  onChange={(e) => handlePhoneNumbersNameChange(e.target.value, index)}
                                  disabled={!updateCheckingData.contactEmailEdit}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="field-group">
                          <div className="field-group-container">
                            <div className="field-group-row">
                              <div className="field label">
                                {updateCheckingData.contactEmailEdit && (
                                  <div className="add-button" onClick={handleAddPhoneNumbersNameField}>
                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Phone Numbers
                                  </div>
                                )}
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
                              {Emailidss.length > 1 && updateCheckingData.contactEmailEdit && (
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
                                    value={Emailids.communicationDt}
                                    onChange={(e) => handleEmailidsNameChange(e.target.value, index)}
                                    disabled={!updateCheckingData.contactEmailEdit}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="field-group">
                          <div className="field-group-container">
                            <div className="field-group-row">
                              <div className="field label">
                                {updateCheckingData.contactEmailEdit && (

                                  <div className="add-button" onClick={handleAddEmailidsNameField}>
                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Email Ids
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox style={{ color: 'red' }}
                              checked={updateCheckingData.contactEmailEdit}
                              onChange={handleCheckboxChang}
                              name="contactEmailEdit"
                            />
                          }
                          label=" Contact & Email Id Edit" style={{ color: 'red' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
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
                      {FamilyformData.familyCombinedDTO.length > 1 && updateCheckingData.familyEdit && (
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
                                        disabled={!updateCheckingData.familyEdit}
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
                                        disabled={!updateCheckingData.familyEdit}

                                        inputProps={{ maxLength: 10 }}
                                      />
                                      {HUFPanErrors[hufIndex] && (
                                        <div style={{ color: 'red' }}>{HUFPanErrors[hufIndex]}</div>
                                      )}
                                      {updateCheckingData.familyEdit && (

                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className="delete-icon"
                                          onClick={() => handleDeleteFieldHuf(personIndex, 'HUFPan', hufIndex)}
                                        />
                                      )}
                                    </div>
                                  ))}
                                  <div className="field label">
                                    {updateCheckingData.familyEdit && (
                                      <div className="add-button" onClick={() => handleAddFieldFamilydetails(personIndex, 'huf')}>
                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More HUF
                                      </div>
                                    )}
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
                                        multiline
                                        type="text"
                                        autoComplete="off"
                                        value={child.fatherName}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                          handleInputChangfatherpan(personIndex, 'fatherName', childIndex, event)
                                        }
                                        disabled={!updateCheckingData.familyEdit}
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
                                        disabled={!updateCheckingData.familyEdit}
                                        inputProps={{ maxLength: 10 }}
                                      />
                                      {fatherPanErrors[childIndex] && (
                                        <div style={{ color: 'red' }}>{fatherPanErrors[childIndex]}</div>
                                      )}
                                      {updateCheckingData.familyEdit && (
                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className="delete-icon"
                                          onClick={() => handleDeleteFieldfather(personIndex, 'fatherPan', childIndex)}
                                        />
                                      )}
                                    </div>
                                  ))}
                                  <div className="field label">
                                    {updateCheckingData.familyEdit && (
                                      <div className="add-button" onClick={() => handleAddFieldFamilydetails(personIndex, 'father')}>
                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Father
                                      </div>
                                    )}
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
                                        multiline
                                        type="text"
                                        autoComplete="off"
                                        value={child.motherName}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                          handleInputChangmotherpan(personIndex, 'motherName', childIndex, event)
                                        }
                                        disabled={!updateCheckingData.familyEdit}
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
                                        disabled={!updateCheckingData.familyEdit}
                                        inputProps={{ maxLength: 10 }}
                                      />
                                      {motherPanErrors[childIndex] && (
                                        <div style={{ color: 'red' }}>{motherPanErrors[childIndex]}</div>
                                      )}
                                      {updateCheckingData.familyEdit && (
                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className="delete-icon"
                                          onClick={() => handleDeleteFieldmother(personIndex, 'motherPan', childIndex)}
                                        />
                                      )}
                                    </div>
                                  ))}
                                  <div className="field label">
                                    {updateCheckingData.familyEdit && (
                                      <div className="add-button" onClick={() => handleAddFieldFamilydetails(personIndex, 'mother')}>
                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Mother
                                      </div>
                                    )}
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
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox style={{ color: 'red' }}
                        checked={updateCheckingData.familyEdit}
                        onChange={handleCheckboxChang}
                        name="familyEdit"
                      />
                    }
                    label="Family Edit" style={{ color: 'red' }}
                  />
                </Grid>
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
                      {SpouseFamilyformData.spouseCommonDTO.length > 1 && updateCheckingData.spouseFamilyEdit && (
                        <div className="close-button" onClick={() => handleRemoveBoxSpouseFamily(personIndex)}>
                          <FontAwesomeIcon icon={faTimes} />
                        </div>
                      )}
                      <div className="field-group-column" style={{ marginBottom: '10px' }}>
                        <TextField style={{ width: '20%' }}
                          label="Spouse Name"
                          variant="standard"
                          multiline
                          type="text"
                          name="relativeName"
                          autoComplete="off"
                          value={person.spouseDetailsDTO.spouseName || ''}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChangespouseFamily(personIndex, 'spouseName', null, event)
                          }
                          disabled={!updateCheckingData.spouseFamilyEdit}

                        />
                        <TextField
                          style={{ width: '25%' }}
                          label="Spouse PAN"
                          variant="standard"
                          type="text"
                          name="pan"
                          autoComplete="off"
                          value={person.spouseDetailsDTO.spousePan || ''}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChangespouseFamily(personIndex, 'spousePan', null, event)
                          }
                          disabled={!updateCheckingData.spouseFamilyEdit}


                          onBlur={() => setTouched(true)}
                          inputProps={{ maxLength: 10 }}
                        />
                        {relativePanTouched && !isValidPAN(person.spouseDetailsDTO.spousePan) && (
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
                                        disabled={!updateCheckingData.spouseFamilyEdit}

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
                                        disabled={!updateCheckingData.spouseFamilyEdit}

                                        inputProps={{ maxLength: 10 }}
                                      />
                                      {spousePanTouched && !isValidPAN(huf.hufPan) && (
                                        <div style={{ color: 'red' }}>Invalid PAN Format</div>
                                      )}
                                      {updateCheckingData.spouseFamilyEdit && (

                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className="delete-icon"
                                          onClick={() => handleDeleteFieldspouseHuf(personIndex, 'hufPan', hufIndex)}
                                        />
                                      )}
                                    </div>
                                  ))}
                                  <div className="field label">
                                    {updateCheckingData.spouseFamilyEdit && (

                                      <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More HUF
                                      </div>
                                    )}
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
                                        label="Father"
                                        variant="standard"
                                        type="text"
                                        autoComplete="off"
                                        value={child.fatherName}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                          handleInputChangspousefatherpan(personIndex, 'fatherName', childIndex, event)
                                        }
                                        disabled={!updateCheckingData.spouseFamilyEdit}

                                      />
                                      <TextField
                                        style={{ width: '50%' }}
                                        label=" Father Pan"
                                        variant="standard"
                                        type="text"
                                        name="fatherPan"
                                        value={child.fatherPan}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                          handleInputChangspousefatherpan(personIndex, 'fatherPan', childIndex, event)
                                        }
                                        disabled={!updateCheckingData.spouseFamilyEdit}

                                        inputProps={{ maxLength: 10 }}
                                      />
                                      {panErrors[childIndex] && (
                                        <div style={{ color: 'red' }}>{panErrors[childIndex]}</div>
                                      )}
                                      {updateCheckingData.spouseFamilyEdit && (

                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className="delete-icon"
                                          onClick={() => handleDeleteFieldspousefather(personIndex, 'fatherPan', childIndex)}
                                        />
                                      )}

                                    </div>
                                  ))}
                                  <div className="field label">
                                    {updateCheckingData.spouseFamilyEdit && (

                                      <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'father')}>
                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Father
                                      </div>
                                    )}
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
                                        disabled={!updateCheckingData.spouseFamilyEdit}

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
                                        disabled={!updateCheckingData.spouseFamilyEdit}

                                        inputProps={{ maxLength: 10 }}
                                      />
                                      {panErrors[childIndex] && (
                                        <div style={{ color: 'red' }}>{panErrors[childIndex]}</div>
                                      )}
                                      {updateCheckingData.spouseFamilyEdit && (

                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className="delete-icon"
                                          onClick={() => handleDeleteFieldspousemother(personIndex, 'motherPan', childIndex)}
                                        />
                                      )}
                                    </div>
                                  ))}
                                  <div className="field label">
                                    {updateCheckingData.spouseFamilyEdit && (

                                      <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'mother')}>
                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Mother
                                      </div>
                                    )}
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
                      disabled={!updateCheckingData.spouseFamilyEdit}

                    >
                      Add Spouse Family Details
                    </Button>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={updateCheckingData.spouseFamilyEdit}
                            onChange={handleCheckboxChang}
                            name="spouseFamilyEdit"
                          />
                        }
                        label=" Spouse Family Edit"
                      />
                    </Grid>
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
                <h3>RELATIVE DETAILS</h3>
                <div className="details-containers">
                  <div className="scrollablebox">
                    {RelativeformData.relativeCombineDTO?.map((person, personIndex) => (
                      <div key={personIndex} className="person-container">
                        {RelativeformData.relativeCombineDTO.length > 1 && updateCheckingData.relativeformDataEdit && (
                          <div className="close-button" onClick={() => handleRemoveBoxFamily(personIndex)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </div>
                        )}
                        <div className="field-group-column" style={{ marginBottom: '10px' }}>
                          <FormControl style={{ width: '50%' }}>
                            <InputLabel htmlFor="type">Relative List</InputLabel>
                            <Select label="Relative" value={person.relativeDTO.relativeMasterId} onChange={(e) => handlerelativeChange(personIndex, e.target.value)} variant="standard" type="text" disabled={!updateCheckingData.relativeformDataEdit}
                            >
                              {Array.isArray(relative) &&
                                relative?.map((lists: any) => (
                                  <MenuItem key={lists.id} value={lists.id}>
                                    {lists.name}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                          <TextField style={{ width: '20%' }}
                            label="Relative Name"
                            variant="standard"
                            multiline
                            type="text"
                            name="relativeName"
                            value={person.relativeDTO.relativeName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChangeFamily(personIndex, 'relativeName', null, event)
                            }
                            disabled={!updateCheckingData.relativeformDataEdit}

                          />
                          <TextField
                            style={{ width: '25%' }}
                            label="PAN"
                            variant="standard"
                            type="text"
                            name="pan"
                            value={person.relativeDTO.pan}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChangeFamily(personIndex, 'pan', null, event)
                            }
                            disabled={!updateCheckingData.relativeformDataEdit}

                          />
                        </div>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <div className="field-group">
                              <div className="field-group-container">
                                <div className="field-group-row">
                                  <div className="scrollable-box">
                                    {person.relativeDetDTOS?.map((email, emailIndex) => (
                                      <div key={emailIndex} className="field-group-column">
                                        <TextField style={{ width: '40%' }} label="Name" variant="standard" type="text" value={email.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleInputChangeFamily(personIndex, 'name', emailIndex, event)}
                                          disabled={!updateCheckingData.relativeformDataEdit}

                                        />
                                        <TextField style={{ width: '40%' }} label="Pan" variant="standard" type="text" value={email.pan} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleInputChangeFamily(personIndex, 'pan', emailIndex, event)}
                                          disabled={!updateCheckingData.relativeformDataEdit}

                                        />
                                        {updateCheckingData.relativeformDataEdit && (

                                          <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDeleteFieldFamily(personIndex, 'pan', emailIndex)}
                                          />
                                        )}
                                      </div>
                                    ))}
                                    <div className="field label">
                                      {updateCheckingData.relativeformDataEdit && (

                                        <div className="add-button" onClick={() => handleAddFieldFamily(personIndex, 'Spouse')}>
                                          <FontAwesomeIcon icon={faPlusCircle} /> Add More Spouse
                                        </div>
                                      )}
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
                                    {person.relativeChildrenDTOS?.map((child, childIndex) => (
                                      <div key={childIndex} className="field-group-column">
                                        <TextField label="Children Name" variant="standard" type="text" value={child.childrenName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleInputChangchilderpan(personIndex, 'childrenName', childIndex, event)}
                                        />
                                        <TextField
                                          style={{ width: '40%' }}
                                          label="Children PAN"
                                          variant="standard"
                                          type="text"
                                          value={child.pan}
                                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            handleInputChangchilderpan(personIndex, 'pan', childIndex, event)
                                          }
                                          disabled={!updateCheckingData.relativeformDataEdit}

                                        />
                                        {updateCheckingData.relativeformDataEdit && (

                                          <FontAwesomeIcon
                                            icon={faTrash}
                                            className="delete-icon"
                                            onClick={() => handleDeleteFieldFamily(personIndex, 'childrenName', childIndex)}
                                          />
                                        )}
                                      </div>
                                    ))}
                                    <div className="field label">
                                      {updateCheckingData.relativeformDataEdit && (

                                        <div className="add-button" onClick={() => handleAddFieldFamily(personIndex, 'children')}>
                                          <FontAwesomeIcon icon={faPlusCircle} /> Add More Children
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
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
                        disabled={!updateCheckingData.relativeformDataEdit}

                      >
                        Add Family details
                      </Button>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox style={{ color: 'red' }}
                              checked={updateCheckingData.relativeformDataEdit}
                              onChange={handleCheckboxChang}
                              name="relativeformDataEdit"
                            />
                          }
                          label=" Relative Details Edit" style={{ color: 'red' }}
                        />
                      </Grid>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="key">
                  </div>
                </div>
              </div>
            </Box>
          </div>
          <Box m={1}>
            <div className="key">
              <h4>PARTY</h4>
              <div className="details-containers">
                <div className="scrollablebox">
                  {PartyformData.partyCommonDto.map((person, personIndex) => (
                    <div key={personIndex} className="person-container">
                      {PartyformData.partyCommonDto.length > 1 && updateCheckingData.partyEdit && (
                        <div className="close-button"
                          onClick={() => handleRemovePartyformstate(personIndex)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </div>
                      )}
                      <div className="field-group-column" style={{ marginBottom: '10px' }}>



                        <TextField
                          style={{ width: '180%' }}
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
                          disabled={!updateCheckingData.partyEdit}
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
                          disabled={!updateCheckingData.partyEdit}
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
                          disabled={!updateCheckingData.partyEdit}
                        />

                        <TextField
                          style={{ width: '20%' }}
                          label="Died"
                          variant="standard"
                          type="text"
                          name="died"
                          value={person.partyCandidateDetailsDTO.died}
                          onChange={(e) => handlediedChange(e.target.value)}
                          disabled={!updateCheckingData.partyEdit}
                        />

                      </div>
                      <Grid container spacing={2}>
                        <Grid item xs={8}>
                          <div className="field-group">
                            <div className="field-group-container">
                              <div className="field-group-row">
                                <div className="scrollable-box">
                                  {person.partyDetailsDTO.map((party, partyIndex) => (
                                    <div key={partyIndex} className="field-group-column">
                                      <FormControl style={{ width: '50%' }}>
                                        <InputLabel htmlFor="party">Party</InputLabel>
                                        <Select
                                          label="Party"
                                          id="party"
                                          value={party.partyMasterId || ''}
                                          onChange={(event: SelectChangeEvent<number>) =>
                                            handlePartyformDataChange(personIndex, partyIndex, 'partyMasterId', event)
                                          }
                                          variant="standard"
                                          size="small"
                                          disabled={!updateCheckingData.partyEdit}
                                        >
                                          {Array.isArray(Party) &&
                                            Party.map((party: any) => (
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
                                          handlePartyformDataChange(personIndex, partyIndex, 'formerAndCurrent', event)
                                        }
                                        disabled={!updateCheckingData.partyEdit}
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
                                          handlePartyformDataChange(personIndex, partyIndex, 'positionInTheParty', event)
                                        }

                                        disabled={!updateCheckingData.partyEdit}
                                      />
                                      {updateCheckingData.partyEdit && (
                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className="delete-icon"
                                          onClick={() => handleDeleteparty(personIndex, 'positionInTheParty', partyIndex)}
                                        />
                                      )}
                                    </div>
                                  ))}

                                </div>
                                <div className="field label">
                                  {updateCheckingData.partyEdit && (
                                    <div className="add-button" onClick={() => handleAddFieldpartydetails(personIndex, 'party')}>
                                      <FontAwesomeIcon icon={faPlusCircle} /> Add More party
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Grid>
                      </Grid>

                    </div>

                    // </div>
                  ))}

                </div>
                <div>
                </div>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox style={{ color: 'red' }}
                        checked={updateCheckingData.partyEdit}
                        onChange={handleCheckboxChang}
                        name="partyEdit"
                      />
                    }
                    label="Party Edit" style={{ color: 'red' }}
                  />
                </Grid>
              </div>
            </div>
          </Box>
          <div className="card-body">
            <Box m={1}>
              <div className="key">
                <h3>LIST OF ASSOCIATED DETAILS</h3>
                <div className="details-containers">
                  <div className="scrollablebox">
                    {formDatas.combinedDTO?.map((person, personIndex) => (
                      <div key={personIndex} className="person-container">
                        {formDatas.combinedDTO.length > 1 && updateCheckingData.listofAssociatedCompaniesEdit && (
                          <div className="close-button" onClick={() => handleRemoveBoxCompanies(personIndex)}>
                            <FontAwesomeIcon icon={faTimes} />
                          </div>
                        )}
                        <div className="field-group-column" style={{ marginBottom: '10px' }}>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Source Link"
                            variant="standard"
                            type="text"
                            fullWidth
                            size="small"
                            name="sourceLink"
                            multiline
                            value={person.companyDTO.sourceLink}
                            id={`sourceLink-${personIndex}`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              handleInputChangeCompanies(personIndex, 'sourceLink', null, event)
                            }}
                            disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

                          />
                        </div>
                        <div className="field-group-column" style={{ marginBottom: '10px' }}>
                          <TextField
                            style={{ width: '25%' }}
                            label="Company Name"
                            variant="standard"
                            multiline
                            type="text"
                            name="companyName"
                            id={`companyName-${personIndex}`}
                            value={person.companyDTO.companyName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              handleInputChangeCompanies(personIndex, 'companyName', null, event)
                            }}
                            disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

                          />
                          <TextField
                            style={{ width: '25%' }}
                            label="CINFCRN"
                            variant="standard"
                            multiline
                            id={`cinfcrn-${personIndex}`}
                            name="cinfcrn"
                            value={person.companyDTO.cinfcrn}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChangeCompanies(personIndex, 'cinfcrn', null, event)
                            }
                            disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

                          />
                          <FormControl style={{ width: '15%' }}>
                            <InputLabel htmlFor="typeId">List of Company Details</InputLabel>
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
                              disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

                            >
                              {listOfCompanyDetails.map((item) => (
                                <MenuItem key={item.id} value={item.id.toString()}>
                                  {item.type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl style={{ width: '25%' }}>
                            <InputLabel htmlFor="type">Associated List</InputLabel>
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
                              disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

                            >
                              {associatedList?.map((item) => (
                                <MenuItem key={item.id} value={item.id.toString()}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
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
                            disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

                          />
                        </div>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <div className="field-group">
                              <div className="field-group-container">
                                <div className="field-group-row">
                                  <div className="scrollable-box">
                                    {person.contactDTOS?.map((email, emailIndex) => (
                                      <div key={emailIndex} className="field-group-column">
                                        <TextField
                                          style={{ width: '100%' }}
                                          label="Email Id"
                                          multiline
                                          variant="standard"
                                          type="text"
                                          value={email.emailID}
                                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            handleInputChangeCompanies(personIndex, 'emailID', emailIndex, event)
                                          }
                                          disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

                                        />
                                        {updateCheckingData.listofAssociatedCompaniesEdit && (

                                          <FontAwesomeIcon
                                            icon={faTrash}
                                            className="delete-icon"
                                            onClick={() =>
                                              handleDeleteFieldCompanies(personIndex, 'emailID', emailIndex)
                                            }
                                          />
                                        )}
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
                                    {person.addressDTOS?.map((address, addressIndex) => (
                                      <div key={addressIndex} className="field-group-column">
                                        <TextField
                                          style={{ width: '100%' }}
                                          label="Registered Address"
                                          variant="standard"
                                          type="text"


                                          value={address.registeredAddress}
                                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            handleInputChangeCompanies(personIndex, 'registeredAddress', addressIndex, event)
                                          }
                                          disabled={!updateCheckingData.listofAssociatedCompaniesEdit}


                                        />
                                        {updateCheckingData.listofAssociatedCompaniesEdit && (

                                          <FontAwesomeIcon
                                            icon={faTrash}
                                            className="delete-icon"
                                            onClick={() =>
                                              handleDeleteFieldCompanies(personIndex, 'registeredAddress', addressIndex)
                                            }
                                          />
                                        )}
                                      </div>
                                    ))}
                                    <div className="field label">
                                      {updateCheckingData.listofAssociatedCompaniesEdit && (

                                        <div className="add-button" onClick={() => handleAddFieldCompanies(personIndex, 'address')}>
                                          <FontAwesomeIcon icon={faPlusCircle} /> Add More Registered Address
                                        </div>
                                      )}
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
                                    {person.companiesDirectorsDTOS?.map((directors, directorsIndex) => (
                                      <div key={directorsIndex} className="field-group-column">
                                        <TextField
                                          label="Director Name"
                                          style={{ width: '25%' }}
                                          variant="standard"
                                          type="text"
                                          value={directors.directorName}
                                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            handleInputChangeCompanies(personIndex, 'directorName', directorsIndex, event)
                                          }
                                          disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

                                        />
                                        <TextField
                                          style={{ width: '25%' }}
                                          label="DIN"
                                          variant="standard"
                                          type="text"
                                          value={directors.din}
                                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            handleInputChangeCompanies(personIndex, 'din', directorsIndex, event)
                                          }
                                          disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

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
                                            disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

                                          >
                                            {Designationlist?.map((item) => (
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
                                            disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

                                          >
                                            {companymaster?.map((item) => (
                                              <MenuItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                        </FormControl>
                                        <TextField
                                          label="Date of Appointment At Current Designation"
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
                                          disabled={!updateCheckingData.listofAssociatedCompaniesEdit}

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
                                          disabled={!updateCheckingData.listofAssociatedCompaniesEdit}
                                        />
                                        {updateCheckingData.listofAssociatedCompaniesEdit && (

                                          <FontAwesomeIcon
                                            icon={faTrash}
                                            className="delete-icon"
                                            onClick={() => handleDeleteFieldCompanies(personIndex, 'din', directorsIndex)}
                                          />
                                        )}
                                      </div>
                                    ))}
                                    <div className="field label">
                                      {updateCheckingData.listofAssociatedCompaniesEdit && (

                                        <div className="add-button" onClick={() => handleAddFieldCompanies(personIndex, 'directors')}>
                                          <FontAwesomeIcon icon={faPlusCircle} /> Add More Directors Name & DIN
                                        </div>
                                      )}
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
                                {person.companyDocumentsDTOS?.map((field3, index3) => (
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
                                    {Array.from(new Set(
                                      person.companyAssociationDTOS
                                        .map(permedia => permedia.companyAssociation)
                                        .filter(company => company.trim() !== '')
                                    )).map((uniqueCompany, uniqueIndex) => {
                                      const originalIndex = person.companyAssociationDTOS.findIndex(
                                        permidia => permidia.companyAssociation === uniqueCompany
                                      );

                                      return (
                                        <div key={uniqueIndex} className="field-group-column">
                                          <TextareaAutosize
                                            style={{ minHeight: '100px', maxHeight: '250px', width: '100%', resize: 'none' }}
                                            placeholder="Type here..."
                                            autoFocus
                                            id={`outlined-multiline-static-${uniqueIndex}`}
                                            value={person.companyAssociationDTOS[originalIndex]?.companyAssociation || ''}
                                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                                              handletPerMediaChangsse(personIndex, 'companyAssociation', originalIndex, event)
                                            }
                                            disabled={!updateCheckingData.listofAssociatedCompaniesEdit}
                                            minRows={3}
                                          />
                                        </div>
                                      );
                                    })}
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
                                  disabled={!updateCheckingData.listofAssociatedCompaniesEdit}
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
                                  disabled={!updateCheckingData.listofAssociatedCompaniesEdit}
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
                                  disabled={!updateCheckingData.listofAssociatedCompaniesEdit}
                                />
                              }
                              label="Government"
                            />
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
                                  associateMasterId: 0,
                                  companyName: '',
                                  sourceLink: '',
                                  originalDateOfAppointment: '',
                                  listAdverseInformation: false,
                                  listRegulatoryAction: false,
                                  listGovernment: false,
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
                        disabled={!updateCheckingData.listofAssociatedCompaniesEdit}
                      >
                        Add List of Associated Companies
                      </Button>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox style={{ color: 'red' }}

                              checked={updateCheckingData.listofAssociatedCompaniesEdit}
                              onChange={handleCheckboxChang}
                              name="listofAssociatedCompaniesEdit"
                            />
                          }
                          label=" List of Associated Companies Edit" style={{ color: 'red' }}
                        />
                      </Grid>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </div>
        </div>
        <div>
        </div>
        <div className="card-body">
          <Box m={3}>
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
                                        value={"Affidavit: Photo - Picture format"}
                                        disabled={field.uploading}
                                      >
                                        <MenuItem value={"Affidavit: Photo - Picture format"}>Affidavit: Photo - Picture Format</MenuItem>
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
                                  <Button variant="outlined" onClick={() => handleChooseImagesClick(index)}>Choose Images</Button>
                                  <TextField label="Image Name" type="text" size="small" variant="outlined" value={field.imageName} disabled />
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
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox style={{ color: 'red' }} checked={includeimage} onChange={handleChangeCheckbox} name="includeimage" />
                  }
                  label="Image" style={{ color: 'red' }}
                /></Grid>
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
                                        value={"Affidavit: Party Photo - Picture format"}
                                        disabled={field1.uploading}
                                      >
                                        <MenuItem value={"Affidavit: Party Photo - Picture format"}>Affidavit: Party Photo - Picture Format</MenuItem>
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
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox style={{ color: 'red' }} checked={includeimage1} onChange={handleChangeCheckbox} name="includeimage1" />
                }
                label="Image 1" style={{ color: 'red' }}
              />
            </Grid>
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
                                    value={"MCA: DIN vs PAN - PDF format"}
                                    disabled={field2.uploading}
                                  >
                                    <MenuItem value={"MCA: DIN vs PAN - PDF format"}>MCA: DIN vs PAN - PDF Format</MenuItem>
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
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox style={{ color: 'red' }} checked={includeimage2} onChange={handleChangeCheckbox} name="includeimage2" />
                }
                label="Image 2" style={{ color: 'red' }}
              />
            </Grid>
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
                                    value={"MCA: List of companies & LLP - PDF format"}
                                    disabled={field4.uploading}
                                  >
                                    <MenuItem value={"MCA: List of companies & LLP - PDF format"}>MCA: List of companies & LLP - PDF Format</MenuItem>
                                  </Select>
                                )}
                              </FormControl>
                              <input
                                id={`image-upload-input4-${index}`}
                                type="file"
                                onChange={(event) => handleFileChange4(index, event)}
                                style={{ display: 'none' }}
                                multiple
                              />
                              <Button variant="outlined" onClick={() => handleChooseImagesClick4(index)}>Choose Images</Button>
                              <Grid xs={2}>
                                <TextField label="Image Name" type="text" size="small" variant="outlined" value={field4.imageName4} disabled />
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
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox style={{ color: 'red' }} checked={includeimage3} onChange={handleChangeCheckbox} name="includeimage3" />
                }
                label="Image 3" style={{ color: 'red' }}
              />
            </Grid>
          </Box>
        </div>
        <div>
          <Card style={{ margin: '1%', padding: '1%' }}>
            <div className='row'>
              <Grid item xs={12}  >
                <Form>
                  <Row>
                    <Col xs={1}>
                      <BootstrapButton variant="primary" style={{ marginTop: '2%' }} onClick={() => handleButtonClick(parseInt(pepId || '0', 10), 1, 'image')}>
                        Profile
                      </BootstrapButton>
                    </Col>
                    <Col xs={1}>
                      <BootstrapButton variant="primary" style={{ marginTop: '2%' }} onClick={() => handleButtonClick(parseInt(pepId || '0', 10), 2, 'image')}>
                        Party
                      </BootstrapButton>
                    </Col>
                    <Col xs={1}>
                      <BootstrapButton variant="primary" style={{ marginTop: '2%' }} onClick={() => { setSelectedAction(3); handleButtonClicks(parseInt(pepId || '0', 10), 3); }}>
                        DIN
                      </BootstrapButton>
                    </Col>
                    <Col xs={1}>
                      <BootstrapButton variant="primary" style={{ marginTop: '2%' }} onClick={() => { setSelectedAction(4); handleButtonClicks(parseInt(pepId || '0', 10), 4); }}>
                        C.LLP
                      </BootstrapButton>
                    </Col>

                  </Row>
                </Form>
                <div>
                  {error && base64Image === null && pdfData.base64 === null && (
                    <p style={{ color: 'red' }}>{error}</p>
                  )}
                </div>
                {base64Image && (
                  <Row>
                    <Col xs={12} style={{ marginTop: '2%' }}>
                      <div>
                        <Image src={base64Image} alt="Preview" style={{ maxHeight: '250px', maxWidth: '300px' }} />
                      </div>
                    </Col>
                    <Col xs={12} style={{ marginTop: '2%' }}>
                      {showBlockProfileButton && !loading && (
                        <BootstrapButton
                          variant="secondary"
                          style={{ marginTop: '2%' }}
                          onClick={() => handleBlockClicke(pepId || '0', 1)}
                          disabled={blockButtonDisabled}
                        >
                          Block
                        </BootstrapButton>
                      )}
                    </Col>

                    <Col xs={12} style={{ marginTop: '2%' }}>
                      {showBlockPartyButton && !loading && (
                        <BootstrapButton
                          variant="secondary"
                          style={{ marginTop: '2%' }}
                          onClick={() => handleBlockClickes(pepId || '0', 2)}
                          disabled={blockButtonDisabled}
                        >
                          Block
                        </BootstrapButton>
                      )}
                    </Col>

                  </Row>
                )}
                {pdfData.base64 && (
                  <Col xs={12} style={{ marginTop: '2%' }}>
                    <div>
                      <h2>PDF Preview</h2>
                      <iframe
                        title="PDF Preview"
                        width="50%"
                        height="600px"
                        style={{ border: 'none' }}
                        src={`data:application/pdf;base64,${pdfData.base64}`}
                      />
                      {pdfData.filename && (
                        <div style={{ marginTop: '10px' }}>
                          <a
                            href={`data:application/pdf;base64,${pdfData.base64}`}
                            download={pdfData.filename}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              textDecoration: 'none',
                              padding: '10px',
                              backgroundColor: '#2a75bb',
                              color: 'white',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            Download PDF
                          </a>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="contained"
                      onClick={handleBlockClick}
                      disabled={blockButtonDisableds || selectedAction === null}
                    >
                      Block PDF
                    </Button>
                  </Col>
                )}

                <Form>
                  <div>
                    {formDatas.combinedDTO && formDatas.combinedDTO.length > 0 ? (
                      <>
                        <BootstrapButton
                          variant="primary"
                          style={{ marginTop: '2%' }}
                          onClick={() =>
                            handleCompanyFiles(
                              formDatas.combinedDTO[0].companiesDirectorsDTOS.length > 0
                                ? formDatas.combinedDTO[0].companiesDirectorsDTOS[0].din
                                : ''
                            )
                          }
                        >
                          Company File
                        </BootstrapButton>

                        {selectedDin && companyNames.length > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            {companyNames.some(company => company.pathId === 5) && (
                              <div style={{ width: '45%' }}>
                                <h2>Company</h2>
                                <div>
                                  {companyNames
                                    .filter(company => company.pathId === 5)
                                    .map((company, index) => (
                                      <p
                                        key={index}
                                        style={{
                                          cursor: 'pointer',
                                          color: 'blue',
                                          textDecoration: 'underline',
                                        }}
                                        onClick={() => {
                                          console.log('Company ID:', company.id);
                                          console.log('Company Name:', company.companyName);
                                          console.log('Path ID:', company.pathId);
                                          handleCompany(
                                            company.companyId,
                                            company.id.toString(),
                                            company.pathId
                                          );
                                        }}
                                      >
                                        {company.companyName}
                                      </p>
                                    ))}
                                </div>
                              </div>
                            )}

                            {companyNames.some(company => company.pathId === 6) && (
                              <div style={{ width: '45%' }}>
                                <h2>Director</h2>
                                <div>
                                  {companyNames
                                    .filter(company => company.pathId === 6)
                                    .map((company, index) => (
                                      <p
                                        key={index}
                                        style={{
                                          cursor: 'pointer',
                                          color: 'blue',
                                          textDecoration: 'underline',
                                        }}
                                        onClick={() => {
                                          // console.log('Company ID:', company.id);
                                          // console.log('Company Name:', company.companyName);
                                          // console.log('Path ID:', company.pathId);
                                          handleCompany(
                                            company.companyId,
                                            company.id.toString(),
                                            company.pathId
                                          );
                                        }}
                                      >
                                        {company.companyName}
                                      </p>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <p>No data available</p>
                    )}
                  </div>
                  <div>
                    <BootstrapButton
                      variant="primary"
                      style={{ marginTop: '2%' }}
                      onClick={() =>
                        fetchCompanyData(
                          formDatas.combinedDTO?.[0]?.companiesDirectorsDTOS?.[0]?.din
                        )
                      }
                    >
                      Companies File Insert
                    </BootstrapButton>

                    {loading && <p>Loading...</p>}
                    {error && <p>Error fetching data: {error}</p>}
                    <ul>
                      {companyData.length > 0 ? (
                        companyData.map((company) => (
                          <li key={company.companyId}>
                            <a
                              href="#"
                              onClick={() => handleCompanyClick(company.companyId)}
                              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                              {company.companyName}
                            </a>
                          </li>
                        ))
                      ) : null}
                    </ul>

                    {selectedCompanyId !== null && (
                      <FileEditCompany
                        open={showFileUploadModal}
                        onClose={() => setShowFileUploadModal(false)}
                        companyId={selectedCompanyId}
                      />
                    )}
                  </div>

                  {activeCompanyId && noDocumentAvailable && (
                    <Button variant="outlined" onClick={handleEditClick}>Insert File</Button>
                  )}
                  {pathId !== undefined && associatedId !== undefined && (
                    <PdfModal
                      show={showPdfModal}
                      onHide={() => setShowPdfModal(false)}
                      pdfBase64={currentPdfBase64}
                      blockButtonText={blockButtonText}
                      editButtonText="Edit"
                      blockButtonDisableds={blockButtonDisableds}
                      editButtonDisabled={false}
                      handleFileChange3={handleFileChange3}
                      handleChoosecompanyImagesClick3={handleChoosecompanyImagesClick3}
                      pathId={pathId}
                      associatedId={companyIds}
                      companyId={companyIds}
                      personIndex={0}
                    />
                  )}
                </Form>
              </Grid>
            </div>
          </Card>
          <Box m={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEdit(pepId || '', uid || '', 0, 0, 0, 0, 0, 0, '')}
              disabled={submissionSuccess}
            >
              Edit & Approve
            </Button>
            {checkboxError && <div style={{ color: 'red' }}>{checkboxError}</div>}
          </Box>
        </div>
      </Box >
    </>
  );
};

export default Details;
