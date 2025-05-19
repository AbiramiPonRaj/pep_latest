import React, { useEffect, useRef, useState } from 'react';
import { Container, Box, Grid, Table, TableBody, TableHead, TableCell, TableContainer, TableRow, Paper, Typography } from '@mui/material';
import { List, ListItem, ListItemText, ListItemIcon, Collapse } from '@mui/material';
import { AccountCircle, Group, People, Business, AttachMoney, Description } from '@mui/icons-material';
import { Button } from 'react-bootstrap';
import ViewPageDetailsService from '../../data/services/viewpage/viewpagedetails-api-service';
import { AkaDetRequest, CustomerRequest, Emailids, FamilyPayload, Father, Mother, NumberofHUTs, OtherAssociationRequest, Payload, PhoneNumbers, Relative, RelativePayload, Spouse, SpouseFamilyPayload } from '../../data/services/viewpage/viewpagedetails-payload';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import updateQcCustomer from '../../data/services/viewpage/viewpagedetails-api-service';
import { CustomerEditData } from '../../data/services/Reports/CustomerEdit/customeredit-payload';
import AssociatedlistPayload from '../../data/services/insert/dto/AssociatedlistPayload';
import AddressApiService from '../../data/services/insert/address-api-service';
import { Form, Card, Col, Row, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faUsers, faMobile, faUser, faFlag, faVenus, faMars, faSkull, faBuilding, faAddressCard, faHandshake, faIdCard, faBirthdayCake, faSync, faCalendarAlt, faGlobe, faMapMarker, faInfoCircle, faUserTie, faIndustry, faChild, faExternalLinkAlt, faBusinessTime, faList, faHome, faRing, faGraduationCap, faPerson, faPhone, faMailBulk, faFile } from '@fortawesome/free-solid-svg-icons';
import Header from '../../layouts/header/header';
import profile from '../../assets/Avatar.png';
import IdentifyApiService from '../../data/services/Identify/Identify_api_service';
import jsPDF, { jsPDFOptions } from 'jspdf';
import 'jspdf-autotable';
import { Button as BootstrapButton } from 'react-bootstrap';
import PdfModal from './displayPDF';

import { renderToString } from 'react-dom/server';
import html2canvas from 'html2canvas';
import PartyApiService from '../../data/services/master/party/party_api_serivces';
import { useSelector } from 'react-redux';


interface CompanyItem {
    companyDTO: {
        listAdverseInformation: number | string;
        listRegulatoryAction: number | string;
        listGovernment: number | string;
    };
}
interface CustomerData {
    createdAt?: string;
}

interface PartyCandidateDetailsDTO {
    id: number;
    pepId: number;
    otherInformation: string;
    positionInTheGovernment: string;
    died: string;
    permanentAddress: string;
    uid: number;
    euid: number;
}

interface PartyDetailsDTO {
    pepId: number;
    partyMasterId: number;
    formerAndCurrent: string;
    partyCandidateId: number;
    uid: number;
    euid: number;
    positionInTheParty: string;
}

interface PartyRequests {
    partyCandidateDetailsDTO: PartyCandidateDetailsDTO;
    partyDetailsDTO: PartyDetailsDTO[];
}


interface Party {
    id: string;
    // partyMasterId: String;
    partyName: string;
}
interface CompanyDetailsItem {
    companyDTO: {
        id: number;
        sourceLink: string;
        associateMasterId: number;
        companyName: string;
        listAdverseInformation: number;
        listRegulatoryAction: number;
        listGovernment: number;
        originalDateOfAppointment: string;
        typeId: number; // Explicitly specify typeId as number
        cinfcrn: string;
        document: string;
    },
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

interface CompanyData {
    id: number;
    companyId: number;
    pathId: number;
    documentType: string;
    concatenated: string;
    companyName: string;
    url: string;
}

interface Company {
    companyId: number;
    directorId: number;
    companyName: string;
    documentId: number;
}

const View: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const location = useLocation();
    const { uid, entity } = useParams();
    const { pepId } = useParams<{ pepId?: string }>();
    const parsedPepId = pepId ? parseInt(pepId, 10) : undefined;
    const queryParams = new URLSearchParams(location.search);
    const hideHeaderParam = queryParams.get('hideHeader');
    const isHeaderVisible = hideHeaderParam !== 'true';
    // Debugging logs
    console.log('Location:', location);
    console.log('Query Parameters:', queryParams.toString());
    console.log('Hide Header Param:', hideHeaderParam);
    console.log('Is Header Visible:', isHeaderVisible);
    const strongStyle = { marginRight: '10px' };
    const [fathers, setFathers] = useState<Father[]>([]);
    const [mothers, setMothers] = useState<Mother[]>([]);
    const [NumberofHUTss, setNumberofHUTss] = useState<NumberofHUTs[]>([]);
    const [Spouses, setSpouses] = useState<Spouse[]>([]);
    const customer = new ViewPageDetailsService();
    const viewPageService = new ViewPageDetailsService();
    const [customerData, setCustomerData] = useState<CustomerData>({})
    const [partyData, setPartyData] = useState<PartyRequests[]>([]);
    const [associatedList, setAssociatedList] = useState<AssociatedlistPayload[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const backendColumns = ['Photo', 'Name', 'PAN', 'AKA Name', 'Phone Number', 'Email Id', 'Directors Identification Number (DIN)', 'Adverse Information', 'Regulatory Action', 'Media', 'Date of Birth', 'Place of Birth', 'Gender', 'Education', 'Position in the Government', 'Address', 'Party', 'Died', 'Other Information', 'Associated Details', 'Family Details', 'Spouse Details', 'Relative Details', 'Source Link', 'Company Media', 'Customer Files', 'Company Files'];//, 'Company Information List'
    const [showPreviousCompanyDetails, setShowPreviousCompanyDetails] = useState(false);
    const [showCompanyDetails, setShowCompanyDetails] = useState(false);
    // const [showListAssociatedDetails, setShowListAssociatedDetails] = useState(false);
    const [showListAssociatedDetails, setShowListAssociatedDetails] = useState<boolean[]>([]);
    const [showFamilyDetails, setShowFamilyDetails] = useState(false);
    const [showAssociatedDetails, setShowAssociatedDetails] = useState(false);
    const [showSpouseDetails, setShowSpouseDetails] = useState(false);
    const [showPartyDetails, setShowPartyDetails] = useState(false);
    const [showRelativeDetails, setShowRelativeDetails] = useState(false);
    const [showFullOtherInformation, setShowFullOtherInformation] = useState(false);
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [showMoreLLPsDetails, setShowMoreLLPsDetails] = useState(false);
    const [showMoreBussinessDetails, setShowMoreBussinessDetails] = useState(false);
    const [showAllRows, setShowAllRows] = useState(false);
    const identifyApiService = new IdentifyApiService();
    const componentRef = useRef<HTMLDivElement | null>(null);
    const [showTable, setShowTable] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showFullPosition, setShowFullPosition] = useState(false);
    const [showaddressPosition, setShowaddressPosition] = useState(false);
    const [isTextBoxVisible, setIsTextBoxVisible] = useState(false);
    const [textBoxValue, setTextBoxValue] = useState('');
    const textAreaRef = useRef<HTMLDivElement>(null);
    // const handleToggle = () => setShowMore(!showMore);
    const handleToggle = (index: number) => {
        setShowMore(showMore === index ? null : index);
    };
    const [showMore, setShowMore] = React.useState<number | null>(null);

    // const [showMore, setShowMore] = useState(false);

    const [isError, setIsError] = useState(false);
    const maxLength = 100;
    const [showFull, setShowFull] = useState(false);
    const [associationaspermedia, setAssociationaspermedia] = useState<OtherAssociationRequest[]>([{ otherAssociationAsPerMedia: '' }]);
    const tableStyle = {
        fontFamily: 'Times New Roman',
        fontWeight: 'bold',
    };
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
    useEffect(() => {
        const { search } = location;
        const urlParams = new URLSearchParams(search);
        const newContentId = urlParams.get('id');

        if (newContentId) {
            // Logic to fetch and display new content based on `newContentId`
            console.log("Updating view page content for ID:", newContentId);
            // Fetch and update view page content here
        }
    }, [location]);

    const fetchPartyDetails = async () => {
        try {
            if (parsedPepId !== undefined) {
                const partyDetails = await viewPageService.getPartyList(parsedPepId);
                console.log("partyDetails", partyDetails);
                setPartyData(partyDetails);
                setPartyFormData(partyDetails);
                setLoading(false);
            }
        } catch (error) {
            setError('Error fetching party details.');
            setLoading(false);
        }
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


    useEffect(() => {
        fetchCustomerData();
        fetchPartyDetails();
        fetchPartylist();
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

    const [PartyformData, setPartyFormData] = useState<PartyRequests[]>([
        {
            partyCandidateDetailsDTO: {
                id: 0,
                pepId: 0,
                otherInformation: '',
                positionInTheGovernment: '',
                died: '',
                permanentAddress: '',
                uid: 0,
                euid: 0,
            },
            partyDetailsDTO: [
                {
                    pepId: 0,
                    partyMasterId: 0,
                    formerAndCurrent: '',
                    partyCandidateId: 0,
                    uid: 0,
                    euid: 0,
                    positionInTheParty: '',
                }
            ]
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

    const [relative, setRelative] = useState<Relative[]>([]);
    const [PhoneNumberss, setPhoneNumberss] = useState<PhoneNumbers[]>([]);
    const [Emailidss, setEmailidss] = useState<Emailids[]>([]);
    const [appendedData, setAppendedData] = useState<CustomerEditData[]>([]);
    const [serialNumber, setSerialNumber] = useState(1);
    const navigate = useNavigate();

    const handleEditClick = (pepId: string, uid: string) => {
        navigate(`/Edit/${pepId}/${uid}?hideHeader=true`);
    };

    const viewPageDetailsService = new ViewPageDetailsService();

    const [adverseInformation, setAdverseInformation] = useState('');
    const [regulatoryAction, setRegulatoryAction] = useState('');

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRelativeData();
        fetchPartylist();
        console.log("PhoneNumber:", PhoneNumberss);
        console.log("Emailid:", Emailidss);

        fetchProfilePicture(parseInt(pepId || '0', 10), 1);
        // fetchCompanyPicture(parseInt('9' || '0', 10), 5);

        const fetchCustomer = async (pepId: string, uid: string) => {
            try {
                setIsLoading(true);
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
                        console.log('adverseInformation:', adverseInformation);
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
                if (customerData.combinedDTO && customerData.combinedDTO.length > 0) {

                    setformDatas({
                        combinedDTO: customerData.combinedDTO
                    });
                    customerData.combinedDTO.forEach((item: { companyDTO: { id: any; }; }) => {
                        console.log('combinedDTO:', item);
                        console.log('CombinedDTO Id File Type:', item.companyDTO.id);


                        const companyId = item.companyDTO.id;
                        handleCompanyButtonClick(companyId, 5);
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
                        console.log('customerData.familyCombinedDTOList:', customerData.familyCombinedDTOList)
                    }
                    if (customerData.spouseCommonDTOList) {
                        setSpouseFamilyFormData({
                            spouseCommonDTO: customerData.spouseCommonDTOList

                        });
                    }
                    if (customerData.partyDataList && customerData.partyDataList.length > 0) {

                        setPartyFormData(customerData.partyDataList);

                        console.log('PartyformData:', PartyformData);


                    } else {
                        console.log('No party data available');
                    }

                }
                if (customerData.createCustomerRequest) {
                    await customer.updateQcCustomer(pepId, uid, 'QcView');
                }

            } catch (error) {
                console.error('Error fetching customer data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (pepId && uid) {
            fetchCustomer(pepId, uid);
        }
        window.scrollTo(0, 0);
    }, [pepId, uid],);


    const handleCloseClick = async (pepId: string, uid: string) => {
        const statusCall = 'CloseView';
        await viewPageDetailsService.updateClose(pepId, uid, statusCall);
        navigate('/QcView/:pepId');
        window.close();
    };

    const handleShowDetailsClick = (index: number) => {
        const updatedDetails = [...showListAssociatedDetails];
        updatedDetails[index] = !updatedDetails[index];
        setShowListAssociatedDetails(updatedDetails);
    };

    const handleUpdateClick = async (pepId: string, uid: string) => {
        try {
            const statusCall = 'QcApprove';
            await viewPageDetailsService.updateEntry(pepId, uid, statusCall);
            const storedData = localStorage.getItem('customerData');
            if (storedData) {
                const transformedData = JSON.parse(storedData) as CustomerEditData[];
                setAppendedData((prevData) => {
                    const updatedData = [...prevData, ...transformedData];
                    return updatedData;
                });
                const hiddenPepIdsString = localStorage.getItem('hiddenPepIds');
                const hiddenPepIds = hiddenPepIdsString ? JSON.parse(hiddenPepIdsString) : [];
                const updatedHiddenPepIds = [...hiddenPepIds, pepId];
                localStorage.setItem('hiddenPepIds', JSON.stringify(updatedHiddenPepIds));
            }
            navigate(`/QcView/${pepId}`);
            window.close();
        } catch (error) {
            console.error('Error updating entry:', error);
        }
    };

    function getAssociatedName(associateMasterdId: number) {
        switch (associateMasterdId) {
            case 1:
                return 'Private';
            case 2:
                return 'LLP';
            default:
                return 'Unknown';
        }
    };

    const hasVisibleFamilyData = FamilyformData.familyCombinedDTO?.some(item =>
        (item.hufDTO && item.hufDTO.length > 0) ||
        (item.fatherDTOS && item.fatherDTOS.length > 0) ||
        (item.motherDTOS && item.motherDTOS.length > 0)
    );

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
            default:
                return 'Not Available';
        }
    }

    const addressApiService = new AddressApiService();

    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({
        base64: null,
        filename: null,
    });
    const [pdfDatas, setPdfDatas] = useState<{ base64: string | null; filename: string | null }>({
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
    const fetchImage = async (pepId: number, pathId: number) => {
        try {
            const imageData = await addressApiService.getImage(pathId, pepId);
            const base64Image = arrayBufferToBase64(imageData);
            setBase64Image(base64Image);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const [error, setError] = useState<string | null>(null);
    const [buttonClicked, setButtonClicked] = useState(false);

    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        const binary = new Uint8Array(buffer);
        const bytes = new Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = String.fromCharCode(binary[i]);
        }
        return `data:image/png;base64,${btoa(bytes.join(''))}`;
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

    const handleButtonClick = async (pepId: number, pathId: number) => {
        setError(null);
        setLoading(true);
        setBase64Image(null);
        setPdfData({ base64: null, filename: null });

        try {
            const { type, data, filename } = await addressApiService.getFile(pathId, pepId);

            console.log('File type:', type);
            console.log('Filename:', filename);

            const fileExtension = filename?.split('.').pop()?.toLowerCase();

            const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            const supportedPdfType = 'application/pdf';

            const fallbackFilename = filename || `download.${fileExtension || 'file'}`;

            if (type === 'image' || supportedImageTypes.includes(type)) {
                const base64Image = arrayBufferToBase64(data);
                setBase64Image(base64Image);
            } else if (type === supportedPdfType) {
                setPdfData({ base64: data, filename: fallbackFilename });
            } else if (fileExtension === 'html' || type === 'application/octet-stream') {
                setError('File format not supported');
            } else {
                setError('File format not supported');
            }

        } catch (error) {
            setError('Not Available');
        } finally {
            setLoading(false);
            setButtonClicked(true);
        }
    };

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



    const [openDirectorCompanyId, setOpenDirectorCompanyId] = useState<number | null>(null);
    const [DirectorCompanyId, setDirectorCompanyId] = useState<number | null>(null);
    const [viewingDocumentTypeIndex, setViewingDocumentTypeIndex] = useState<number | null>(null);
    const [viewingDirectorDocumentTypeIndex, setViewingDirectorDocumentTypeIndex] = useState<number | null>(null);
    const [showPdfViewer, setShowPdfViewer] = useState<boolean>(false);
    const [showPdfViewers, setShowPdfViewers] = useState<boolean>(false);
    const [visibleItems, setVisibleItems] = useState(3);
    const [visibleItem, setVisibleItem] = useState(3);

    const handleViewDocumentType = (index: number) => {
        if (openDirectorCompanyId !== null) {
            setViewingDocumentTypeIndex(index);
            handleDocumentTypeClick(documentTypes[index], openDirectorCompanyId);
            setShowPdfViewer(true);
        } else {
            console.error('openDirectorCompanyId is null');
        }
    };

    const handleViewDocumentListType = (index: number) => {
        if (DirectorCompanyId !== null) {
            setViewingDirectorDocumentTypeIndex(index);
            handleDocumentListTypeClick(directorDocumentType[index], DirectorCompanyId);
            setShowPdfViewers(true);
        } else {
            console.error('DirectorCompanyId is null');
        }
    };
    const handleClosePdfViewer = () => {
        setShowPdfViewer(false);
    };
    const handleClosePdf = () => {
        setPdfData({ base64: null, filename: null });
        setPdfDatas({ base64: null, filename: null });
    };
    const handleClosePdfViewers = () => {
        setShowPdfViewers(false);
    };

    const handleToggleDetails = () => {
        if (visibleItems === 3) {
            setVisibleItems(formDatas.combinedDTO.length);
        } else {
            setVisibleItems(3);
        }
    };

    const handleToggleDetail = () => {
        if (visibleItem === 3) {
            setVisibleItem(formDatas.combinedDTO.length);
        } else {
            setVisibleItem(3);
        }
    };

    const handleCompanyButtonClick = async (companyId: number, pathId: number) => {
        setError(null);
        setLoading(true);

        try {
            const companyDetailsData: any[] = await addressApiService.getDocumentType(companyId, pathId);
            const types = companyDetailsData.map(documentData => documentData.documentType);

            setCompanyDetails({
                companyName: companyDetailsData[0]?.companyName || 'Not Available',
                id: companyId,
                documentType: types[0] || null,
            });

            setDocumentTypes(types);
            if (openDirectorCompanyId === companyId) {

                setOpenDirectorCompanyId(null);
            } else {

                setOpenDirectorCompanyId(companyId);
                console.log('Clicked button for companyId:', companyId);
                console.log('Clicked button for documentTypes:', types);
            }
        } catch (error) {
            setError('Error fetching data');
            setImageSrc(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentTypeClick = async (imageName: string, companyId: number) => {
        try {
            const imagePathId = 5;
            const imageResponse = await addressApiService.getDocumentImage(companyId, imageName, imagePathId);

            console.log(`Image Response for Document Type ${imageName}:`, imageResponse);

            const base64Image = arrayBufferToBases64(imageResponse);
            setPdfDatas({ base64: base64Image, filename: imageName });
        } catch (error) {
            console.error(`Error fetching document image for Document Type ${imageName}:`, error);
        }
    };

    const handleDiretorCompanyButtonClick = async (companyId: number, pathId: number) => {
        setError(null);
        setLoading(true);

        try {
            const companyDetailsDatas: any[] = await addressApiService.getDocumentType(companyId, pathId);

            const types = companyDetailsDatas.map(documentData => documentData.documentType);
            setCompanyDetails({
                companyName: companyDetailsDatas[0]?.companyName || 'Not Available',
                id: companyId,
                documentType: types[0] || null,
            });

            setDirectorDocumentTypes(types);

            if (DirectorCompanyId === companyId) {
                setDirectorCompanyId(null);
            } else {
                setDirectorCompanyId(companyId);
                console.log('Clicked button for companyId:', companyId);
                console.log('Clicked button for documentTypes:', types);
            }
        } catch (error) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentListTypeClick = async (imageName: string, companyId: number) => {
        try {
            const imagePathId = 6;
            const imageResponse = await addressApiService.getDocumentImage(companyId, imageName, imagePathId);

            console.log(`Images Response for Document Type ${imageName}:`, imageResponse);

            const base64Image = arrayBufferToBases64(imageResponse);

            setImageSrc(base64Image);
        } catch (error) {
            console.error(`Error fetching document image for Document Type ${imageName}:`, error);
        }
    };
    const isDataAvailable = () => {
        return (
            formData.sourceLink ||
            formData.name ||
            formData.pan ||
            formData.education ||
            formData.dob ||
            akaformData.some((aka) => aka.akaName) ||
            PhoneNumberss.some((item) => item.communicationDt) ||
            Emailidss.some((item) => item.communicationDt)
        );
    };

    const headingStyle = {
        fontFamily: 'Times New Roman',
        fontSize: '20px',
    };

    const nameStyle = {
        fontFamily: 'Times New Roman',
        fontSize: '25px',
        fontWeight: 'bold',
        margin: '0',
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
    function formatDateInMonth(datesString: string | number | Date) {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const date = new Date(datesString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

    const partyservices = new PartyApiService();
    const fetchPartylist = async () => {
        try {
            const partylistData = await partyservices.getparty();
            setPartylist(partylistData);
        } catch (error) {
            console.error('Error fetching associated list:', error);
        }
    };
    const [partylist, setPartylist] = useState<{ id: string; partyName: string }[]>([]);

    const mapPartyIdToName = (partyId: string | number) => {
        const idToFindString = typeof partyId === 'number' ? partyId.toString() : partyId;
        const party = partylist.find((party) => party.id == idToFindString);
        return party ? party.partyName : 'Not Available';
    };

    const renderAkaNames = () => {
        return (
            akaformData && akaformData.some((aka) => aka.akaName.trim() !== '') ? (
                akaformData.map((aka, index) => (
                    <div key={index}>
                        {index > 0} {/* Line break if not the first name */}
                        <span>{aka.akaName}</span>
                    </div>
                ))
            ) : (
                'Not Available'
            )
        );
    };
    const
        [RelativeList, setRelativeList] = useState<Relative[]>([]);
    const fetchRelativeData = async () => {
        try {
            const response = await customer.getRelative();
            console.log('API Response:', response);
            setRelativeList(response);
            console.log('RelativeList:', RelativeList);
        } catch (error) {
            console.error('Error fetching Relatives Data:', error);
        }
    };

    const getColumnIcon = (columnName: string) => {
        switch (columnName) {
            case 'Photo':
                return <FontAwesomeIcon icon={faUserCircle} />;
            case 'Name':
                return <FontAwesomeIcon icon={faUser} />;

            case 'PAN':
                return <FontAwesomeIcon icon={faIdCard} />;
            case 'Directors Identification Number (DIN)':
                return <FontAwesomeIcon icon={faIdCard} />;
            case 'AKA Name':
                return <FontAwesomeIcon icon={faUser} />;
            case 'Phone Number':
                return <FontAwesomeIcon icon={faPhone} />;
            case 'Email Id':
                return <FontAwesomeIcon icon={faMailBulk} />;
            case 'Adverse Information':
                return <FontAwesomeIcon icon={faMailBulk} />;
            case 'Regulatory Action':
                return <FontAwesomeIcon icon={faMailBulk} />;
            case 'Media':
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
            case 'Address':
                return <FontAwesomeIcon icon={faAddressCard} />
            case 'Party':
                return <FontAwesomeIcon icon={faHandshake} />;
            case 'Died':
                return <FontAwesomeIcon icon={faSkull} />;
            // case 'Company / LLP Details':
            //     return <FontAwesomeIcon icon={faBuilding} />;
            // case 'Previous Company / LLP Details':
            //     return <FontAwesomeIcon icon={faBuilding} />;
            case 'Other Information':
                return <FontAwesomeIcon icon={faInfoCircle} />;
            // case 'Bussiness Associated Details':
            //     return <FontAwesomeIcon icon={faBusinessTime} />
            case 'Associated Details':
                return <FontAwesomeIcon icon={faList} />
            case 'Family Details':
                return <FontAwesomeIcon icon={faHome} />;
            case 'Relative Details':
                return <FontAwesomeIcon icon={faUsers} />
            case 'Spouse Details':
                return <FontAwesomeIcon icon={faRing} />;
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
            case 'Company Information List':
                return <FontAwesomeIcon icon={faMailBulk} />;
            case 'Company Media':
                return <FontAwesomeIcon icon={faUser} />;
            case 'Customer Files':
                return <FontAwesomeIcon icon={faFile} />
            case 'Company Files':
                return <FontAwesomeIcon icon={faFile} />
            default:
                return null;
        }
    };

    const toggleDetails = () => {
        setShowMoreDetails(!showMoreDetails);
    };

    const toggleLLPsDetails = () => {
        setShowMoreLLPsDetails(!showMoreLLPsDetails);
    };
    const toggleBussinessDetails = () => {
        setShowMoreBussinessDetails(!showMoreBussinessDetails);
    };

    const renderTableRows = () => {
        return backendColumns.map((columnName, index) => (
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
                        {renderColumnValue(columnName, formDatas)}
                    </div>
                </TableCell>
            </TableRow>
        ));
    };

    const handleDownloadPDF = async () => {
        try {
            setLoading(true);
            const tableElement = tableRef.current;
            if (!tableElement) {
                console.error("Table element is null");
                return;
            }
            const canvas = await html2canvas(tableElement, { scale: 3 });
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
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 30);
            pdf.save('user_details.pdf');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
        } finally {
            setLoading(false);
        }
    };


    const formatDate = (dateString: string | number | Date) => {
        if (!dateString) {
            return 'Not Available';
        }
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const hasVisibleData = partyData.some(party =>
        party.partyDetailsDTO.some(partyDetails =>
            partyDetails.partyMasterId !== null &&
            partyDetails.formerAndCurrent.trim() !== '' &&
            partyDetails.positionInTheParty.trim() !== ''
        )
    );

    const handleRequestForUpdateClick = () => {
        setIsTextBoxVisible(true);
    };

    const areContactAndAddressEmpty = (company: { contactDTOS: string | any[]; addressDTOS: string | any[]; }) => {
        const isEmailEmpty = !company.contactDTOS || company.contactDTOS.length === 0 || !company.contactDTOS[0].emailID;
        const isAddressEmpty = !company.addressDTOS || company.addressDTOS.length === 0 || !company.addressDTOS[0].registeredAddress;
        return isEmailEmpty && isAddressEmpty;
    };

    const handleTextBoxSubmit = async () => {
        if (!textBoxValue.trim()) {
            setIsError(true);
        } else {
            try {
                const parsedPepId = pepId ? parseInt(pepId) : 0;
                const parsedUid = uid ? parseInt(uid) : 0;
                const payload = {
                    pepId: parsedPepId,
                    description: textBoxValue,
                    uid: parsedUid,
                };
                const apiService = new ViewPageDetailsService();
                const response = await apiService.saveRequestDescription(payload);
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

    const isAllDataUnavailable = (company: CompanyDetailsItem) => {
        const areCompanyDetailsUnavailable = areAllCompanyDetailsUnavailable(company);
        const areContactsAndAddressUnavailable = areContactAndAddressEmpty(company);
        const areDirectorsUnavailable =
            !company.companiesDirectorsDTOS ||
            company.companiesDirectorsDTOS.length === 0 ||
            areAllDirectorValuesEmpty(company.companiesDirectorsDTOS);
        return areCompanyDetailsUnavailable && areContactsAndAddressUnavailable && areDirectorsUnavailable;
    };

    const areAllDirectorValuesEmpty = (directors: any[]) => {
        return directors.every((director) =>
            !director.directorName &&
            !director.din &&
            !director.designationId &&
            !director.directorStatus &&
            !director.appointmentDate &&
            !director.cessationDate
        );
    };

    const areAllCompanyDetailsUnavailable = (company: CompanyDetailsItem) => {
        const isSourceLinkUnavailable = !company.companyDTO.sourceLink;
        const isCompanyNameUnavailable = !company.companyDTO.companyName;
        const isCinfcrnUnavailable = !company.companyDTO.cinfcrn;
        const isOriginalDateUnavailable = !company.companyDTO.originalDateOfAppointment;
        return isSourceLinkUnavailable && isCompanyNameUnavailable && isCinfcrnUnavailable && isOriginalDateUnavailable;
    };

    const [companyNames, setCompanyNames] = useState<CompanyData[]>([]);
    const [selectedDin, setSelectedDin] = useState<string | null>(null);
    const [showFileUploadModal, setShowFileUploadModal] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [pathId, setPathId] = useState<number | undefined>(undefined);
    const [associatedId, setAssociatedId] = useState<number | undefined>(undefined);
    const [companyIds, setcompanyIds] = useState<number | undefined>(undefined);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [currentPdfBase64, setCurrentPdfBase64] = useState<string | null>(null);
    const [blockButtonText, setBlockButtonText] = useState('');
    const [blockButtonDisableds, setBlockButtonDisableds] = useState(false);
    const [blockButtonDisabled, setBlockButtonDisabled] = useState(false);
    const [companyData, setCompanyData] = useState<Company[]>([]);
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

    const handleCompany = async (companyId: number, imageName: string, imagePathId: number) => {
        try {
            setIsLoading(true);
            const imageResponse = await addressApiService.getDocumentImage(companyId, imageName, imagePathId);
            const base64Image = arrayBufferToBases64(imageResponse);

            if (base64Image) {
                setPdfDatas({ base64: base64Image, filename: imageName });
            } else {
                console.error('No base64 image data received.');
            }
        } catch (error) {
            console.error(`Error fetching document for Company ID ${companyId} and Path ID ${imagePathId}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderColumnValue = (columnName: string, formDatas: any) => {
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
                            }}
                        />
                    );
                }
            case 'Name':
                return formData.name || 'Not Available';
            case 'PAN':
                return formData.pan || 'Not Available';
            case 'AKA Name':
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
            case 'Directors Identification Number (DIN)':
                return formData.directorsIdentificationNumber || 'Not Available';
            case 'Adverse Information':
                return (
                    <>

                        <Grid item xs={12} sm={12}>
                            {adverseInformation === null || adverseInformation === undefined ? (
                                <div>Not Available</div>
                            ) : typeof adverseInformation === 'string' ? (
                                parseInt(adverseInformation, 10) === 1 ? (
                                    <div>Yes</div>
                                ) : parseInt(adverseInformation, 10) === 0 ? (
                                    <div>No</div>
                                ) : (
                                    <div>Not Available</div>
                                )
                            ) : typeof adverseInformation === 'number' ? (
                                adverseInformation === 1 ? (
                                    <div>Yes</div>
                                ) : adverseInformation === 0 ? (
                                    <div>No</div>
                                ) : (
                                    <div>Not Available</div>
                                )
                            ) : (
                                <div>Not Available</div>
                            )}
                        </Grid>

                    </>
                );

            case 'Regulatory Action':
                return (
                    <>
                        <Grid item xs={12} sm={12}>
                            {regulatoryAction ? (
                                <div>Yes</div>
                            ) : (
                                <div>No</div>
                            )}
                        </Grid>
                    </>

                );
            case 'Phone Number':
                return PhoneNumberss && PhoneNumberss.length > 0 ?
                    PhoneNumberss.map((phone, index) => (
                        <div key={index}>{phone.communicationDt}</div>
                    )) :
                    'Not Available';

            case 'Email Id':
                return Emailidss && Emailidss.length > 0 ?
                    Emailidss.map((email, index) => (
                        <div key={index}>{email.communicationDt}</div>
                    )) :
                    'Not Available';

            case 'Gender':
                return getgenderName(formData.genderId) || 'Not Available';

            case 'Education':
                const educationContent = formData.education;
                const displayContent = showFull
                    ? educationContent
                    : (educationContent && educationContent.length > maxLength)
                        ? educationContent.slice(0, maxLength) + '...'
                        : educationContent || 'Not Available';
                const toggleShowFull = () => {
                    setShowFull(!showFull);
                };
                const shouldShowLink = educationContent && educationContent.length > maxLength;
                return (
                    <div>
                        {displayContent && <p>{displayContent}
                            {shouldShowLink && (
                                <span
                                    style={{
                                        cursor: 'pointer',
                                        color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))',
                                        textDecoration: 'underline',
                                    }}
                                    onClick={toggleShowFull}
                                >
                                    {showFull ? 'Show less' : 'Show more'}
                                </span>
                            )}</p>}
                    </div>
                );
            case 'Position in the Government':
                const positionInTheGovernment = PartyformData?.[0]?.partyCandidateDetailsDTO?.positionInTheGovernment || 'Not Available';
                const formattedPosition = positionInTheGovernment.replace(/\n/g, '<br/>');
                const isTruncated = formattedPosition.length > 100;
                const truncatedPosition = isTruncated
                    ? showFullPosition
                        ? formattedPosition
                        : formattedPosition.slice(0, 100) + '...'
                    : formattedPosition;

                console.log('Position in the Government:', {
                    positionInTheGovernment,
                    formattedPosition,
                    isTruncated,
                    truncatedPosition,
                });

                return (
                    <>
                        <span dangerouslySetInnerHTML={{ __html: truncatedPosition }}></span>
                        {isTruncated && (
                            <span
                                style={{
                                    cursor: 'pointer',
                                    color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))',
                                    textDecoration: 'underline'
                                }}
                                onClick={() => setShowFullPosition(!showFullPosition)}
                            >
                                {showFullPosition ? ' Show Less' : ' Show More'}
                            </span>
                        )}
                    </>
                );

            case 'Address':
                const permanentAddress = PartyformData?.[0]?.partyCandidateDetailsDTO?.permanentAddress || 'Not Available';
                const isTruncate = permanentAddress.length > 100;
                const truncatePosition = isTruncate
                    ? showaddressPosition
                        ? permanentAddress
                        : permanentAddress.slice(0, 100) + '...'
                    : permanentAddress;

                const addressLines = truncatePosition.split('\n'); // Splitting addresses by newline character

                console.log('Address:', {
                    permanentAddress,
                    isTruncate,
                    truncatePosition,
                    addressLines,
                });

                return (
                    <>
                        {addressLines.map((address, index) => (
                            <div key={index}>
                                <span>{address}</span>
                                <br /> {/* New line for each address */}
                            </div>
                        ))}
                        {isTruncate && (
                            <span
                                style={{
                                    cursor: 'pointer',
                                    color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))',
                                    textDecoration: 'underline'
                                }}
                                onClick={() => setShowaddressPosition(!showaddressPosition)}
                            >
                                {showaddressPosition ? ' Show Less' : ' Show More'}
                            </span>
                        )}
                    </>
                );


            case 'Died':
                console.log('Died:', PartyformData?.[0]?.partyCandidateDetailsDTO?.died);
                return PartyformData?.[0]?.partyCandidateDetailsDTO?.died || 'Not Available';


            case 'Other Information':
                const otherInformation = PartyformData?.[0]?.partyCandidateDetailsDTO?.otherInformation || 'Not Available';
                const formattedOtherInformation = otherInformation.replace(/\n/g, '<br/>');
                const isTruncateds = formattedOtherInformation.length > 200;
                const truncatedOtherInformation = isTruncateds
                    ? showFullOtherInformation
                        ? formattedOtherInformation
                        : formattedOtherInformation.slice(0, 200) + '...'
                    : formattedOtherInformation;
                const toggleReadMore = () => {
                    setShowFullOtherInformation(!showFullOtherInformation);
                };
                console.log('Other Information:', {
                    otherInformation,
                    formattedOtherInformation,
                    isTruncateds,
                    truncatedOtherInformation,
                });
                return (
                    <>
                        <div dangerouslySetInnerHTML={{ __html: truncatedOtherInformation }}></div>
                        {isTruncateds && (
                            <span
                                style={{
                                    cursor: 'pointer',
                                    color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))',
                                    textDecoration: 'underline'
                                }}
                                onClick={toggleReadMore}
                            >
                                {showFullOtherInformation ? ' Read Less' : ' Read More'}
                            </span>
                        )}
                    </>
                );

            case 'Associated Details':
                return (

                    <div>
                        <Typography
                            component="span"
                            style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
                            onClick={() => setShowAssociatedDetails(!showAssociatedDetails)}
                        >
                            {showAssociatedDetails ? 'Hide More Details' : 'Show More Details'}
                        </Typography>

                        <Collapse in={showAssociatedDetails}>

                            {formDatas.combinedDTO && formDatas.combinedDTO.length > 0 ? (
                                <>
                                    {formDatas.combinedDTO.map((company: CompanyDetailsItem, index: number) => (
                                        <div key={index ?? 0}>
                                            <Grid item xs={12} sm={12} style={{ fontFamily: 'Times New Roman' }}>
                                                <strong> Company Name: </strong> {company.companyDTO.companyName || 'Not Available'}

                                                {formDatas.combinedDTO.length > 1 && (
                                                    <span
                                                        style={{
                                                            cursor: 'pointer',
                                                            color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))',
                                                            textDecoration: 'underline',
                                                            marginLeft: '10px'
                                                        }}
                                                        onClick={() => handleToggle(index)}
                                                    >
                                                        {showMore === index ? 'Less Details' : 'Show More'}
                                                    </span>
                                                )}
                                            </Grid>

                                            {showMore === index && (
                                                <>
                                                    {!isAllDataUnavailable(company) ? (
                                                        <>
                                                            {!areAllCompanyDetailsUnavailable(company) && (
                                                                <>
                                                                    <Grid item xs={12} sm={12} style={{ fontFamily: 'Times New Roman' }}>
                                                                        <strong>SourceLink: </strong>
                                                                        <p style={{ marginBottom: '14px', maxWidth: '100%' }}>
                                                                            {company.companyDTO.sourceLink ? (
                                                                                company.companyDTO.sourceLink.split('\n').map((link, linkIndex) => (
                                                                                    <React.Fragment key={linkIndex}>
                                                                                        <a
                                                                                            href={link as string}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            style={{
                                                                                                display: 'inline-block',
                                                                                                maxWidth: '100%',
                                                                                                overflow: 'hidden',
                                                                                                textOverflow: 'ellipsis',
                                                                                                whiteSpace: 'nowrap',
                                                                                            }}
                                                                                        >
                                                                                            {typeof link === 'string' && link.length > 60 ? `${link.substring(0, 60)}...` : link}
                                                                                        </a>
                                                                                        {linkIndex < company.companyDTO.sourceLink.split('\n').length - 1 && <br />}
                                                                                    </React.Fragment>
                                                                                ))
                                                                            ) : (
                                                                                'Not Available'
                                                                            )}
                                                                        </p>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={3} style={{ fontFamily: 'Times New Roman' }}>
                                                                        <strong>CINFCRN: </strong> {company.companyDTO.cinfcrn || 'Not Available'}
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={3} style={{ fontFamily: 'Times New Roman' }}>
                                                                        <strong>Original Date Of Appointment: </strong>
                                                                        {company.companyDTO.originalDateOfAppointment
                                                                            ? formatDateInMonth(company.companyDTO.originalDateOfAppointment)
                                                                            : 'Not Available'}
                                                                    </Grid>
                                                                </>
                                                            )}
                                                            <Grid item xs={12} sm={12}>
                                                                {!areContactAndAddressEmpty(company) ? (
                                                                    <TableContainer component={Paper} style={{ width: '100%', marginTop: '1%' }}>
                                                                        <Table>
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell style={{ width: '50%' }}><strong>Email Id</strong></TableCell>
                                                                                    <TableCell style={{ width: '50%' }}><strong>Registered Address</strong></TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell>
                                                                                        {company.contactDTOS && company.contactDTOS.length > 0 && company.contactDTOS[0].emailID
                                                                                            ? company.contactDTOS[0].emailID
                                                                                            : 'Not Available'}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {company.addressDTOS && company.addressDTOS.length > 0 && company.addressDTOS[0].registeredAddress
                                                                                            ? company.addressDTOS[0].registeredAddress
                                                                                            : 'Not Available'}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            </TableBody>
                                                                        </Table>
                                                                    </TableContainer>
                                                                ) : (
                                                                    <p></p>
                                                                )}
                                                            </Grid>

                                                            <Grid item xs={12} sm={12}>
                                                                {company.companiesDirectorsDTOS && company.companiesDirectorsDTOS.length > 0 && !areAllDirectorValuesEmpty(company.companiesDirectorsDTOS) ? (
                                                                    <TableContainer component={Paper} style={{ width: '100%', marginTop: '1%' }}>
                                                                        <Table>
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell><strong>D.Name</strong></TableCell>
                                                                                    <TableCell><strong>Din</strong></TableCell>
                                                                                    <TableCell><strong>Designation</strong></TableCell>
                                                                                    <TableCell><strong>Director Status</strong></TableCell>
                                                                                    <TableCell><strong>Date Of Appointment</strong></TableCell>
                                                                                    <TableCell><strong>Date Of Cessation</strong></TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                {company.companiesDirectorsDTOS.map((director, dirIndex) => (
                                                                                    <TableRow key={dirIndex}>
                                                                                        <TableCell>{director.directorName || 'Not Available'}</TableCell>
                                                                                        <TableCell>{director.din || 'Not Available'}</TableCell>
                                                                                        <TableCell>{getDesignationName(director.designationId) || 'Not Available'}</TableCell>
                                                                                        <TableCell>{director.directorStatus || 'Not Available'}</TableCell>
                                                                                        <TableCell>{director.appointmentDate || 'Not Available'}</TableCell>
                                                                                        <TableCell>{director.cessationDate || 'Not Available'}</TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </TableContainer>
                                                                ) : (
                                                                    <p></p>
                                                                )}
                                                            </Grid>
                                                        </>
                                                    ) : (
                                                        <p>Not Available</p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <p>Not Available</p>
                            )}
                        </Collapse>
                    </div>
                );

            // return (
            //     <div>
            //         {formDatas.combinedDTO && formDatas.combinedDTO.length > 0 ? (
            //             <>
            //                 {formDatas.combinedDTO.slice(0, showMore ? formDatas.combinedDTO.length : 1).map((company: CompanyDetailsItem, index: React.Key | null | undefined) => (
            //                     <div key={index}>
            //                         {!isAllDataUnavailable(company) ? (
            //                             <>
            //                                 {!areAllCompanyDetailsUnavailable(company) && (
            //                                     <>
            //                                         <Grid item xs={12} sm={12} style={{ fontFamily: 'Times New Roman' }}>
            //                                             <strong>SourceLink: </strong>
            //                                             <p style={{ marginBottom: '14px', maxWidth: '100%' }}>
            //                                                 {company.companyDTO.sourceLink ? (
            //                                                     company.companyDTO.sourceLink.split('\n').map((link: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, linkIndex: React.Key | null | undefined) => (
            //                                                         <React.Fragment key={linkIndex}>
            //                                                             <a
            //                                                                 href={link as string}
            //                                                                 target="_blank"
            //                                                                 rel="noopener noreferrer"
            //                                                                 style={{
            //                                                                     display: 'inline-block',
            //                                                                     maxWidth: '100%',
            //                                                                     overflow: 'hidden',
            //                                                                     textOverflow: 'ellipsis',
            //                                                                     whiteSpace: 'nowrap',
            //                                                                 }}
            //                                                             >
            //                                                                 {typeof link === 'string' && link.length > 60 ? `${link.substring(0, 60)}...` : link}
            //                                                             </a>
            //                                                             {typeof linkIndex === 'number' && linkIndex < company.companyDTO.sourceLink.split('\n').length - 1 && <br />}
            //                                                         </React.Fragment>
            //                                                     ))
            //                                                 ) : (
            //                                                     'Not Available'
            //                                                 )}
            //                                             </p>
            //                                         </Grid>
            //                                         <Grid item xs={12} sm={3} style={{ fontFamily: 'Times New Roman' }}>
            //                                             <strong>Company Name: </strong> {company.companyDTO.companyName || 'Not Available'}
            //                                         </Grid>
            //                                         <Grid item xs={12} sm={3} style={{ fontFamily: 'Times New Roman' }}>
            //                                             <strong>CINFCRN: </strong> {company.companyDTO.cinfcrn || 'Not Available'}
            //                                         </Grid>
            //                                         <Grid item xs={12} sm={3} style={{ fontFamily: 'Times New Roman' }}>
            //                                             <strong>Original Date Of Appointment: </strong>
            //                                             {company.companyDTO.originalDateOfAppointment
            //                                                 ? formatDateInMonth(company.companyDTO.originalDateOfAppointment)
            //                                                 : 'Not Available'}
            //                                         </Grid>
            //                                     </>
            //                                 )}

            //                                 <Grid item xs={12} sm={12}>
            //                                     {!areContactAndAddressEmpty(company) ? (
            //                                         <TableContainer component={Paper} style={{ width: '100%', marginTop: '1%' }}>
            //                                             <Table>
            //                                                 <TableHead>
            //                                                     <TableRow>
            //                                                         <TableCell style={{ width: '50%' }}><strong>Email Id</strong></TableCell>
            //                                                         <TableCell style={{ width: '50%' }}><strong>Registered Address</strong></TableCell>
            //                                                     </TableRow>
            //                                                 </TableHead>
            //                                                 <TableBody>
            //                                                     <TableRow>
            //                                                         <TableCell>
            //                                                             {company.contactDTOS && company.contactDTOS.length > 0 && company.contactDTOS[0].emailID
            //                                                                 ? company.contactDTOS[0].emailID
            //                                                                 : 'Not Available'}
            //                                                         </TableCell>
            //                                                         <TableCell>
            //                                                             {company.addressDTOS && company.addressDTOS.length > 0 && company.addressDTOS[0].registeredAddress
            //                                                                 ? company.addressDTOS[0].registeredAddress
            //                                                                 : 'Not Available'}
            //                                                         </TableCell>
            //                                                     </TableRow>
            //                                                 </TableBody>
            //                                             </Table>
            //                                         </TableContainer>
            //                                     ) : (
            //                                         <p></p>
            //                                     )}
            //                                 </Grid>

            //                                 <Grid item xs={12} sm={12}>
            //                                     {company.companiesDirectorsDTOS && company.companiesDirectorsDTOS.length > 0 && !areAllDirectorValuesEmpty(company.companiesDirectorsDTOS) ? (
            //                                         <TableContainer component={Paper} style={{ width: '100%', marginTop: '1%' }}>
            //                                             <Table>
            //                                                 <TableHead>
            //                                                     <TableRow>
            //                                                         <TableCell><strong>D.Name</strong></TableCell>
            //                                                         <TableCell><strong>Din</strong></TableCell>
            //                                                         <TableCell><strong>Designation</strong></TableCell>
            //                                                         <TableCell><strong>Director Status</strong></TableCell>
            //                                                         <TableCell><strong>Date Of Appointment</strong></TableCell>
            //                                                         <TableCell><strong>Date Of Cessation</strong></TableCell>
            //                                                     </TableRow>
            //                                                 </TableHead>
            //                                                 <TableBody>
            //                                                     {company.companiesDirectorsDTOS.map((director: { directorName: any; din: any; designationId: number; directorStatus: any; appointmentDate: any; cessationDate: any; }, dirIndex: React.Key | null | undefined) => (
            //                                                         <TableRow key={dirIndex}>
            //                                                             <TableCell>{director.directorName || 'Not Available'}</TableCell>
            //                                                             <TableCell>{director.din || 'Not Available'}</TableCell>
            //                                                             <TableCell>{getDesignationName(director.designationId) || 'Not Available'}</TableCell>
            //                                                             <TableCell>{director.directorStatus || 'Not Available'}</TableCell>
            //                                                             <TableCell>{director.appointmentDate || 'Not Available'}</TableCell>
            //                                                             <TableCell>{director.cessationDate || 'Not Available'}</TableCell>
            //                                                         </TableRow>
            //                                                     ))}
            //                                                 </TableBody>
            //                                             </Table>
            //                                         </TableContainer>
            //                                     ) : (
            //                                         <p></p>
            //                                     )}
            //                                 </Grid>
            //                             </>
            //                         ) : (
            //                             <p>Not Available</p>
            //                         )}
            //                     </div>
            //                 ))}
            //                 {formDatas.combinedDTO.length > 1 && (
            //                     <span
            //                         style={{
            //                             cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline'
            //                         }}
            //                         onClick={handleToggle}
            //                     >
            //                         {showMore ? 'Show Less Details' : 'Show More Details'}
            //                     </span>
            //                 )}
            //             </>
            //         ) : (
            //             <p>Not Available</p>
            //         )}
            //     </div>
            // );


            case 'Family Details':
                return (
                    <div>
                        {hasVisibleFamilyData ? (
                            <>
                                <Typography
                                    component="span"
                                    style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
                                    onClick={() => setShowFamilyDetails(!showFamilyDetails)}
                                >
                                    {showFamilyDetails ? 'Hide More Details' : 'Show More Details'}
                                </Typography>
                                <Collapse in={showFamilyDetails}>
                                    <div>
                                        <TableContainer component={Paper} style={{ width: '100%', marginBottom: '1%' }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><strong>Huf Name</strong></TableCell>
                                                        <TableCell><strong>Huf Pan</strong></TableCell>
                                                        <TableCell><strong>Father Name</strong></TableCell>
                                                        <TableCell><strong>Father Pan</strong></TableCell>
                                                        <TableCell><strong>Mother Name</strong></TableCell>
                                                        <TableCell><strong>Mother Pan</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {FamilyformData.familyCombinedDTO.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                {item.hufDTO?.length > 0 ? (
                                                                    item.hufDTO.map((contact, contactIndex) => (
                                                                        <p key={contactIndex}>{contact.hufName || 'Not Available'}</p>
                                                                    ))
                                                                ) : (
                                                                    <p>Not Available</p>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.hufDTO?.length > 0 ? (
                                                                    item.hufDTO.map((contact, contactIndex) => (
                                                                        <p key={contactIndex}>{contact.hufPan || 'Not Available'}</p>
                                                                    ))
                                                                ) : (
                                                                    <p>Not Available</p>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.fatherDTOS?.length > 0 ? (
                                                                    item.fatherDTOS.map((contact, contactIndex) => (
                                                                        <p key={contactIndex}>{contact.fatherName || 'Not Available'}</p>
                                                                    ))
                                                                ) : (
                                                                    <p>Not Available</p>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.fatherDTOS?.length > 0 ? (
                                                                    item.fatherDTOS.map((contact, contactIndex) => (
                                                                        <p key={contactIndex}>{contact.fatherPan || 'Not Available'}</p>
                                                                    ))
                                                                ) : (
                                                                    <p>Not Available</p>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.motherDTOS?.length > 0 ? (
                                                                    item.motherDTOS.map((contact, contactIndex) => (
                                                                        <p key={contactIndex}>{contact.motherName || 'Not Available'}</p>
                                                                    ))
                                                                ) : (
                                                                    <p>Not Available</p>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.motherDTOS?.length > 0 ? (
                                                                    item.motherDTOS.map((contact, contactIndex) => (
                                                                        <p key={contactIndex}>{contact.motherPan || 'Not Available'}</p>
                                                                    ))
                                                                ) : (
                                                                    <p>Not Available</p>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </Collapse>
                            </>
                        ) : (
                            <p>Not Available</p>
                        )}
                    </div>
                );
            case 'Party':
                return (
                    <div>
                        {partyData.length > 0 ? (
                            <>
                                <Typography
                                    component="span"
                                    style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
                                    onClick={() => setShowPartyDetails(!showPartyDetails)}
                                >
                                    {showPartyDetails ? 'Hide More Details' : 'Show More Details'}
                                </Typography>
                                <Collapse in={showPartyDetails}>
                                    <TableContainer component={Paper} style={{ width: '100%' }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Party</strong></TableCell>
                                                    <TableCell><strong>Party Name</strong></TableCell>
                                                    <TableCell><strong>Position in the Party</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {partyData.map((party: PartyRequests, index: number) => (
                                                    party.partyDetailsDTO.map((partyDetails: PartyDetailsDTO, subIndex: number) => (
                                                        <TableRow key={`${index}-${subIndex}`}>
                                                            <TableCell>
                                                                <p>{mapPartyIdToName(partyDetails.partyMasterId)}</p>
                                                            </TableCell>
                                                            <TableCell>
                                                                <p>{partyDetails.formerAndCurrent || 'Not Available'}</p>
                                                            </TableCell>
                                                            <TableCell>
                                                                <p>
                                                                    {partyDetails.positionInTheParty
                                                                        ? partyDetails.positionInTheParty.split('\n').map((item: string, subIndex: number) => (
                                                                            <React.Fragment key={subIndex}>
                                                                                {item}
                                                                                <br />
                                                                            </React.Fragment>
                                                                        ))
                                                                        : 'Not Available'}
                                                                </p>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Collapse>
                            </>
                        ) : (
                            <p>Party details not available</p>
                        )}

                    </div>
                );
            case 'Spouse Details':
                return (
                    <div>
                        {SpouseFamilyformData.spouseCommonDTO && SpouseFamilyformData.spouseCommonDTO.length > 0 ? (
                            <>
                                {SpouseFamilyformData.spouseCommonDTO[0].spouseDetailsDTO?.spouseName ? (

                                    <Typography
                                        component="span"
                                        style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
                                        onClick={() => setShowSpouseDetails(!showSpouseDetails)}
                                    >
                                        {showSpouseDetails ? 'Hide More Details' : 'Show More Details'}
                                    </Typography>
                                ) : "Not Available"}
                                <Collapse in={showSpouseDetails}>
                                    <TableContainer component={Paper} style={{ width: '100%', marginBottom: '1%' }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Spouse Name</strong></TableCell>
                                                    <TableCell><strong>Spouse PAN</strong></TableCell>
                                                    <TableCell><strong>Huf Name</strong></TableCell>
                                                    <TableCell><strong>Huf Pan</strong></TableCell>
                                                    <TableCell><strong>Father Name</strong></TableCell>
                                                    <TableCell><strong>Father Pan</strong></TableCell>
                                                    <TableCell><strong>Mother Name</strong></TableCell>
                                                    <TableCell><strong>Mother Pan</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {SpouseFamilyformData.spouseCommonDTO.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <p>{item.spouseDetailsDTO && item.spouseDetailsDTO.spouseName ? item.spouseDetailsDTO.spouseName : 'Not Available'}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p>{item.spouseDetailsDTO && item.spouseDetailsDTO.spousePan ? item.spouseDetailsDTO.spousePan : 'Not Available'}</p>
                                                        </TableCell>
                                                        {/* <TableCell>
                                                            {item.spouseHufDTOS?.map((contact, contactIndex) => (
                                                                <p key={contactIndex}>{contact.hufName || 'Not Available'}</p>
                                                            ))}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.spouseHufDTOS?.map((contact, contactIndex) => (
                                                                <p key={contactIndex}>{contact.hufPan || 'Not Available'}</p>
                                                            ))}
                                                        </TableCell> */}
                                                        <TableCell>
                                                            {item.spouseHufDTOS && item.spouseHufDTOS.length > 0 ? (
                                                                item.spouseHufDTOS.map((contact, contactIndex) => (
                                                                    <p key={contactIndex}>{contact.hufName || 'Not Available'}</p>
                                                                ))
                                                            ) : (
                                                                <p>Not Available</p>
                                                            )}
                                                        </TableCell>

                                                        <TableCell>
                                                            {item.spouseHufDTOS && item.spouseHufDTOS.length > 0 ? (
                                                                item.spouseHufDTOS.map((contact, contactIndex) => (
                                                                    <p key={contactIndex}>{contact.hufPan || 'Not Available'}</p>
                                                                ))
                                                            ) : (
                                                                <p>Not Available</p>
                                                            )}
                                                        </TableCell>

                                                        <TableCell>
                                                            {item.spouseFatherDTOS?.length > 0 ? (
                                                                item.spouseFatherDTOS.map((contact, contactIndex) => (
                                                                    <p key={contactIndex}>{contact.fatherName || 'Not Available'}</p>
                                                                ))
                                                            ) : (
                                                                <p>Not Available</p>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.spouseFatherDTOS?.length > 0 ? (
                                                                item.spouseFatherDTOS.map((contact, contactIndex) => (
                                                                    <p key={contactIndex}>{contact.fatherPan || 'Not Available'}</p>
                                                                ))
                                                            ) : (
                                                                <p>Not Available</p>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.spouseMotherDTOS?.length > 0 ? (
                                                                item.spouseMotherDTOS.map((contact, contactIndex) => (
                                                                    <p key={contactIndex}>{contact.motherName || 'Not Available'}</p>
                                                                ))
                                                            ) : (
                                                                <p>Not Available</p>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.spouseMotherDTOS?.length > 0 ? (
                                                                item.spouseMotherDTOS.map((contact, contactIndex) => (
                                                                    <p key={contactIndex}>{contact.motherPan || 'Not Available'}</p>
                                                                ))
                                                            ) : (
                                                                <p>Not Available</p>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Collapse>
                            </>
                        ) : (
                            <p>Not Available</p>
                        )}
                    </div>
                );
            case 'Relative Details':

                return (
                    <div>
                        {RelativeformData.relativeCombineDTO && RelativeformData.relativeCombineDTO.length > 0 ? (
                            <>
                                <Typography
                                    component="span"
                                    style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb),var(--bs-link-opacity,1))', textDecoration: 'underline' }}
                                    onClick={() => setShowRelativeDetails(!showRelativeDetails)}
                                >
                                    {showRelativeDetails ? 'Hide More Details' : 'Show More Details'}
                                </Typography>
                                <Collapse in={showRelativeDetails}>
                                    <div>
                                        {RelativeformData.relativeCombineDTO && RelativeformData.relativeCombineDTO.length > 0 ? (
                                            <TableContainer component={Paper}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Relative List</TableCell>
                                                            <TableCell>Relative Name</TableCell>
                                                            <TableCell>PAN</TableCell>
                                                            <TableCell>Spouse Name</TableCell>
                                                            <TableCell>Spouse PAN</TableCell>
                                                            <TableCell>Children Name</TableCell>
                                                            <TableCell>Children PAN</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {RelativeformData.relativeCombineDTO.map((relative, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>
                                                                    {RelativeList.find(item => item.id === relative.relativeDTO.relativeMasterId)?.name || '-'}
                                                                </TableCell>
                                                                <TableCell>{relative.relativeDTO.relativeName || 'Not Available'}</TableCell>
                                                                <TableCell>{relative.relativeDTO.pan || 'Not Available'}</TableCell>
                                                                <TableCell>
                                                                    {relative.relativeDetDTOS.length > 0 ? (
                                                                        relative.relativeDetDTOS.map((spouse, spouseIndex) => (
                                                                            <div key={spouseIndex}>
                                                                                {spouse.name}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        'Not Available'
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {relative.relativeDetDTOS.length > 0 ? (
                                                                        relative.relativeDetDTOS.map((spouse, spouseIndex) => (
                                                                            <div key={spouseIndex}>
                                                                                {spouse.pan || '-'}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        'Not Available'
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {relative.relativeChildrenDTOS.length > 0 ? (
                                                                        relative.relativeChildrenDTOS.map((child, childIndex) => (
                                                                            <div key={childIndex}>
                                                                                {child.childrenName}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        'Not Available'
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {relative.relativeChildrenDTOS.length > 0 ? (
                                                                        relative.relativeChildrenDTOS.map((child, childIndex) => (
                                                                            <div key={childIndex}>
                                                                                {child.pan || 'Not Available'}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        'Not Available'
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        ) : (
                                            <p>Not Available</p>
                                        )}
                                    </div>
                                </Collapse>
                            </>
                        ) : (
                            <p>Not Available</p>
                        )}
                    </div>
                );


            case 'Source Link':
                const sourceLink = formData.sourceLink;
                const maxLinkLength = 50;
                return (
                    <div>
                        {sourceLink ? (
                            sourceLink.split('\n').map((link: string, index: number) => (
                                <React.Fragment key={index}>
                                    <p style={{ marginBottom: '-14px', maxWidth: '100%' }}>
                                        <a href={link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {link.length > maxLinkLength ? `${link.substring(0, maxLinkLength)}...` : link}
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
            case 'Media':
                return (
                    <>
                        {associationaspermedia && associationaspermedia.length > 0 ? (
                            // Create a Set to hold unique associations
                            Array.from(new Set(associationaspermedia.map(aka => aka.otherAssociationAsPerMedia)))
                                .filter(Boolean) // Filter out any empty or undefined values
                                .map((uniqueAssociation, index) => (
                                    <Grid item xs={12} sm={3} key={index}>
                                        <div style={{ marginBottom: '2em' }}>
                                            {uniqueAssociation ? (
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: uniqueAssociation.replace(/\n/g, '<br/>'),
                                                    }}
                                                />
                                            ) : (
                                                'Not Available'
                                            )}
                                        </div>
                                    </Grid>
                                ))
                        ) : (
                            <p>No associations available.</p> // If associationaspermedia is empty
                        )}
                    </>
                );

            case 'Company Media':
                return (
                    <div>
                        {formDatas && Array.isArray(formDatas.combinedDTO) && formDatas.combinedDTO.length > 0 ? (
                            formDatas.combinedDTO.some((item: { companyAssociationDTOS?: any[] }) =>
                                item.companyAssociationDTOS && item.companyAssociationDTOS.length > 0
                            ) ? (
                                formDatas.combinedDTO.reduce((acc: string[], item: { companyAssociationDTOS?: any[] }) => {
                                    if (item.companyAssociationDTOS && item.companyAssociationDTOS.length > 0) {
                                        item.companyAssociationDTOS.forEach((associationItem: any) => {
                                            if (
                                                associationItem.companyAssociation &&
                                                associationItem.companyAssociation.trim() !== ""
                                            ) {
                                                const cleanedAssociation = associationItem.companyAssociation.replace(/\n/g, '<br/>');
                                                if (!acc.includes(cleanedAssociation)) {
                                                    acc.push(cleanedAssociation);
                                                }
                                            }
                                        });
                                    }
                                    return acc;
                                }, []).map((uniqueAssociation: string, index: number) => (
                                    <Grid item xs={12} sm={3} key={index}>
                                        <span dangerouslySetInnerHTML={{ __html: uniqueAssociation }} />
                                    </Grid>
                                ))
                            ) : (
                                <p>No company associations available.</p>
                            )
                        ) : (
                            <p>Not Available</p>
                        )}
                    </div>
                );

            case 'Customer Files':

                return (
                    <div>
                        <Grid item xs={12}>
                            <Form>
                                <Row>
                                    <Col xs={1}>
                                        <Button variant="primary" onClick={() => handleButtonClick(parseInt(pepId || '0', 10), 2)}>
                                            Party
                                        </Button>
                                    </Col>
                                    <Col xs={1}>
                                        <Button variant="primary" onClick={() => handleButtonClicks(parseInt(pepId || '0', 10), 3)}>
                                            DIN
                                        </Button>
                                    </Col>
                                    <Col xs={1}>
                                        <Button variant="primary" onClick={() => handleButtonClicks(parseInt(pepId || '0', 10), 4)}>
                                            C.LLP
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>

                            <div>
                                {error && !pdfData.base64 && buttonClicked && (
                                    <p style={{ color: 'red' }}>{error}</p>
                                )}
                            </div>

                            {loading && <p>Loading...</p>}

                            {base64Image && buttonClicked && !loading && !error && (
                                <Col xs={12} style={{ marginTop: '2%' }}>
                                    <div>
                                        <Image src={base64Image} alt="Preview" style={{ maxHeight: '250px', maxWidth: '300px' }} />
                                    </div>
                                </Col>
                            )}
                            {pdfData.base64 && buttonClicked && !loading && !error && (
                                <Col xs={12} style={{ marginTop: '2%' }}>
                                    <div>
                                        {pdfData && pdfData.base64 && (
                                            <div style={{ position: 'relative' }}>
                                                <button
                                                    onClick={handleClosePdf}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '1.5rem'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                                <iframe
                                                    src={`data:application/pdf;base64,${pdfData.base64}`}
                                                    style={{ width: '100%', height: '600px', border: 'none' }}
                                                    title="Document PDF"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            )}
                        </Grid>
                    </div>
                );

            case 'Company Files':
                return (
                    <div>
                        {(() => {
                            console.log('Rendering Company Files section');

                            const associatedDetails = formDatas.combinedDTO
                                ?.filter((item: CompanyDetailsItem) => item.companyDTO?.typeId === 1) || [];

                            const allDocumentsEmpty = associatedDetails.every(
                                (item: CompanyDetailsItem) => !item.companyDTO.document || item.companyDTO.document.length === 0
                            );

                            // if (associatedDetails.length === 0 || allDocumentsEmpty) {
                            //     return (
                            //         <Grid item xs={12}>
                            //             <div>
                            //                 <span>Not Available</span>
                            //             </div>
                            //         </Grid>
                            //     );
                            // }
                            return (
                                <div>
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
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', position: 'relative' }}>
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
                                                                                    onClick={() => handleCompany(company.companyId, company.id.toString(), company.pathId)}
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
                                                                                    onClick={() => handleCompany(company.companyId, company.id.toString(), company.pathId)}
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

                                        {pdfDatas && pdfDatas.base64 && (
                                            <div style={{ position: 'relative' }}>
                                                <button
                                                    onClick={handleClosePdf}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '1.5rem'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                                <iframe
                                                    src={`data:application/pdf;base64,${pdfDatas.base64}`}
                                                    style={{ width: '100%', height: '600px', border: 'none' }}
                                                    title="Document PDF"
                                                />
                                            </div>
                                        )}

                                        {isLoading && <p>Loading...</p>}
                                    </Form>

                                </div>
                            );
                        })()}
                    </div>
                );

            default:
                console.log('Default case');
                return null;

        }
    };


    return (
        <div>
            {isHeaderVisible && <Header />}
            <Box>
                <Card
                    style={{
                        // margin: '6%',
                        padding: '1%',
                        boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                        marginLeft: '1%',
                        width: '98%',
                    }}
                >
                    <Container
                        style={{
                            maxWidth: 'none',
                            backgroundColor: 'white',
                            // margin: '10px',

                        }}
                    >
                        <Box>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <h4 style={{ marginBottom: '1%' }}>QC VIEW</h4>
                                </Grid>

                            </Grid>
                            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                                <Table ref={tableRef}>
                                    <TableBody>{renderTableRows()}</TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Container>
                </Card>
            </Box>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' ,marginTop:'1%'}}>
                <Button style={{ marginRight: '1%' }} onClick={() => {
                    if (pepId !== undefined && uid !== undefined) {
                        handleCloseClick(pepId, uid);
                    }
                }}>
                    Close
                </Button>
                <Button variant="primary" style={{ marginRight: '1%' }} onClick={() => {
                    if (pepId !== undefined && uid !== undefined) {
                        handleEditClick(pepId, uid);
                    }
                }}>
                    Edit
                </Button>

                <Button variant="primary" style={{ marginRight: '1%' }} onClick={() => {
                    if (pepId !== undefined && uid !== undefined) {
                        handleUpdateClick(pepId, uid);
                    }
                }}>
                    Approve
                </Button>
            </div>
            <Box mt={3} />
            <div ref={componentRef}></div>
        </div>


    );


};

export default View;



// case 'Associated Details':
//     return (
//         <div>
//             {formDatas.combinedDTO && formDatas.combinedDTO.length > 0 ? (
//                 <>
//                     {formDatas.combinedDTO.map((company: CompanyDetailsItem, index: number) => (
//                         <div key={index}>
//                             {!isAllDataUnavailable(company) ? (
//                                 <>
//                                     {!areAllCompanyDetailsUnavailable(company) && (
//                                         <>
//                                             <Grid item xs={12} sm={12} style={{ fontFamily: 'Times New Roman' }}>
//                                                 <strong>SourceLink: </strong>
//                                                 <p style={{ marginBottom: '14px', maxWidth: '100%' }}>
//                                                     {company.companyDTO.sourceLink ? (
//                                                         company.companyDTO.sourceLink.split('\n').map((link: string, linkIndex: number) => (
//                                                             <React.Fragment key={linkIndex}>
//                                                                 <a
//                                                                     href={link}
//                                                                     target="_blank"
//                                                                     rel="noopener noreferrer"
//                                                                     style={{
//                                                                         display: 'inline-block',
//                                                                         maxWidth: '100%',
//                                                                         overflow: 'hidden',
//                                                                         textOverflow: 'ellipsis',
//                                                                         whiteSpace: 'nowrap',
//                                                                     }}
//                                                                 >
//                                                                     {link.length > 60 ? `${link.substring(0, 60)}...` : link}
//                                                                 </a>
//                                                                 {linkIndex < company.companyDTO.sourceLink.split('\n').length - 1 && <br />}
//                                                             </React.Fragment>
//                                                         ))
//                                                     ) : (
//                                                         'Not Available'
//                                                     )}
//                                                 </p>
//                                             </Grid>
//                                             <Grid item xs={12} sm={3} style={{ fontFamily: 'Times New Roman' }}>
//                                                 <strong>Company Name: </strong> {company.companyDTO.companyName || 'Not Available'}
//                                             </Grid>
//                                             <Grid item xs={12} sm={3} style={{ fontFamily: 'Times New Roman' }}>
//                                                 <strong>CINFCRN: </strong> {company.companyDTO.cinfcrn || 'Not Available'}
//                                             </Grid>
//                                             <Grid item xs={12} sm={3} style={{ fontFamily: 'Times New Roman' }}>
//                                                 <strong>Original Date of Appointment: </strong>
//                                                 {company.companyDTO.originalDateOfAppointment
//                                                     ? formatDateInMonth(company.companyDTO.originalDateOfAppointment)
//                                                     : 'Not Available'}
//                                             </Grid>
//                                         </>
//                                     )}

//                                     <Grid item xs={12} sm={12}>
//                                         {!areContactAndAddressEmpty(company) ? (
//                                             <TableContainer component={Paper} style={{ width: '100%', marginTop: '1%' }}>
//                                                 <Table>
//                                                     <TableHead>
//                                                         <TableRow>
//                                                             <TableCell style={{ width: '50%' }}><strong>Email Id</strong></TableCell>
//                                                             <TableCell style={{ width: '50%' }}><strong>Registered Address</strong></TableCell>
//                                                         </TableRow>
//                                                     </TableHead>
//                                                     <TableBody>
//                                                         <TableRow>
//                                                             <TableCell>
//                                                                 {company.contactDTOS && company.contactDTOS.length > 0 && company.contactDTOS[0].emailID
//                                                                     ? company.contactDTOS[0].emailID
//                                                                     : 'Not Available'}
//                                                             </TableCell>
//                                                             <TableCell>
//                                                                 {company.addressDTOS && company.addressDTOS.length > 0 && company.addressDTOS[0].registeredAddress
//                                                                     ? company.addressDTOS[0].registeredAddress
//                                                                     : 'Not Available'}
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     </TableBody>
//                                                 </Table>
//                                             </TableContainer>
//                                         ) : (
//                                             <p></p>
//                                         )}
//                                     </Grid>

//                                     <Grid item xs={12} sm={12}>
//                                         {company.companiesDirectorsDTOS && company.companiesDirectorsDTOS.length > 0 && !areAllDirectorValuesEmpty(company.companiesDirectorsDTOS) ? (
//                                             <TableContainer component={Paper} style={{ width: '100%', marginTop: '1%' }}>
//                                                 <Table>
//                                                     <TableHead>
//                                                         <TableRow>
//                                                             <TableCell><strong>D.Name</strong></TableCell>
//                                                             <TableCell><strong>Din</strong></TableCell>
//                                                             <TableCell><strong>Designation</strong></TableCell>
//                                                             <TableCell><strong>Director Status</strong></TableCell>
//                                                             <TableCell><strong>Date Of Appointment</strong></TableCell>
//                                                             <TableCell><strong>Date Of Cessation</strong></TableCell>
//                                                         </TableRow>
//                                                     </TableHead>
//                                                     <TableBody>
//                                                         {company.companiesDirectorsDTOS.map((director, dirIndex) => (
//                                                             <TableRow key={dirIndex}>
//                                                                 <TableCell>{director.directorName || 'Not Available'}</TableCell>
//                                                                 <TableCell>{director.din || 'Not Available'}</TableCell>
//                                                                 <TableCell>{getDesignationName(director.designationId) || 'Not Available'}</TableCell>
//                                                                 <TableCell>{director.directorStatus || 'Not Available'}</TableCell>
//                                                                 <TableCell>{director.appointmentDate || 'Not Available'}</TableCell>
//                                                                 <TableCell>{director.cessationDate || 'Not Available'}</TableCell>
//                                                             </TableRow>
//                                                         ))}
//                                                     </TableBody>
//                                                 </Table>
//                                             </TableContainer>
//                                         ) : (
//                                             <p></p>
//                                         )}
//                                     </Grid>
//                                 </>
//                             ) : (
//                                 <p>Not Available</p>
//                             )}
//                         </div>
//                     ))}
//                 </>
//             ) : (
//                 <p>Not Available</p>
//             )}
//         </div>
//     );