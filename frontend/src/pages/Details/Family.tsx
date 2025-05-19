

import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Container, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AddressDTO, AkaDetRequest, AssociatedlistPayload, PartyPayload, CompaniesDirectorsDTO, CompanyDTO, ContactDTO, Country, CustomerRequest, Emailids, Father, Mother, NumberofHUTs, OtherAssociationRequest, PartyRequest, PartyAddress, Payload, PhoneNumbers, CompanyMasterPayload, Relative, RelativePayload, Spouse, State, DesignationPayload, CompanyDocumentsDTO, Gender } from '../../data/services/viewpage/viewpagedetails-payload';
import RelativeApiService from '../../data/services/master/relative/relative-api-serivces';
import { SelectChangeEvent } from '@mui/material/Select';

export interface HufDTO {
    pepId: number;
    HUF: string;
    HUFPan: string;
}

export interface FatherDTO {
    pepId: number;
    hufId: number;
    fatherName: string;
    fatherPan: string;
}

export interface MotherDTO {
    pepId: number;
    hufId: number;
    motherName: string;
    motherPan: string;
}



export interface FamilyCombinedDTO {
    hufDTO: HufDTO[];
    fatherDTOS: FatherDTO[];
    motherDTOS: MotherDTO[];
}

export interface FamilyPayload {
    familyCombinedDTO: FamilyCombinedDTO[];
}

export interface SpousehufDTO {
    pepId: number;
    HUF: string;
    HUFPan: string;
}


export interface SpouseDTOS {
    pepId: number;

    spouseName: string;
    spousePan: string;
}

export interface SpouseMotherDTO {
    pepId: number;
    hufId: number;
    fatherName: string;
    fatherPan: string;
}

export interface SpouseFamilyMotherDTO {
    pepId: number;
    hufId: number;
    motherName: string;
    motherPan: string;
}

export interface SpouseFamilyCombinedDTO {
    spouseDTOS: SpouseDTOS;
    spousefamilyDetDTO: SpousehufDTO[];
    spousefamilyFatherDTO: SpouseMotherDTO[];
    SpousefamilyMotherDTO: SpouseFamilyMotherDTO[];
}

export interface SpouseFamilyPayload {
    SpousefamilyCombinedDTO: SpouseFamilyCombinedDTO[];
}
export interface FamilyType {
    id: string;
    family: string;

}

function Family() {
    const [relativePanTouched, setRelativePanTouched] = useState(false);
    const [spousePanTouched, setSpousePanTouched] = useState(false);
    const [childrenPanTouched, setChildrenPanTouched] = useState(false);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [touchedFields, setTouchedFields] = useState<boolean[]>([false]);
    const [touched, setTouched] = useState(false);
    const [panErrors, setPanErrors] = useState<string[]>([]);
    const [spousePanErrors, setspousePanErrors] = useState<string[]>([]);
    const [motherPanErrors, setmotherPanErrors] = useState<string[]>([]);
    const [fatherPanErrors, setfatherPanErrors] = useState<string[]>([]);
    const [HUFPanErrors, setHUFPanErrors] = useState<string[]>([]);
    const [isValidInput, setIsValidInput] = useState(true);
    const [fathers, setFathers] = useState<Father[]>([{ pepId: 0, relativeName: '', pan: '', relativeMasterId: '4' }]);
    const [mothers, setMothers] = useState<Mother[]>([{ pepId: 0, relativeName: '', pan: '', relativeMasterId: '5' }]);
    const [NumberofHUTss, setNumberofHUTss] = useState<NumberofHUTs[]>([{ pepId: 0, relativeName: '', pan: '', relativeMasterId: '4' }]);
    const [Spouses, setSpouses] = useState<Spouse[]>([{ pepId: 0, relativeName: '', pan: '', relativeMasterId: '5' }]);
    const [FamilyformData, setFamilyFormData] = useState<FamilyPayload>({
        familyCombinedDTO: [
            {

                hufDTO:[
                    {
                        pepId: 0,
                        HUF: '',
                        HUFPan: '',
                    },
                ],
                
                fatherDTOS: [
                    {
                        pepId: 0,
                        hufId: 0,
                        fatherName: '',
                        fatherPan: '',
                    },
                ],
                motherDTOS: [
                    {
                        pepId: 0,
                        hufId: 0,
                        motherName: '',
                        motherPan: '',
                    },
                ],
            },
        ],
    });
    const [SpouseFamilyformData, setSpouseFamilyFormData] = useState<SpouseFamilyPayload>({
        SpousefamilyCombinedDTO: [
            {
                spouseDTOS: {
                    pepId: 0,

                    spouseName: '',
                    spousePan: '',
                },
                spousefamilyDetDTO: [
                    {
                        pepId: 0,
                        HUF: '',
                        HUFPan: '',
                    },
                ],

                spousefamilyFatherDTO: [
                    {
                        pepId: 0,
                        hufId: 0,
                        fatherName: '',
                        fatherPan: '',
                    },
                ],
                SpousefamilyMotherDTO: [
                    {
                        pepId: 0,
                        hufId: 0,
                        motherName: '',
                        motherPan: '',
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
    const [selectedfamilyType, setSelectedfamilyType] = useState<string>('');
    const [familyType, setfamilyType] = useState<FamilyType[]>([
        { id: '1', family: 'Son', },
        { id: '2', family: 'Daugher' },
        // Add other items as needed
    ]);
    const handleRemoveBoxFather = (index: number) => {
        const updatedFathers = [...fathers];
        updatedFathers.splice(index, 1);
        setFathers(updatedFathers);
    };

    const handleAddFatherNameField = () => {
        setFathers([...fathers, { pepId: 0, relativeName: '', pan: '', relativeMasterId: '4' }]);
    };

    const handleFatherNameChange = (value: string, index: number) => {
        const updatedFathers = [...fathers];
        updatedFathers[index].relativeName = value;
        setFathers(updatedFathers);
    };

    const handleFatherPANChange = (value: string, index: number) => {
        const updatedFathers = [...fathers];
        updatedFathers[index].pan = value;
        setFathers(updatedFathers);
    };

    const handleRemoveBoxMother = (index: number) => {
        const updatedMothers = [...mothers];
        updatedMothers.splice(index, 1);
        setMothers(updatedMothers);
    };

    const handleAddMotherNameField = () => {
        setMothers([...mothers, { pepId: 0, relativeName: '', pan: '', relativeMasterId: '4' }]);
    };

    const handleMotherNameChange = (value: string, index: number) => {
        const updatedMothers = [...mothers];
        updatedMothers[index].relativeName = value;
        setMothers(updatedMothers);
    };

    const handleMotherPANChange = (value: string, index: number) => {
        const updatedMothers = [...mothers];
        updatedMothers[index].pan = value;
        setMothers(updatedMothers);
    };

    const handleRemoveBoxNumberofHUTs = (index: number) => {
        const updatedNumberofHUTss = [...NumberofHUTss];
        updatedNumberofHUTss.splice(index, 1);
        setNumberofHUTss(updatedNumberofHUTss);
    };

    const handleAddNumberofHUTsNameField = () => {
        setNumberofHUTss([...NumberofHUTss, { pepId: 0, relativeName: '', pan: '', relativeMasterId: '4' }]);
    };

    const handleNumberofHUTsNameChange = (value: string, index: number) => {
        const updatedNumberofHUTss = [...NumberofHUTss];
        updatedNumberofHUTss[index].relativeName = value;
        setNumberofHUTss(updatedNumberofHUTss);
    };

    const handleNumberofHUTsPANChange = (value: string, index: number) => {
        const updatedNumberofHUTss = [...NumberofHUTss];
        updatedNumberofHUTss[index].pan = value;
        setNumberofHUTss(updatedNumberofHUTss);
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
                HUF: '',
                HUFPan: '',
            });
        }
       
        else if (fieldType === 'father') {
            updatedPeople.familyCombinedDTO[personIndex].fatherDTOS.push({
                pepId: 0,
                hufId: 0,
                fatherName: '',
                fatherPan: '',
            });

        }
        else if (fieldType === 'mother') {
            updatedPeople.familyCombinedDTO[personIndex].motherDTOS.push({
                pepId: 0,
                hufId: 0,
                motherName: '',
                motherPan: '',
            });

        }

        setFamilyFormData({ familyCombinedDTO: updatedPeople.familyCombinedDTO });
    };

    const handleInputChangeHuf = (
        personIndex: number,
        field: 'HUF' | 'HUFPan',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
        const value = field === 'HUF' ? event.target.value : event.target.value.toUpperCase();

        if (index !== null) {
            if (field === 'HUF' || field === 'HUFPan') {
                if (!updatedPeople.familyCombinedDTO[personIndex].hufDTO[index]) {
                    updatedPeople.familyCombinedDTO[personIndex].hufDTO[index] = {
                        pepId: 0,
                        HUF: '',
                        HUFPan: '',
                    };
                }
                updatedPeople.familyCombinedDTO[personIndex].hufDTO[index][field] = value;
                if (field === 'HUFPan') {
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
                errors[index] = 'Invalid PAN format';
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
            updatedPeople[personIndex].hufDTO.splice(index, 1); // Replace 'familyDetDTO' with the correct array property
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
                errors[index] = 'Invalid PAN format';
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
    // const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    const validatemotherPan = (motherPan: string, index: number | null) => {
        const errors = [...panErrors];
        const isValid = panRegex.test(motherPan);

        if (index !== null) {
            if (!isValid) {
                errors[index] = 'Invalid PAN format';
            } else {
                errors[index] = '';
            }
        }
        setmotherPanErrors(errors);
    };
    const handleRemoveBoxSpouseFamily = (personIndex: number) => {
        setSpouseFamilyFormData((prevData) => {
            const updatedPeople = [...prevData.SpousefamilyCombinedDTO];
            updatedPeople.splice(personIndex, 1);
            return { SpousefamilyCombinedDTO: updatedPeople };
        });
    };


    const handleAddFieldSpouseFamily = (personIndex: number, fieldType: 'huf' | 'Spouse' | 'father' | 'mother') => {
        const updatedPeople = { ...SpouseFamilyformData };
        
        if (fieldType === 'huf') {
            updatedPeople.SpousefamilyCombinedDTO[personIndex].spousefamilyDetDTO.push({
                pepId: 0,
                HUF: '',
                HUFPan: '',
            });
        }

        else if (fieldType === 'father') {
            updatedPeople.SpousefamilyCombinedDTO[personIndex].spousefamilyFatherDTO.push({
                pepId: 0,
                hufId: 0,
                fatherName: '',
                fatherPan: '',
            });

        }
        else if (fieldType === 'mother') {
            updatedPeople.SpousefamilyCombinedDTO[personIndex].SpousefamilyMotherDTO.push({
                pepId: 0,
                hufId: 0,
                motherName: '',
                motherPan: '',
            });

        }

        setSpouseFamilyFormData({ SpousefamilyCombinedDTO: updatedPeople.SpousefamilyCombinedDTO });
    };



    const handlerelativeChange = (personIndex: number, value: any) => {
        const updatedPeople = JSON.parse(JSON.stringify(SpouseFamilyformData));
        updatedPeople.SpousefamilyCombinedDTO[personIndex].spousefamilyDetDTO.relativeMasterId = value;
        setSpouseFamilyFormData({ SpousefamilyCombinedDTO: updatedPeople.SpousefamilyCombinedDTO });
    };

    const handleInputChangeSpouseHuf = (
        personIndex: number,
        field: 'HUF' | 'HUFPan',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(SpouseFamilyformData));
        const value = field === 'HUF' ? event.target.value : event.target.value.toUpperCase();

        if (index !== null) {
            if (field === 'HUF' || field === 'HUFPan') {
                if (!updatedPeople.SpousefamilyCombinedDTO[personIndex].spousefamilyDetDTO[index]) {
                    updatedPeople.SpousefamilyCombinedDTO[personIndex].spousefamilyDetDTO[index] = {
                        pepId: 0,
                        HUF: '',
                        HUFPan: '',
                    };
                }
                updatedPeople.SpousefamilyCombinedDTO[personIndex].spousefamilyDetDTO[index][field] = value;
                if (field === 'HUFPan') {
                    validateHUFPan(value, index);
                }
            }
        }
        setSpouseFamilyFormData({ SpousefamilyCombinedDTO: updatedPeople.SpousefamilyCombinedDTO });
    };

    const validateHUFPan = (HUFPan: string, index: number | null) => {
        const errors = [...panErrors];
        const isValid = panRegex.test(HUFPan);

        if (index !== null) {
            if (!isValid) {
                errors[index] = 'Invalid PAN format';
            } else {
                errors[index] = '';
            }
        }
        setHUFPanErrors(errors);
    };
    const handleDeleteFieldspouseHuf = (
        personIndex: number,
        field1: 'HUFPan' | 'HUF',
        index: number
    ) => {
        const updatedPeople = [...SpouseFamilyformData.SpousefamilyCombinedDTO];
        if (field1 === 'HUF' || field1 === 'HUFPan') {
            updatedPeople[personIndex].spousefamilyDetDTO.splice(index, 1); // Replace 'spousefamilyDetDTO' with the correct array property
        }
        setSpouseFamilyFormData({ SpousefamilyCombinedDTO: updatedPeople });
    };


    const handleDeleteFieldspousefather = (
        personIndex: number,
        field1: 'fatherPan' | 'fatherName',
        index: number
    ) => {
        const updatedPeople = [...SpouseFamilyformData.SpousefamilyCombinedDTO];
        if (field1 === 'fatherName' || field1 === 'fatherPan') {
            updatedPeople[personIndex].spousefamilyFatherDTO.splice(index, 1);
        }
        setSpouseFamilyFormData({ SpousefamilyCombinedDTO: updatedPeople });
    };
    const handleDeleteFieldspousemother = (
        personIndex: number,
        field1: 'motherPan' | 'motherName',
        index: number
    ) => {
        const updatedPeople = [...SpouseFamilyformData.SpousefamilyCombinedDTO];
        if (field1 === 'motherName' || field1 === 'motherPan') {
            updatedPeople[personIndex].SpousefamilyMotherDTO.splice(index, 1);
        }
        setSpouseFamilyFormData({ SpousefamilyCombinedDTO: updatedPeople });
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
                if (!updatedPeople.SpousefamilyCombinedDTO[personIndex].spousefamilyFatherDTO[index]) {
                    updatedPeople.SpousefamilyCombinedDTO[personIndex].spousefamilyFatherDTO[index] = {
                        pepId: 0,
                        hufId: 0,
                        fatherName: '',
                        fatherPan: '',
                    };
                }
                updatedPeople.SpousefamilyCombinedDTO[personIndex].spousefamilyFatherDTO[index][field] = value;
                if (field === 'fatherPan') {
                    validatePan(value, index);
                }
            }
        }
        setSpouseFamilyFormData({ SpousefamilyCombinedDTO: updatedPeople.SpousefamilyCombinedDTO });
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
                if (!updatedPeople.SpousefamilyCombinedDTO[personIndex].SpousefamilyMotherDTO[index]) {
                    updatedPeople.SpousefamilyCombinedDTO[personIndex].SpousefamilyMotherDTO[index] = {
                        pepId: 0,
                        hufId: 0,
                        motherName: '',
                        motherPan: '',
                    };
                }
                updatedPeople.SpousefamilyCombinedDTO[personIndex].SpousefamilyMotherDTO[index][field] = value;
                if (field === 'motherPan') {
                    validatePan(value, index);
                }
            }
        }
        setSpouseFamilyFormData({ SpousefamilyCombinedDTO: updatedPeople.SpousefamilyCombinedDTO });
    };
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    const validatePan = (pan: string, index: number | null) => {
        const errors = [...panErrors];
        const isValid = panRegex.test(pan);

        if (index !== null) {
            if (!isValid) {
                errors[index] = 'Invalid PAN format';
            } else {
                errors[index] = '';
            }
        }
        setPanErrors(errors);
    };
    const isValidPAN = (pan: string) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        return panRegex.test(pan);
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
            updatedPeople.SpousefamilyCombinedDTO[personIndex].spouseDTOS[field] = field === 'spouseName' ? event.target.value : event.target.value.toUpperCase();
            if (field === 'spousePan' && !panRegex.test(updatedPeople.SpousefamilyCombinedDTO[personIndex].spouseDTOS[field])) {
                console.error('Invalid PAN format');
                setRelativePanTouched(true);
            }
        }

        setSpouseFamilyFormData({ SpousefamilyCombinedDTO: updatedPeople.SpousefamilyCombinedDTO });
        setTouched(true);
    };
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
                    console.error('Invalid PAN format');
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
                    console.error('Invalid PAN format');
                    setChildrenPanTouched(true);
                }
            }
        } else {
            if (field === 'relativeName' || field === 'pan') {
                updatedPeople.relativeCombineDTO[personIndex].relativeDTO[field] = field === 'relativeName' ? event.target.value : event.target.value.toUpperCase();
                if (field === 'pan' && !panRegex.test(updatedPeople.relativeCombineDTO[personIndex].relativeDTO[field])) {
                    console.error('Invalid PAN format');
                    setRelativePanTouched(true);
                }
            }
        }
        setRelativeFormData({ relativeCombineDTO: updatedPeople.relativeCombineDTO });
        setTouched(true);
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
    const relatives = new RelativeApiService();
    const [relative, setRelative] = useState<Relative[]>([]);
    const fetchRelative = async () => {
        try {
            const relativeData = await relatives.getRelative();
            setRelative(relativeData);
            console.log("relativelist :", relativeData);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };
    useEffect(() => {
        fetchRelative();
        window.scrollTo(0, 0);
    }, []);
    const handleSubmit = () => {
        // console.log('FamilyformData:', FamilyformData);



        // Add your logic to handle the submitted data
    };
    return (
        <Box m={6}>


            <div className="card-body">
                <Box m={1}>
                    <div className="card-body">
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
                                                                                    value={huf.HUF}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangeHuf(personIndex, 'HUF', hufIndex, event)
                                                                                    }
                                                                                />
                                                                                <TextField
                                                                                    style={{ width: '50%' }}
                                                                                    label="Pan"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    name="pan1"
                                                                                    autoComplete="off"
                                                                                    value={huf.HUFPan}
                                                                                    // onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    //     handleInputChangeHuf(personIndex, 'HUFPan', hufIndex, {
                                                                                    //         ...event,
                                                                                    //         target: { ...event.target, value: event.target.value.toUpperCase() },
                                                                                    //     })
                                                                                    // }
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangeHuf(personIndex, 'HUFPan', hufIndex, event)
                                                                                    }
                                                                                    inputProps={{ maxLength: 10 }}
                                                                                />
                                                                                {/* {HUFPanErrors && !isValidPAN(huf.HUFPan) && (
                                                                                    <div style={{ color: 'red' }}>Invalid PAN format</div>
                                                                                )} */}
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
                                                                                    label="Father"
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
                                                                                    label=" Father Pan"
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
                                                                                    label=" Mother Pan"
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
                            <div className="card-body">
                                <Box m={1}>
                                    <div className="key">
                                        <h4>SPOUSE FAMILY DETAILS</h4>
                                        <div className="details-containers">
                                            <div className="scrollablebox">
                                                {SpouseFamilyformData.SpousefamilyCombinedDTO.map((person, personIndex) => (
                                                    <div key={personIndex} className="person-container">
                                                        {SpouseFamilyformData.SpousefamilyCombinedDTO.length > 1 && (
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
                                                                value={person.spouseDTOS.spouseName}
                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                    handleInputChangespouseFamily(personIndex, 'spouseName', null, event)
                                                                }
                                                            />
                                                            <TextField
                                                                style={{ width: '25%' }}
                                                                label="Spouse Pan"
                                                                variant="standard"
                                                                type="text"
                                                                name="pan"
                                                                autoComplete="off"
                                                                value={person.spouseDTOS.spousePan}
                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                    handleInputChangespouseFamily(personIndex, 'spousePan', null, event)
                                                                }
                                                                onBlur={() => setTouched(true)}
                                                                inputProps={{ maxLength: 10 }}
                                                            />

                                                            {relativePanTouched && !isValidPAN(person.spouseDTOS.spousePan) && (
                                                                <div style={{ color: 'red' }}>Invalid PAN format</div>
                                                            )}

                                                        </div>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={4}>
                                                                <div className="field-group">
                                                                    <div className="field-group-container">
                                                                        <div className="field-group-row">
                                                                            <div className="scrollable-box">
                                                                                {person.spousefamilyDetDTO.map((huf, hufIndex) => (

                                                                                    <div key={hufIndex} className="field-group-column">
                                                                                        <TextField
                                                                                            style={{ width: '50%' }}
                                                                                            label="HUF Name"
                                                                                            variant="standard"
                                                                                            type="text"
                                                                                            autoComplete="off"
                                                                                            value={huf.HUF}
                                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                                handleInputChangeSpouseHuf(personIndex, 'HUF', hufIndex, event)
                                                                                            }
                                                                                        />
                                                                                        <TextField
                                                                                            style={{ width: '50%' }}
                                                                                            label="Pan"
                                                                                            variant="standard"
                                                                                            type="text"
                                                                                            name="pan1"
                                                                                            autoComplete="off"
                                                                                            value={huf.HUFPan}
                                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                                handleInputChangeSpouseHuf(personIndex, 'HUFPan', hufIndex, {
                                                                                                    ...event,
                                                                                                    target: { ...event.target, value: event.target.value.toUpperCase() },
                                                                                                })
                                                                                            }
                                                                                            inputProps={{ maxLength: 10 }}
                                                                                        />
                                                                                        {spousePanTouched && !isValidPAN(huf.HUFPan) && (
                                                                                            <div style={{ color: 'red' }}>Invalid PAN format</div>
                                                                                        )}
                                                                                        <FontAwesomeIcon
                                                                                            icon={faTrash}
                                                                                            className="delete-icon"
                                                                                            onClick={() => handleDeleteFieldspouseHuf(personIndex, 'HUFPan', hufIndex)}
                                                                                        />
                                                                                    </div>
                                                                                ))}
                                                                                <div className="field label">
                                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
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
                                                                                {person.spousefamilyFatherDTO.map((child, childIndex) => (
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
                                                                                            inputProps={{ maxLength: 10 }}
                                                                                        />
                                                                                        {panErrors[childIndex] && (
                                                                                            <div style={{ color: 'red' }}>{panErrors[childIndex]}</div>
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
                                                                                {person.SpousefamilyMotherDTO.map((child, childIndex) => (
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
                                                                                            label=" Mother Pan"
                                                                                            variant="standard"
                                                                                            type="text"
                                                                                            name="motherPan"
                                                                                            value={child.motherPan}
                                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                                handleInputChangspousemotherpan(personIndex, 'motherPan', childIndex, event)
                                                                                            }
                                                                                            inputProps={{ maxLength: 10 }}
                                                                                        />
                                                                                        {panErrors[childIndex] && (
                                                                                            <div style={{ color: 'red' }}>{panErrors[childIndex]}</div>
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
                                                                SpousefamilyCombinedDTO: [
                                                                    ...SpouseFamilyformData.SpousefamilyCombinedDTO,
                                                                    {
                                                                        spouseDTOS: {
                                                                            pepId: 0,

                                                                            spouseName: '',
                                                                            spousePan: '',
                                                                        },
                                                                        spousefamilyDetDTO: [{
                                                                            pepId: 0,
                                                                            HUF: '',
                                                                            HUFPan: '',
                                                                        }],

                                                                        spousefamilyFatherDTO: [
                                                                            {
                                                                                pepId: 0,
                                                                                hufId: 0,
                                                                                fatherName: '',
                                                                                fatherPan: '',
                                                                            }
                                                                        ],
                                                                        SpousefamilyMotherDTO: [
                                                                            {
                                                                                pepId: 0,
                                                                                hufId: 0,
                                                                                motherName: '',
                                                                                motherPan: '',
                                                                            }
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
                                <h3>Family details:</h3>
                                <div className="details-containers">
                                    <div className="scrollablebox">
                                        {RelativeformData.relativeCombineDTO.map((person, personIndex) => (
                                            <div key={personIndex} className="person-container">
                                                {RelativeformData.relativeCombineDTO.length > 1 && (
                                                    <div className="close-button" onClick={() => handleRemoveBoxFamilydetails(personIndex)}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </div>
                                                )}
                                                <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                                <FormControl style={{ width: '50%' }}>
                                                        <InputLabel htmlFor="type">Relative list</InputLabel>
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
                                                        label="Relative name"
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
                                                        label="Pan"
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
                                                        <div style={{ color: 'red' }}>Invalid PAN format</div>
                                                    )}

                                                </div>
                                                

                                                <Grid container spacing={2}>
                                                    <Grid item xs={4}>
                                                        <div className="field-group">
                                                            <div className="field-group-container">
                                                                <div className="field-group-row">
                                                                    <div className="scrollable-box">
                                                                        {person.relativeDetDTOS.map((email, emailIndex) => (
                                                                            <div key={emailIndex} className="field-group-column">
                                                                                <TextField
                                                                                    style={{ width: '50%' }}
                                                                                    label="Spouse Name"
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
                                                                                    label="Pan"
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
                                                                                    <div style={{ color: 'red' }}>Invalid PAN format</div>
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
                                                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Spouse Names
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                    <FormControl style={{ width: '100%' }}>
                                                        <InputLabel htmlFor="gender">
                                                            Family Type
                                                        </InputLabel>
                                                        <Select
                                                            label="Regulator"
                                                            variant="standard"
                                                            onChange={(
                                                                event: SelectChangeEvent<string>
                                                            ) => {
                                                                setSelectedfamilyType(
                                                                    event.target.value as string
                                                                );
                                                            }}
                                                        >
                                                            {familyType.map((item) => (
                                                                <MenuItem
                                                                    key={item.id}
                                                                    value={item.id.toString()}
                                                                >
                                                                    {item.family}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                    <Grid item xs={4}>
                                                        <div className="field-group">
                                                            <div className="field-group-row">
                                                                <div className="field-group-container">
                                                                    <div className="scrollable-box">
                                                                        {person.relativeChildrenDTOS.map((child, childIndex) => (
                                                                            <div key={childIndex} className="field-group-column">
                                                                                <TextField
                                                                                    style={{ width: '50%' }}
                                                                                    label="Children name"
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
                                                                                    label="Children pan"
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
                            </div>
                        </Box>


                    </div>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>

        </Box>
    )
}

export default Family

