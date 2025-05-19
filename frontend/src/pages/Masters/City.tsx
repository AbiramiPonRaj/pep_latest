import React, { useState, useEffect } from 'react';
import {
  TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem,
  Grid, Button, IconButton, Box, Dialog, DialogTitle, DialogContent, Container, DialogActions, Snackbar, Card
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Header from '../../layouts/header/header';
import { StatePayload } from "../../data/services/master/State/state_payload";
import StateApiService from "../../data/services/master/State/state_api_service";
import CountryApiService from "../../data/services/master/Country/country_api_service";
import MuiAlert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface State {
  id: string;
  countryId: string;
  stateName: string;
}

interface Country {
  id: string;
  name: string;
}

const City = () => {
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editStateName, setEditStateName] = useState('');
  const [editStateId, setEditStateId] = useState('');

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteStateId, setDeleteStateId] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [activeTab, setActiveTab] = useState('insert');
  const [serialNumber, setSerialNumber] = useState(1);

  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [blockedRows, setBlockedRows] = useState<string[]>([]); 

  const authService = new StateApiService();
  const countryService = new CountryApiService();

  useEffect(() => {
    fetchCountries();
    fetchStates();
    const storedBlockedRows = localStorage.getItem('blockedRows');
    if (storedBlockedRows) {
      setBlockedRows(JSON.parse(storedBlockedRows) as string[]); 
    }
  }, []);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessOpen(true);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setIsErrorOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCountry || !name) {
      showErrorMessage('Please fill out all fields.');
      return; 
    }

    try {
      const payload: StatePayload = {
        stateName: name,
        countryId: selectedCountry
      };

      const response = await authService.MasterState(payload);

      setName('');
      setSelectedCountry('');
      fetchStates();
      showSuccessMessage('State added successfully.');
    } catch (error) {
      console.error("Error adding state:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const Countries = await countryService.getCountryOptions();
      setCountries(Countries);
      setSerialNumber(page * rowsPerPage + 1);
    } catch (error) {
      console.error("Error fetching Country:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const fetchedStates = await authService.getStateDataByCountryId();
      setStates(fetchedStates);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleEditClick = (id: string, name: string, countryId: string) => {
    setEditStateId(id);
    setEditStateName(name);
    setSelectedCountry(countryId); 
    setOpenEditDialog(true);
  };


  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditStateId('');
    setEditStateName('');
  };

  const handleEditDialogSave = async () => {
    try {
      const payload: StatePayload = {
        stateName: editStateName,
        countryId: selectedCountry, 
      };
      await authService.updateState(Number(editStateId), payload);

      setOpenEditDialog(false);
      setEditStateId('');
      setEditStateName('');
      fetchStates();
      showSuccessMessage('State updated successfully.');
    } catch (error) {
      console.error("Error editing State:", error);
    }
  };

  const handleUnblock = (id: string) => {
    setSelectedRowId(id);
    setDialogAction('unblock');
    setDialogOpen(true);
  };

  const handleBlock = (id: string) => {
    setSelectedRowId(id);
    setDialogAction('block');
    setDialogOpen(true);
  };

  const handleConfirmDialog = async (confirmed: boolean) => {
    if (confirmed && selectedRowId !== null) {
      if (dialogAction === 'block') {
        await blockRow(selectedRowId);
      } else if (dialogAction === 'unblock') {
        await unblockRow(selectedRowId);
      }
    }
    setSelectedRowId(null);
    setDialogOpen(false);
    setDialogAction(null);
  };

  const blockRow = async (id: string) => {
    try {
      await authService.blockState(Number(id));
      setBlockedRows([...blockedRows, id]);
      localStorage.setItem('blockedRows', JSON.stringify([...blockedRows, id]));
      showSuccessMessage('State blocked successfully.');

    } catch (error) {
      console.error("Error blocking State:", error);
    }
  };

  const unblockRow = async (id: string) => {
    try {
      await authService.unblockState(Number(id));
      setBlockedRows(blockedRows.filter((rowId) => rowId !== id));
      localStorage.setItem('blockedRows', JSON.stringify(blockedRows.filter((rowId) => rowId !== id)));
      showSuccessMessage('State unblocked successfully.');
    } catch (error) {
      console.error("Error unblocking State:", error);
    }
  };

  const handleDialogCancel = () => {
    setSelectedRowId(null);
    setDialogOpen(false);
    setDialogAction(null);
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    setSerialNumber(newPage * rowsPerPage + 1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  function getCountryNameById(countryId: string) {
    const country = countries.find((c) => c.id === countryId);
    return country ? country.name : '';
  }
   
  return (
    <>
      <Header />
      <Box m={6}>
        <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "30px", margin: "10px" }}>
          <Box m={4}>
            <h3>City</h3>
            <div className="d-flex justify-content-center">
              <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
                <div className="card-body">
                  <ul className="nav gap-2 p-1 small shadow-sm">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'insert' ? 'active btn btn-outline-primary' : 'btn btn-outline-primary'}`}
                        onClick={() => setActiveTab('insert')}
                        type="button"
                      >
                        INSERT
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'edit' ? 'active btn btn-outline-primary' : 'btn btn-outline-primary'}`}
                        onClick={() => setActiveTab('edit')}
                        type="button"
                      >
                        EDIT
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'unblock' ? 'active btn btn-outline-primary' : 'btn btn-outline-primary'}`}
                        onClick={() => setActiveTab('unblock')}
                        type="button"
                      >
                        UNBLOCK
                      </button>
                    </li>
                  </ul>
                 
                   {activeTab === 'insert' && (
                    <div className="nav gap-2 p-3 small shadow-sm">
                      <Grid container spacing={3} alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="outlined" margin="dense"  className="text-field">
                            <InputLabel   htmlFor="country">Country</InputLabel>
                            <Select
                              label="Country"
                              value={selectedCountry}
                              onChange={(e) => setSelectedCountry(e.target.value as string)}
                              name="country"
                              variant="outlined"
                              className="text-field"
                              size="small"
                              required
                            >
                              {countries.map((country) => (
                                <MenuItem key={country.id} value={country.id}>
                                  {country.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="outlined" margin="dense"  className="text-field">
                            <InputLabel   htmlFor="state">State</InputLabel>
                            <Select
                              label="State"
                              value={selectedState}
                              onChange={(e) => setSelectedState(e.target.value as string)}
                              name="State"
                              variant="outlined"
                              className="text-field"
                              size="small"
                              required
                            >
                              {states.map((state) => (
                                <MenuItem key={state.id} value={state.countryId}>
                                  {state.stateName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <TextField
                            id="filled-basic stateName"
                            label="City Name:"
                            className="text-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            variant="outlined"
                            margin="dense"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={4}>
                          <Box mt={2}>
                            <button type="button" className="btn btn-outline-primary" onClick={handleSubmit} style={{ textAlign: 'center',marginLeft: "120px" }}>
                              Submit
                            </button>
                          </Box>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                  {activeTab === 'edit' && (
                    <div className="card-body">
                      <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <TableContainer component={Card} sx={{ maxHeight: 440 }} style={{ width: "85%", margin: "20px" }}>
                          <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                            <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                              <TableRow className="tableHeading">
                                <TableCell>S.No</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {states
                                .filter((state) => !blockedRows.includes(state.id))
                                .slice(startIndex, endIndex)
                                .map((state, index) => (
                                  <TableRow key={state.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                    <TableCell>{serialNumber + index}</TableCell>
                                    <TableCell>{state.stateName}</TableCell>
                                 <TableCell>{getCountryNameById(state.countryId)}</TableCell>
                                    <TableCell>
                                      <Button
                                        onClick={() => handleEditClick(state.id, state.stateName, state.countryId)}
                                        style={{ padding: '1px', marginRight: '4px' }}
                                        startIcon={<EditIcon />}
                                        variant="outlined"
                                        disabled={blockedRows.includes(state.id)}
                                      >
                                        Edit
                                      </Button>

                                      <Button variant="outlined" onClick={() => handleBlock(state.id)}>
                                        Block
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <div>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 20]}
                            component="div"
                            count={states.length}
                            page={page}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            style={{ marginLeft: "500px" }}
                          />
                        </div>
                      </Grid>
                    </div>
                  )}
                  {activeTab === 'unblock' && (
                    <div className="card-body">
                      <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <TableContainer component={Card} sx={{ maxHeight: 440 }} style={{ width: "85%", margin: "20px" }}>
                          <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                            <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                              <TableRow className="tableHeading">
                                <TableCell>S.No</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {states
                                .filter((state) => blockedRows.includes(state.id))
                                .slice(startIndex, endIndex)
                                .map((state, index) => (
                                  <TableRow key={state.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                    <TableCell>{serialNumber + index}</TableCell>
                                    <TableCell>{state.stateName}</TableCell>
                                    <TableCell>{getCountryNameById(state.countryId)}</TableCell>
                                    <TableCell>
                                      <Button
                                        onClick={() => handleEditClick(state.id, state.stateName, state.countryId)}
                                        style={{ padding: '1px', marginRight: '4px' }}
                                        startIcon={<EditIcon />}
                                        variant="outlined"
                                        disabled={blockedRows.includes(state.id)}
                                      >
                                        Edit
                                      </Button>

                                      <Button variant="outlined" onClick={() => handleUnblock(state.id)}>
                                        Unblock
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <div>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 20]}
                            component="div"
                            count={states.filter((state) => blockedRows.includes(state.id)).length}
                            page={page}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            style={{ marginLeft: "500px" }}
                          />
                        </div>
                      </Grid>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Box>
        </Container>
      </Box>


      <Dialog open={openEditDialog} onClose={handleEditDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit State</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={4}>
              <TextField
                label="State Name"
                fullWidth
                variant="outlined"
                margin="dense"
                value={editStateName}
                size="small"
                onChange={(e) => setEditStateName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel htmlFor="country">Country</InputLabel>
                <Select
                  label="Country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value as string)}
                  name="country"
                  variant="outlined"
                  size="small"
                  required
                >
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditDialogSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={handleDialogCancel}>
        <DialogTitle>
          {dialogAction === 'block' ? 'Block State' : 'Unblock State'}
        </DialogTitle>
        <DialogContent>
          <p>
            Are you sure you want to {dialogAction === 'block' ? 'block' : 'unblock'} this City?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleConfirmDialog(true)} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={isSuccessOpen}
        autoHideDuration={5000}
        onClose={() => setIsSuccessOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={() => setIsSuccessOpen(false)}
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={isErrorOpen}
        autoHideDuration={5000}
        onClose={() => setIsErrorOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={() => setIsErrorOpen(false)}
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default City;;