

// import React, { useEffect, useRef, useState } from 'react';
// import { Container, Box, Grid, Table, TableBody, TableHead, TableCell, TableContainer, TableRow, Paper, Typography } from '@mui/material';
// import { List, ListItem, ListItemText, ListItemIcon, Collapse } from '@mui/material';
// import { AccountCircle, Group, People, Business, AttachMoney, Description } from '@mui/icons-material';
// import { Button } from 'react-bootstrap';
// import ViewPageDetailsService from '../../data/services/viewpage/viewpagedetails-api-service';
// import { AkaDetRequest, CustomerRequest, Emailids, Father, Mother, NumberofHUTs, OtherAssociationRequest, PartyRequest, Payload, PhoneNumbers, Relative, RelativePayload, Spouse } from '../../data/services/viewpage/viewpagedetails-payload';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import updateQcCustomer from '../../data/services/viewpage/viewpagedetails-api-service';
// import { CustomerEditData } from '../../data/services/Reports/CustomerEdit/customeredit-payload';
// import AssociatedlistPayload from '../../data/services/insert/dto/AssociatedlistPayload';
// import AddressApiService from '../../data/services/insert/address-api-service';
// import { Form, Card, Col, Row, Image } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import CountryApiService from '../../data/services/master/Country/country_api_service';
// import StateApiService from '../../data/services/master/State/state_api_service';
// import { faUserCircle, faUsers, faMobile, faUser, faFlag, faVenus, faMars, faSkull, faBuilding, faIdCard, faBirthdayCake, faSync, faCalendarAlt, faGlobe, faMapMarker, faInfoCircle, faUserTie, faIndustry, faChild, faExternalLinkAlt, faHome, faGraduationCap, faPerson } from '@fortawesome/free-solid-svg-icons';
// import Header from '../../layouts/header/header';
// import profile from '../../assets/Avatar.png';
// import IdentifyApiService from '../../data/services/Identify/Identify_api_service';
// import jsPDF, { jsPDFOptions } from 'jspdf';
// import 'jspdf-autotable';
// import { renderToString } from 'react-dom/server';
// import html2canvas from 'html2canvas';
//
// interface CompanyItem {
//     companyDTO: {
//         listAdverseInformation: number | string; // Adjust the type accordingly
//         listRegulatoryAction: number | string;
//         listGovernment: number | string;
//     };
// }

// interface Country {
//     id: string;
//     name: string;
// }

// interface CustomerData {
//     createdAt?: string;
// }

// interface State {
//     id: string;
//     countryId: string;
//     stateName: string;
// }

// interface CategoryName {
//     name: string;
//     id: string;
// }

// const NewViews: React.FC = () => {
//     const location = useLocation();
//     const { pepId, uid, entity } = useParams();
//     const strongStyle = { marginRight: '10px' };
//     const [fathers, setFathers] = useState<Father[]>([]);
//     const [mothers, setMothers] = useState<Mother[]>([]);
//     const [NumberofHUTss, setNumberofHUTss] = useState<NumberofHUTs[]>([]);
//     const [Spouses, setSpouses] = useState<Spouse[]>([]);
//     const customer = new ViewPageDetailsService();
//     const viewPageService = new ViewPageDetailsService();
//     const [customerData, setCustomerData] = useState<CustomerData>({})
//     const [associatedList, setAssociatedList] = useState<AssociatedlistPayload[]>([]);
//     const authService = new CountryApiService();
//     const [countries, setCountries] = useState<Country[]>([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [states, setStates] = useState<State[]>([]);
//     const authServices = new StateApiService();
//     const [isButtonDisabled, setIsButtonDisabled] = useState(false);
//     const backendColumns = ['Photo', 'Name', 'Category', 'Country', 'State', 'PAN', 'AKA Names', 'Date of Birth', 'Place of Birth', 'Gender', 'Education', 'Position in the Government', 'Died', 'Company / LLP Details', 'Previous Company / LLP Details', 'Other Information', 'Potentially Associated Directors', 'Potentially Associated Companies', 'Family Details', 'Source Link', 'Pep Id', 'Last Created Date', 'Request For Update'];
//     const [showPreviousCompanyDetails, setShowPreviousCompanyDetails] = useState(false);
//     const [showCompanyDetails, setShowCompanyDetails] = useState(false);
//     const [showFamilyDetails, setShowFamilyDetails] = useState(false);
//     const [showFullOtherInformation, setShowFullOtherInformation] = useState(false);
//     const [showMoreDetails, setShowMoreDetails] = useState(false);
//     const [showMoreLLPsDetails, setShowMoreLLPsDetails] = useState(false);
//     const [showAllRows, setShowAllRows] = useState(false);
//     const [categoryName, setCategoryName] = useState<CategoryName[]>([]);
//     const identifyApiService = new IdentifyApiService();
//     const componentRef = useRef<HTMLDivElement | null>(null);
//     const [showTable, setShowTable] = useState(false);
//     const [isHovered, setIsHovered] = useState(false);
//     const tableRef = useRef(null);
//     const [loading, setLoading] = useState(false);
//     const [showFullPosition, setShowFullPosition] = useState(false);
//     const [isTextBoxVisible, setIsTextBoxVisible] = useState(false);
//     const [textBoxValue, setTextBoxValue] = useState('');
//     const textAreaRef = useRef<HTMLDivElement>(null);
//     const [isError, setIsError] = useState(false);
//     const maxLength = 100;
//     const [showFull, setShowFull] = useState(false);


//     const handleMouseOver = () => {
//         setIsHovered(true);
//     };

//     const handleMouseOut = () => {
//         setIsHovered(false);
//     };

//     const buttonStyle = {
//         backgroundColor: isHovered ? '#135688' : '#1976D2',
//         color: '#fff',
//     };

//     const fetchCustomerData = async () => {
//         try {
//             const customerList = await viewPageService.getCustomerList();
//             const matchingCustomer = customerList.find((customer: { id: any; }) => String(customer.id) === pepId);
//             if (matchingCustomer) {
//                 setCustomerData(matchingCustomer);
//             } else {
//                 console.error(`Customer with pepId ${pepId} not found`);
//             }
//         } catch (error) {
//             console.error('Error fetching customer list:', error);
//         }
//     };

//     const fetchCategory = async () => {
//         try {
//             const categoryName = await identifyApiService.getCategory();
//             setCategoryName(categoryName);
//         } catch (error) {
//             console.error("Error fetching Category Name:", error);
//         }
//     };

//     useEffect(() => {
//         fetchCustomerData();
//         fetchCategory();
//     }, [pepId]);

//     const [formData, setFormData] = useState<CustomerRequest>({
//         name: '',
//         sourceLink: '',
//         education: '',
//         placeOfBirth: '',
//         dob: '',
//         pan: '',
//         directorsIdentificationNumber: '',
//         uid: '',
//         createdAt: '',
//         genderId: 0,
//     });

//     const [akaformData, setAkaFormData] = useState<AkaDetRequest[]>([{ akaName: '' }]);
//     const [associationaspermedia, setAssociationaspermedia] = useState<OtherAssociationRequest[]>([{ otherAssociationAsPerMedia: '' }]);
//     const [PartyformData, setPartyFormData] = useState<PartyRequest[]>([
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
//                         uid: 0,
//                         files3: [],
//                         // path: [4,5,6],
//                         path: [],
//                         euid: 0,
//                     },
//                 ],

//             },
//         ],
//     });

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

//     const [relative, setRelative] = useState<Relative[]>([]);
//     const [PhoneNumberss, setPhoneNumberss] = useState<PhoneNumbers[]>([]);
//     const [Emailidss, setEmailidss] = useState<Emailids[]>([]);
//     const [appendedData, setAppendedData] = useState<CustomerEditData[]>([]);
//     const [serialNumber, setSerialNumber] = useState(1);
//     const navigate = useNavigate();

//     const handleEditClick = (pepId: string, uid: string) => {
//         navigate(`/Edit/${pepId}/${uid}`);
//     };

//     const fetchCountries = async () => {
//         try {
//             const countriesData = await authService.getCountryOptions();
//             setCountries(countriesData);
//             const statesData = await authServices.getStateDataByCountryId();
//             setStates(statesData);
//         } catch (error) {
//             console.error("Error fetching Country/State:", error);
//         }
//     };

//     const viewPageDetailsService = new ViewPageDetailsService();
//     // useEffect(() => {
//     //     fetchProfilePicture(parseInt(pepId || '0', 10), 1);
//     //     fetchCountries();
//     //     const fetchCustomer = async (pepId: string, uid: string) => {
//     //         try {
//     //             const customerData = await customer.getcustomer(pepId);
//     //             if (customerData.createCustomerRequest) {
//     //                 const {
//     //                     name,
//     //                     sourceLink,
//     //                     education,
//     //                     dob,
//     //                     placeOfBirth,
//     //                     pan,
//     //                     directorsIdentificationNumber,
//     //                     createdAt,
//     //                     genderId,
//     //                 } = customerData.createCustomerRequest;
//     //                 setFormData({
//     //                     name: name || '',
//     //                     sourceLink: sourceLink || '',
//     //                     education: education || '',
//     //                     placeOfBirth: placeOfBirth || '',
//     //                     dob: dob || '',
//     //                     pan: pan || '',
//     //                     directorsIdentificationNumber: directorsIdentificationNumber || '',
//     //                     uid: uid,
//     //                     createdAt: createdAt || '',
//     //                     genderId: genderId || '',
//     //                 });
//     //             }
//     //             {
//     //                 formData.sourceLink && (
//     //                     <a href={formData.sourceLink} target="_blank" rel="noopener noreferrer">
//     //                         {formData.sourceLink}
//     //                     </a>
//     //                 )
//     //             }

//     //             if (customerData.akaDetDataList) {
//     //                 setAkaFormData(
//     //                     customerData.akaDetDataList.map((aka: { akaName: string }) => ({ akaName: aka.akaName || '' }))
//     //                 );
//     //             }
//     //             setPartyFormData((prevData) => [
//     //                 {
//     //                     ...prevData[0],
//     //                     formerAndCurrent: customerData.partyDataList[0]?.formerAndCurrent || '',
//     //                     stateId: customerData.partyDataList[0]?.stateId || '',
//     //                     countryId: customerData.partyDataList[0]?.countryId || '',
//     //                     otherInformation: customerData.partyDataList[0]?.otherInformation || '',
//     //                     died: customerData.partyDataList[0]?.died || '',
//     //                     permanentAddress: customerData.partyDataList[0]?.permanentAddress || '',
//     //                 },
//     //             ]);

//     //             if (customerData.otherAssociationDataList) {
//     //                 setAssociationaspermedia(
//     //                     customerData.otherAssociationDataList.map((aka: { otherAssociationAsPerMedia: string }) => ({ otherAssociationAsPerMedia: aka.otherAssociationAsPerMedia || '' }))
//     //                 );
//     //             }
//     //             if (customerData.combinedDTO) {
//     //                 setformDatas({
//     //                     combinedDTO: customerData.combinedDTO

//     //                 });
//     //             }
//     //             if (customerData.relativeCombineDTOList) {
//     //                 setRelativeFormData({
//     //                     relativeCombineDTO: customerData.relativeCombineDTOList

//     //                 });
//     //             }
//     //             if (customerData.Relative) {
//     //                 setRelative(
//     //                     customerData.Relative.map((aka: { name: string }) => ({ name: aka.name || '' }))
//     //                 );
//     //             }
//     //             if (customerData.relativeDataList) {
//     //                 setFathers(
//     //                     customerData.relativeDataList
//     //                         .filter((father: Father) => parseInt(father.relativeMasterId, 10) === 4)
//     //                         .map((father: Father) => ({
//     //                             relativeMasterId: 4,
//     //                             relativeName: father.relativeName || '',
//     //                             pan: father.pan || '',
//     //                         }))
//     //                 );
//     //                 setMothers(
//     //                     customerData.relativeDataList
//     //                         .filter((mother: Mother) => parseInt(mother.relativeMasterId, 10) === 6)
//     //                         .map((mother: Mother) => ({
//     //                             relativeMasterId: 6,
//     //                             relativeName: mother.relativeName || '',
//     //                             pan: mother.pan || '',
//     //                         }))
//     //                 );
//     //                 setNumberofHUTss(
//     //                     customerData.relativeDataList
//     //                         .filter((numberofHUTs: NumberofHUTs) => parseInt(numberofHUTs.relativeMasterId, 10) === 1)
//     //                         .map((numberofHUTs: NumberofHUTs) => ({
//     //                             relativeMasterId: 1,
//     //                             relativeName: numberofHUTs.relativeName || '',
//     //                             pan: numberofHUTs.pan || '',
//     //                         }))
//     //                 );
//     //                 setSpouses(
//     //                     customerData.relativeDataList
//     //                         .filter((spouse: Spouse) => parseInt(spouse.relativeMasterId, 10) === 33)
//     //                         .map((spouse: Spouse) => ({
//     //                             relativeMasterId: 33,
//     //                             relativeName: spouse.relativeName || '',
//     //                             pan: spouse.pan || '',
//     //                         }))
//     //                 );
//     //             }
//     //             if (customerData.contactsDetailsDataList) {
//     //                 setPhoneNumberss(
//     //                     customerData.contactsDetailsDataList
//     //                         .filter((PhoneNumbers: PhoneNumbers) => PhoneNumbers.communicationTypeId === 1)
//     //                         .map((PhoneNumbers: PhoneNumbers) => ({
//     //                             communicationTypeId: 1,
//     //                             communicationDt: PhoneNumbers.communicationDt || '',
//     //                         }))
//     //                 );
//     //                 setEmailidss(
//     //                     customerData.contactsDetailsDataList
//     //                         .filter((Email: Emailids) => Email.communicationTypeId === 2)
//     //                         .map((Email: Emailids) => ({
//     //                             communicationTypeId: 2,
//     //                             communicationDt: Email.communicationDt || '',
//     //                         }))
//     //                 );
//     //                 if (customerData.relativeCombineDTOList) {
//     //                     setRelativeFormData({
//     //                         relativeCombineDTO: customerData.relativeCombineDTOList,
//     //                     });
//     //                 }
//     //                 if (customerData.partyDataList && customerData.partyDataList.length > 0) {
//     //                     setPartyFormData((prevData) => [
//     //                         {
//     //                             ...prevData[0],
//     //                             formerAndCurrent: customerData.partyDataList[0].formerAndCurrent || '',
//     //                             stateId: customerData.partyDataList[0].stateId || '',
//     //                             countryId: customerData.partyDataList[0].countryId || '',
//     //                             otherInformation: customerData.partyDataList[0].otherInformation || '',
//     //                             died: customerData.partyDataList[0].died || '',
//     //                             permanentAddress: customerData.partyDataList[0].permanentAddress || '',
//     //                         },
//     //                     ]);
//     //                 } else {
//     //                     console.log('No party data available');
//     //                 }
//     //             }
//     //             if (customerData.createCustomerRequest) {
//     //                 await customer.updateQcCustomer(pepId, uid, 'QcView');
//     //             }
//     //         } catch (error) {
//     //             console.error('Error fetching customer data:', error);
//     //         }
//     //     };
//     //     if (pepId && uid) {
//     //         fetchCustomer(pepId, uid);
//     //     }
//     //     window.scrollTo(0, 0);
//     // }, [pepId, uid]);

//     const [adverseInformation, setAdverseInformation] = useState('');
//     const [regulatoryAction, setRegulatoryAction] = useState('');
//     useEffect(() => {
//         const fetchCustomer = async (pepId: string, uid: string,) => {

//             try {
//                 const customerData = await customer.getcustomer(pepId);
//                 if (customerData.createCustomerRequest) {
//                     const {
//                         name,
//                         sourceLink,
//                         education,
//                         dob,
//                         placeOfBirth,
//                         pan,
//                         directorsIdentificationNumber,
//                         adverseInformation,
//                         regulatoryAction,
//                         genderId,
//                         createdAt,
//                     } = customerData.createCustomerRequest;
//                     if (adverseInformation) {
//                         setAdverseInformation(adverseInformation);
//                     }

//                     if (regulatoryAction) {
//                         setRegulatoryAction(regulatoryAction);
//                     }
//                     setFormData({
//                         name: name || '',
//                         sourceLink: sourceLink || '',
//                         education: education || '',
//                         placeOfBirth: placeOfBirth || '',
//                         dob: dob || '',
//                         pan: pan || '',
//                         genderId: genderId || '',
//                         directorsIdentificationNumber: directorsIdentificationNumber || '',
//                         adverseInformation: adverseInformation || '',
//                         regulatoryAction: regulatoryAction || '',
//                         uid: uid,
//                         createdAt: createdAt || '',
//                     });
//                 }
//                 {
//                     formData.sourceLink && (
//                         <a href={formData.sourceLink} target="_blank" rel="noopener noreferrer">
//                             {formData.sourceLink}
//                         </a>
//                     )
//                 }
//                 if (customerData.akaDetDataList) {
//                     setAkaFormData(
//                         customerData.akaDetDataList.map((aka: { akaName: string }) => ({ akaName: aka.akaName || '' }))
//                     );
//                 }


//                 if (customerData.otherAssociationDataList) {
//                     setAssociationaspermedia(
//                         customerData.otherAssociationDataList.map((aka: { otherAssociationAsPerMedia: string }) => ({ otherAssociationAsPerMedia: aka.otherAssociationAsPerMedia || '' }))
//                     );
//                 }
//                 if (customerData.combinedDTO) {
//                     setformDatas({
//                         combinedDTO: customerData.combinedDTO

//                     });
//                 }
//                 if (customerData.relativeCombineDTOList) {
//                     setRelativeFormData({
//                         relativeCombineDTO: customerData.relativeCombineDTOList

//                     });
//                 }
//                 if (customerData.Relative) {
//                     setRelative(
//                         customerData.Relative.map((aka: { name: string }) => ({ name: aka.name || '' }))
//                     );
//                 }

//                 if (customerData.contactsDetailsDataList) {
//                     setPhoneNumberss(
//                         customerData.contactsDetailsDataList
//                             .filter((PhoneNumbers: PhoneNumbers) => PhoneNumbers.communicationTypeId === 1)
//                             .map((PhoneNumbers: PhoneNumbers) => ({
//                                 communicationTypeId: 1,
//                                 communicationDt: PhoneNumbers.communicationDt || '',
//                             }))
//                     );
//                     setEmailidss(
//                         customerData.contactsDetailsDataList
//                             .filter((Email: Emailids) => Email.communicationTypeId === 2)
//                             .map((Email: Emailids) => ({
//                                 communicationTypeId: 2,
//                                 communicationDt: Email.communicationDt || '',
//                             }))
//                     );
//                     if (customerData.relativeCombineDTOList) {
//                         setRelativeFormData({
//                             relativeCombineDTO: customerData.relativeCombineDTOList,
//                         });
//                     }

//                     if (customerData.partyDataList && customerData.partyDataList.length > 0) {

//                         setPartyFormData(customerData.partyDataList);

//                         console.log('PartyformData:', PartyformData);


//                     } else {
//                         console.log('No party data available');
//                     }
//                 }

//             } catch (error) {
//                 console.error('Error fetching customer data:', error);
//             }
//         };

//         if (pepId && uid) {
//             fetchCustomer(pepId, uid);
//         }
//         window.scrollTo(0, 0);
//     }, [pepId, uid]);

//     const handleCloseClick = () => {
//         navigate('/CustomerEdit');
//     }

//     // const handleRequestForUpdateClick = async () => {
//     //     try {
//     //         const singlePayload = {
//     //             pepId: 0,
//     //             requestAt: '1',
//     //             requestUid: 0,
//     //             updatedUid: 0,
//     //             valid: 1,
//     //             updated: 'string',
//     //             requestForUpdate: '1',
//     //         };
//     //         const apiService = new ViewPageDetailsService();
//     //         const response = await apiService.saveRequestForUpdate(singlePayload);
//     //         if (response && response.success) {
//     //             setIsButtonDisabled(true);
//     //         }
//     //         setIsButtonDisabled(true);
//     //     } catch (error: any) {
//     //         console.error('Error:', error.response ? error.response.data : error.message);
//     //     }
//     // };

//     const handleUpdateClick = async (pepId: string, uid: string) => {
//         try {
//             const statusCall = 'QcApprove';
//             await viewPageDetailsService.updateEntry(pepId, uid, statusCall);
//             const storedData = localStorage.getItem('customerData');
//             if (storedData) {
//                 const transformedData = JSON.parse(storedData) as CustomerEditData[];
//                 setAppendedData((prevData) => {
//                     const updatedData = [...prevData, ...transformedData];
//                     return updatedData;
//                 });
//                 const hiddenPepIdsString = localStorage.getItem('hiddenPepIds');
//                 const hiddenPepIds = hiddenPepIdsString ? JSON.parse(hiddenPepIdsString) : [];
//                 const updatedHiddenPepIds = [...hiddenPepIds, pepId];
//                 localStorage.setItem('hiddenPepIds', JSON.stringify(updatedHiddenPepIds));
//             }
//             navigate(`/CustomerEdit/${pepId}`);
//         } catch (error) {
//             console.error('Error updating entry:', error);
//         }
//     };

//     function getAssociatedName(associateMasterdId: number) {
//         switch (associateMasterdId) {
//             case 1:
//                 return 'Private';
//             case 2:
//                 return 'LLP';
//             default:
//                 return 'Unknown';
//         }
//     }
//     function getgenderName(genderId: number) {
//         switch (genderId) {
//             case 1:
//                 return 'Male';
//             case 2:
//                 return 'FeMale';
//             case 3:
//                 return 'Others';

//         }
//     };
//     function getDesignationName(associateMasterdId: number) {
//         switch (associateMasterdId) {
//             case 1:
//                 return 'Designer';
//             case 2:
//                 return 'HR';
//             case 3:
//                 return 'Manager';
//             case 4:
//                 return 'Civil Engineer';
//             default:
//                 return 'Not Available';
//         }
//     }

//     const addressApiService = new AddressApiService();
//     const [base64Image, setBase64Image] = useState<string | null>(null);
//     const fetchImage = async (pepId: number, pathId: number) => {
//         try {
//             const imageData = await addressApiService.getImage(pathId, pepId);
//             const base64Image = arrayBufferToBase64(imageData);
//             setBase64Image(base64Image);
//         } catch (error) {
//             console.error('Error fetching image:', error);
//         }
//     };

//     const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
//         const binary = new Uint8Array(buffer);
//         const bytes = new Array(binary.length);

//         for (let i = 0; i < binary.length; i++) {
//             bytes[i] = String.fromCharCode(binary[i]);
//         }
//         const base64String = btoa(bytes.join(''));
//         return `data:image/png;base64,${base64String}`;
//     };

//     const handleButtonClick = (pepId: number, pathId: number) => {
//         fetchImage(pepId, pathId);
//     };

//     const isDataAvailable = () => {
//         return (
//             formData.sourceLink ||
//             formData.name ||
//             formData.pan ||
//             formData.education ||
//             formData.dob ||
//             akaformData.some((aka) => aka.akaName) ||
//             PhoneNumberss.some((item) => item.communicationDt) ||
//             Emailidss.some((item) => item.communicationDt)
//         );
//     };

//     const headingStyle = {
//         fontFamily: 'Times New Roman',
//         fontSize: '20px',
//     };

//     const nameStyle = {
//         fontFamily: 'Times New Roman',
//         fontSize: '25px',
//         fontWeight: 'bold',
//         margin: '0',
//     };

//     const getCountryNameById = (countryId: string) => {
//         const country = countries.find((c) => c.id === countryId);
//         return country ? country.name : '-';
//     };

//     const getStateNameById = (stateId: string) => {
//         const state = states.find((s) => s.id === stateId);
//         return state ? state.stateName : 'Not Available';
//     };

//     const [profileImageData, setProfileImageData] = useState<string | null>(null);
//     const fetchProfilePicture = async (pepId: number, pathId: number) => {
//         try {
//             const imageData = await addressApiService.getImage(pathId, pepId);
//             const profileImageData = arrayBufferToBase64(imageData);
//             setProfileImageData(profileImageData);
//         } catch (error) {
//             console.error('Error fetching image:', error);
//         }
//     };

//     const renderAkaNames = () => {
//         return (
//             akaformData && akaformData.some((aka) => aka.akaName.trim() !== '') ? (
//                 akaformData.map((aka) => (
//                     <span key={aka.akaName}>{aka.akaName}</span>
//                 ))
//             ) : (
//                 'Not Available'
//             )
//         );
//     };

//     const getColumnIcon = (columnName: string) => {
//         switch (columnName) {
//             case 'Photo':
//                 return <FontAwesomeIcon icon={faUserCircle} />;
//             case 'Name':
//                 return <FontAwesomeIcon icon={faUser} />;
//             case 'Category':
//                 return <FontAwesomeIcon icon={faUsers} />;
//             case 'Country':
//                 return <FontAwesomeIcon icon={faGlobe} />;
//             case 'State':
//                 return <FontAwesomeIcon icon={faFlag} />;
//             case 'PAN':
//                 return <FontAwesomeIcon icon={faIdCard} />;
//             case 'AKA Names':
//                 return <FontAwesomeIcon icon={faUser} />;
//             case 'Date of Birth':
//                 return <FontAwesomeIcon icon={faBirthdayCake} />;
//             case 'Place of Birth':
//                 return <FontAwesomeIcon icon={faMapMarker} />;
//             case 'Gender':
//                 return (
//                     <>
//                         <FontAwesomeIcon icon={faVenus} title="Female" />
//                         <FontAwesomeIcon icon={faMars} title="Male" />
//                     </>
//                 );
//             case 'Education':
//                 return <FontAwesomeIcon icon={faGraduationCap} />;
//             case 'Position in the Government':
//                 return <FontAwesomeIcon icon={faBuilding} />;
//             case 'Died':
//                 return <FontAwesomeIcon icon={faSkull} />;
//             case 'Company / LLP Details':
//                 return <FontAwesomeIcon icon={faBuilding} />;
//             case 'Previous Company / LLP Details':
//                 return <FontAwesomeIcon icon={faBuilding} />;
//             case 'Other Information':
//                 return <FontAwesomeIcon icon={faInfoCircle} />;
//             case 'Potentially Associated Directors':
//                 return <FontAwesomeIcon icon={faUserTie} />;
//             case 'Potentially Associated Companies':
//                 return <FontAwesomeIcon icon={faIndustry} />;
//             case 'Family Details':
//                 return <FontAwesomeIcon icon={faHome} />;
//             case 'Son Name':
//                 return <FontAwesomeIcon icon={faChild} />;
//             case 'PAN':
//                 return <FontAwesomeIcon icon={faIdCard} />;
//             case 'Daughter Name':
//                 return <FontAwesomeIcon icon={faChild} />;
//             case 'PAN':
//                 return <FontAwesomeIcon icon={faIdCard} />;
//             case 'Source Link':
//                 return <FontAwesomeIcon icon={faExternalLinkAlt} />;
//             case 'Pep Id':
//                 return <FontAwesomeIcon icon={faIdCard} />;
//             case 'Last Created Date':
//                 return <FontAwesomeIcon icon={faCalendarAlt} />;
//             case 'Request For Update':
//                 return <FontAwesomeIcon icon={faSync} />;
//             default:
//                 return null;
//         }
//     };

//     const toggleDetails = () => {
//         setShowMoreDetails(!showMoreDetails);
//     };

//     const toggleLLPsDetails = () => {
//         setShowMoreLLPsDetails(!showMoreLLPsDetails);
//     };

//     const renderTableRows = () => {
//         return backendColumns.map((columnName, index) => (
//             <TableRow key={columnName} style={{ height: '30px' }}>
//                 <TableCell>
//                     <div style={{ display: 'flex', alignItems: 'center', lineHeight: '1' }}>
//                         <span style={{ marginRight: '10px' }}>{getColumnIcon(columnName)}</span>
//                         <Typography variant="body1" fontWeight="bold" style={{ marginLeft: '3px', lineHeight: '1' }}>
//                             {columnName}
//                         </Typography>
//                     </div>
//                 </TableCell>
//                 <TableCell>
//                     <div style={{ marginLeft: '20px' }}>
//                         {renderColumnValue(columnName, formDatas)}
//                     </div>
//                 </TableCell>
//             </TableRow>
//         ));
//     };

//     const handleDownloadPDF = async () => {
//         try {
//             setLoading(true);
//             const tableElement = tableRef.current;
//             if (!tableElement) {
//                 console.error("Table element is null");
//                 return;
//             }
//             const canvas = await html2canvas(tableElement, { scale: 3 });
//             const pdf = new jsPDF({
//                 unit: 'mm',
//                 format: 'a4',
//                 orientation: 'portrait',
//                 precision: 16,
//                 putOnlyUsedFonts: true,
//                 floatPrecision: 16,
//             });
//             pdf.setLineWidth(0.5);
//             pdf.rect(5, 5, pdf.internal.pageSize.getWidth() - 10, pdf.internal.pageSize.getHeight() - 10);
//             pdf.setFontSize(14);
//             pdf.text('USER DETAILS', pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
//             pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 30);
//             pdf.save('user_details.pdf');
//         } catch (error) {
//             console.error('Error exporting to PDF:', error);
//         } finally {
//             setLoading(false);
//         }
//     };


//     const formatDate = (dateString: string | number | Date) => {
//         if (!dateString) {
//             return 'Not Available';
//         }
//         const date = new Date(dateString);
//         const day = date.getDate().toString().padStart(2, '0');
//         const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
//         const month = monthNames[date.getMonth()];
//         const year = date.getFullYear();
//         return `${day}-${month}-${year}`;
//     };

//     const getCategoryName = (entityId: string | undefined) => {
//         const parsedEntityId: number | string = entityId ? Number(entityId) : NaN;
//         const category = categoryName.find((cat) => cat.id.toString() === parsedEntityId.toString());
//         return category ? category.name : 'Not Available';
//     };

//     const handleRequestForUpdateClick = () => {
//         setIsTextBoxVisible(true);
//     };


//     const handleTextBoxSubmit = async () => {
//         if (!textBoxValue.trim()) {
//             setIsError(true);
//         } else {
//             try {
//                 const parsedPepId = pepId ? parseInt(pepId) : 0;
//                 const parsedUid = uid ? parseInt(uid) : 0;
//                 const payload = {
//                     pepId: parsedPepId,
//                     description: textBoxValue,
//                     uid: parsedUid,
//                 };
//                 const apiService = new ViewPageDetailsService();
//                 const response = await apiService.saveRequestDescription(payload);
//                 setIsButtonDisabled(true);
//                 handleRequestUpdateClick();
//             } catch (error) {
//                 console.error('Error submitting description:', error);
//             }
//         }
//     };

//     const handleRequestUpdateClick = async () => {
//         try {
//             const singlePayload = {
//                 pepId: 0,
//                 requestAt: '1',
//                 requestUid: 0,
//                 updatedUid: 0,
//                 valid: 1,
//                 updated: 'string',
//                 requestForUpdate: '1',
//             };
//             const apiService = new ViewPageDetailsService();
//             const response = await apiService.saveRequestForUpdate(singlePayload);
//             if (response && response.success) {
//                 setIsButtonDisabled(true);
//             }
//             setIsButtonDisabled(true);
//         } catch (error: any) {
//             console.error('Error:', error.response ? error.response.data : error.message);
//         }
//     };

//     const renderColumnValue = (columnName: string, formDatas: any) => {
//         switch (columnName) {
//             case 'Photo':
//                 if (profileImageData) {
//                     return (
//                         <img
//                             src={profileImageData}
//                             alt="Profile"
//                             style={{
//                                 width: '100px',
//                                 height: '100px',
//                             }}
//                         />
//                     );
//                 } else {
//                     return (
//                         <img
//                             src={profile}
//                             alt="Default Avatar"
//                             style={{
//                                 width: '100px',
//                                 height: '100px',
//                             }}
//                         />
//                     );
//                 }
//             case 'Name':
//                 return formData.name || 'Not Available';
//             case 'Category':
//                 const categoryName = getCategoryName(entity);
//                 return categoryName || 'Not Available';
//             case 'Country':
//                 return PartyformData[0].countryId || 'Not Available';
//             // case 'State':
//             //     return PartyformData[0].stateId || 'Not Available';
//             case 'State':
//                 const stateId = PartyformData[0].stateId;
//                 const stateName = getStateNameById(stateId);
//                 return stateName || 'Not Available';
//             case 'PAN':
//                 return formData.pan || 'Not Available';
//             case 'AKA Names':
//                 return renderAkaNames();
//             case 'Date of Birth':
//                 if (formData.dob) {
//                     const dobDate = new Date(formData.dob);
//                     const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
//                     const day = dobDate.getDate();
//                     const month = monthNames[dobDate.getMonth()];
//                     const year = dobDate.getFullYear();
//                     const formattedDate = `${day}-${month}-${year}`;
//                     return formattedDate;
//                 } else {
//                     return 'Not Available';
//                 }
//             case 'Place of Birth':
//                 return formData.placeOfBirth || 'Not Available';
//             case 'Gender':
//                 return getgenderName(formData.genderId) || 'Not Available';

//             // case 'Education':
//             //     return formData.education || 'Not Available';
//             case 'Education':
//                 const educationContent = formData.education;
//                 const displayContent = showFull
//                     ? educationContent
//                     : (educationContent && educationContent.length > maxLength)
//                         ? educationContent.slice(0, maxLength) + '...'
//                         : educationContent || 'Not Available';
//                 const toggleShowFull = () => {
//                     setShowFull(!showFull);
//                 };
//                 const shouldShowLink = educationContent && educationContent.length > maxLength;
//                 return (
//                     <div>
//                         {displayContent && <p>{displayContent}
//                             {shouldShowLink && (
//                                 <span
//                                     style={{
//                                         cursor: 'pointer',
//                                         color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))',
//                                         textDecoration: 'underline',
//                                     }}
//                                     onClick={toggleShowFull}
//                                 >
//                                     {showFull ? 'Show less' : 'Show more'}
//                                 </span>
//                             )}</p>}
//                     </div>
//                 );
//             case 'Position in the Government':
//                 const positionInTheGovernment = PartyformData[0].positionInTheGovernment || 'Not Available';
//                 const isTruncated = positionInTheGovernment.length > 100;
//                 const truncatedPosition = isTruncated
//                     ? showFullPosition
//                         ? positionInTheGovernment
//                         : positionInTheGovernment.slice(0, 100) + '...'
//                     : positionInTheGovernment;

//                 return (
//                     <>
//                         <span>{truncatedPosition}</span>
//                         {isTruncated && (
//                             <span
//                                 style={{
//                                     cursor: 'pointer',
//                                     color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))',
//                                     textDecoration: 'underline'
//                                 }}
//                                 onClick={() => setShowFullPosition(!showFullPosition)}
//                             >
//                                 {showFullPosition ? ' Show Less' : ' Show More'}
//                             </span>
//                         )}
//                     </>
//                 );
//             case 'Died':
//                 return PartyformData[0].died || 'Not Available';
//             // if (PartyformData[0].died) {
//             //     const dobDate = new Date(PartyformData[0].died);
//             //     const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
//             //     const day = dobDate.getDate();
//             //     const month = monthNames[dobDate.getMonth()];
//             //     const year = dobDate.getFullYear();
//             //     const formattedDate = `${day}-${month}-${year}`;
//             //     return formattedDate;
//             // } else {
//             //     return 'Not Available';
//             // }
//             // case 'Company / LLP Details':
//             //     const combinedDTO = formDatas.combinedDTO || { companyName: 'Not Available', designationId: 'Not Available' };
//             //     console.log(combinedDTO, "combinedDTO")
//             //     return (
//             //         <div>
//             //             {showMoreDetails ? (
//             //                 <TableContainer component={Paper}>
//             //                     <Table>
//             //                         <TableHead>
//             //                             <TableRow>
//             //                                 <TableCell><strong>Company LLP Name</strong></TableCell>
//             //                                 <TableCell><strong>Position</strong></TableCell>
//             //                                 <TableCell><strong>Original Date of Appointment</strong></TableCell>
//             //                                 <TableCell><strong>Date of Appointment At Current Designation</strong></TableCell>
//             //                                 <TableCell><strong>Date of Cessation</strong></TableCell>
//             //                             </TableRow>
//             //                         </TableHead>
//             //                         {/* <TableBody>
//             //                             {formDatas.combinedDTO.map((item: { companyDTO: { companyName: any; designationId: any; originalDateOfAppointment: any; dateOfAppointmentAtCurrentDesignation: any; dateOfCessation: any; }; }, index: React.Key | null | undefined) => (
//             //                                 <TableRow key={index}>
//             //                                     <TableCell>{item.companyDTO.companyName || 'Not Available'}</TableCell>
//             //                                     <TableCell>{getDesignationName(item.companyDTO.designationId) || 'Not Available'}</TableCell>
//             //                                     <TableCell>{formatDate(item.companyDTO.originalDateOfAppointment)}</TableCell>
//             //                                     <TableCell>{formatDate(item.companyDTO.dateOfAppointmentAtCurrentDesignation)}</TableCell>
//             //                                     <TableCell>{formatDate(item.companyDTO.dateOfCessation)}</TableCell>
//             //                                 </TableRow>
//             //                             ))}
//             //                         </TableBody> */}
//             //                         <TableBody>
//             //                             {formDatas.combinedDTO?.map((item: { companyDTO: { companyName: any; originalDateOfAppointment: any; }; }, index: React.Key | null | undefined) => (
//             //                                 <TableRow key={index}>
//             //                                     <TableCell>{item.companyDTO.companyName || 'Not Available'}</TableCell>
//             //                                     {/* <TableCell>{getDesignationName(item.companyDTO.designationId) || 'Not Available'}</TableCell> */}
//             //                                     <TableCell>{item.companyDTO.originalDateOfAppointment || 'Not Available'}</TableCell>
//             //                                     {/* <TableCell>{item.companyDTO.dateOfAppointmentAtCurrentDesignation || 'Not Available'}</TableCell> */}
//             //                                     {/* <TableCell>{item.companyDTO.dateOfCessation || 'Not Available'}</TableCell> */}
//             //                                 </TableRow>
//             //                             ))}
//             //                         </TableBody>
//             //                     </Table>
//             //                     <span
//             //                         style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline', marginLeft: '2%' }}
//             //                         onClick={toggleDetails}
//             //                     >
//             //                         Read Less
//             //                     </span>
//             //                 </TableContainer>
//             //             ) : (
//             //                 <><p>Company LLP Name: {combinedDTO[0]?.companyDTO.companyName || 'Not Available'}</p>
//             //                     <p>Position: {combinedDTO[0]?.companyDTO.designationId || 'Not Available'}</p>
//             //                     <span
//             //                         style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
//             //                         onClick={toggleDetails}
//             //                     >
//             //                         Read More
//             //                     </span>
//             //                 </>
//             //             )}
//             //         </div>
//             //     );
//             // case 'Previous Company / LLP Details':
//             //     const combinedDTOs = formDatas.combinedDTO || { companyName: 'Not Available', designationId: 'Not Available' };
//             //     return (
//             //         <div>
//             //             {showMoreLLPsDetails ? (
//             //                 <TableContainer component={Paper}>
//             //                     <Table>
//             //                         <TableHead>
//             //                             <TableRow>
//             //                                 <TableCell><strong>Company LLP Name</strong></TableCell>
//             //                                 <TableCell><strong>Position</strong></TableCell>
//             //                                 <TableCell><strong>Original Date of Appointment</strong></TableCell>
//             //                                 <TableCell><strong>Date of Appointment At Current Designation</strong></TableCell>
//             //                                 <TableCell><strong>Date of Cessation</strong></TableCell>
//             //                             </TableRow>
//             //                         </TableHead>
//             //                         <TableBody>
//             //                             {Array.isArray(combinedDTOs) ? (
//             //                                 combinedDTOs.map((item: { companyDTO: { companyName: any; designationId: any; originalDateOfAppointment: any; dateOfAppointmentAtCurrentDesignation: any; dateOfCessation: any; }; }, index: React.Key | null | undefined) => (
//             //                                     <TableRow key={index}>
//             //                                         <TableCell>{item.companyDTO.companyName || 'Not Available'}</TableCell>
//             //                                         <TableCell>{getDesignationName(item.companyDTO.designationId) || 'Not Available'}</TableCell>
//             //                                         <TableCell>{formatDate(item.companyDTO.originalDateOfAppointment)}</TableCell>
//             //                                         <TableCell>{formatDate(item.companyDTO.dateOfAppointmentAtCurrentDesignation)}</TableCell>
//             //                                         <TableCell>{formatDate(item.companyDTO.dateOfCessation)}</TableCell>
//             //                                     </TableRow>
//             //                                 ))
//             //                             ) : (
//             //                                 <TableRow>
//             //                                     <TableCell>{combinedDTOs.companyName || 'Not Available'}</TableCell>
//             //                                     <TableCell>{combinedDTOs.designationId || 'Not Available'}</TableCell>
//             //                                 </TableRow>
//             //                             )}
//             //                         </TableBody>
//             //                     </Table>
//             //                     <span
//             //                         style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline', marginLeft: '2%' }}
//             //                         onClick={toggleLLPsDetails}
//             //                     >
//             //                         Read Less
//             //                     </span>
//             //                 </TableContainer>
//             //             ) : (
//             //                 <div>
//             //                     <p>Company LLP Name: {combinedDTOs.companyName || 'Not Available'}</p>
//             //                     <p>Position: {combinedDTOs.designationId || 'Not Available'}</p>
//             //                     <span
//             //                         style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
//             //                         onClick={toggleLLPsDetails}
//             //                     >
//             //                         Read More
//             //                     </span>
//             //                 </div>
//             //             )}

//             //         </div>
//             //     );
//             case 'Company / LLP Details':
//                 const currentCompanyDTOs = formDatas.combinedDTO
//                     ? formDatas.combinedDTO.filter((item: { companiesDirectorsDTOS: { directorStatus: string; }[]; }) => item.companiesDirectorsDTOS[0].directorStatus === 'Current Company')
//                     : [];
//                 return (
//                     <>
//                         {formDatas.combinedDTO.length === 0 || currentCompanyDTOs.length === 0 ? (
//                             <p>Not Available</p>
//                         ) : (
//                             <>
//                                 {currentCompanyDTOs.length > 0 && (
//                                     <div>
//                                         {showMoreDetails ? (
//                                             <TableContainer component={Paper}>
//                                                 <Table>
//                                                     <TableHead>
//                                                         <TableRow>
//                                                             <TableCell><strong>Company LLP Name</strong></TableCell>
//                                                             <TableCell><strong>Position</strong></TableCell>
//                                                             <TableCell><strong>Director Status</strong></TableCell>
//                                                             <TableCell><strong>Original Date of Appointment</strong></TableCell>
//                                                             <TableCell><strong>Date of Appointment At Current Designation</strong></TableCell>
//                                                             <TableCell><strong>Date of Cessation</strong></TableCell>
//                                                         </TableRow>
//                                                     </TableHead>
//                                                     <TableBody>
//                                                         {currentCompanyDTOs.map((item: {
//                                                             companyDTO: any; companiesDirectorsDTOS: {
//                                                                 designation: string; companyDTO: { companyName: string; }; designationId: any; directorStatus: any; originalDateOfAppointment: any; appointmentDate: any; cessationDate: any;
//                                                             }[];
//                                                         }, index: number) => (
//                                                             <React.Fragment key={index}>
//                                                                 {showMoreDetails ? (
//                                                                     <TableRow>
//                                                                         <TableCell>{item.companyDTO.companyName || 'Not Available'}</TableCell>
//                                                                         <TableCell>{item.companiesDirectorsDTOS[0]?.designation || 'Not Available'}</TableCell>
//                                                                         <TableCell>{item.companiesDirectorsDTOS[0]?.directorStatus || 'Not Available'}</TableCell>
//                                                                         <TableCell>{item.companyDTO.originalDateOfAppointment || 'Not Available'}</TableCell>
//                                                                         <TableCell>{item.companiesDirectorsDTOS[0]?.appointmentDate || 'Not Available'}</TableCell>
//                                                                         <TableCell>{item.companiesDirectorsDTOS[0]?.cessationDate || 'Not Available'}</TableCell>
//                                                                     </TableRow>
//                                                                 ) : null}
//                                                             </React.Fragment>
//                                                         ))}

//                                                     </TableBody>
//                                                 </Table>
//                                                 <Grid item xs={12} sm={4}>
//                                     <TableCell>{adverseInformation && (<div>AdverseInformation</div>)}</TableCell>
//                                     <TableCell>{regulatoryAction && (<div>RegulatoryAction</div>)}</TableCell>
//                                     <TableCell>
//                                         {formDatas.combinedDTO && formDatas.combinedDTO.length > 0 ? (
//                                             formDatas.combinedDTO.map((item: CompanyItem, index: number) => (
//                                                 <div key={index}>
//                                                     {item.companyDTO.listAdverseInformation && 1 ?(
//                                                         <div style={{ fontSize: 'small' }}>listAdverseInformation</div>
//                                                     ): (
//                                                         <div>{/* Render something else or nothing */}</div>
//                                                     )}
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             ''
//                                         )}
//                                     </TableCell>
//                                     <TableCell>
//                                         {formDatas.combinedDTO && formDatas.combinedDTO.length > 0 ? (
//                                             formDatas.combinedDTO.map((item: CompanyItem, index: number) => (
//                                                 <div key={index}>
//                                                     {item.companyDTO.listRegulatoryAction && 1 ? (
//                                                         <div style={{ fontSize: 'small' }}>listRegulatoryAction</div>
//                                                     ) : (
//                                                         <div>{/* Render something else or nothing */}</div>
//                                                     )}
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             ''
//                                         )}
//                                     </TableCell>

//                                     <TableCell>
//                                         {formDatas.combinedDTO && formDatas.combinedDTO.length > 0 ? (
//                                             formDatas.combinedDTO.map((item: CompanyItem, index: number) => (
//                                                 <div key={index}>
//                                                     {item.companyDTO.listGovernment && 1 ? (
//                                                         <div style={{ fontSize: 'small' }}>listGovernment</div>
//                                                     ): (
//                                                         <div>{/* Render something else or nothing */}</div>
//                                                     )}
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             ''
//                                         )}
//                                     </TableCell>
//                                 </Grid>
//                                                 <span
//                                                     style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline', marginLeft: '2%' }}
//                                                     onClick={toggleDetails}
//                                                 >
//                                                     Read Less
//                                                 </span>
//                                             </TableContainer>
//                                         ) : (
//                                             <>
//                                                 <p>Company LLP Name : {currentCompanyDTOs[0]?.companyDTO.companyName || 'Not Available'}</p>
//                                                 <p>Position : {currentCompanyDTOs[0]?.companiesDirectorsDTOS[0]?.designation || 'Not Available'}</p>
//                                                 <span
//                                                     style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
//                                                     onClick={toggleDetails}
//                                                 >
//                                                     Read More
//                                                 </span>
//                                             </>
//                                         )}
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </>
//                 );
//             case 'Previous Company / LLP Details':
//                 const previousCompanyDTOs = formDatas.combinedDTO
//                     ? formDatas.combinedDTO.filter((item: { companiesDirectorsDTOS: { directorStatus: string; }[]; }) => item.companiesDirectorsDTOS[0].directorStatus === 'Previous Company')
//                     : [];
//                 return (
//                     <>
//                         {formDatas.combinedDTO.length === 0 ? (
//                             <p>Not Available</p>
//                         ) : (
//                             <>
//                                 {previousCompanyDTOs.length > 0 ? (
//                                     <div>
//                                         {showMoreLLPsDetails ? (
//                                             <TableContainer component={Paper}>
//                                                 <Table>
//                                                     <TableHead>
//                                                         <TableRow>
//                                                             <TableCell><strong>Company LLP Name</strong></TableCell>
//                                                             <TableCell><strong>Position</strong></TableCell>
//                                                             <TableCell><strong>Director Status</strong></TableCell>
//                                                             <TableCell><strong>Original Date of Appointment</strong></TableCell>
//                                                             <TableCell><strong>Date of Appointment At Current Designation</strong></TableCell>
//                                                             <TableCell><strong>Date of Cessation</strong></TableCell>
//                                                         </TableRow>
//                                                     </TableHead>
//                                                     <TableBody>
//                                                         {previousCompanyDTOs.map((item: {
//                                                             companyDTO: any; companiesDirectorsDTOS: { companyDTO: any; designation: any; directorStatus: any; originalDateOfAppointment: any; appointmentDate: any; cessationDate: any; }[];
//                                                         }, index: number) => (
//                                                             <TableRow key={index}>
//                                                                 <TableCell>{item.companyDTO.companyName || 'Not Available'}</TableCell>
//                                                                 <TableCell>{item.companiesDirectorsDTOS[0]?.designation || 'Not Available'}</TableCell>
//                                                                 <TableCell>{item.companiesDirectorsDTOS[0]?.directorStatus || 'Not Available'}</TableCell>
//                                                                 <TableCell>{item.companyDTO.originalDateOfAppointment || 'Not Available'}</TableCell>
//                                                                 <TableCell>{item.companiesDirectorsDTOS[0]?.appointmentDate || 'Not Available'}</TableCell>
//                                                                 <TableCell>{item.companiesDirectorsDTOS[0]?.cessationDate || 'Not Available'}</TableCell>
//                                                             </TableRow>
//                                                         ))}
//                                                     </TableBody>
//                                                 </Table>
//                                                 <span
//                                                     style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline', marginLeft: '2%' }}
//                                                     onClick={toggleLLPsDetails}
//                                                 >
//                                                     Read Less
//                                                 </span>
//                                             </TableContainer>
//                                         ) : (
//                                             <div>
//                                                 <p>Company LLP Name : {previousCompanyDTOs[0]?.companyDTO.companyName || 'Not Available'}</p>
//                                                 <p>Position : {previousCompanyDTOs[0]?.companiesDirectorsDTOS[0]?.designation || 'Not Available'}</p>
//                                                 <span
//                                                     style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
//                                                     onClick={toggleLLPsDetails}
//                                                 >
//                                                     Read More
//                                                 </span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ) : (
//                                     <p>Not Available</p>
//                                 )}
//                             </>
//                         )}
//                     </>
//                 );
//             case 'Other Information':
//                 const otherInformation = PartyformData[0]?.otherInformation || 'Not Available';
//                 const toggleReadMore = () => {
//                     setShowFullOtherInformation(!showFullOtherInformation);
//                 };
//                 if (otherInformation.length > 200 && !showFullOtherInformation) {
//                     return (
//                         <div>
//                             {otherInformation.substring(0, 200) + '...'}
//                             <span
//                                 style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
//                                 onClick={toggleReadMore}
//                             >
//                                 Read More
//                             </span>
//                         </div>
//                     );
//                 } else {
//                     return (
//                         <div>
//                             {otherInformation}
//                             {otherInformation.length > 200 && (
//                                 <span
//                                     style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
//                                     onClick={toggleReadMore}
//                                 >
//                                     Read Less
//                                 </span>
//                             )}
//                         </div>
//                     );
//                 }
//             case 'Potentially Associated Directors':
//                 return "Not Available";
//             case 'Potentially Associated Companies':
//                 return "Not Available";
//             case 'Family Details':
//                 return (
//                     <div>
//                         {RelativeformData.relativeCombineDTO && RelativeformData.relativeCombineDTO.length > 0 ? (
//                             <>
//                                 <Typography
//                                     component="span"
//                                     style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
//                                     onClick={() => setShowFamilyDetails(!showFamilyDetails)}
//                                 >
//                                     {showFamilyDetails ? 'Hide More Details' : 'Show More Details'}
//                                 </Typography>
//                                 <Collapse in={showFamilyDetails}>
//                                     <div>
//                                         {RelativeformData.relativeCombineDTO && RelativeformData.relativeCombineDTO.length > 0 ? (
//                                             <TableContainer component={Paper}>
//                                                 <Table>
//                                                     <TableHead>
//                                                         <TableRow>
//                                                             <TableCell><strong>Spouse Name</strong></TableCell>
//                                                             <TableCell><strong>Spouse PAN</strong></TableCell>
//                                                             <TableCell><strong>Children Name</strong></TableCell>
//                                                             <TableCell><strong>Children Pan</strong></TableCell>
//                                                         </TableRow>
//                                                     </TableHead>
//                                                     <TableBody>
//                                                         {RelativeformData.relativeCombineDTO?.map((item, index) => {
//                                                             const hasNonEmptyData =
//                                                                 (item.relativeDetDTOS && item.relativeDetDTOS.some(contact => contact.name || contact.pan)) ||
//                                                                 (item.relativeChildrenDTOS && item.relativeChildrenDTOS.some(contact => contact.childrenName || contact.pan));

//                                                             return (
//                                                                 hasNonEmptyData && (
//                                                                     <TableRow key={index}>
//                                                                         <TableCell>
//                                                                             {item.relativeDetDTOS && item.relativeDetDTOS.length > 0 ? (
//                                                                                 item.relativeDetDTOS.map((contact, contactIndex) => (
//                                                                                     <p key={contactIndex}>{contact.name || '_'}</p>
//                                                                                 ))
//                                                                             ) : (
//                                                                                 <p>_</p>
//                                                                             )}
//                                                                         </TableCell>
//                                                                         <TableCell>
//                                                                             {item.relativeDetDTOS && item.relativeDetDTOS.length > 0 ? (
//                                                                                 item.relativeDetDTOS.map((contact, contactIndex) => (
//                                                                                     <p key={contactIndex}>{contact.pan || '_'}</p>
//                                                                                 ))
//                                                                             ) : (
//                                                                                 <p>_</p>
//                                                                             )}
//                                                                         </TableCell>
//                                                                         <TableCell>
//                                                                             {item.relativeChildrenDTOS && item.relativeChildrenDTOS.length > 0 ? (
//                                                                                 item.relativeChildrenDTOS.map((contact, contactIndex) => (
//                                                                                     <p key={contactIndex}>{contact.childrenName || '_'}</p>
//                                                                                 ))
//                                                                             ) : (
//                                                                                 <p>_</p>
//                                                                             )}
//                                                                         </TableCell>
//                                                                         <TableCell>
//                                                                             {item.relativeChildrenDTOS && item.relativeChildrenDTOS.length > 0 ? (
//                                                                                 item.relativeChildrenDTOS.map((contact, contactIndex) => (
//                                                                                     <p key={contactIndex}>{contact.pan || '_'}</p>
//                                                                                 ))
//                                                                             ) : (
//                                                                                 <p>_</p>
//                                                                             )}
//                                                                         </TableCell>
//                                                                     </TableRow>
//                                                                 )
//                                                             );
//                                                         })}
//                                                     </TableBody>
//                                                 </Table>
//                                             </TableContainer>
//                                         ) : (
//                                             <p>Not Available</p>
//                                         )}
//                                     </div>
//                                 </Collapse>
//                             </>
//                         ) : (
//                             <p>Not Available</p>
//                         )}
//                     </div>
//                 );
//             case 'Source Link':
//                 const sourceLink = formData.sourceLink;
//                 return (
//                     <div>
//                         {sourceLink ? (
//                             sourceLink.split('\n').map((link, index) => (
//                                 <React.Fragment key={index}>
//                                     <p style={{ marginBottom: '-14px' }}>
//                                         <a href={link} target="_blank" rel="noopener noreferrer">
//                                             {link}
//                                         </a>
//                                     </p>
//                                     {index < sourceLink.split('\n').length - 1 && <br />}
//                                 </React.Fragment>
//                             ))
//                         ) : (
//                             <p style={{ marginBottom: '5px' }}>Not Available</p>
//                         )}
//                     </div>
//                 );
//             case 'Pep Id':
//                 return pepId || 'Not Available';
//             case 'Last Created Date':
//                 const createdAt = customerData.createdAt;
//                 return createdAt ? new Date(createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not Available';
//             // case 'Request For Update':
//             //     return (
//             //         <div>
//             //             <Button
//             //                 variant="contained"
//             //                 color="primary"
//             //                 style={{ backgroundColor: '#8badcf' }}
//             //                 onClick={handleRequestForUpdateClick}
//             //                 disabled={isButtonDisabled}
//             //             >
//             //                 Request for Update
//             //             </Button>
//             //         </div>
//             //     );
//             case 'Request For Update':
//                 return (
//                     <div>
//                         {isTextBoxVisible ? (
//                             <div>
//                                 <div
//                                     ref={textAreaRef}
//                                     contentEditable
//                                     style={{
//                                         width: '100%',
//                                         maxWidth: '650px',
//                                         overflowY: 'hidden',
//                                         border: `1px solid ${isError ? 'red' : '#ccc'}`,
//                                         padding: '8px',
//                                         minHeight: '50px',
//                                     }}
//                                     onInput={() => {
//                                         const content = textAreaRef.current?.innerText;
//                                         setTextBoxValue(content || '');
//                                         textAreaRef.current!.style.height = 'auto';
//                                         textAreaRef.current!.style.height = textAreaRef.current!.scrollHeight > 0
//                                             ? Math.min(textAreaRef.current!.scrollHeight || 300, 300) + 'px'
//                                             : 'auto';
//                                         setIsError(false);
//                                     }}
//                                     placeholder="Enter Description"
//                                 />
//                                 <p style={{ color: 'red', marginTop: '6px', display: isError ? 'block' : 'none' }}>
//                                     Description is required!
//                                 </p>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     type="button"
//                                     className="btn btn-outline-primary"
//                                     style={{
//                                         marginTop: '6px',
//                                         float: 'right',
//                                         maxWidth: '150px',
//                                     }}
//                                     onClick={() => {
//                                         if (!textAreaRef.current?.innerText.trim()) {
//                                             setIsError(true);
//                                         } else {
//                                             handleTextBoxSubmit();
//                                         }
//                                     }}
//                                     disabled={isButtonDisabled}
//                                 >
//                                     Submit
//                                 </Button>
//                             </div>
//                         ) : (
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 style={{ backgroundColor: '#8badcf' }}
//                                 onClick={handleRequestForUpdateClick}
//                                 disabled={isButtonDisabled}
//                             >
//                                 Request for Update
//                             </Button>
//                         )}
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div>
//             <Header />
//             <Box m={6}>
//                 <Card
//                     style={{
//                         margin: '6%',
//                         padding: '1%',
//                         boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//                         marginLeft: '10%',
//                         width: '80%',
//                     }}
//                 >
//                     <Container
//                         style={{
//                             maxWidth: 'none',
//                             backgroundColor: 'white',
//                             margin: '10px',
//                         }}
//                     >
//                         <Box m={4}>
//                             <Grid container justifyContent="space-between" alignItems="center">
//                                 <Grid item>
//                                     <h4 style={{ marginBottom: '1%' }}>USER DETAILS</h4>
//                                 </Grid>
//                                 <Grid item>
//                                     <Button
//                                         variant="contained"
//                                         color="primary"
//                                         onClick={handleDownloadPDF}
//                                         onMouseOver={handleMouseOver}
//                                         onMouseOut={handleMouseOut}
//                                         style={buttonStyle}
//                                     >
//                                         Download PDF
//                                     </Button>
//                                     {loading && <div style={{ margin: '20px', color: 'red' }}>Generating PDF Please wait...</div>}
//                                 </Grid>
//                             </Grid>
//                             <TableContainer component={Paper} style={{ marginTop: '20px' }}>
//                                 <Table ref={tableRef}>
//                                     <TableBody>{renderTableRows()}</TableBody>
//                                 </Table>
//                             </TableContainer>
//                         </Box>
//                     </Container>
//                 </Card>
//             </Box>
//             <div ref={componentRef}></div>
//         </div>
//     );

// };



// export default NewViews;



import React, { useEffect, useRef, useState } from 'react';
import { Container, Box, Grid, Table, TableBody, TableHead, TableCell, TableContainer, TableRow, Paper, Typography } from '@mui/material';
import { Button } from 'react-bootstrap';
import ViewPageDetailsService from '../../data/services/viewpage/viewpagedetails-api-service';
import { AkaDetRequest, CustomerRequest, Emailids, Father, Mother, NumberofHUTs, OtherAssociationRequest, PartyRequest, Payload, PhoneNumbers, Relative, RelativePayload, Spouse } from '../../data/services/viewpage/viewpagedetails-payload';
import { useParams } from 'react-router-dom';
import { CustomerEditData } from '../../data/services/Reports/CustomerEdit/customeredit-payload';
import AssociatedlistPayload from '../../data/services/insert/dto/AssociatedlistPayload';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CountryApiService from '../../data/services/master/Country/country_api_service';
import StateApiService from '../../data/services/master/State/state_api_service';
import { faUserCircle, faUsers, faUser, faFlag, faVenus, faMars, faSkull, faBuilding, faIdCard, faBirthdayCake, faSync, faCalendarAlt, faGlobe, faMapMarker, faInfoCircle, faUserTie, faIndustry, faChild, faExternalLinkAlt, faHome, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import Header from '../../layouts/header/header';
import profile from '../../assets/Avatar.png';
import IdentifyApiService from '../../data/services/Identify/Identify_api_service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { useSelector } from 'react-redux';

interface CompanyItem {
    companyDTO: {
        listAdverseInformation: number | string;
        listRegulatoryAction: number | string;
        listGovernment: number | string;
    };
}

interface Country {
    id: string;
    name: string;
}

interface CustomerData {
    createdAt?: string;
}

interface State {
    id: string;
    countryId: string;
    stateName: string;
}

interface CategoryName {
    name: string;
    id: string;
}

const NewViews: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const { pepId, uid, entity } = useParams();
    const [fathers, setFathers] = useState<Father[]>([]);
    const [mothers, setMothers] = useState<Mother[]>([]);
    const [NumberofHUTss, setNumberofHUTss] = useState<NumberofHUTs[]>([]);
    const [Spouses, setSpouses] = useState<Spouse[]>([]);
    const customer = new ViewPageDetailsService();
    const viewPageService = new ViewPageDetailsService();
    const [customerData, setCustomerData] = useState<CustomerData>({})
    const [associatedList, setAssociatedList] = useState<AssociatedlistPayload[]>([]);
    const authService = new CountryApiService();
    const [countries, setCountries] = useState<Country[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [states, setStates] = useState<State[]>([]);
    const authServices = new StateApiService();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const backendColumns = ['Photo', 'Name', 'Category', 'Country', 'State', 'PAN', 'AKA Names', 'Date of Birth', 'Place of Birth', 'Gender', 'Education', 'Position in the Government', 'Died', 'Company / LLP Details', 'Previous Company / LLP Details', 'Other Information', 'Family Details', 'Source Link', 'Pep Id', 'Last Updated Date'];
    const [categoryName, setCategoryName] = useState<CategoryName[]>([]);
    const identifyApiService = new IdentifyApiService();
    const componentRef = useRef<HTMLDivElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isTextBoxVisible, setIsTextBoxVisible] = useState(false);
    const [textBoxValue, setTextBoxValue] = useState('');
    const textAreaRef = useRef<HTMLDivElement>(null);
    const [isError, setIsError] = useState(false);
    const [isPDFGenerating, setIsPDFGenerating] = useState(false);
    const [isRequestForUpdateVisible, setIsRequestForUpdateVisible] = useState(true);
    const maxLength = 100;

    const handleMouseOver = () => {
        setIsHovered(true);
    };

    const handleMouseOut = () => {
        setIsHovered(false);
    };

    const buttonStyle = {
        backgroundColor: isHovered ? '#135688' : '#1976D2',
        color: '#fff',
    };

    const fetchCustomerData = async () => {
        try {
            const customerList = await viewPageService.getCustomerList();
            const matchingCustomer = customerList.find((customer: { id: any; }) => String(customer.id) === pepId);
            if (matchingCustomer) {
                setCustomerData(matchingCustomer);
            } else {
                console.error(`Customer with pepId ${pepId} not found`);
            }
        } catch (error) {
            console.error('Error fetching customer list:', error);
        }
    };

    const fetchCategory = async () => {
        try {
            const categoryName = await identifyApiService.getCategory();
            setCategoryName(categoryName);
        } catch (error) {
            console.error("Error fetching Category Name:", error);
        }
    };

    useEffect(() => {
        fetchCustomerData();
        fetchCategory();
        fetchCountries();
    }, [pepId]);

    const [formData, setFormData] = useState<CustomerRequest>({
        name: '',
        sourceLink: '',
        education: '',
        placeOfBirth: '',
        dob: '',
        pan: '',
        directorsIdentificationNumber: '',
        uid: '',
        createdAt: '',
        genderId: 0,
    });

    const [akaformData, setAkaFormData] = useState<AkaDetRequest[]>([{ akaName: '' }]);
    const [associationaspermedia, setAssociationaspermedia] = useState<OtherAssociationRequest[]>([{ otherAssociationAsPerMedia: '' }]);
    const [PartyformData, setPartyFormData] = useState<PartyRequest[]>([
        {
            formerAndCurrent: '',
            stateId: '',
            countryId: '',
            otherInformation: '',
            died: '',
            permanentAddress: '',
            positionInTheGovernment: '',
            partyMasterId: '',
            positionInTheParty: ''
        },
    ]);

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

    const [relative, setRelative] = useState<Relative[]>([]);
    const [PhoneNumberss, setPhoneNumberss] = useState<PhoneNumbers[]>([]);
    const [Emailidss, setEmailidss] = useState<Emailids[]>([]);
    const [appendedData, setAppendedData] = useState<CustomerEditData[]>([]);
    const [serialNumber, setSerialNumber] = useState(1);

    const fetchCountries = async () => {
        try {
            const countriesData = await authService.getCountryOptions();
            setCountries(countriesData);
            const statesData = await authServices.getStateDataByCountryId();
            setStates(statesData);
        } catch (error) {
            console.error("Error fetching Country/State:", error);
        }
    };

    const [adverseInformation, setAdverseInformation] = useState('');
    const [regulatoryAction, setRegulatoryAction] = useState('');

    useEffect(() => {
        const fetchCustomer = async (pepId: string, uid: string,) => {
            try {
                const customerData = await customer.getcustomer(pepId);
                if (customerData.createCustomerRequest) {
                    const {
                        name,
                        sourceLink,
                        education,
                        dob,
                        placeOfBirth,
                        pan,
                        directorsIdentificationNumber,
                        adverseInformation,
                        regulatoryAction,
                        genderId,
                        createdAt,
                    } = customerData.createCustomerRequest;
                    if (adverseInformation) {
                        setAdverseInformation(adverseInformation);
                    }
                    if (regulatoryAction) {
                        setRegulatoryAction(regulatoryAction);
                    }
                    setFormData({
                        name: name || '',
                        sourceLink: sourceLink || '',
                        education: education || '',
                        placeOfBirth: placeOfBirth || '',
                        dob: dob || '',
                        pan: pan || '',
                        genderId: genderId || '',
                        directorsIdentificationNumber: directorsIdentificationNumber || '',
                        adverseInformation: adverseInformation || '',
                        regulatoryAction: regulatoryAction || '',
                        uid: uid,
                        createdAt: createdAt || '',
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
                    setAssociationaspermedia(
                        customerData.otherAssociationDataList.map((aka: { otherAssociationAsPerMedia: string }) => ({ otherAssociationAsPerMedia: aka.otherAssociationAsPerMedia || '' }))
                    );
                }
                if (customerData.combinedDTO) {
                    setformDatas({
                        combinedDTO: customerData.combinedDTO
                    });
                }
                if (customerData.relativeCombineDTOList) {
                    setRelativeFormData({
                        relativeCombineDTO: customerData.relativeCombineDTOList
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
                    if (customerData.partyDataList && customerData.partyDataList.length > 0) {
                        setPartyFormData(customerData.partyDataList);
                    } else {
                        console.log('No party data available');
                    }
                }
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        };
        if (pepId && uid) {
            fetchCustomer(pepId, uid);
        }
        window.scrollTo(0, 0);
    }, [pepId, uid]);

    function getgenderName(genderId: number) {
        switch (genderId) {
            case 1:
                return 'Male';
            case 2:
                return 'Female';
            case 3:
                return 'Others';
        }
    };

    const [base64Image, setBase64Image] = useState<string | null>(null);

    const getCountryNameById = (countryId: string) => {
        const country = countries.find((c) => c.id === countryId);
        return country ? country.name : 'Not Available';
    };

    const getStateNameById = (stateId: string) => {
        const state = states.find((s) => s.id === stateId);
        return state ? state.stateName : 'Not Available';
    };

    const [profileImageData, setProfileImageData] = useState<string | null>(null);

    const renderAkaNames = () => {
        return (
            akaformData && akaformData.some((aka) => aka.akaName.trim() !== '') ? (
                akaformData.map((aka) => (
                    <span key={aka.akaName}>{aka.akaName}</span>
                ))
            ) : (
                'Not Available'
            )
        );
    };

    const getColumnIcon = (columnName: string) => {
        switch (columnName) {
            case 'Photo':
                return <FontAwesomeIcon icon={faUserCircle} />;
            case 'Name':
                return <FontAwesomeIcon icon={faUser} />;
            case 'Category':
                return <FontAwesomeIcon icon={faUsers} />;
            case 'Country':
                return <FontAwesomeIcon icon={faGlobe} />;
            case 'State':
                return <FontAwesomeIcon icon={faFlag} />;
            case 'PAN':
                return <FontAwesomeIcon icon={faIdCard} />;
            case 'AKA Names':
                return <FontAwesomeIcon icon={faUser} />;
            case 'Date of Birth':
                return <FontAwesomeIcon icon={faBirthdayCake} />;
            case 'Place of Birth':
                return <FontAwesomeIcon icon={faMapMarker} />;
            case 'Gender':
                return (
                    <>
                        <FontAwesomeIcon icon={faVenus} title="Female" />
                        <FontAwesomeIcon icon={faMars} title="Male" />
                    </>
                );
            case 'Education':
                return <FontAwesomeIcon icon={faGraduationCap} />;
            case 'Position in the Government':
                return <FontAwesomeIcon icon={faBuilding} />;
            case 'Died':
                return <FontAwesomeIcon icon={faSkull} />;
            case 'Company / LLP Details':
                return <FontAwesomeIcon icon={faBuilding} />;
            case 'Previous Company / LLP Details':
                return <FontAwesomeIcon icon={faBuilding} />;
            case 'Other Information':
                return <FontAwesomeIcon icon={faInfoCircle} />;
            case 'Potentially Associated Directors':
                return <FontAwesomeIcon icon={faUserTie} />;
            case 'Potentially Associated Companies':
                return <FontAwesomeIcon icon={faIndustry} />;
            case 'Family Details':
                return <FontAwesomeIcon icon={faHome} />;
            case 'Son Name':
                return <FontAwesomeIcon icon={faChild} />;
            case 'PAN':
                return <FontAwesomeIcon icon={faIdCard} />;
            case 'Daughter Name':
                return <FontAwesomeIcon icon={faChild} />;
            case 'PAN':
                return <FontAwesomeIcon icon={faIdCard} />;
            case 'Source Link':
                return <FontAwesomeIcon icon={faExternalLinkAlt} />;
            case 'Pep Id':
                return <FontAwesomeIcon icon={faIdCard} />;
            case 'Last Updated Date':
                return <FontAwesomeIcon icon={faCalendarAlt} />;
            default:
                return null;
        }
    };

    const renderPDFContent = () => {
        const rows = renderTableRows();
        return rows;
    };

    const renderTableRows = () => {
        const shouldHideRequestForUpdate = isPDFGenerating;
        const columnsToRender = backendColumns.filter(column => {
            if (column === 'Name' && (!formData.name || formData.name.trim() === '')) {
                return false;
            }
            if (column === 'AKA Names' && (!akaformData || akaformData.every(aka => aka.akaName.trim() === ''))) {
                return false;
            }
            if (column === 'Country' && (!PartyformData[0] || !PartyformData[0].countryId)) {
                return false;
            }
            if (column === 'State' && (!PartyformData[0] || !PartyformData[0].stateId)) {
                return false;
            }
            if (column === 'PAN' && (!formData.pan || formData.pan.trim() === '')) {
                return false;
            }
            if (column === 'Date of Birth' && !formData.dob) {
                return false;
            }
            if (column === "Place of Birth" && !formData.placeOfBirth) {
                return false;
            }
            if (column === 'Gender' && (!formData.genderId || formData.genderId === 0)) {
                return false;
            }
            if (column === 'Education' && (!formData.education || formData.education.trim() === '')) {
                return false;
            }
            if (column === 'Position in the Government' && (!PartyformData[0].positionInTheGovernment || PartyformData[0].positionInTheGovernment.trim() === '')) {
                return false;
            }
            if (column === 'Died' && (!PartyformData[0] || !PartyformData[0].died)) {
                return false;
            }
            if (column === 'Other Information' && (!PartyformData[0]?.otherInformation || PartyformData[0]?.otherInformation.trim() === '')) {
                return false;
            }
            if (column === 'Company / LLP Details' && (!formDatas.combinedDTO || formDatas.combinedDTO.length === 0)) {
                return false;
            }
            if (column === 'Source Link' && !formData.sourceLink) {
                return false;
            }
            if (column === 'Last Updated Date' && !customerData.createdAt) {
                return false;
            }
            if (column === 'Company / LLP Details') {
                const shouldHideCompanyDetails = !formDatas.combinedDTO || formDatas.combinedDTO.every(item => (
                    item.companyDTO.companyName === '' &&
                    item.companiesDirectorsDTOS[0]?.designation === '' &&
                    item.companiesDirectorsDTOS[0]?.directorStatus === '' &&
                    item.companyDTO.originalDateOfAppointment === '' &&
                    item.companiesDirectorsDTOS[0]?.appointmentDate === '' &&
                    item.companiesDirectorsDTOS[0]?.cessationDate === '' &&
                    (!adverseInformation || !regulatoryAction || !item.companyDTO.listAdverseInformation || !item.companyDTO.listRegulatoryAction || !item.companyDTO.listGovernment)
                ));
                if (shouldHideCompanyDetails) {
                    return false;
                }
            }
            if (column === 'Previous Company / LLP Details') {
                const shouldHidePreviousDetails = !formDatas.combinedDTO || formDatas.combinedDTO.every(item => (
                    item.companyDTO.companyName === '' &&
                    item.companiesDirectorsDTOS[0]?.designation === '' &&
                    item.companiesDirectorsDTOS[0]?.directorStatus === '' &&
                    item.companyDTO.originalDateOfAppointment === '' &&
                    item.companiesDirectorsDTOS[0]?.appointmentDate === '' &&
                    item.companiesDirectorsDTOS[0]?.cessationDate === '' &&
                    (!adverseInformation || !regulatoryAction || !item.companyDTO.listAdverseInformation || !item.companyDTO.listRegulatoryAction || !item.companyDTO.listGovernment)
                ));
                if (shouldHidePreviousDetails) {
                    return false;
                }
            }
            if (column === 'Family Details') {
                const shouldHideFamilyDetails = !RelativeformData.relativeCombineDTO || RelativeformData.relativeCombineDTO.every(item => (
                    !item.relativeDetDTOS || !item.relativeChildrenDTOS ||
                    item.relativeDetDTOS.every(contact => !(contact.name || contact.pan)) &&
                    item.relativeChildrenDTOS.every(contact => !(contact.childrenName || contact.pan))
                ));
                if (shouldHideFamilyDetails) {
                    return false;
                }
            }
            return true;
        });
        const filteredColumns = columnsToRender.filter(column => !isPDFGenerating || column !== 'Request For Update');
        return filteredColumns.map((columnName) => {
            let columnContent;
            if (columnName === 'Request For Update') {
                columnContent = shouldHideRequestForUpdate ? null : (
                    <div data-html2canvas-ignore="true">
                        {getColumnIcon(columnName)}
                    </div>
                );
            } else {
                columnContent = getColumnIcon(columnName);
            }
            if (
                (columnName === 'Company / LLP Details' && (!formDatas.combinedDTO || formDatas.combinedDTO.length === 0)) ||
                (columnName === 'Previous Company / LLP Details' && (!formDatas.combinedDTO || formDatas.combinedDTO.length === 0)) ||
                (columnName === 'Family Details' && (!RelativeformData.relativeCombineDTO || RelativeformData.relativeCombineDTO.length === 0))
            ) {
                return null;
            }
            return (
                <TableRow key={columnName} style={{ height: '30px' }}>
                    <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', lineHeight: '1' }}>
                            <span style={{ marginRight: '10px' }}>{getColumnIcon(columnName)}</span>
                            <Typography variant="body1" fontWeight="bold" style={{ marginLeft: '3px', lineHeight: '1' }}>
                                {columnName}
                            </Typography>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div style={{ marginLeft: '20px' }}>
                            {renderColumnValue(columnName, formDatas, isPDFGenerating)}
                        </div>
                    </TableCell>
                </TableRow>
            );
        }).filter(Boolean);
    };

    const handleDownloadPDF = async () => {
        try {
            setLoading(true);
            const pdfContent = renderPDFContent();
            const tableElement = tableRef.current;
            if (!tableElement) {
                console.error("Table element is null");
                return;
            }
            const elementsToIgnore = document.querySelectorAll('[data-html2canvas-ignore="true"]');
            elementsToIgnore.forEach((element) => {
                const htmlElement = element as HTMLElement;
                if (htmlElement.style) {
                    htmlElement.style.display = 'none';
                }
            });
            const canvas = await html2canvas(tableElement, {
                scale: 3,
                ignoreElements: element => {
                    const htmlElement = element as HTMLElement;
                    return htmlElement.dataset && htmlElement.dataset.html2canvasIgnore === 'true';
                },
                onclone: (document) => {
                    const requestForUpdateColumn = document.querySelector('[data-html2canvas-ignore="true"]');
                    if (requestForUpdateColumn) {
                        const htmlElement = requestForUpdateColumn as HTMLElement;
                        if (htmlElement.style) {
                            htmlElement.style.display = 'none';
                        }
                    }
                }
            });
            elementsToIgnore.forEach((element) => {
                const htmlElement = element as HTMLElement;
                if (htmlElement.style) {
                    htmlElement.style.display = '';
                }
            });
            const pdf = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                precision: 16,
                putOnlyUsedFonts: true,
                floatPrecision: 16,
            });
            pdf.setLineWidth(0.5);
            pdf.rect(5, 5, pdf.internal.pageSize.getWidth() - 10, pdf.internal.pageSize.getHeight() - 10);
            pdf.setFontSize(14);
            pdf.text('USER DETAILS', pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
            let yPosition = 40;
            pdfContent.forEach((row) => {
                if (row !== null && typeof row === 'object') {
                    row.props.children.forEach((cell: { props: { children: { toString: () => string | string[]; }; }; }, index: number) => {
                        if (backendColumns[index] !== 'Request For Update') {
                            pdf.text(cell.props.children.toString(), 10 + index * 50, yPosition);
                        }
                    });
                    yPosition += 10;
                }
            });
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 30);
            pdf.save('user_details.pdf');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (entityId: string | undefined) => {
        const parsedEntityId: number | string = entityId ? Number(entityId) : NaN;
        const category = categoryName.find((cat) => cat.id.toString() === parsedEntityId.toString());
        return category ? category.name : 'Not Available';
    };

    const handleRequestForUpdateClick = () => {
        setIsTextBoxVisible(!isTextBoxVisible);
    };

    const handleTextBoxSubmit = async () => {
        if (!textBoxValue.trim()) {
            setIsError(true);
        } else {
            try {
                setIsButtonDisabled(true);
                handleRequestUpdateClick();
            } catch (error) {
                console.error('Error submitting description:', error);
            }
        }
    };

    const handleRequestUpdateClick = async () => {
        try {
            const singlePayload = {
                pepId: 0,
                requestAt: '1',
                requestUid: 0,
                updatedUid: 0,
                valid: 1,
                updated: 'string',
                requestForUpdate: '1',
            };
            const apiService = new ViewPageDetailsService();
            const response = await apiService.saveRequestForUpdate(singlePayload);
            if (response && response.success) {
                setIsButtonDisabled(true);
            }
            setIsButtonDisabled(true);
        } catch (error: any) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    const renderRequestForUpdate = () => {
        return (
            <div data-html2canvas-ignore="true">
                {isTextBoxVisible ? (
                    <div>
                        <div
                            ref={textAreaRef}
                            contentEditable
                            style={{
                                width: '100%',
                                maxWidth: '650px',
                                overflowY: 'hidden',
                                border: `1px solid ${isError ? 'red' : '#ccc'}`,
                                padding: '8px',
                                minHeight: '50px',
                            }}
                            onInput={() => {
                                const content = textAreaRef.current?.innerText;
                                setTextBoxValue(content || '');
                                textAreaRef.current!.style.height = 'auto';
                                textAreaRef.current!.style.height = textAreaRef.current!.scrollHeight > 0
                                    ? Math.min(textAreaRef.current!.scrollHeight || 300, 300) + 'px'
                                    : 'auto';
                                setIsError(false);
                            }}
                            placeholder="Enter Description"
                        />
                        <p style={{ color: 'red', marginTop: '6px', display: isError ? 'block' : 'none' }}>
                            Description is required!
                        </p>
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            className="btn btn-outline-primary"
                            style={{
                                marginTop: '6px',
                                float: 'right',
                                maxWidth: '150px',
                            }}
                            onClick={() => {
                                if (!textAreaRef.current?.innerText.trim()) {
                                    setIsError(true);
                                } else {
                                    handleTextBoxSubmit();
                                }
                            }}
                            disabled={isButtonDisabled}
                        >
                            Submit
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: '#8badcf' }}
                        onClick={handleRequestForUpdateClick}
                        disabled={isButtonDisabled}
                    >
                        Request for Update
                    </Button>
                )}
            </div>
        );


    };

    const renderColumnValue = (columnName: string, formDatas: any, isPDFGenerating: boolean) => {
        switch (columnName) {
            case 'Photo':
                if (profileImageData) {
                    return (
                        <img
                            src={profileImageData}
                            alt="Profile"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '0',
                            }}
                        />
                    );
                } else {
                    return (
                        <img
                            src={profile}
                            alt="Default Avatar"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '0',
                            }}
                        />
                    );
                }
            case 'Name':
                return formData.name || 'Not Available';
            case 'Category':
                const categoryName = getCategoryName(entity);
                return categoryName || 'Not Available';
            case 'Country':
                const countryId = PartyformData[0].countryId;
                const countryName = getCountryNameById(countryId);
                return countryName || 'Not Available';
            case 'State':
                const stateId = PartyformData[0].stateId;
                const stateName = getStateNameById(stateId);
                return stateName || 'Not Available';
            case 'PAN':
                return formData.pan || 'Not Available';
            case 'AKA Names':
                return renderAkaNames();
            case 'Date of Birth':
                if (formData.dob) {
                    const dobDate = new Date(formData.dob);
                    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                    const day = dobDate.getDate();
                    const month = monthNames[dobDate.getMonth()];
                    const year = dobDate.getFullYear();
                    const formattedDate = `${day}-${month}-${year}`;
                    return formattedDate;
                } else {
                    return 'Not Available';
                }
            case 'Place of Birth':
                return formData.placeOfBirth || 'Not Available';
            case 'Gender':
                return getgenderName(formData.genderId) || 'Not Available';
            case 'Education':
                const educationContent = formData.education || 'Not Available';
                return (
                    <div>
                        <p>{educationContent}</p>
                    </div>
                );
            case 'Position in the Government':
                const positionInTheGovernment = PartyformData[0].positionInTheGovernment || 'Not Available';
                return (
                    <span>{positionInTheGovernment}</span>
                );
            case 'Died':
                return PartyformData[0].died || 'Not Available';
            case 'Company / LLP Details':
                const currentCompanyDTOs = formDatas.combinedDTO
                    ? formDatas.combinedDTO.filter((item: { companiesDirectorsDTOS: { directorStatus: string; }[]; }) => item.companiesDirectorsDTOS[0].directorStatus === 'Current Company')
                    : [];
                return (
                    <>
                        {formDatas.combinedDTO.length === 0 || currentCompanyDTOs.length === 0 ? (
                            <p>Not Available</p>
                        ) : (
                            <>
                                {currentCompanyDTOs.length > 0 &&
                                    <div>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><strong>Company LLP Name</strong></TableCell>
                                                        <TableCell><strong>Position</strong></TableCell>
                                                        <TableCell><strong>Director Status</strong></TableCell>
                                                        <TableCell><strong>Original Date of Appointment</strong></TableCell>
                                                        <TableCell><strong>Date of Appointment At Current Designation</strong></TableCell>
                                                        <TableCell><strong>Date of Cessation</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {currentCompanyDTOs.map((item: {
                                                        companyDTO: any; companiesDirectorsDTOS: {
                                                            designation: string; companyDTO: { companyName: string; }; designationId: any; directorStatus: any; originalDateOfAppointment: any; appointmentDate: any; cessationDate: any;
                                                        }[];
                                                    }, index: number) => (
                                                        <React.Fragment key={index}>
                                                            <TableRow>
                                                                <TableCell>{item.companyDTO.companyName || 'Not Available'}</TableCell>
                                                                <TableCell>{item.companiesDirectorsDTOS[0]?.designation || 'Not Available'}</TableCell>
                                                                <TableCell>{item.companiesDirectorsDTOS[0]?.directorStatus || 'Not Available'}</TableCell>
                                                                <TableCell>{item.companyDTO.originalDateOfAppointment || 'Not Available'}</TableCell>
                                                                <TableCell>{item.companiesDirectorsDTOS[0]?.appointmentDate || 'Not Available'}</TableCell>
                                                                <TableCell>{item.companiesDirectorsDTOS[0]?.cessationDate || 'Not Available'}</TableCell>
                                                            </TableRow>
                                                        </React.Fragment>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            <Grid item xs={12} sm={4}>
                                                <TableCell>{adverseInformation && (<div>AdverseInformation</div>)}</TableCell>
                                                <TableCell>{regulatoryAction && (<div>RegulatoryAction</div>)}</TableCell>
                                                <TableCell>
                                                    {formDatas.combinedDTO && formDatas.combinedDTO.length > 0 ? (
                                                        formDatas.combinedDTO.map((item: CompanyItem, index: number) => (
                                                            <div key={index}>
                                                                {item.companyDTO.listAdverseInformation && 1 ? (
                                                                    <div style={{ fontSize: 'small' }}>listAdverseInformation</div>
                                                                ) : (
                                                                    <div></div>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        ''
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {formDatas.combinedDTO && formDatas.combinedDTO.length > 0 ? (
                                                        formDatas.combinedDTO.map((item: CompanyItem, index: number) => (
                                                            <div key={index}>
                                                                {item.companyDTO.listRegulatoryAction && 1 ? (
                                                                    <div style={{ fontSize: 'small' }}>listRegulatoryAction</div>
                                                                ) : (
                                                                    <div></div>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        ''
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {formDatas.combinedDTO && formDatas.combinedDTO.length > 0 ? (
                                                        formDatas.combinedDTO.map((item: CompanyItem, index: number) => (
                                                            <div key={index}>
                                                                {item.companyDTO.listGovernment && 1 ? (
                                                                    <div style={{ fontSize: 'small' }}>listGovernment</div>
                                                                ) : (
                                                                    <div></div>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        ''
                                                    )}
                                                </TableCell>
                                            </Grid>
                                        </TableContainer>
                                    </div>
                                }
                            </>
                        )}
                    </>
                );
            case 'Previous Company / LLP Details':
                const previousCompanyDTOs = formDatas.combinedDTO
                    ? formDatas.combinedDTO.filter((item: { companiesDirectorsDTOS: { directorStatus: string; }[]; }) => item.companiesDirectorsDTOS[0].directorStatus === 'Previous Company')
                    : [];
                return (
                    <>
                        {formDatas.combinedDTO.length === 0 ? (
                            <p>Not Available</p>
                        ) : (
                            <>
                                {previousCompanyDTOs.length > 0 ? (
                                    <div>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><strong>Company LLP Name</strong></TableCell>
                                                        <TableCell><strong>Position</strong></TableCell>
                                                        <TableCell><strong>Director Status</strong></TableCell>
                                                        <TableCell><strong>Original Date of Appointment</strong></TableCell>
                                                        <TableCell><strong>Date of Appointment At Current Designation</strong></TableCell>
                                                        <TableCell><strong>Date of Cessation</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {previousCompanyDTOs.map((item: {
                                                        companyDTO: any; companiesDirectorsDTOS: { companyDTO: any; designation: any; directorStatus: any; originalDateOfAppointment: any; appointmentDate: any; cessationDate: any; }[];
                                                    }, index: number) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{item.companyDTO.companyName || 'Not Available'}</TableCell>
                                                            <TableCell>{item.companiesDirectorsDTOS[0]?.designation || 'Not Available'}</TableCell>
                                                            <TableCell>{item.companiesDirectorsDTOS[0]?.directorStatus || 'Not Available'}</TableCell>
                                                            <TableCell>{item.companyDTO.originalDateOfAppointment || 'Not Available'}</TableCell>
                                                            <TableCell>{item.companiesDirectorsDTOS[0]?.appointmentDate || 'Not Available'}</TableCell>
                                                            <TableCell>{item.companiesDirectorsDTOS[0]?.cessationDate || 'Not Available'}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                ) : (
                                    <p>Not Available</p>
                                )}
                            </>
                        )}
                    </>
                );
            case 'Other Information':
                const otherInformation = PartyformData[0]?.otherInformation || 'Not Available';
                return (
                    <div>
                        {otherInformation}
                    </div>
                );
            case 'Potentially Associated Directors':
                return "Not Available";
            case 'Potentially Associated Companies':
                return "Not Available";
            case 'Family Details':
                return (
                    <div>
                        {RelativeformData.relativeCombineDTO && RelativeformData.relativeCombineDTO.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Spouse Name</strong></TableCell>
                                            <TableCell><strong>Spouse PAN</strong></TableCell>
                                            <TableCell><strong>Children Name</strong></TableCell>
                                            <TableCell><strong>Children Pan</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {RelativeformData.relativeCombineDTO?.map((item, index) => {
                                            const hasNonEmptyData =
                                                (item.relativeDetDTOS && item.relativeDetDTOS.some(contact => contact.name || contact.pan)) ||
                                                (item.relativeChildrenDTOS && item.relativeChildrenDTOS.some(contact => contact.childrenName || contact.pan));
                                            return (
                                                hasNonEmptyData && (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.relativeDetDTOS && item.relativeDetDTOS.length > 0 ? (
                                                                item.relativeDetDTOS.map((contact, contactIndex) => (
                                                                    <p key={contactIndex}>{contact.name || '_'}</p>
                                                                ))
                                                            ) : (
                                                                <p>_</p>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.relativeDetDTOS && item.relativeDetDTOS.length > 0 ? (
                                                                item.relativeDetDTOS.map((contact, contactIndex) => (
                                                                    <p key={contactIndex}>{contact.pan || '_'}</p>
                                                                ))
                                                            ) : (
                                                                <p>_</p>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.relativeChildrenDTOS && item.relativeChildrenDTOS.length > 0 ? (
                                                                item.relativeChildrenDTOS.map((contact, contactIndex) => (
                                                                    <p key={contactIndex}>{contact.childrenName || '_'}</p>
                                                                ))
                                                            ) : (
                                                                <p>_</p>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.relativeChildrenDTOS && item.relativeChildrenDTOS.length > 0 ? (
                                                                item.relativeChildrenDTOS.map((contact, contactIndex) => (
                                                                    <p key={contactIndex}>{contact.pan || '_'}</p>
                                                                ))
                                                            ) : (
                                                                <p>_</p>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <p>Not Available</p>
                        )}
                    </div>
                );
            case 'Source Link':
                const sourceLink = formData.sourceLink;
                return (
                    <div>
                        {sourceLink ? (
                            sourceLink.split('\n').map((link, index) => (
                                <React.Fragment key={index}>
                                    <p style={{ marginBottom: '-14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <a href={link} target="_blank" rel="noopener noreferrer">
                                            {link.length > maxLength ? `${link.slice(0, maxLength)}...` : link}
                                        </a>
                                    </p>
                                    {index < sourceLink.split('\n').length - 1 && <br />}
                                </React.Fragment>
                            ))
                        ) : (
                            <p style={{ marginBottom: '5px' }}>Not Available</p>
                        )}
                    </div>
                );
            case 'Pep Id':
                return pepId || 'Not Available';
            case 'Last Updated Date':
                const createdAt = customerData.createdAt;
                return createdAt ? new Date(createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not Available';
            default:
                return null;
        }
    };

    return (
        <div>
            <Header />
            <Box m={6}>
                <Card
                    style={{
                        marginTop: '9%',
                        padding: '1%',
                        boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                        width: '100%',
                    }}
                >
                    <Container
                        style={{
                            maxWidth: 'none',
                            backgroundColor: 'white',
                            margin: '10px',
                        }}
                    >
                        <Box m={4}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <h4 style={{ marginBottom: '1%' }}>USER DETAILS</h4>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleDownloadPDF}
                                        onMouseOver={handleMouseOver}
                                        onMouseOut={handleMouseOut}
                                        style={buttonStyle}
                                    >
                                        Download PDF
                                    </Button>
                                    {loading && <div style={{ margin: '20px', color: 'red' }}>Generating PDF Please wait...</div>}
                                </Grid>
                            </Grid>
                            <TableContainer component={Paper} style={{ marginTop: '20px', overflowX: 'auto' }}>
                                <Table ref={tableRef}>
                                    <TableBody>
                                        {renderTableRows()}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Container>
                    <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                        <Grid item xs={3}>
                            <span style={{ marginLeft: '28%' }}><FontAwesomeIcon icon={faSync} /></span>
                        </Grid>
                        <Grid item xs={1}>
                            <span style={{ marginLeft: '-186%', font: 'message-box', fontWeight: 'bold', clear: 'both', display: 'inline-block', whiteSpace: 'nowrap' }}>Request For Update</span>
                        </Grid>
                        <Grid item xs={8}>
                            <span style={{ marginLeft: '1%', clear: 'both', display: 'inline-block', whiteSpace: 'nowrap', width: '100%' }}> {renderRequestForUpdate()}</span>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
            <div ref={componentRef}></div>
        </div>
    );
};

export default NewViews;