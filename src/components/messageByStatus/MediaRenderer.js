import React from "react";
import IconButton from "@mui/material/IconButton";
import LaunchIcon from "@mui/icons-material/Launch";
import { Tooltip } from "@mui/material";

const MediaRenderer = (props) => {
  const { value, data } = props;
  const baseUrl = "http://localhost:5000/images/";
  const mediaUrl = `${baseUrl}${data.phoneNumber}_${data.userName}/${data.date}/${value}`;

  if (!value) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <a
        href={mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginRight: 8,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "200px",
          display: "block",
        }}
      >
        {value}
      </a>
      <Tooltip title="Open URL">
        <IconButton
          href={mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
        >
          <LaunchIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default MediaRenderer;
