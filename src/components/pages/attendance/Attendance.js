import "./attendance.css"
import * as React from 'react';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import axios from "axios";
import { Inventory, AssignmentInd, AlignHorizontalCenter} from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker, Popup } from "react-leaflet"
import {Icon} from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"




 

    
  

export default function Attendance(){

  const [userData, setUserData] = React.useState([]);  

    const body = {test: "test"};
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);  
    const [latitude , setLatitude] = React.useState();
    const [longitude, setLongitude] = React.useState();
    const [city, setCity] = React.useState();
    const [street, setStreet] = React.useState();

    const columns = [
      { field: 'count', headerName: '#', width: 100 },
      {
        field: 'email',
        headerName: 'Email',
        width: 250,
      },
      { field: 'time_in', headerName: 'Time In', width: 175},
      { field: 'time_in_loc', 
      headerName: 'Time In Location', 
      width: 175,
      sortable: false,
      disableClickEventBubbling: true,
      
      renderCell: (params) => {
          const onClick = async (e) => {
            const currentRow = params.row;

            const userLatitude = await currentRow.time_in_coordinates.latitude;
            const userLongitude = await currentRow.time_in_coordinates.longitude;
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`;
            fetch(url)
            .then( res => res.json())
            .then(data=>{
              console.log(data)
              setCity(data.address.city)
              setStreet(data.address.road)
              setLatitude(userLatitude);
              setLongitude(userLongitude);
              handleOpen()
            }
              )

            return
          };
          const check = params.row.time_out;
          return (
            <>
           {check === "no record" ? 

        
            
           "no record"

           

           :

            <Stack style={{marginTop:10}}>
            
              <Button variant="contained" color="warning" size="small" onClick={() => {onClick();  }}>View</Button>
          
            </Stack>
          

          }
          </>
          );
        }
      },
      { field: 'time_in_coordinates', headerName: 'Time In Location', width: 175 },
      { field: 'time_out_coordinates', headerName: 'Time out Location', width: 175 },
      { field: 'time_out', headerName: 'Time Out', width: 175 },
      {
        field: 'time_out_loc',
        headerName: 'Time out Location',
        width: 175  ,
        sortable: false,
        disableClickEventBubbling: true,
      
        renderCell: (params) => {
          const onClick = async (e) => {
            const currentRow = params.row;

            const userLatitude = await currentRow.time_out_coordinates.latitude;
            const userLongitude = await currentRow.time_out_coordinates.longitude;
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`;
            fetch(url)
            .then( res => res.json())
            .then(data=>{
              console.log(data)
              setCity(data.address.city)
              setStreet(data.address.road)
              setLatitude(userLatitude);
              setLongitude(userLongitude);
              handleOpen()
            }
              )

            return
          };
          const check = params.row.time_out;
          return (
            <>
            {check !== "no record" ? 

            <Stack style={{marginTop:10}}>
            
              <Button variant="contained" color="warning" size="small" onClick={() => {onClick() }}>View</Button>
          
           </Stack>
           :
           <Stack style={{marginBottom:100}}>
            no record
           </Stack>

            }
          </>
          );
      },
    },
    {
      field: 'action',
      headerName: 'History',
      width: 175,
      sortable: false,
      disableClickEventBubbling: true,
      
      renderCell: (params) => {
          const onClick = (e) => {
            const currentRow = params.row;
            return alert(JSON.stringify(currentRow, null, 4));
          };
          
          return (
         
           <Stack>
              <Link to={"/view-attendance"}
                state={{ state : params.row.email }}
                style={{textDecoration:"none"}}
              >
              <Button variant="contained" color="warning" size="small" >Select</Button>
              </Link>
           </Stack>
         
          );
      }
    },

    ];

    async function getUser(){
      await  axios
        .post('http://192.168.50.139:8082/retrieve-user-attendance-today', body)
        .then(async response=> {
          const data = await response.data.data;

          console.log(data)

          const newData = data.map((data, key) => {
            
            return {
               count : key + 1,
               time_in: data.timeIn,
               time_out: data.timeOut? data.timeOut: "no record",
               time_in_coordinates: data.timeInCoordinates,
               time_out_coordinates: data.timeOutCoordinates,
               email: data.user
              
            };
           }
          );
          console.log(newData, "testing par");
          setUserData(newData);


        });

    }



    
    React.useEffect(() => {
        getUser();
      
    }, []);



    return(
        <div className="attendance">
  
        <div style={{ height: '100%', width : '100%', marginLeft: '100'}}>
        <DataGrid
          rows={userData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                time_in_coordinates: false,
                time_out_coordinates: false   
               
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
            
              showQuickFilter: true,
            },
          }}
          loading={!userData.length}  
          disableDen
          sitySelector
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          disableDensitySelector
          pageSizeOptions={[5, 10]}
          getRowId={(row) =>  row.count}

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
            <MapContainer center={[latitude, longitude]} zoom={17} scrollWheelZoom={false}  style={{ height: "100%", minHeight: '100%' }}>
            <TileLayer
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
            <Popup>
            {city}, <br /> {street}
            </Popup>
            </Marker>
           </MapContainer>

          </div>
             
         </Box>
        </Modal>

      </div>
          
    );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};