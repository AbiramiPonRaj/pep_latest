import React, { useEffect, useState } from 'react';
import { Button, Container, TextField, Typography, Paper, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FcAddImage } from 'react-icons/fc';
import FileUpload from '../../data/services/Fileupload/fileupload_api_service';

interface FieldState {
  imageName: string;
  fileType: string;
  uploading: boolean;
  uploadSuccess: boolean;
}
interface FileType {
  id: string;
  name: string;
}

const ImageUploadPage = () => {
  const initialFieldState: FieldState = {
    imageName: '',
    fileType: '',
    uploading: false,
    uploadSuccess: false,
  };


  const [fields, setFields] = useState<FieldState[]>([initialFieldState]);
  const fileUpload = new FileUpload();
  const [filetype, Setfiletype] = useState<FileType[]>([]);
  const [pepId, setPepId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const selectedField = fields[selectedFileIndex || 0]; 



  useEffect(() => {
    fetchfiletype();
    fetchPepId();
  }, []);



  const fetchPepId = async () => {
    try {
      setPepId('5'); 
      console.log('PepId:', '5');
    } catch (error) {
      console.error('Error setting pepId:', error);
    }
  };
  
  const displayImagePreview = async (pepId: string, pathId: string, filename: string, index: number) => {
    try {
      const parsedPepId = parseInt(pepId, 10);
      if (isNaN(parsedPepId)) {
        console.error('Invalid pepId provided:', pepId);
        return;
      }
  
      const parsedPathId = parseInt(pathId, 10);
      if (isNaN(parsedPathId)) {
        console.error('Invalid pathId provided:', pathId);
        return;
      }

      const fileData = await fileUpload.getFileByPepIdAndPathId(parsedPepId, parsedPathId, filename);
  
      if (fileData) {
        const imageURL = URL.createObjectURL(fileData);
        
        const imageElement = document.createElement('img');
        imageElement.src = imageURL;
  
        const previewContainer = document.getElementById(`image-preview-container-${index}`);
        if (previewContainer) {
          previewContainer.innerHTML = '';
          previewContainer.appendChild(imageElement);
        }
      } else {
        console.error('File data is undefined or empty.');
      }
    } catch (error) {
      setError('Error downloading the file');
      console.error('Error:', error);
    }
  };

  const handlePreviewClick = () => {
    displayImagePreview('1', '1', '14', 0);
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
    }
  };

  const fetchfiletype = async () => {
    try {
      const response: FileType[] = await fileUpload.getfiletype();
      Setfiletype(response);
      console.log('Filetype data:', response); 
      console.log('State after update:', filetype);

    } catch (error) {
      console.error('Error fetching filetype:', error); // Log error if data fetch fails
    }
  };

  const handleSubmit = async (index: number) => {
    // const file = document.getElementById(`image-upload-input-${index}`) as HTMLInputElement;
  
    // if (file && file.files && file.files.length > 0) {
    //   const formData = new FormData();
    //   formData.append('files', file.files[0]);
      
    //   const selectedFileTypeId = fields[index].fileType;
    // formData.append('pathId', selectedFileTypeId);

    // if (pepId !== null) {
    //   formData.append('pepId', pepId);

    //   try {
    //     const response = await fileUpload.uploadImage(formData);
    //     console.log(response);
    //   } catch (error) {
    //     console.error('Upload failed:', error);
    //   }
    // } else {
    //   console.error('pepId is null');
    // }}
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

  const handleSubmitAll = async () => {
    for (let i = 0; i < fields.length; i++) {
      await handleSubmit(i);
    }
  };

  const addMoreFields = () => {
    setFields(prevFields => [...prevFields, initialFieldState]);
  };

  const handleChooseImagesClick = (index: number) => {
    document.getElementById(`image-upload-input-${index}`)?.click();
  };

  return (
    <>
     {fields.map((field, index) => (
        <form key={index} encType="multipart/form-data">
          <Container maxWidth="sm" key={index}>
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <FormControl fullWidth>
                  <InputLabel id={`demo-simple-select-label-${index}`}>File Type</InputLabel>
                  {filetype && filetype.length > 0 && (
                    <Select
                      labelId={`demo-simple-select-label-${index}`}
                      id={`demo-simple-select-${index}`}
                      label="FileType"
                      value={fields[index].fileType}
                      onChange={(event) => handleSelectChange(event.target.value as string, index)}
                      disabled={field.uploading}
                    >
                      {filetype.map((data) => (
                        <MenuItem key={data.id} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
                <div style={{ marginLeft: '20px' }}>
                  <input
                    id={`image-upload-input-${index}`}
                    type="file"
                    onChange={(event) => handleFileChange(index, event)}
                    style={{ display: 'none' }}
                    multiple
                  />
                  <Button variant="outlined" onClick={() => handleChooseImagesClick(index)}>
                    Choose Images
                  </Button>
                 </div>
                <TextField label="Image Name" variant="outlined" value={field.imageName} disabled />
                {field.uploadSuccess && (
                  <Typography variant="body1" color="success" align="center" style={{ marginTop: '10px' }}>
                    Images uploaded successfully!
                  </Typography>
                )}
              </Box>
            </Paper>
          </Container>
        </form>
      ))}
     
      <div className="add-button" style={{ cursor: 'pointer' }} onClick={addMoreFields}>
        <FcAddImage /> Add More Image Upload Fields
      </div>
     
    </>
  );
};  

export default ImageUploadPage;

