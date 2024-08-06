import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { fetchContacts } from '../../services/api'; // Import fetchContacts from api.js

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 450,
    },
  },
};

const PICselect = ({ onSelectPIC }) => {
  const theme = useTheme();
  const [selectedPIC, setSelectedPIC] = React.useState('');
  const [picOptions, setPicOptions] = React.useState([]);

  useEffect(() => {
    fetchContacts()
      .then((response) => {
        const contacts = response.data;
        const picNames = contacts.map((contact) => ({
          id: contact.id_contact,
          name: contact.name,
          no_handphone: contact.no_handphone,
          bidang: contact.bidang,
        }));
        setPicOptions(picNames);
      })
      .catch((error) => {
        console.error('Error fetching PICs:', error);
      });
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedPIC(value);
    onSelectPIC(value); // Send selected value to parent component
  };

  function getStyles(name, selectedPIC, theme) {
    return {
      fontWeight:
        selectedPIC === name
          ? theme.typography.fontWeightMedium
          : theme.typography.fontWeightRegular,
    };
  }

  return (
    <>
      <FormControl sx={{ m: 1, width: 350, fontSize: '14px' }}>
        <InputLabel id="demo-single-name-label" sx={{ fontSize: '14px', padding: '2px' }}>
          PIC
        </InputLabel>
        <Select
          labelId="demo-single-name-label"
          id="demo-single-name"
          value={selectedPIC} // Menggunakan selectedPIC sebagai nilai
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
          sx={{ fontSize: '14px', minHeight: 'auto', alignItems: 'center', width: '500px' }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {picOptions.map((contact) => (
            <MenuItem
              key={contact.id}
              value={contact} // Menetapkan seluruh objek kontak sebagai nilai
              style={getStyles(contact, selectedPIC, theme)} // Mengirim contact instead of contact.name
              sx={{ fontSize: '14px' }}
            >
              {contact.name} | +{contact.no_handphone} | Bidang {contact.bidang}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default PICselect;
