import React, { useState, useEffect, useMemo, useRef } from "react";
import { fetchMessages } from "../../services/api";
import Sidenav from "../Sidenav";
import "../styling/DoneMessage.css";
import { Box, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import DeleteButtonRenderer from './DeleteButtonRenderer';
import moment from 'moment';
import MediaRenderer from "./MediaRenderer";
import TableChartIcon from '@mui/icons-material/TableChart';

const DoneMessages = () => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetchMessages()
      .then((response) => {
        const doneMessages = response.data.filter(
          (message) => message.status === "done"
        );
        setRowData(doneMessages);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const columnDefs = useMemo(() => [
    { headerName: "No", valueGetter: 'node.rowIndex + 1', width: 70},
    { headerName: "ID", field: "id", sortable: true, filter: true, width: 100, sort: 'desc'},
    { headerName: "Pesan Pengirim", field: "message", filter: true },
    { headerName: "Lampiran Pesan", field: "media", width: 200, cellRenderer: MediaRenderer},
    { headerName: "No. Pengirim", field: "phoneNumber", filter: true },
    { headerName: "Nama Pengirim", field: "userName", filter: true },
    { headerName: "Tanggal", field: "createdAt", sortable: true, filter: true, width: 120},
    { headerName: "Jam", field: "hour", sortable: true, filter: true, width: 100},
    { headerName: "Waktu Aduan Selesai", 
      field: "reply_time", 
      filter: true,
      valueFormatter: (params) => {
        return moment(params.value).format('DD-MM-YYYY HH:mm:ss');
      },
      width: 200
    },
    { headerName: "PIC", field: "pic", sortable: true, filter: true },
    { headerName: "No. PIC", field: "no_pic", filter: true },
    { headerName: "Pesan PIC", field: "reply_pic", filter: true },
    { headerName: "Pesan Balasan", field: "reply_message", filter: true },
    { headerName: "Status", field: "status", width: 100  },
    {
      headerName: "Action",
      field: "actions",
      cellRenderer: DeleteButtonRenderer,
      width: 150
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    width: 170,
    headerClass: 'header-bold',
  }), []);

  const gridApiRef = useRef(null);

  const onGridReady = params => {
    gridApiRef.current = params.api;
  };

  const exportToCsv = () => {
    if (gridApiRef.current) {
      gridApiRef.current.exportDataAsCsv({
        fileName: 'daftar_aduan_selesai.csv',
        allColumns: true,
      });
    } else {
      console.error('Grid API is not available.');
    }
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: "1", p: "3" }}>
          <Button variant="outlined" color="success" onClick={exportToCsv} className="button-excell">
            <TableChartIcon sx={{fontSize:"2.3vh", marginRight:"0.5vw", color: 'green' }}/>
            Export to CSV
          </Button>
          <div className="ag-theme-quartz body-aggrid">
            <AgGridReact
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowData={rowData}
              onGridReady={onGridReady}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </Box>
      </Box>
    </>
  );
};

export default DoneMessages;
