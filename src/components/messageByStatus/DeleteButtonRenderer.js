import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { deleteMessage } from "../../services/api";

const DeleteButtonRenderer = (props) => {
  const { api, data } = props;

  const handleDelete = () => {
    if (
      window.confirm(
        `Apakah Anda yakin untuk menghapus pesan dengan ID ${data.id}?`
      )
    ) {
      deleteMessage(data.id)
        .then(() => {
          api.applyTransaction({ remove: [data] }); // Remove the row from the grid
        })
        .catch((error) => console.error("Error deleting message:", error));
    }
  };

  const handleCopyClick = () => {
    const { data } = props;
    const rowData = JSON.stringify(data);
    const tempInput = document.createElement('textarea');
    tempInput.value = rowData;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Row data copied to clipboard!');
  };

  return (
    <>
      <IconButton onClick={handleCopyClick}>
        <ContentCopyIcon/>
      </IconButton>
      <IconButton onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </>
  );
};

export default DeleteButtonRenderer;
