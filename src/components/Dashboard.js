import React, { useState, useEffect } from "react";
import "./styling/Dashboard.css";
import Chart from "./small-components/Chart";
import { Box } from "@mui/material";
import Sidenav from "./Sidenav";
import UpcomingIcon from '@mui/icons-material/Upcoming';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import LanguageIcon from '@mui/icons-material/Language';
import { fetchMessages } from "../services/api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import DateRange from "./small-components/DateRange";


const colors = {
  masuk: '#ffe2e6',
  diproses: '#fff4de',
  selesai: '#dcfce7',
  total: '#f4e8ff',
  alltotal:'#e8f6ff',
};

const bgcolors = {
  masuk: '#FA5A7E',
  diproses: '#FF947A',
  selesai: '#3CD856',
  total: '#BF83FD',
  alltotal: '#83c0fd'
};

const Dashboard = () => {
  const [messageCounts, setMessageCounts] = useState({
    masuk: 0,
    diproses: 0,
    selesai: 0,
    total: 0
  });
  // const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);
  const [dateRange, setDateRange] = useState([moment().subtract(1, 'weeks'), moment()]);
  // const [dateRange, setDateRange] = useState([
  //   moment().subtract(1, 'months').startOf('month'), 
  //   moment().endOf('month')
  // ]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchMessages();
        const messages = response.data;
        const filteredMessages = messages.filter(msg => {
          const msgDate = moment(msg.date);
          return msgDate.isBetween(dateRange[0], dateRange[1], null, '[]');
        });

        const counts = {
          masuk: filteredMessages.filter(msg => msg.status === 'pending').length,
          diproses: filteredMessages.filter(msg => msg.status === 'process').length,
          selesai: filteredMessages.filter(msg => msg.status === 'done').length,
          total: filteredMessages.length,
          alltotal: messages.length
        };

        setMessageCounts(counts);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getData();
  }, [dateRange]);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: "1", p: "3" }}>
          <div style={{ marginTop: "11vh" }}>
            <div className="dashboard-card" style={{ margin: "7vh 2vw 3vh 2vw" }}>
              <h3 style={{ marginLeft: "5vh", marginBottom: "0vh" }}>Aduan Hari ini</h3>
              <div style={{ display: "flex", justifyContent: "space-around", padding: "2vh" }}>
                <div className="aduan-card" style={{ backgroundColor: colors.masuk }} onClick={() => navigate('/pending-messages')}>
                  <div className="icon-wrapper" style={{ backgroundColor: bgcolors.masuk }}>
                    <UpcomingIcon sx={{fontSize : "16px"}} />
                  </div>
                  <h2>{messageCounts.masuk}</h2>
                  <p>Aduan Masuk</p>
                </div>
                <div className="aduan-card" style={{ backgroundColor: colors.diproses }} onClick={() => navigate('/processing-messages')}>
                  <div className="icon-wrapper" style={{ backgroundColor: bgcolors.diproses }}>
                    <HourglassBottomIcon sx={{fontSize : "16px"}} />
                  </div>
                  <h2>{messageCounts.diproses}</h2>
                  <p>Aduan Diproses</p>
                </div>
                <div className="aduan-card" style={{ backgroundColor: colors.selesai }} onClick={() => navigate('/done-messages')}>
                  <div className="icon-wrapper" style={{ backgroundColor: bgcolors.selesai }}>
                    <MarkEmailReadIcon sx={{fontSize : "16px"}} />
                  </div>
                  <h2>{messageCounts.selesai}</h2>
                  <p>Aduan Selesai</p>
                </div>
                <div className="aduan-card" style={{ backgroundColor: colors.total }} onClick={() => navigate('/done-messages')}>
                  <div className="icon-wrapper" style={{ backgroundColor: bgcolors.total }}>
                    <PlaylistAddCheckCircleIcon sx={{fontSize : "16px"}} />
                  </div>
                  <h2>{messageCounts.total}</h2>
                  <p>Total Aduan Minggu Ini</p>
                </div>
                <div className="aduan-card" style={{ backgroundColor: colors.alltotal }} onClick={() => navigate('/done-messages')}>
                  <div className="icon-wrapper" style={{ backgroundColor: bgcolors.alltotal }}>
                    <LanguageIcon sx={{fontSize : "16px"}} />
                  </div>
                  <h2>{messageCounts.alltotal || '0'}</h2>
                  <p>Total Semua Aduan</p>
                </div>
              </div>
            </div>
            <div className="canvasChart">
              <div style={{display:'flex', justifyContent:'space-between'}}>
              <h3 style={{ marginTop: "4vh", marginBottom: "-2vh" }}>Data Total Aduan</h3>
              <DateRange onChange={handleDateRangeChange} />
              </div>
              <Chart dateRange={dateRange}/>
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
