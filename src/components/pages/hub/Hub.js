import "./hub.css";
import { React, useState, useEffect, Component } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbar,
} from "@mui/x-data-grid";
import axios, { isAxiosError } from "axios";
import { AddBox } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDemoData } from "@mui/x-data-grid-generator";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const viewStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Hub() {
  const [userData, setUserData] = useState([]);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [viewLatitude, setViewLatitude] = useState("");
  const [viewLongitude, setViewLongitude] = useState("");
  const [address, setAddress] = useState();
  const [hubName, setHubName] = useState();
  const [region, setRegion] = useState("");

  const [editId, setEditId] = useState("");
  const [editLatitude, setEditLatitude] = useState(0);
  const [editLongitude, setEditLongitude] = useState(0);
  const [editAddress, setEditAddress] = useState();
  const [editHubName, setEditHubName] = useState();
  const [editRegion, setEditRegion] = useState("");

  const [updateStatus, setUpdateStatus] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const [hubId, setHubId] = useState("");

  const requestBody = { isActivate: updateStatus, id: hubId };

  const [openDialog, setOpenDialog] = useState(false);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleOpenEditModal = () => {
    console.log(editHubName);
    setOpenEditModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };

  const handleOpenViewModal = () => {
    setOpenViewModal(true);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (event) => {
    setRegion(event.target.value);
  };

  const handleChangeEditRegion = (event) => {
    setEditRegion(event.target.value);
  };

  const LocationFinderDummy = () => {
    const map = useMapEvents({
      click(e) {
        console.log(e.latlng);
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });
    return null;
  };

  const LocationFinderEdit = () => {
    const map = useMapEvents({
      click(e) {
        console.log(e.latlng);
        setEditLatitude(e.latlng.lat);
        setEditLongitude(e.latlng.lng);
      },
    });
    return null;
  };

  const columns = [
    { field: "count", headerName: "#", width: 125 },
    { field: "id", headerName: "ID", width: 150 },
    { field: "hub_name", headerName: "Hub ", width: 300 },
    { field: "address", headerName: "Address", width: 500 },
    { field: "region", headerName: "Region", width: 500 },
    { field: "coordinates", headerName: "Coordinate", width: 450 },
    {
      field: "isActive",
      headerName: "Status",
      width: 180,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const status = params.row.isActive;
        const rowId = params.row.id;
        const onClick = (e) => {
          {
            status ? setUpdateStatus(false) : setUpdateStatus(true);
          }
          setHubId(rowId);
          handleOpenDialog();
        };

        return (
          <>
            {status ? (
              <Stack>
                <ColorButton
                  variant="contained"
                  size="small"
                  style={{ width: "50%", marginTop: "13px" }}
                  onClick={onClick}
                >
                  Active
                </ColorButton>
              </Stack>
            ) : (
              <Stack>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ width: "50%", marginTop: "13px" }}
                  onClick={onClick}
                >
                  Inactive
                </Button>
              </Stack>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const rowValue = params.row;
        const eCoordinatesLatitude = rowValue.coordinates.latitude;
        const eCoordinatesLongitude = rowValue.coordinates.longitude;
        const eHubName = rowValue.hub_name;
        const eAddress = rowValue.address;
        const eRegion = rowValue.region;
        const eId = rowValue.id;
        const onClickEdit = (e) => {
          setEditId(eId);
          setEditLatitude(eCoordinatesLatitude);
          setEditLongitude(eCoordinatesLongitude);
          setEditHubName(eHubName);
          setEditAddress(eAddress);
          setEditRegion(eRegion);
          handleOpenEditModal();
        };
        const onClickView = (e) => {
          setViewLatitude(eCoordinatesLatitude);
          setViewLongitude(eCoordinatesLongitude);
          handleOpenViewModal();
        };
        return (
          <>
            <Stack direction="row" spacing={2}>
              <Button
                color="info"
                variant="contained"
                size="small"
                style={{ width: "100%", marginTop: "13px" }}
                onClick={onClickView}
              >
                View
              </Button>
              <Button
                color="info"
                variant="contained"
                size="small"
                style={{ width: "100%", marginTop: "13px" }}
                onClick={onClickEdit}
              >
                Edit
              </Button>
            </Stack>
          </>
        );
      },
    },
  ];

  async function getHub() {
    await axios
      .post("https://api-rma.bmphrc.com/fetch-hub")
      .then(async (response) => {
        const data = await response.data.data;

        console.log(response.data.data);

        const newData = data.map((data, key) => {
          return {
            count: key + 1,
            id: data._id,
            hub_name: data.hub_name,
            isActive: data.isActive,
            coordinates: data.coordinates,
            address: data.address,
            region: data.region,
          };
        });
        console.log(newData, "testing par");
        setUserData(newData);
      });
  }

  async function setStatus() {
    await axios
      .put("https://api-rma.bmphrc.com/update-hub-status", requestBody)
      .then(async (response) => {
        const data = await response.data.data;

        console.log(data);
        window.location.reload();
      });
  }

  async function createHub() {
    const hubData = {
      hub_name: hubName,
      region: region,
      address: address,
      coordinates: {
        latitude: latitude,
        longitude: longitude,
      },
    };

    await axios
      .post("https://api-rma.bmphrc.com/create-hub", hubData)
      .then(async (response) => {
        const date = await response.data;
        console.log("success");
      });
    window.location.reload();
  }

  async function editHub() {
    const hubData = {
      id: editId,
      hub_name: editHubName,
      region: editRegion,
      address: editAddress,
      coordinates: {
        latitude: editLatitude,
        longitude: editLongitude,
      },
    };

    await axios
      .post("https://api-rma.bmphrc.com/edit-hub", hubData)
      .then(async (response) => {
        const date = await response.data;
        console.log("success");
      });
    window.location.reload();
  }

  useEffect(() => {
    getHub();
  }, []);

  return (
    <div className="hub">
      <Topbar />
      <div className="container">
        <Sidebar />

        <div style={{ height: "100%", width: "100%", marginLeft: "100" }}>
          <div style={{ margin: 10 }}>
            <Button
              onClick={handleOpen}
              variant="contained"
              endIcon={<AddBox />}
            >
              Add Hub
            </Button>
          </div>

          <DataGrid
            rows={userData}
            sx={{ overflowX: "scroll" }}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              columns: {
                columnVisibilityModel: {
                  id: false,
                  coordinates: false,
                  region: false,
                },
              },
            }}
            // slots={{
            //   toolbar: CustomToolbar,
            //   // loadingOverlay: LinearProgress,
            // }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            loading={!userData.length}
            disableDensitySelector
            disableColumnFilter
            disableColumnSelector
            pageSizeOptions={[5, 10]}
            getRowId={(row) => row.count}
            disableRowSelectionOnClick
          />
        </div>

        <Modal
          open={openModal}
          onClose={handleCloseDialog}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                Hub Details : 
                 <HighlightOffIcon/>
                {test}
              </Typography> */}
            {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}

            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-amount">Name</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                label="Amount"
                onChange={(evt) => {
                  setHubName(evt.target.value);
                }}
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
              <TextField
                label="Address"
                multiline
                rows={3}
                onChange={(evt) => {
                  setAddress(evt.target.value);
                }}
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Region
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={region}
                label="Region"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em style={{ color: "gray" }}>None</em>
                </MenuItem>
                <MenuItem value={"NCR"}>NCR</MenuItem>
                <MenuItem value={"CAR"}>CAR</MenuItem>
                <MenuItem value={"Region I"}>Region I</MenuItem>
                <MenuItem value={"Region II"}>Region II</MenuItem>
                <MenuItem value={"Region III"}>Region III</MenuItem>
                <MenuItem value={"Region IV"}>Region IV</MenuItem>
                <MenuItem value={"Region V"}>Region V</MenuItem>
                <MenuItem value={"Region VI"}>Region VI</MenuItem>
                <MenuItem value={"Region VII"}>Region VII</MenuItem>
                <MenuItem value={"Region III"}>Region VIII</MenuItem>
                <MenuItem value={"Region IX"}>Region IX</MenuItem>
                <MenuItem value={"Region X"}>Region X</MenuItem>
                <MenuItem value={"Region XI"}>Region XI</MenuItem>
                <MenuItem value={"Region XII"}>Region XII</MenuItem>
                <MenuItem value={"Region III"}>Region XIII</MenuItem>
                <MenuItem value={"BARMM"}>BARMM</MenuItem>
              </Select>
            </FormControl>

            <div style={{ height: "50%", width: "100%", margin: 9 }}>
              <div className="leaflet-container">
                <MapContainer
                  center={[14.6091, 121.0223]}
                  zoom={11}
                  scrollWheelZoom={false}
                  style={{ height: "100%", minHeight: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[latitude, longitude]}
                    icon={
                      new Icon({
                        iconUrl: markerIconPng,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                  >
                    {/* <Popup>
            {city}, <br /> {street}
            </Popup> */}
                    <LocationFinderDummy />
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* </Typography> */}

            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
              <Button onClick={createHub} autoFocus>
                Save
              </Button>
            </DialogActions>
          </Box>
        </Modal>

        <Modal
          open={openViewModal}
          onClose={handleCloseViewModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={viewStyle}>
            <div style={{ height: "90%", width: "100%", margin: 9 }}>
              <div className="leaflet-container">
                <MapContainer
                  center={[viewLatitude, viewLongitude]}
                  zoom={11}
                  scrollWheelZoom={false}
                  style={{ height: "100%", minHeight: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[viewLatitude, viewLongitude]}
                    icon={
                      new Icon({
                        iconUrl: markerIconPng,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                  >
                    {/* <Popup>
            {city}, <br /> {street}
            </Popup> */}
                    <LocationFinderDummy />
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* </Typography> */}

            <DialogActions>
              <Button onClick={handleCloseViewModal}>Close</Button>
            </DialogActions>
          </Box>
        </Modal>

        <Modal
          open={openEditModal}
          onClose={handleCloseEditModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-amount">Name</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                label="Amount"
                value={editHubName}
                onChange={(evt) => {
                  setEditHubName(evt.target.value);
                }}
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
              <TextField
                label="Address"
                multiline
                rows={3}
                value={editAddress}
                onChange={(evt) => {
                  setEditAddress(evt.target.value);
                }}
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Region
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={editRegion}
                label="Region"
                onChange={handleChangeEditRegion}
              >
                <MenuItem value="">
                  <em style={{ color: "gray" }}>None</em>
                </MenuItem>
                <MenuItem value={"NCR"}>NCR</MenuItem>
                <MenuItem value={"CAR"}>CAR</MenuItem>
                <MenuItem value={"Region I"}>Region I</MenuItem>
                <MenuItem value={"Region II"}>Region II</MenuItem>
                <MenuItem value={"Region III"}>Region III</MenuItem>
                <MenuItem value={"Region IV"}>Region IV</MenuItem>
                <MenuItem value={"Region V"}>Region V</MenuItem>
                <MenuItem value={"Region VI"}>Region VI</MenuItem>
                <MenuItem value={"Region VII"}>Region VII</MenuItem>
                <MenuItem value={"Region III"}>Region VIII</MenuItem>
                <MenuItem value={"Region IX"}>Region IX</MenuItem>
                <MenuItem value={"Region X"}>Region X</MenuItem>
                <MenuItem value={"Region XI"}>Region XI</MenuItem>
                <MenuItem value={"Region XII"}>Region XII</MenuItem>
                <MenuItem value={"Region III"}>Region XIII</MenuItem>
                <MenuItem value={"BARMM"}>BARMM</MenuItem>
              </Select>
            </FormControl>

            <div style={{ height: "50%", width: "100%", margin: 9 }}>
              <div className="leaflet-container">
                <MapContainer
                  center={[editLatitude, editLongitude]}
                  zoom={11}
                  scrollWheelZoom={false}
                  style={{ height: "100%", minHeight: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[editLatitude, editLongitude]}
                    icon={
                      new Icon({
                        iconUrl: markerIconPng,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                  >
                    {/* <Popup>
            {city}, <br /> {street}
            </Popup> */}
                    <LocationFinderEdit />
                  </Marker>
                </MapContainer>
              </div>
            </div>

            <DialogActions>
              <Button onClick={handleCloseEditModal}>Close</Button>
              <Button onClick={editHub} autoFocus>
                Save
              </Button>
            </DialogActions>
          </Box>
        </Modal>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Account Activation"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {updateStatus
                ? "Are you sure you want to set this hub as active?"
                : "Are you sure you want to set this hub as inactive?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={setStatus} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

const ColorButton = styled(Button)(({ theme }) => ({
  color: "#000",
  backgroundColor: "#F6FAB9",
  "&:hover": {
    backgroundColor: "#CAE6B2",
  },
}));

const EditButton = styled(Button)(({ theme }) => ({
  color: "#000",
  backgroundColor: "#e8f5e9",
  "&:hover": {
    backgroundColor: "#a5d6a7",
  },
}));
