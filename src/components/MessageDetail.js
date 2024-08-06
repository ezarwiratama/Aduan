import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styling/MessageDetail.css";
import Sidenav from "./Sidenav";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  fetchMessages,
  sendMessages,
  updateMessageStatus,
  updateReplyMessage,
} from "../services/api";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PICselect from "./small-components/PIC-select";
import { Snackbar, Alert, Box, TextField } from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CircularProgress from "@mui/material/CircularProgress";
import io from "socket.io-client";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PhotoIcon from '@mui/icons-material/Photo';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import Backdrop from '@mui/material/Backdrop';

const socket = io.connect("http://localhost:5000");

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    whiteSpace: "pre-wrap",
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

function createData(name, content) {
  return { name, content };
}

const MessageDetail = () => {
  const [message, setMessage] = useState(null);
  const [selectedPIC, setSelectedPIC] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false); // State for alert
  const [alert2Open, setAlert2Open] = useState(false); // State for alert
  const [reply, setReply] = useState(""); // State to store the value of the TextField
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await fetchMessages();
        console.log("MESSAGES", response)
        const messageData = response.data.find(
          (msg) => msg.id === parseInt(id)
        );
        setMessage(messageData);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };
    getMessage();

    socket.on("update_message", (data) => {
      if (data.id === id) {
        setMessage(data);
      }
    });

    return () => {
      socket.off("update_message");
    };
  }, [id]);

  const handleClick = async () => {
    if (!selectedPIC || selectedPIC.length === 0) {
      console.error("PIC not selected");
      return;
    }

    const mergedData = {
      ...message,
      messageId: message.id,
      ...selectedPIC,
      selectedPICId: selectedPIC?.id,
    };
    console.log("DATA =>", selectedPIC);
    const number = mergedData.no_handphone;
    const numberUser = mergedData.phoneNumber;
    const body = `*ID Pesan #${mergedData.messageId}*\n\n*Tanggal/Jam*\n${mergedData.date}/${mergedData.hour}\n\n*PIC*\n${mergedData.name}\n\n*Nomor Pengirim*\n${mergedData.phoneNumber}\n\n*Nama Pengirim*\n${mergedData.userName}\n\n*Lampiran Pesan*\n${mergedData.media}\n\n*Pesan Pengirim*\n${mergedData.message}\n\n_"Balas admin dengan format !balasadmin<ID Pesan>(spasi)isi pesan, contoh !balasadmin7 aduan telah ditangani"_`;
    const bodyUser = `Aduan anda sedang kami proses\n\n*PIC yang menangani*\n${mergedData.name}`;

    try {
      const responseSendtoPIC = await sendMessages(number, body, mergedData);
      socket.emit("send-message", responseSendtoPIC.data);
      
      const responseSendtoUser = await sendMessages(numberUser, bodyUser, null);
      socket.emit("send-message", responseSendtoUser.data);

      await updateMessageStatus(
        message.id,
        "process",
        mergedData.name,
        mergedData.no_handphone
      );

      if (responseSendtoUser.status === 200) {
        const updatedMessage = await responseSendtoUser;
        console.log("Message updated successfully:", updatedMessage);
        navigate(-1);
        setOpen(true);
        // Save Snackbar status in local storage
        localStorage.setItem('snackbarMessage', 'Pesan Aduan berhasil dikirim ke PIC — Aduan sedang diproses!');
      } else {
        console.error("Failed to update message");
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleClickReply = async () => {
    if (!message.reply_pic) {
      setAlertOpen(true);
      return;
    }

    if (reply.trim() === "") {
      setAlert2Open(true);
      return;
    }

    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const mergedData2 = {
      ...message,
      reply_message: reply,
      reply_time: currentTime
    };
    const bodyUser = `Aduan anda sudah selesai\n\n*Pesan Admin*\n${mergedData2.reply_message}`;
    const numberUser = mergedData2.phoneNumber;

    try {
      const responseSendtoUserDone = await sendMessages(numberUser, bodyUser);
      socket.emit("send-message", responseSendtoUserDone.data);
      await updateReplyMessage(
        mergedData2.id,
        "done",
        mergedData2.reply_message,
        currentTime
      );

      if (responseSendtoUserDone.status === 200) {
        const updatedMessage = responseSendtoUserDone;
        console.log("Message updated successfully:", updatedMessage);
        setOpen(true);
        // Save Snackbar status in local storage
        localStorage.setItem('snackbarMessage', 'Pesan Balasan sudah dikirim — Aduan Selesai!');
        navigate(-1);
      } else {
        console.error("Failed to update message");
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleSelectPIC = (value) => {
    setSelectedPIC(value);
  };

  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleCloseAlert = () => {
    setAlert2Open(false);
  };

  const handlePICCloseAlert = () => {
    setAlertOpen(false);
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!message) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const formattedDate = moment(message.date).format("DD-MM-YYYY");

  function toSentenceCase(str) {
    if (!str) return str; // Return the string as is if it's empty or null
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const statusPesan = toSentenceCase(message.status)
  const imageUrl = "http://localhost:5000/images/";

  const getButtonColor = (media) => {
    const extension = media.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'error';
      case 'docx':
        return 'primary';
      case 'xlsx':
        return 'success';
      case 'jpg':
        return 'primary';
      case 'jpeg':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getIcon = (media) => {
    const extension = media.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <PictureAsPdfIcon />;
      case 'docx':
        return <DescriptionIcon />;
      case 'xlsx':
        return <TableChartIcon />;
      case 'jpeg':
        return <PhotoIcon />;
      case 'jpg':
        return <PhotoIcon />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  const rows = [
    createData("ID Pesan", message.id),
    createData("Status Pesan", `${statusPesan}`),
    createData("Tanggal/Jam", `${formattedDate} / ${message.hour}`),
    createData("Nomor", "+" + message.phoneNumber),
    createData("Username", message.userName),
    createData("Isi Pesan", message.message),
    createData(
      "Lampiran Pesan", 
      message.media ?
      <>
        <IconButton
          color={getButtonColor(message.media)}
          aria-label="file icon"
        >
          {getIcon(message.media)}
        </IconButton>
        <a href={`${imageUrl}${message.phoneNumber}_${message.userName}/${message.date}/${message.media}`} target="_blank" rel="noopener noreferrer">
        {message.media}
        </a> 
      </> : "Tidak ada lampiran"
    ),
    createData("PIC yang menangani", message.pic),
    createData("No. PIC", message.no_pic),
    createData("Pesan Balasan", message.reply_message),
  ];

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: "1", p: "3" }}>
          <div className="message-container-message">
            <div className="message-card-message">
              <div  style={{ display: "flex" , justifyContent: "space-between" }}>
                <div className="message-title-message">
                  Detail Aduan #{message.id}
                </div>
                <div>
                  <IconButton aria-label="delete" onClick={handleGoBack}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableBody>
                    {rows.map((row) => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell
                          component="tb"
                          scope="row"
                          sx={{
                            borderRight: "1px solid #dee2e6",
                            fontWeight: "bold",
                          }}
                        >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.content}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {message.status === "pending" && (
                <div>
                  <p>Pilih PIC</p>
                  <div style={{ display: "flex" }}>
                    <PICselect onSelectPIC={handleSelectPIC} />
                    <div style={{ marginTop: "3vh", marginLeft: "12vw" }}>
                      <Button
                        variant="contained"
                        endIcon={<PersonAddAltIcon />}
                        onClick={() => navigate("/add-contact")}
                      >
                        Tambah
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {message.status === "process" && (
                <div>
                  <div>
                    <p>Balasan dari PIC</p>
                      <TextField
                        id="outlined-read-only-input"
                        multiline
                        defaultValue= {message.reply_pic}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{ width: "500px", marginLeft: "6px" }}
                      />
                  </div>
                  <div>
                    <p>Balasan ke Pengirim</p>
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Balas ke Pengirim"
                      multiline
                      required
                      sx={{ width: "500px", marginLeft: "6px" }}
                      onChange={handleReplyChange}
                    />
                  </div>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "end" }}>
                <div className="button-kembali">
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBack}
                  >
                    Kembali
                  </Button>
                </div>
                {message.status !== "done" && message.status !== "process" && (
                  <div className="button-simpan">
                    <Button
                      variant="contained"
                      endIcon={<CheckCircleOutlineIcon />}
                      onClick={handleClick}
                    >
                      Simpan
                    </Button>
                    <Snackbar
                      open={open}
                      autoHideDuration={3000}
                      onClose={handleClose}
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                      <Alert
                        onClose={handleClose}
                        severity="success"
                        sx={{ width: "100%" }}
                      >
                        Pesan Aduan berhasil dikirim ke PIC — Aduan sedang
                        diproses!
                      </Alert>
                    </Snackbar>
                  </div>
                )}
                {message.status === "process" && (
                  <div className="button-simpan">
                    <Button
                      variant="contained"
                      endIcon={<CheckCircleOutlineIcon />}
                      onClick={handleClickReply}
                    >
                      Simpan
                    </Button>
                    <Snackbar
                      open={open}
                      autoHideDuration={3000}
                      onClose={handleClose}
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                      <Alert
                        onClose={handleClose}
                        severity="success"
                        sx={{ width: "100%" }}
                      >
                        Pesan Balasan sudah dikirim — Aduan Selesai!
                      </Alert>
                    </Snackbar>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Box>
      </Box>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handlePICCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handlePICCloseAlert}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Harap menunggu balasan dari PIC sebelum menyelesaikan aduan!
        </Alert>
      </Snackbar>
      <Snackbar
        open={alert2Open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Harus mengisi balasan ke pengirim sebelum menyelesaikan aduan!
        </Alert>
      </Snackbar>
    </>
  );
};

export default MessageDetail;