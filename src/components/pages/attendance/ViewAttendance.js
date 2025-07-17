import "./attendance.css";
import  React, {useEffect, useState}  from "react";
import { useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import RoomIcon from '@mui/icons-material/Room';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageViewer from 'react-simple-image-viewer';

export default function ViewAttendance() {
  const [userData, setUserData] = React.useState([]);
  const location = useLocation();
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const [open, setOpen] = React.useState(false);
  const [latitude, setLatitude] = React.useState();
  const [longitude, setLongitude] = React.useState();
  const [city, setCity] = React.useState();
  const [street, setStreet] = React.useState();
  const [isProofViewerOpen, setIsProofViewerOpen] = useState(false);
  const [proofItemData, setProofItemData] = useState([]);

  const handleOpenProof = (imgArr) => {
    

    setProofItemData(imgArr)
    setIsProofViewerOpen(true)

  }

  const closeImageViewer = () => {
    setIsProofViewerOpen(false);
  };

  const userEmail = location.state.state;

  const columns = [
    { field: "count", headerName: "#", width: 75, type: "number" },
    { field: "date", headerName: "Date", width: 225 },
    { field: "time_in", headerName: "Time In", width: 110 },
    {
      field: "time_in_loc",
      headerName: "",
      width: 110,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const onClick = async (e) => {
          const currentRow = params.row;

          const userLatitude = await currentRow.time_in_coordinates.latitude;
          const userLongitude = await currentRow.time_in_coordinates.longitude;
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`;
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              setCity(data.address.city);
              setStreet(data.address.road);
              setLatitude(userLatitude);
              setLongitude(userLongitude);
              handleOpen();
            });

          return;
        };

        return (
          <>
            <Stack style={{ marginTop: 10,alignItems:'center' }}>
              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={() => {
                  onClick();
                }}
              >
                 <RoomIcon/>
              </Button>
            </Stack>
          </>
        );
      },
    },
    { field: 'proof', headerName: 'Proof', width: 175 },
    {
      field: "time_in_coordinates",
      headerName: "Time In Location",
      width: 225,
    },
    {
      field: "time_out_coordinates",
      headerName: "Time out Location",
      width: 225,
    },
    { field: "time_out", headerName: "Time Out", width: 110 },
    {
      field: "time_out_loc",
      headerName: "",
      width: 150,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const onClick = async (e) => {
          const currentRow = params.row;

          const userLatitude = await currentRow.time_out_coordinates.latitude;
          const userLongitude = await currentRow.time_out_coordinates.longitude;
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`;
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              setCity(data.address.city);
              setStreet(data.address.road);
              setLatitude(userLatitude);
              setLongitude(userLongitude);
              handleOpen();
            });

          return;
        };
        const checkTimeout = params.row.time_out;
        const checkTimeoutLoc = params.row.time_out_loc;
        return (
          <>
            {(checkTimeout !== "no record" && checkTimeout !== "no record") ? (
              <Stack style={{ marginTop: 10, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={() => {
                    onClick();
                  }}
                >
                <RoomIcon/>
                </Button>
              </Stack>
            ) : (
              <Stack style={{ marginBottom: 100,alignItems: 'center' }}>-</Stack>
            )
            }
          </>
        );
      },
    },
    {
      field: "proof_img",
      headerName: "Proof",
      width: 120,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
       
        const currentRow = params.row;
        const check = params.row.proof;
       
        const viewProofImg = (e) => {
          const imgArr = [currentRow.proof]

          handleOpenProof(imgArr);
        };

      
        return (
      
          <>
          {check !== "no record" ? (
            <Stack style={{ marginTop: 10, alignItems: 'center' }}
             direction="row"
             spacing={1}>
              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={() => {
                  viewProofImg();
                }}
              >
                <DescriptionIcon/>
              </Button>
            </Stack>
          ) : (
            <Stack style={{ marginBottom: 100, alignItems: 'center' }}>-</Stack>
          )}
        </>
        );
      },
    },
  ];



  async function getUser() {
    const body = { user: userEmail };
    console.log(userEmail, "test email");

    await axios
      .post("http://54.255.154.99:8082/view-user-attendance", body)
      .then(async (response) => {
        const data = await response.data.data;
        
        const newData = data.map((data, key) => {
          return {
            count: key + 1,
            date: data.date,
            time_in: data.time_in,
            time_in_coordinates: data.time_in_coordinates,
            time_in_loc: data.time_in_coordinates? data.time_in_coordinates.latitude ? data.time_in_coordinates.latitude : "no record" : "no record",
            time_out: data.time_out ? data.time_out : "no record",
            time_out_coordinates: data.time_out_coordinates,
            time_out_loc: data.time_out_coordinates ? data.time_out_coordinates.latitude ? data.time_out_coordinates.latitude : "no record" : "no record",
            proof: data.assigned_parcel_screenshot? data.assigned_parcel_screenshot : "no record",
            action: data.time_out ? data.time_out : "no record",
          };
        });

        setUserData(newData);
      });
  }

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="attendance">
      <Topbar />
      <div className="container">
        <Sidebar />
        {isProofViewerOpen && (
          <div className="img-viewer">
        <ImageViewer
          src={ proofItemData }
          currentIndex={0}
          disableScroll={ true }
          closeOnClickOutside={ true }
          onClose={ closeImageViewer }
        />
        </div>
      )}
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={userData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
              columns: {
                columnVisibilityModel: {
              
                  time_in_coordinates: false,
                  time_out_coordinates: false,
                  proof:false
                },
              },
            }}
            pageSizeOptions={[5, 10]}
            getRowId={(row) => row.count}
            loading={!userData.length}
          />
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="leaflet-container">
              <MapContainer
                center={[latitude, longitude]}
                zoom={17}
                scrollWheelZoom={false}
                style={{ height: "100%", minHeight: "100%" }}
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
                  <Popup>
                    {city}, <br /> {street}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
