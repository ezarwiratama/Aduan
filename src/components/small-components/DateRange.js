// src/small-components/DateRangePicker.js
import React, { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField, Button } from '@mui/material';
import moment from 'moment';
import 'moment/locale/en-gb';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import "../styling/DateRange.css";

const DateRange = ({ onChange }) => {
    // const [startDate, setStartDate] = useState(moment().startOf('month'));
    // const [endDate, setEndDate] = useState(moment().endOf('month'));
    // const [startDate, setStartDate] = useState(moment().subtract(1, 'months').startOf('month'));
    // const [endDate, setEndDate] = useState(moment().endOf('month'));
    // Mengatur tanggal default: startDate adalah 2 minggu lalu, endDate adalah hari ini
    const [startDate, setStartDate] = useState(moment().subtract(1, 'weeks'));
    const [endDate, setEndDate] = useState(moment());


    const handleStartDateChange = (newValue) => {
        setStartDate(newValue);
        if (onChange) {
            onChange([newValue, endDate]);
        }
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue);
        if (onChange) {
            onChange([startDate, newValue]);
        }
    };

    const handleSetClick = () => {
        if (onChange) {
            onChange([startDate, endDate]);
            console.log("tgl", startDate.format('DD-MM-YYYY'), endDate.format('DD-MM-YYYY'));
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div style={{ display: 'flex', margin: '4vh 0px -1vh', gap: '1rem' }}>
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    renderInput={(params) => <TextField {...params} />}
                />
                {/* <Button variant="contained" color="primary" onClick={handleSetClick}>
                    Set
                </Button> */}
            </div>
        </LocalizationProvider>
    );
};

export default DateRange;
