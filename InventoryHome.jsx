import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import QRCode from "react-qr-code";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Checkbox,
  Button,
} from "@mui/material";

const rows = [
  { id: 1, name: "John Doe", status: "Filled", quantity: "100" },
  { id: 2, name: "Jane Smith", status: "Open", quantity: "250" },
  {
    id: 3,
    name: "Michael Johnson",
    status: "Partially Filled",
    quantity: "400",
  },
  { id: 4, name: "Emily Davis", status: "Rejected", quantity: "50" },
];

const columns = [
  { field: "id", headerName: "ID" },
  { field: "name", headerName: "Name" },
  { field: "status", headerName: "Status" },
  { field: "quantity", headerName: "Quantity" },
];

const predefinedFilters = [
  { label: "All", filterFn: () => true },
  { label: "Filled", filterFn: (row) => row.status === "Filled" },
  { label: "Open", filterFn: (row) => row.status === "Open" },
  { label: "Rejected", filterFn: (row) => row.status === "Rejected" },
  {
    label: "Partially Filled",
    filterFn: (row) => row.status === "Partially Filled",
  },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SimpleTable() {
  const [filteredRows, setFilteredRows] = React.useState(rows);
  const [selectedFilter, setSelectedFilter] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheckboxChange = (event, rowId) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, rowId]);
    } else {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((id) => id !== rowId)
      );
    }
  };

  const handleFilterChange = (filterFn, label) => {
    setSelectedFilter(label);
    setFilteredRows(rows.filter(filterFn));
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredRows(
      rows.filter((row) =>
        columns.some((col) =>
          row[col.field].toString().toLowerCase().includes(query)
        )
      )
    );
  };

  const generateQRCodeValue = () => {
    const selectedData = rows.filter(row => selectedRows.includes(row.id));
    const billDetails = encodeURIComponent(JSON.stringify(selectedData));
    const paymentUrl = `https://paymentgateway.com/pay?billDetails=${billDetails}`;
    return paymentUrl;
  };

  return (
    <div style={{ overflow: "hidden", textAlign: "end" }}>
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <FormControl sx={{ width: "7%", mt: 3 }}>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedFilter}
            label="Filter"
            sx={{ color: "black" }}
          >
            {predefinedFilters.map(({ label, filterFn }) => (
              <MenuItem
                key={label}
                value={label}
                onClick={() => handleFilterChange(filterFn, label)}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: "50%", height: "24px", mt: 3 }}
        />
        <Button
          variant="contained"
          sx={{
            fontSize: "1.4rem",
            fontWeight: "650",
            fontFamily: "Nova Square",
            width: "auto",
            height: "10%",
            mt: 3,
          }}
        >
          Print
        </Button>
      </Box>

      <Box sx={{ overflowX: "auto", display: "flex", flexDirection: "column" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < filteredRows.length
                    }
                    checked={selectedRows.length === filteredRows.length}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedRows(filteredRows.map((row) => row.id));
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                  />
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col.field}>{col.headerName}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onChange={(event) => handleCheckboxChange(event, row.id)}
                    />
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.field}>{row[col.field]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Button
        variant="contained"
        sx={{ textAlign: "end", margin: "10px auto" }}
        onClick={handleOpen}
      >
        Bill
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div
              style={{
                height: "auto",
                margin: "0 auto",
                maxWidth: "100%",
                width: "100%",
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={generateQRCodeValue()}
                viewBox={`0 0 256 256`}
              />
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
