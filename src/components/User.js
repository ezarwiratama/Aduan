import React, { useState, useEffect } from "react";
import Sidenav from "./Sidenav";
import { InputLabel, FormControl, Select, IconButton } from "@mui/material";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import {
  signupUser,
  fetchUsers,
  deleteUser,
  updateUser,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchTwo from "./small-components/SearchTwo";
import moment from 'moment';

const User = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]); // Initialize as empty array
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedRole, setEditedRole] = useState("");

  // States for dialog
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users on component mount
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data.data); // Ensure data is an array
      } catch (error) {
        setSnackbarMessage("Error fetching users.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    loadUsers();
  }, []);

  const handleSignup = async () => {
    try {
      await signupUser({ username, password, role });
      setSnackbarMessage("User successfully added!");
      setSnackbarSeverity("success");
      // Refresh users list after adding
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (error) {
      setSnackbarMessage("Error adding user.");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
      setOpenDialog(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser.id);
      setSnackbarMessage("User successfully deleted!");
      setSnackbarSeverity("success");
      // Refresh users list after deletion
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (error) {
      setSnackbarMessage("Error deleting user.");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
      setOpenDeleteDialog(false);
    }
  };

  const handleEditUser = async () => {
    try {
      await updateUser(selectedUser.id, {
        username: editedUsername,
        role: editedRole,
      });
      setSnackbarMessage("User successfully updated!");
      setSnackbarSeverity("success");
      // Refresh users list after editing
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (error) {
      setSnackbarMessage("Error updating user.");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
      setOpenEditDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setEditedUsername(user.username);
    setEditedRole(user.role);
    setOpenEditDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <div style={{ marginTop: "9vh"}}>
          <div style={{ display: 'flex', fontSize: '3vh', fontWeight: 'bold', margin: '2vh 0vw 2vh 0vw'}}>User List</div>
          <div style={{ display: "flex", gap: "6vh", marginBottom: "2vh" }}>
            <SearchTwo />
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
              endIcon={<PersonAddAltIcon />}
            >
              Add User
            </Button>
          </div>
          <div style={{ marginBottom: "5vh" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>No</StyledTableCell>
                    <StyledTableCell>Username</StyledTableCell>
                    <StyledTableCell>Role</StyledTableCell>
                    <StyledTableCell>Created At</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user, index) => (
                    <StyledTableRow key={user.id}>
                      <StyledTableCell component="th" scope="row">
                      {page * rowsPerPage + index + 1} 
                      </StyledTableCell>
                      <StyledTableCell>{user.username}</StyledTableCell>
                      <StyledTableCell>{user.role}</StyledTableCell>
                      <StyledTableCell> {moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss')}</StyledTableCell>
                      <StyledTableCell>
                        {user.id ? (
                          <>
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleOpenEditDialog(user)}
                              style={{ padding: "4px" }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleOpenDeleteDialog(user)}
                              style={{ padding: "4px" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        ) : null}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </div>
        </div>
          {/* Add User Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle style={{width: '30vw', height: '12vh'}}>Tambah User</DialogTitle>
            <DialogContent>
              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  maxWidth: 400,
                }}
              >
                <TextField
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  required
                  sx={{marginTop:'1vh'}}
                />
                 <TextField
                  label="Role"
                  variant="outlined"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  select
                  fullWidth
                  required
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </TextField>
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSignup}
              >
                Add User
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxWidth: 400,
                }}
              >
                <TextField
                  label="Username"
                  variant="outlined"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  fullWidth
                  required
                  sx={{marginTop:'10px'}}
                />
                <TextField
                  label="Role"
                  variant="outlined"
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                  select
                  fullWidth
                  required
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </TextField>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditUser}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete User Dialog */}
          <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Delete User</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this user?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteUser}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        
        </Box>
      </Box>
    </>
  );
};

export default User;
