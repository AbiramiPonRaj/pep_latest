import React, { useState, useEffect } from 'react';
import { Grid, TextField, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Modal, Button } from 'react-bootstrap';
import AddressApiService from '../../data/services/insert/address-api-service';
import FileUpload from '../../data/services/Fileupload/fileupload_api_service';

interface PdfModalProps {
    pathId?: number;
    associatedId?: number;
    companyId?: number;
    show: boolean;
    onHide: () => void;
    pdfBase64: string | null;
    blockButtonText: string;
    editButtonText: string;
    blockButtonDisableds: boolean;
    editButtonDisabled: boolean;
    personIndex: number;
    person?: { companyDocumentsDTOS: { imageName3: string }[] };
    handleFileChange3: (personIndex: number, index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    handleChoosecompanyImagesClick3: (personIndex: number, index: number) => void;
    onBlockClick?: () => void;  // Add this line
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

const PdfModal: React.FC<PdfModalProps> = ({
    pathId,
    associatedId,
    companyId,
    show,
    onHide,
    pdfBase64,
    blockButtonText,
    editButtonText,
    blockButtonDisableds,
    editButtonDisabled,
    person,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [companyDocuments, setCompanyDocuments] = useState<MultipartFile[]>([]);
    const addressApiService = new AddressApiService();
    const [filetype, setFiletype] = useState<FileType[]>([]);
    const fileUpload = new FileUpload();
    const [hasDocument, setHasDocument] = useState(false);

    useEffect(() => {
        console.log('Company documents:', companyDocuments);
    }, [companyDocuments]);


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
        if (person?.companyDocumentsDTOS) {
            setCompanyDocuments(
                person.companyDocumentsDTOS.map((doc) => ({
                    name: doc.imageName3 || '',
                    size: 0,
                    type: '',
                    file: {} as File,
                    pathId: undefined,
                }))
            );
        }
    }, [person]);

    const handleFileInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            setCompanyDocuments(prevDocs => {
                const newDocs = [...prevDocs];
                newDocs[index] = {
                    name: selectedFile.name,
                    size: selectedFile.size,
                    type: selectedFile.type,
                    file: selectedFile,
                };
                return newDocs;
            });
        }
    };

    const handleChooseImagesClick = (index: number) => {
        const fileInput = document.getElementById(`file-input-${index}`) as HTMLInputElement;
        if (fileInput) fileInput.click();
    };

    const handleSelectChange3 = (index: number, value: number) => {
        setCompanyDocuments(prevDocs => {
            const newDocs = [...prevDocs];
            if (newDocs[index]) {
                newDocs[index].pathId = value; // Store the selected pathId
            }
            return newDocs;
        });
    };

    const handleAddFileUpload = () => {
        if (!hasDocument) {
            setCompanyDocuments(prevDocs => [...prevDocs, { name: '', size: 0, type: '', file: new File([], '') }]);
            setHasDocument(true);
        }
    };

    // const handleAddFileUpload = () => {
    //     setCompanyDocuments(prevDocs => [...prevDocs, { name: '', size: 0, type: '', file: new File([], '') }]);
    // };

    console.log("associatedIds", associatedId);

    const handleSave = async () => {
        if (!pathId || !associatedId || !companyId) {
            console.log('Path ID or Associated ID is missing');
            return;
        }

        const files = companyDocuments.map(doc => doc.file);
        const pathIds = [pathId];
        const associatedIds = [associatedId];
        const companyIds = [companyId];

        console.log('files documents:', files);
        console.log('pathIds:', pathIds);
        console.log('associatedIds:', associatedIds);
        console.log('companyIds:', companyIds);

        try {
            const response = await addressApiService.uploadFiles(files, pathIds, associatedIds, companyIds);
            console.log('Response:', response);
            console.log('Files uploaded successfully');
            onHide();
        } catch (error) {
            console.error('Upload error:', error);
            console.log('Failed to upload files');
        }
    };

    const handleBlockClick = async () => {
        try {
            if (associatedId) {
                const response = await addressApiService.blockCompanyDocument(associatedId);
                console.log('Block response:', response);
                console.log('Director blocked successfully.');
            } else {
                console.log('Associated ID is missing.');
            }
            onHide();
        } catch (error) {
            console.error('Error blocking director:', error);
            console.log('Failed to block director.');
        }
    };
    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Edit Document' : 'Document PDF'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isEditing ? (
                    <Grid container spacing={2}>
                        {companyDocuments.map((doc, index) => (
                            <Grid item xs={12} key={index}>
                                <Paper style={{ padding: 16 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={6}>
                                            <input
                                                id={`file-input-${index}`}
                                                type="file"
                                                onChange={(event) => handleFileInputChange(index, event)}
                                                style={{ display: 'none' }}
                                            />
                                            <FormControl fullWidth>
                                                <InputLabel id={`demo-simple-select-label-${index}`}>File Type</InputLabel>
                                                <Select
                                                    labelId={`demo-simple-select-label-${index}`}
                                                    id={`demo-simple-select-${index}`}
                                                    label="File Type"
                                                    size="small"
                                                    variant="standard"
                                                    value={doc.pathId ? String(doc.pathId) : ''}
                                                    onChange={(event) => handleSelectChange3(index, parseInt(event.target.value, 10))}
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
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => handleChooseImagesClick(index)}
                                                style={{ marginTop: '8px' }}
                                            >
                                                Choose File
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="File Name"
                                                value={doc.name || 'No file chosen'}
                                                disabled
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                onClick={handleAddFileUpload}
                                disabled={hasDocument}
                            >
                                Add New Document
                            </Button>
                        </Grid>
                    </Grid>
                ) : (
                    pdfBase64 ? (
                        <iframe
                            src={`data:application/pdf;base64,${pdfBase64}`}
                            style={{ width: '100%', height: '600px', border: 'none' }}
                            title="Document PDF"
                        />
                    ) : (
                        <p>No PDF available</p>
                    )
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        if (isEditing) {
                            setIsEditing(false);
                        } else {
                            handleBlockClick();
                        }
                    }}
                    disabled={blockButtonDisableds}
                >
                    {blockButtonText}
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        if (isEditing) {
                            handleSave();
                            setIsEditing(false);
                        } else {
                            setIsEditing(true);
                        }
                    }}
                    disabled={editButtonDisabled}
                >
                    {isEditing ? 'Save' : editButtonText}
                </Button>
                {isEditing && (
                    <Button
                        variant="warning"
                        onClick={() => setIsEditing(false)}
                    >
                        Back
                    </Button>
                )}
                <Button
                    variant="danger"
                    onClick={onHide}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PdfModal;


// import React, { useState, useEffect } from 'react';
// import { Grid, TextField, Paper } from '@mui/material';
// import { Modal, Button, Col, Row, FormControl } from 'react-bootstrap';
// import AddressApiService from '../../data/services/insert/address-api-service';

// interface PdfModalProps {
//     pathId?: number;
//     associatedId?: number;
//     companyId?: number;
//     show: boolean;
//     onHide: () => void;
//     pdfBase64: string | null;
//     onBlockClick: () => void;
//     blockButtonText: string;
//     editButtonText: string;
//     blockButtonDisableds: boolean;
//     editButtonDisabled: boolean;
//     personIndex: number;
//     person?: { companyDocumentsDTOS: { imageName3: string }[] };
//     handleFileChange3: (personIndex: number, index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
//     handleChoosecompanyImagesClick3: (personIndex: number, index: number) => void;
//     filetype: { id: number; name: string }[];

// }

// interface MultipartFile {
//     name: string;
//     size: number;
//     type: string;
//     file: File;
//     pathId?: number;
// }

// const PdfModal: React.FC<PdfModalProps> = ({
//     pathId,
//     associatedId,
//     companyId,
//     show,
//     onHide,
//     pdfBase64,
//     blockButtonText,
//     editButtonText,
//     blockButtonDisableds,
//     editButtonDisabled,
//     person,
//     personIndex
// }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [companyDocuments, setCompanyDocuments] = useState<MultipartFile[]>([]);
//     const addressApiService = new AddressApiService();

//     useEffect(() => {
//         console.log('Company documents:', companyDocuments);
//     }, [companyDocuments]);

//     const handleFileInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
//         const files = event.target.files;
//         if (files && files.length > 0) {
//             const selectedFile = files[0];
//             setCompanyDocuments(prevDocs => {
//                 const newDocs = [...prevDocs];
//                 newDocs[index] = {
//                     name: selectedFile.name,
//                     size: selectedFile.size,
//                     type: selectedFile.type,
//                     file: selectedFile,
//                 };
//                 return newDocs;
//             });
//         }
//     };

//     const handleChooseImagesClick = (index: number) => {
//         const fileInput = document.getElementById(`file-input-${index}`) as HTMLInputElement;
//         if (fileInput) fileInput.click();
//     };

// const handleSave = async () => {
//     if (!pathId || !associatedId || !companyId) {
//         console.log('Path ID or Associated ID is missing');
//         return;
//     }

//     const files = companyDocuments.map(doc => doc.file);
//     const pathIds = [pathId];
//     const associatedIds = [associatedId];
//     const companyIds = [companyId];

//     console.log('files documents:', files);
//     console.log('pathIds:', pathIds);
//     console.log('associatedIds:', associatedIds);

//     try {
//         const response = await addressApiService.uploadFiles(files, pathIds, associatedIds, companyIds);
//         console.log('Response:', response);
//         console.log('Files uploaded successfully');
//         onHide();
//     } catch (error) {
//         console.error('Upload error:', error);
//         console.log('Failed to upload files');
//     }
// };


// const handleBlockClick = async () => {
//     try {
//         if (associatedId) {
//             const response = await addressApiService.blockCompanyDocument(associatedId);
//             console.log('Block response:', response);
//             console.log('Director blocked successfully.');
//         } else {
//             console.log('Associated ID is missing.');
//         }
//         onHide();
//     } catch (error) {
//         console.error('Error blocking director:', error);
//         console.log('Failed to block director.');
//     }
// };

//     return (
//         <Modal show={show} onHide={onHide} size="xl" centered>
//             <Modal.Header closeButton>
//                 <Modal.Title>{isEditing ? 'Edit Document' : 'Document PDF'}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 {isEditing ? (
//                     <Grid container spacing={2}>
//                         {companyDocuments.map((doc, index) => (
//                             <Grid item xs={12} key={index}>
//                                 <Paper style={{ padding: 16 }}>
//                                     <Grid container spacing={2} alignItems="center">
//                                         <Grid item xs={6}>
//                                             <input
//                                                 id={`file-input-${index}`}
//                                                 type="file"
//                                                 onChange={(event) => handleFileInputChange(index, event)}
//                                                 style={{ display: 'none' }}
//                                             />
//                                             <FormControl fullWidth>
//                                                 <InputLabel id={`demo-simple-select-label-${index}`}>File Type</InputLabel>
//                                                 <Select
//                                                     labelId={`demo-simple-select-label-${index}`}
//                                                     id={`demo-simple-select-${index}`}
//                                                     label="File Type"
//                                                     size="small"
//                                                     variant="standard"
//                                                     value={doc.pathId ? String(doc.pathId) : ''}
//                                                     onChange={(event) => handleSelectChange3(index, parseInt(event.target.value, 10))}
//                                                 >
//                                                     {filetype
//                                                         .filter((_, dataIndex1) => dataIndex1 === 4 || dataIndex1 === 5)
//                                                         .map((data) => (
//                                                             <MenuItem key={data.id} value={data.id.toString()}>
//                                                                 {data.name}
//                                                             </MenuItem>
//                                                         ))}
//                                                 </Select>
//                                             </FormControl>
//                                             <Button
//                                                 size="small"
//                                                 variant="outlined"
//                                                 onClick={() => handleChooseImagesClick(index)}
//                                                 style={{ marginTop: '8px' }}
//                                             >
//                                                 Choose File
//                                             </Button>
//                                         </Grid>
//                                         <Grid item xs={6}>
//                                             <TextField
//                                                 label="File Name"
//                                                 value={doc.name || 'No file chosen'}
//                                                 disabled
//                                                 fullWidth
//                                             />
//                                         </Grid>
//                                     </Grid>
//                                 </Paper>
//                             </Grid>
//                         ))}
//                         <Grid item xs={12}>
//                             <Button
//                                 variant="outlined"
//                                 onClick={handleAddFileUpload}
//                                 fullWidth
//                             >
//                                 Add New Document
//                             </Button>
//                         </Grid>
//                     </Grid>
//                 ) : (
//                     pdfBase64 ? (
//                         <iframe
//                             src={`data:application/pdf;base64,${pdfBase64}`}
//                             style={{ width: '100%', height: '600px', border: 'none' }}
//                             title="Document PDF"
//                         />
//                     ) : (
//                         <p>No PDF available</p>
//                     )
//                 )}
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button
//                     variant="secondary"
//                     onClick={() => {
//                         if (isEditing) {
//                             setIsEditing(false);
//                         } else {
//                             handleBlockClick();
//                         }
//                     }}
//                     disabled={blockButtonDisableds}
//                 >
//                     {blockButtonText}
//                 </Button>
//                 <Button
//                     variant="primary"
//                     onClick={() => {
//                         if (isEditing) {
//                             handleSave();
//                             setIsEditing(false);
//                         } else {
//                             setIsEditing(true);
//                         }
//                     }}
//                     disabled={editButtonDisabled}
//                 >
//                     {isEditing ? 'Save' : editButtonText}
//                 </Button>
//                 {isEditing && (
//                     <Button
//                         variant="warning"
//                         onClick={() => setIsEditing(false)}
//                     >
//                         Back
//                     </Button>
//                 )}
//                 <Button
//                     variant="danger"
//                     onClick={onHide}
//                 >
//                     Close
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default PdfModal;

// // import React, { useState, useEffect } from 'react';
// // import { Grid, TextField, Paper } from '@mui/material';
// // import { Modal, Button, Col, Row } from 'react-bootstrap';
// // import AddressApiService from '../../data/services/insert/address-api-service';

// // interface PdfModalProps {
// //     pathId?: number;
// //     associatedId?: number;
// //     companyId?: number;
// //     show: boolean;
// //     onHide: () => void;
// //     pdfBase64: string | null;
// //     onBlockClick: () => void;
// //     blockButtonText: string;
// //     editButtonText: string;
// //     blockButtonDisableds: boolean;
// //     editButtonDisabled: boolean;
// //     personIndex: number;
// //     person: any;
// //     handleFileChange3: (personIndex: number, index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
// //     handleChoosecompanyImagesClick3: (personIndex: number, index: number) => void;
// // }

// // interface MultipartFile {
// //     name: string;
// //     size: number;
// //     type: string;
// //     file: File;
// // }

// // const PdfModal: React.FC<PdfModalProps> = ({
// //     pathId,
// //     associatedId,
// //     companyId,
// //     show,
// //     onHide,
// //     pdfBase64,
// //     onBlockClick,
// //     blockButtonText,
// //     editButtonText,
// //     blockButtonDisableds,
// //     editButtonDisabled,
// //     personIndex,
// //     person,
// //     handleFileChange3,
// //     handleChoosecompanyImagesClick3,
// // }) => {
// //     const [isEditing, setIsEditing] = useState(false);
// //     const [companyDocuments, setCompanyDocuments] = useState<MultipartFile[]>([]);
// //     const addressApiService = new AddressApiService();

// //     useEffect(() => {
// //         console.log('Company documents:', companyDocuments);
// //     }, [companyDocuments]);

// //     const handleFileInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
// //         const files = event.target.files;
// //         if (files && files.length > 0) {
// //             const selectedFile = files[0];
// //             setCompanyDocuments(prevDocs => {
// //                 const newDocs = [...prevDocs];
// //                 newDocs[index] = {
// //                     name: selectedFile.name,
// //                     size: selectedFile.size,
// //                     type: selectedFile.type,
// //                     file: selectedFile,
// //                 };
// //                 return newDocs;
// //             });
// //         }
// //     };

// //     const handleChooseImagesClick = (index: number) => {
// //         const fileInput = document.getElementById(`file-input-${index}`) as HTMLInputElement;
// //         if (fileInput) fileInput.click();
// //     };

// //     const handleSave = async () => {
// //         if (!pathId || !associatedId || !companyId) {
// //             console.log('Path ID or Associated ID is missing');
// //             return;
// //         }

// //         const files = companyDocuments.map(doc => doc.file);
// //         const pathIds = [pathId];
// //         const associatedIds = [associatedId];
// //         const companyIds = [companyId];

// //         console.log('files documents:', files);
// //         console.log('pathIds:', pathIds);
// //         console.log('associatedIds:', associatedIds);

// //         try {
// //             const response = await addressApiService.uploadFiles(files, pathIds, associatedIds, companyIds);
// //             console.log('Response:', response);
// //             console.log('Files uploaded successfully');
// //             onHide();
// //         } catch (error) {
// //             console.error('Upload error:', error);
// //             console.log('Failed to upload files');
// //         }
// //     };


// //     const handleBlockClick = async () => {
// //         try {
// //             if (associatedId) {
// //                 const response = await addressApiService.blockCompanyDocument(associatedId);
// //                 console.log('Block response:', response);
// //                 console.log('Director blocked successfully.');
// //             } else {
// //                 console.log('Associated ID is missing.');
// //             }
// //             onHide();
// //         } catch (error) {
// //             console.error('Error blocking director:', error);
// //             console.log('Failed to block director.');
// //         }
// //     };

// //     return (
// //         <Modal show={show} onHide={onHide} size="xl" centered>
// //             <Modal.Header closeButton>
// //                 <Modal.Title>{isEditing ? 'Edit Document' : 'Document PDF'}</Modal.Title>
// //             </Modal.Header>
// //             <Modal.Body>
// //                 {isEditing ? (
// //                     <Grid container spacing={2}>
// //                         {person.companyDocumentsDTOS?.map((doc: { imageName3: string }, index: number) => (
// //                             <Grid item xs={12} key={index}>
// //                                 <Paper style={{ padding: 16 }}>
// //                                     <Grid container spacing={2} alignItems="center">
// //                                         <Grid item xs={6}>
// //                                             <input
// //                                                 id={`file-input-${index}`}
// //                                                 type="file"
// //                                                 onChange={(event) => handleFileInputChange(index, event)}
// //                                                 style={{ display: 'none' }}
// //                                             />
// //                                             <Button
// //                                                 size="sm"
// //                                                 variant="outlined"
// //                                                 onClick={() => handleChooseImagesClick(index)}
// //                                             >
// //                                                 Choose Image
// //                                             </Button>
// //                                         </Grid>
// //                                         <Grid item xs={6}>
// //                                             <TextField
// //                                                 label="File Name"
// //                                                 value={companyDocuments[index]?.name || doc.imageName3 || ''}
// //                                                 disabled
// //                                                 fullWidth
// //                                             />
// //                                         </Grid>
// //                                     </Grid>
// //                                 </Paper>
// //                             </Grid>
// //                         ))}
// //                     </Grid>
// //                 ) : (
// //                     pdfBase64 ? (
// //                         <iframe
// //                             src={`data:application/pdf;base64,${pdfBase64}`}
// //                             style={{ width: '100%', height: '600px', border: 'none' }}
// //                             title="Document PDF"
// //                         />
// //                     ) : (
// //                         <p>No PDF available</p>
// //                     )
// //                 )}
// //             </Modal.Body>
// //             <Modal.Footer>
// //                 <Button
// //                     variant="secondary"
// //                     onClick={() => {
// //                         if (isEditing) {
// //                             setIsEditing(false);
// //                         } else {
// //                             handleBlockClick();
// //                         }
// //                     }}
// //                     disabled={blockButtonDisableds}
// //                 >
// //                     {blockButtonText}
// //                 </Button>
// //                 <Button
// //                     variant="primary"
// //                     onClick={() => {
// //                         if (isEditing) {
// //                             handleSave();
// //                             setIsEditing(false);
// //                         } else {
// //                             setIsEditing(true);
// //                         }
// //                     }}
// //                     disabled={editButtonDisabled}
// //                 >
// //                     {isEditing ? 'Save' : editButtonText}
// //                 </Button>
// //                 {isEditing && (
// //                     <Button
// //                         variant="warning"
// //                         onClick={() => setIsEditing(false)}
// //                     >
// //                         Back
// //                     </Button>
// //                 )}
// //                 <Button
// //                     variant="danger"
// //                     onClick={onHide}
// //                 >
// //                     Close
// //                 </Button>
// //             </Modal.Footer>
// //         </Modal>
// //     );
// // };

// // export default PdfModal;

