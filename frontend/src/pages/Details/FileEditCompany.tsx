import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import AddressApiService from '../../data/services/insert/address-api-service';
import FileUpload from '../../data/services/Fileupload/fileupload_api_service';

interface FileEditCompanyProps {
    companyId?: number;
    open: boolean;
    onClose: () => void;
    person?: { companyDocumentsDTOS: { imageName3: string }[] };
}

interface MultipartFile {
    name: string;
    size: number;
    type: string;
    file: File;
    pathId?: number;
}

interface FileType {
    id: string;
    name: string;
}

const FileEditCompany: React.FC<FileEditCompanyProps> = ({
    companyId,
    open,
    onClose,
    person,
}) => {
    const [companyDocument, setCompanyDocument] = useState<MultipartFile | null>(null);
    const addressApiService = new AddressApiService();
    const [filetype, setFiletype] = useState<FileType[]>([]);
    const fileUpload = new FileUpload();

    const fetchfiletype = async () => {
        try {
            const response: FileType[] = await fileUpload.getfiletype3();
            setFiletype(response);
        } catch (error) {
            console.error('Error fetching filetype:', error);
        }
    };

    useEffect(() => {
        fetchfiletype();
        if (person?.companyDocumentsDTOS?.length) {
            const doc = person.companyDocumentsDTOS[0];
            setCompanyDocument({
                name: doc.imageName3 || '',
                size: 0,
                type: '',
                file: {} as File,
                pathId: undefined,
            });
        }
    }, [person]);

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setCompanyDocument({
                name: file.name,
                size: file.size,
                type: file.type,
                file,
                pathId: companyDocument?.pathId,
            });
        }
    };

    const handleChooseImagesClick = () => {
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        fileInput?.click();
    };

    const handleSelectChange = (selectedValue: number) => {
        if (companyDocument) {
            setCompanyDocument({
                ...companyDocument,
                pathId: selectedValue,
            });
        }
    };

    const handleSave = async () => {
        if (!companyId || !companyDocument) {
            console.log('Company ID or document is missing');
            return;
        }

        const { file, pathId } = companyDocument;

        try {
            const response = await addressApiService.uploadCompanyFiles([file], [pathId || 0], [0], [companyId]);
            console.log('Response:', response);
            console.log('File uploaded successfully');
            onClose();
        } catch (error) {
            console.error('Upload error:', error);
            console.log('Failed to upload file');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Upload Company Document</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper style={{ padding: 16 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={6}>
                                <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={handleChooseImagesClick}
                                        style={{ marginTop: '8px' }}
                                    >
                                        Choose File
                                    </Button>
                                    <input
                                        id="file-input"
                                        type="file"
                                        onChange={handleFileInputChange}
                                        style={{ display: 'none' }}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">File Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="File Type"
                                            size="small"
                                            variant="standard"
                                            value={companyDocument?.pathId ? String(companyDocument.pathId) : ''}
                                            onChange={(event) => handleSelectChange(parseInt(event.target.value, 10))}
                                        >
                                            {filetype
                                                .filter((_, dataIndex1) => dataIndex1 === 4 || dataIndex1 === 5)
                                                .map((data) => (
                                                    <MenuItem key={data.id} value={data.id.toString()}>
                                                        {data.name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                    
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="File Name"
                                        value={companyDocument?.name || 'No file chosen'}
                                        disabled
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleSave} disabled={!companyDocument}>
                    Save
                </Button>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileEditCompany;

