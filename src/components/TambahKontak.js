import React, { useState, useEffect } from "react";
import Sidenav from "./Sidenav";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import SearchTwo from './small-components/SearchTwo';
import { styled } from "@mui/material/styles";
import { fetchContacts, newContact, deleteContact, updateContact } from "../services/api";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

const TambahKontak = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bidang, setBidang] = useState("");
  const [contacts, setContacts] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchInitialContacts = async () => {
      try {
        const response = await fetchContacts();
        setContacts(response.data);
      } catch (error) {
        setSnackbarMessage("Error fetching contacts.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    fetchInitialContacts();

    socket.on("newContact", (data) => {
      setContacts((prevContacts) => [...prevContacts, data]);
    });

    return () => {
      socket.off("newContact");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await newContact(name, phoneNumber, bidang);
      setSnackbarMessage("Contact added successfully!");
      setSnackbarSeverity("success");
      socket.emit("newContact", response.data);
      setName("");
      setPhoneNumber("");
      setBidang("");
      setOpenAddDialog(false);
    } catch (error) {
      setSnackbarMessage("Error adding contact.");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleOpenDeleteDialog = (contact) => {
    setSelectedContact(contact);
    setOpenDeleteDialog(true);
  };

  const handleOpenEditDialog = (contact) => {
    setSelectedContact(contact);
    setOpenEditDialog(true);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedContact(null);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedContact(null);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setName("");
    setPhoneNumber("");
    setBidang("");
  };

  const handleDelete = async () => {
    if (selectedContact) {
      try {
        await deleteContact(selectedContact.id);
        setContacts(
          contacts.filter((contact) => contact.id !== selectedContact.id)
        );
        setSnackbarMessage("Contact deleted successfully!");
        setSnackbarSeverity("success");
        handleCloseDeleteDialog();
      } catch (error) {
        setSnackbarMessage("Error deleting contact.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleUpdate = async () => {
    if (selectedContact) {
      try {
        await updateContact(
          selectedContact.id,
          selectedContact.name,
          selectedContact.no_handphone,
          selectedContact.bidang
        );
        setContacts(
          contacts.map((contact) =>
            contact.id === selectedContact.id ? selectedContact : contact
          )
        );
        setSnackbarMessage("Contact updated successfully!");
        setSnackbarSeverity("success");
        handleCloseEditDialog();
      } catch (error) {
        setSnackbarMessage("Error updating contact.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleEditChange = (field, value) => {
    setSelectedContact((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#d5d5d5",
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: "10px 16px",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const paginatedContacts = contacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div style={{ marginTop: "9vh" }}>
          <div style={{ display: 'flex', fontSize: '3vh', fontWeight: 'bold', margin: '2vh 0vw 2vh 0vw'}}>Contact List</div>
            <div style={{ display: "flex", gap: "6vh", marginBottom: "2vh" }}>
              <SearchTwo/>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddDialog}
                endIcon={<PersonAddAltIcon />}
              >
                Add Contact
              </Button>
            </div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>NO.</StyledTableCell>
                    <StyledTableCell>Nama Lengkap</StyledTableCell>
                    <StyledTableCell>No. Handphone</StyledTableCell>
                    <StyledTableCell>Bidang</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedContacts.map((contact, index) => (
                    <StyledTableRow key={contact.id}>
                      <StyledTableCell component="th" scope="row">
                        {page * rowsPerPage + index + 1}
                      </StyledTableCell>
                      <StyledTableCell>{contact.name}</StyledTableCell>
                      <StyledTableCell>{contact.no_handphone}</StyledTableCell>
                      <StyledTableCell>{contact.bidang}</StyledTableCell>
                      <StyledTableCell>
                        {contact.name && contact.no_handphone && contact.bidang && (
                          <>
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleOpenEditDialog(contact)}
                              style={{ padding: "4px" }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleOpenDeleteDialog(contact)}
                              style={{ padding: "4px" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={contacts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </div>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedContact?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle sx={{width:"35vw"}}>Edit Contact</DialogTitle>
        <DialogContent>
        <TextField
            label="Nama Lengkap"
            variant="outlined"
            fullWidth
            value={selectedContact?.name || ""}
            onChange={(e) => handleEditChange("name", e.target.value)}
            margin="normal"
            required
            sx={{margin:" 2vh 0 4vh 0"}}
          />
          <PhoneInput
            country={'id'}
            value={selectedContact?.no_handphone || ""}
            onChange={(value) => handleEditChange("no_handphone", value)}
            inputProps={{ id: "phone-number", placeholder: "No. Handphone" }}
            inputStyle={{
              width: '100%',
            }}
          />
          <FormControl fullWidth margin="dense" sx={{margin:" 4vh 0 0vh 0"}}>
            <InputLabel>Bidang</InputLabel>
            <Select
              value={selectedContact?.bidang || ""}
              onChange={(e) => handleEditChange("bidang", e.target.value)}
              label="Bidang"
            >
              <MenuItem value="Sekretariat">Sekretariat</MenuItem>
              <MenuItem value="Informasi Publik(1)">Informasi Publik (1)</MenuItem>
              <MenuItem value="Informatika(2)">Informatika (2)</MenuItem>
              <MenuItem value="Keamanan Informasi(3)">Keamanan Informasi (3)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle sx={{width:"35vw"}}>Add New Contact</DialogTitle>
        <DialogContent>
        <TextField
            label="Nama Lengkap"
            variant="outlined"
            fullWidth
            value={selectedContact?.name || ""}
            onChange={(e) => handleEditChange("name", e.target.value)}
            margin="normal"
            required
            sx={{margin:" 2vh 0 4vh 0"}}
          />
          <PhoneInput
            country={'id'}
            value={phoneNumber}
            fullWidth
            onChange={(value) => setPhoneNumber(value)}
            inputProps={{ id: "phone-number", placeholder: "No. Handphone" }}
            inputStyle={{
              width: '100%',
            }}
          />
          <FormControl fullWidth margin="dense" sx={{margin:" 4vh 0 0vh 0"}}>
            <InputLabel>Bidang</InputLabel>
            <Select
              value={bidang}
              onChange={(e) => setBidang(e.target.value)}
              label="Bidang"
            >
              <MenuItem value="Sekretariat">Sekretariat</MenuItem>
              <MenuItem value="Informasi Publik(1)">Informasi Publik (1)</MenuItem>
              <MenuItem value="Informatika(2)">Informatika (2)</MenuItem>
              <MenuItem value="Keamanan Informasi(3)">Keamanan Informasi (3)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TambahKontak;