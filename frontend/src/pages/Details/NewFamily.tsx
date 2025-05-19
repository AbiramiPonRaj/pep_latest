import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Container, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AddressDTO, AkaDetRequest, AssociatedlistPayload, PartyPayload, CompaniesDirectorsDTO, CompanyDTO, ContactDTO, Country, CustomerRequest, Emailids, Father, Mother, NumberofHUTs, OtherAssociationRequest, PartyRequest, PartyAddress, Payload, PhoneNumbers, CompanyMasterPayload, Relative, RelativePayload, Spouse, State, DesignationPayload, CompanyDocumentsDTO, Gender } from '../../data/services/viewpage/viewpagedetails-payload';
import RelativeApiService from '../../data/services/master/relative/relative-api-serivces';
import { SelectChangeEvent } from '@mui/material/Select';

export interface FamilyDetDTO {
    pepId: number;
    HUF: string;
    HUFPan: string;
}

export interface FamilySpouseDTOS {
    pepId: number;
    hufId: number;
    spouseName: string;
    spousePan: string;
}

export interface FamilyFatherDTO {
    pepId: number;
    hufId: number;
    fatherName: string;
    fatherPan: string;
}

export interface FamilyMotherDTO {
    pepId: number;
    hufId: number;
    motherName: string;
    motherPan: string;
}

export interface FamilyCombineDTO {
    familyDetDTO: FamilyDetDTO[];
    familySpouseDTOS: FamilySpouseDTOS[];
    familyFatherDTO: FamilyFatherDTO[];
    familyMotherDTO: FamilyMotherDTO[];
}

export interface FamilyPayload {
    familyCombineDTO: FamilyCombineDTO[];
}

export interface SpouseFamilyDetDTO {
    pepId: number;
    HUF: string;
    HUFPan: string;
}



export interface SpouseFamilyFatherDTO {
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

export interface SpouseFamilyCombineDTO {
    spousefamilyDetDTO: SpouseFamilyDetDTO[];
    spousefamilyFatherDTO: SpouseFamilyFatherDTO[];
    SpousefamilyMotherDTO: SpouseFamilyMotherDTO[];
}

export interface SpouseFamilyPayload {
    SpousefamilyCombineDTO: SpouseFamilyCombineDTO[];
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
    const [isValidInput, setIsValidInput] = useState(true);
    const [relative, setRelative] = useState<Relative[]>([]);
    const [fathers, setFathers] = useState<Father[]>([{ pepId: 0, relativeName: '', pan: '', relativeMasterId: '4' }]);
    const [mothers, setMothers] = useState<Mother[]>([{ pepId: 0, relativeName: '', pan: '', relativeMasterId: '5' }]);
    const [NumberofHUTss, setNumberofHUTss] = useState<NumberofHUTs[]>([{ pepId: 0, relativeName: '', pan: '', relativeMasterId: '4' }]);
    const [Spouses, setSpouses] = useState<Spouse[]>([{ pepId: 0, relativeName: '', pan: '', relativeMasterId: '5' }]);
    const [selectedfamilyType, setSelectedfamilyType] = useState<string>('');
    const [familyType, setfamilyType] = useState<FamilyType[]>([
        { id: '1', family: 'Son', },
        { id: '2', family: 'Daugher' },
        // Add other items as needed
    ]);

    const [FamilyformData, setFamilyFormData] = useState<FamilyPayload>({
        familyCombineDTO: [
            {
                familyDetDTO: [
                    {
                        pepId: 0,
                        HUF: '',
                        HUFPan: '',
                    },
                ],
                familySpouseDTOS: [
                    {
                        pepId: 0,
                        hufId: 0,
                        spouseName: '',
                        spousePan: '',
                    },
                ],
                familyFatherDTO: [
                    {
                        pepId: 0,
                        hufId: 0,
                        fatherName: '',
                        fatherPan: '',
                    },
                ],
                familyMotherDTO: [
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
        SpousefamilyCombineDTO: [
            {
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

    const handleRemoveBoxFamily = (personIndex: number) => {
        setFamilyFormData((prevData) => {
            const updatedPeople = [...prevData.familyCombineDTO];
            updatedPeople.splice(personIndex, 1);
            return { familyCombineDTO: updatedPeople };
        });
    };


    const handleAddFieldFamilyDetails = (personIndex: number, fieldType: 'huf' | 'Spouse' | 'father' | 'mother') => {
        const updatedPeople = { ...FamilyformData };
        // if (fieldType === 'huf') {
        //     updatedPeople.familyCombineDTO[personIndex].familyDetDTO = ({
        //         pepId: 0,
        //         HUF: '',
        //         HUFPan: '',
        //     });
        // }
        if (fieldType === 'huf') {
            updatedPeople.familyCombineDTO[personIndex].familyDetDTO.push({
                pepId: 0,
                HUF: '',
                HUFPan: '',
            });
        }
        else if (fieldType === 'Spouse') {
            updatedPeople.familyCombineDTO[personIndex].familySpouseDTOS.push({
                pepId: 0,
                hufId: 0,
                spouseName: '',
                spousePan: '',
            });
        }
        else if (fieldType === 'father') {
            updatedPeople.familyCombineDTO[personIndex].familyFatherDTO.push({
                pepId: 0,
                hufId: 0,
                fatherName: '',
                fatherPan: '',
            });

        }
        else if (fieldType === 'mother') {
            updatedPeople.familyCombineDTO[personIndex].familyMotherDTO.push({
                pepId: 0,
                hufId: 0,
                motherName: '',
                motherPan: '',
            });

        }

        setFamilyFormData({ familyCombineDTO: updatedPeople.familyCombineDTO });
    };



    // const handlerelativeChange = (personIndex: number, value: any) => {
    //     const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
    //     updatedPeople.familyCombineDTO[personIndex].familyDetDTO.relativeMasterId = value;
    //     setFamilyFormData({ familyCombineDTO: updatedPeople.familyCombineDTO });
    // };

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
                if (!updatedPeople.familyCombineDTO[personIndex].familyDetDTO[index]) {
                    updatedPeople.familyCombineDTO[personIndex].familyDetDTO[index] = {
                        pepId: 0,
                        HUF: '',
                        HUFPan: '',
                    };
                }
                updatedPeople.familyCombineDTO[personIndex].familyDetDTO[index][field] = value;
                if (field === 'HUFPan') {
                    validatePan(value, index);
                }
            }
        }
        setFamilyFormData({ familyCombineDTO: updatedPeople.familyCombineDTO });
    };

    const handleDeleteFieldHuf = (
        personIndex: number,
        field1: 'HUFPan' | 'HUF',
        index: number
    ) => {
        const updatedPeople = [...FamilyformData.familyCombineDTO];
        if (field1 === 'HUF' || field1 === 'HUFPan') {
            updatedPeople[personIndex].familyDetDTO.splice(index, 1); // Replace 'familyDetDTO' with the correct array property
        }
        setFamilyFormData({ familyCombineDTO: updatedPeople });
    };

    const handleDeleteFieldspouse = (
        personIndex: number,
        field1: 'spousePan' | 'spouseName',
        index: number
    ) => {
        const updatedPeople = [...FamilyformData.familyCombineDTO];
        if (field1 === 'spouseName' || field1 === 'spousePan') {
            updatedPeople[personIndex].familySpouseDTOS.splice(index, 1);
        }
        setFamilyFormData({ familyCombineDTO: updatedPeople });
    };
    const handleDeleteFieldfather = (
        personIndex: number,
        field1: 'fatherPan' | 'fatherName',
        index: number
    ) => {
        const updatedPeople = [...FamilyformData.familyCombineDTO];
        if (field1 === 'fatherName' || field1 === 'fatherPan') {
            updatedPeople[personIndex].familyFatherDTO.splice(index, 1);
        }
        setFamilyFormData({ familyCombineDTO: updatedPeople });
    };
    const handleDeleteFieldmother = (
        personIndex: number,
        field1: 'motherPan' | 'motherName',
        index: number
    ) => {
        const updatedPeople = [...FamilyformData.familyCombineDTO];
        if (field1 === 'motherName' || field1 === 'motherPan') {
            updatedPeople[personIndex].familyMotherDTO.splice(index, 1);
        }
        setFamilyFormData({ familyCombineDTO: updatedPeople });
    };
    const handleInputChangspouse = (
        personIndex: number,
        field: 'spousePan' | 'spouseName',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
        const value = field === 'spouseName' ? event.target.value : event.target.value.toUpperCase();

        if (index !== null) {
            if (field === 'spouseName' || field === 'spousePan') {
                if (!updatedPeople.familyCombineDTO[personIndex].familySpouseDTOS[index]) {
                    updatedPeople.familyCombineDTO[personIndex].familySpouseDTOS[index] = {
                        pepId: 0,
                        hufId: 0,
                        spouseName: '',
                        spousePan: '',
                    };
                }
                updatedPeople.familyCombineDTO[personIndex].familySpouseDTOS[index][field] = value;
                if (field === 'spousePan') {
                    validatePan(value, index);
                }
            }
        }
        setFamilyFormData({ familyCombineDTO: updatedPeople.familyCombineDTO });
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
                if (!updatedPeople.familyCombineDTO[personIndex].familyFatherDTO[index]) {
                    updatedPeople.familyCombineDTO[personIndex].familyFatherDTO[index] = {
                        pepId: 0,
                        hufId: 0,
                        fatherName: '',
                        fatherPan: '',
                    };
                }
                updatedPeople.familyCombineDTO[personIndex].familyFatherDTO[index][field] = value;
                if (field === 'fatherPan') {
                    validatePan(value, index);
                }
            }
        }
        setFamilyFormData({ familyCombineDTO: updatedPeople.familyCombineDTO });
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
                if (!updatedPeople.familyCombineDTO[personIndex].familyMotherDTO[index]) {
                    updatedPeople.familyCombineDTO[personIndex].familyMotherDTO[index] = {
                        pepId: 0,
                        hufId: 0,
                        motherName: '',
                        motherPan: '',
                    };
                }
                updatedPeople.familyCombineDTO[personIndex].familyMotherDTO[index][field] = value;
                if (field === 'motherPan') {
                    validatePan(value, index);
                }
            }
        }
        setFamilyFormData({ familyCombineDTO: updatedPeople.familyCombineDTO });
    };
    const handleRemoveBoxSpouseFamily = (personIndex: number) => {
        setSpouseFamilyFormData((prevData) => {
            const updatedPeople = [...prevData.SpousefamilyCombineDTO];
            updatedPeople.splice(personIndex, 1);
            return { SpousefamilyCombineDTO: updatedPeople };
        });
    };


    const handleAddFieldSpouseFamily = (personIndex: number, fieldType: 'huf' | 'Spouse' | 'father' | 'mother') => {
        const updatedPeople = { ...SpouseFamilyformData };
        // if (fieldType === 'huf') {
        //     updatedPeople.SpousefamilyCombineDTO[personIndex].spousefamilyDetDTO = ({
        //         pepId: 0,
        //         HUF: '',
        //         HUFPan: '',
        //     });
        // }
        if (fieldType === 'huf') {
            updatedPeople.SpousefamilyCombineDTO[personIndex].spousefamilyDetDTO.push({
                pepId: 0,
                HUF: '',
                HUFPan: '',
            });
        }

        else if (fieldType === 'father') {
            updatedPeople.SpousefamilyCombineDTO[personIndex].spousefamilyFatherDTO.push({
                pepId: 0,
                hufId: 0,
                fatherName: '',
                fatherPan: '',
            });

        }
        else if (fieldType === 'mother') {
            updatedPeople.SpousefamilyCombineDTO[personIndex].SpousefamilyMotherDTO.push({
                pepId: 0,
                hufId: 0,
                motherName: '',
                motherPan: '',
            });

        }

        setSpouseFamilyFormData({ SpousefamilyCombineDTO: updatedPeople.SpousefamilyCombineDTO });
    };



    const handlerelativeChange = (personIndex: number, value: any) => {
        const updatedPeople = JSON.parse(JSON.stringify(SpouseFamilyformData));
        updatedPeople.SpousefamilyCombineDTO[personIndex].spousefamilyDetDTO.relativeMasterId = value;
        setSpouseFamilyFormData({ SpousefamilyCombineDTO: updatedPeople.SpousefamilyCombineDTO });
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
                if (!updatedPeople.SpousefamilyCombineDTO[personIndex].spousefamilyDetDTO[index]) {
                    updatedPeople.SpousefamilyCombineDTO[personIndex].spousefamilyDetDTO[index] = {
                        pepId: 0,
                        HUF: '',
                        HUFPan: '',
                    };
                }
                updatedPeople.SpousefamilyCombineDTO[personIndex].spousefamilyDetDTO[index][field] = value;
                if (field === 'HUFPan') {
                    validatePan(value, index);
                }
            }
        }
        setSpouseFamilyFormData({ SpousefamilyCombineDTO: updatedPeople.SpousefamilyCombineDTO });
    };

    const handleDeleteFieldspouseHuf = (
        personIndex: number,
        field1: 'HUFPan' | 'HUF',
        index: number
    ) => {
        const updatedPeople = [...SpouseFamilyformData.SpousefamilyCombineDTO];
        if (field1 === 'HUF' || field1 === 'HUFPan') {
            updatedPeople[personIndex].spousefamilyDetDTO.splice(index, 1); // Replace 'spousefamilyDetDTO' with the correct array property
        }
        setSpouseFamilyFormData({ SpousefamilyCombineDTO: updatedPeople });
    };


    const handleDeleteFieldspousefather = (
        personIndex: number,
        field1: 'fatherPan' | 'fatherName',
        index: number
    ) => {
        const updatedPeople = [...SpouseFamilyformData.SpousefamilyCombineDTO];
        if (field1 === 'fatherName' || field1 === 'fatherPan') {
            updatedPeople[personIndex].spousefamilyFatherDTO.splice(index, 1);
        }
        setSpouseFamilyFormData({ SpousefamilyCombineDTO: updatedPeople });
    };
    const handleDeleteFieldspousemother = (
        personIndex: number,
        field1: 'motherPan' | 'motherName',
        index: number
    ) => {
        const updatedPeople = [...SpouseFamilyformData.SpousefamilyCombineDTO];
        if (field1 === 'motherName' || field1 === 'motherPan') {
            updatedPeople[personIndex].SpousefamilyMotherDTO.splice(index, 1);
        }
        setSpouseFamilyFormData({ SpousefamilyCombineDTO: updatedPeople });
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
                if (!updatedPeople.SpousefamilyCombineDTO[personIndex].spousefamilyFatherDTO[index]) {
                    updatedPeople.SpousefamilyCombineDTO[personIndex].spousefamilyFatherDTO[index] = {
                        pepId: 0,
                        hufId: 0,
                        fatherName: '',
                        fatherPan: '',
                    };
                }
                updatedPeople.SpousefamilyCombineDTO[personIndex].spousefamilyFatherDTO[index][field] = value;
                if (field === 'fatherPan') {
                    validatePan(value, index);
                }
            }
        }
        setSpouseFamilyFormData({ SpousefamilyCombineDTO: updatedPeople.SpousefamilyCombineDTO });
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
                if (!updatedPeople.SpousefamilyCombineDTO[personIndex].SpousefamilyMotherDTO[index]) {
                    updatedPeople.SpousefamilyCombineDTO[personIndex].SpousefamilyMotherDTO[index] = {
                        pepId: 0,
                        hufId: 0,
                        motherName: '',
                        motherPan: '',
                    };
                }
                updatedPeople.SpousefamilyCombineDTO[personIndex].SpousefamilyMotherDTO[index][field] = value;
                if (field === 'motherPan') {
                    validatePan(value, index);
                }
            }
        }
        setSpouseFamilyFormData({ SpousefamilyCombineDTO: updatedPeople.SpousefamilyCombineDTO });
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
    const handleSubmit = () => {
        console.log('FamilyformData:', FamilyformData);



        // Add your logic to handle the submitted data
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
    const renderSonFields = () => {
        return (
            <>
             
                {/* Add other fields related to Ship */}
            </>
        );
    };
    const renderDaugherFields = () => {
        return (
            <>
             
                {/* Add other fields related to Ship */}
            </>
        );
    };

    const renderFieldsBasedOnRecordType = () => {
        switch (selectedfamilyType) {
            case '1':
                return renderSonFields();
            case '2':
                return renderDaugherFields();
            
            // Add cases for other record types as needed
            default:
                return null;
        }
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
                                        {FamilyformData.familyCombineDTO.map((person, personIndex) => (
                                            <div key={personIndex} className="person-container">
                                                {FamilyformData.familyCombineDTO.length > 1 && (
                                                    <div className="close-button" onClick={() => handleRemoveBoxFamily(personIndex)}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </div>
                                                )}

                                                <Grid container spacing={2}>
                                                    <Grid item xs={3}>
                                                        <div className="field-group">
                                                            <div className="field-group-container">
                                                                <div className="field-group-row">
                                                                    <div className="scrollable-box">
                                                                        {person.familyDetDTO.map((huf, hufIndex) => (

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
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangeHuf(personIndex, 'HUFPan', hufIndex, {
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
                                                                                    onClick={() => handleDeleteFieldHuf(personIndex, 'HUFPan', hufIndex)}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                        <div className="field label">
                                                                            <div className="add-button" onClick={() => handleAddFieldFamilyDetails(personIndex, 'huf')}>
                                                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More HUF Name
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <div className="field-group">
                                                            <div className="field-group-row">
                                                                <div className="field-group-container">
                                                                    <div className="scrollable-box">
                                                                        {person.familySpouseDTOS.map((child, childIndex) => (
                                                                            <div key={childIndex} className="field-group-column">
                                                                                <TextField
                                                                                    style={{ width: '50%' }}
                                                                                    label="Spouse
                                                                                    (Husband / Wife)"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    autoComplete="off"
                                                                                    value={child.spouseName}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangspouse(personIndex, 'spouseName', childIndex, event)
                                                                                    }
                                                                                />
                                                                                <TextField
                                                                                    style={{ width: '50%' }}
                                                                                    label=" pan"
                                                                                    variant="standard"
                                                                                    type="text"
                                                                                    name="childrenPan"
                                                                                    value={child.spousePan}
                                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                        handleInputChangspouse(personIndex, 'spousePan', childIndex, event)
                                                                                    }
                                                                                    inputProps={{ maxLength: 10 }}
                                                                                />
                                                                                {panErrors[childIndex] && (
                                                                                    <div style={{ color: 'red' }}>{panErrors[childIndex]}</div>
                                                                                )}
                                                                                <FontAwesomeIcon
                                                                                    icon={faTrash}
                                                                                    className="delete-icon"
                                                                                    onClick={() => handleDeleteFieldspouse(personIndex, 'spousePan', childIndex)}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                        <div className="field label">
                                                                            <div className="add-button" onClick={() => handleAddFieldFamilyDetails(personIndex, 'Spouse')}>
                                                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Spouse
                                                                                (Husband / Wife)
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <div className="field-group">
                                                            <div className="field-group-row">
                                                                <div className="field-group-container">
                                                                    <div className="scrollable-box">
                                                                        {person.familyFatherDTO.map((child, childIndex) => (
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
                                                                                {panErrors[childIndex] && (
                                                                                    <div style={{ color: 'red' }}>{panErrors[childIndex]}</div>
                                                                                )}
                                                                                <FontAwesomeIcon
                                                                                    icon={faTrash}
                                                                                    className="delete-icon"
                                                                                    onClick={() => handleDeleteFieldfather(personIndex, 'fatherPan', childIndex)}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                        <div className="field label">
                                                                            <div className="add-button" onClick={() => handleAddFieldFamilyDetails(personIndex, 'father')}>
                                                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Father
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <div className="field-group">
                                                            <div className="field-group-row">
                                                                <div className="field-group-container">
                                                                    <div className="scrollable-box">
                                                                        {person.familyMotherDTO.map((child, childIndex) => (
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
                                                                                {panErrors[childIndex] && (
                                                                                    <div style={{ color: 'red' }}>{panErrors[childIndex]}</div>
                                                                                )}
                                                                                <FontAwesomeIcon
                                                                                    icon={faTrash}
                                                                                    className="delete-icon"
                                                                                    onClick={() => handleDeleteFieldmother(personIndex, 'motherPan', childIndex)}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                        <div className="field label">
                                                                            <div className="add-button" onClick={() => handleAddFieldFamilyDetails(personIndex, 'mother')}>
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
                                                    setFamilyFormData({
                                                        familyCombineDTO: [
                                                            ...FamilyformData.familyCombineDTO,
                                                            {
                                                                familyDetDTO: [{
                                                                    pepId: 0,
                                                                    HUF: '',
                                                                    HUFPan: '',
                                                                }],
                                                                familySpouseDTOS: [{
                                                                    pepId: 0,
                                                                    hufId: 0,
                                                                    spouseName: '',
                                                                    spousePan: '',
                                                                }],
                                                                familyFatherDTO: [
                                                                    {
                                                                        pepId: 0,
                                                                        hufId: 0,
                                                                        fatherName: '',
                                                                        fatherPan: '',
                                                                    }
                                                                ],
                                                                familyMotherDTO: [
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
                                                Add Family details
                                            </Button>
                                        </div>
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
                                                {SpouseFamilyformData.SpousefamilyCombineDTO.map((person, personIndex) => (
                                                    <div key={personIndex} className="person-container">
                                                        {SpouseFamilyformData.SpousefamilyCombineDTO.length > 1 && (
                                                            <div className="close-button" onClick={() => handleRemoveBoxSpouseFamily(personIndex)}>
                                                                <FontAwesomeIcon icon={faTimes} />
                                                            </div>
                                                        )}

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
                                                                SpousefamilyCombineDTO: [
                                                                    ...SpouseFamilyformData.SpousefamilyCombineDTO,
                                                                    {
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
                            </div>
                        </Box>
                    </div>
                    <div className="card-body">
                        <Box m={1}>
                            <div className="key">
                                <h3>Family details:</h3>
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
                                                {/* <Grid item xs={4}>
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
                                                 */}

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
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div >

        </Box >
    )
}

export default Family

