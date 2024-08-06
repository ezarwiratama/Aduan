import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Person2Icon from "@mui/icons-material/Person2";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { fetchMessages } from "../services/api";
import io from "socket.io-client";
import Sidenav from "./Sidenav";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import moment from "moment";

const socket = io.connect("http://localhost:5000");

const MessageList = ({ status }) => {
  const [messages, setMessages] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetchMessages();
        const sortedMessages = response.data.sort((a, b) => new Date(b.id) - new Date(a.id));
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    getMessages();

    socket.on("receive_message", (data) => {
      console.log("Received data:", data);
      setMessages((prevMessages) => {
        const updatedMessages = [data, ...prevMessages];
        const sortedUpdatedMessages = updatedMessages.sort((a, b) => new Date(b.id) - new Date(a.id));
        return sortedUpdatedMessages;
      });
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    // Retrieve and display Snackbar message from local storage
    const message = localStorage.getItem('snackbarMessage');
    if (message) {
      setSnackbarMessage(message);
      setOpenSnackbar(true);
      localStorage.removeItem('snackbarMessage');
    }
  }, []);

  const handleCardClick = (id) => {
    navigate(`/message-detail/${id}`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + " (...)" : text;
  }

  const filteredMessages = messages.filter(
    (message) => message.status === status
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: "1", p: "3" }}>
          <div style={{ marginTop: "9vh", padding: "3vh 2vw 0vh 2vw" }}>
            <div className="message-container">
              {filteredMessages.length === 0 ? (
                <Typography
                  variant="h7"
                  align="center"
                  sx={{ marginTop: "40vh", color: "#bfbfbf" }}
                >
                  Tidak Ada Aduan
                </Typography>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className="message-card"
                    onClick={() => handleCardClick(message.id)}
                  >
                    <h3 className="message-title">
                      Aduan No.{message.id} | +{message.phoneNumber} | {message.pic}
                    </h3>
                    <div
                      className="message-content"
                      style={{ display: "flex" }}
                    >
                      <div style={{ marginRight: "5px", display: "flex" }}>
                        <Person2Icon fontSize="Small" sx={{marginTop: "3px", marginRight: "3px"}}/>
                        <div>{message.userName} | </div>
                      </div>
                      <div style={{ margin: 0, display: "flex" }}>
                        <AccessTimeIcon fontSize="Small" sx={{marginTop: "3px", marginRight: "3px"}}/>
                        <div>{moment(message.date).format("DD-MM-YYYY")} {message.hour}</div>
                      </div>
                    </div>
                    <p className="message-content">
                      {truncateText(message.message, 100)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MessageList;
