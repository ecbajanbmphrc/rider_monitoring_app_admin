import "./parcel.css"
import * as React from 'react';
import { useLocation } from "react-router-dom";
import { DataGrid} from '@mui/x-data-grid';
import axios from "axios";
import { Button, Stack } from "@mui/material";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import 'leaflet/dist/leaflet.css'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import { Marker, Popup } from "react-leaflet"
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import ImageViewer from 'react-simple-image-viewer';
import { ConstructionOutlined, FileDownload, InsertPhoto, ReceiptLong } from "@mui/icons-material";

  

export default function ViewParcel(){
  
  const [userData, setUserData] = React.useState([]);    
  const location = useLocation();
  const handleClose = () => setOpen(false);  

  const [open, setOpen] = React.useState(false);
  const [parcelItem, setParcelItem] =  React.useState([]);
  const [parcelItemBulk, setParcelItemBulk] = React.useState();
  const [parcelItemNonBulk, setParcelItemNonBulk] = React.useState();
  const [parcelDate, setParcelDate] = React.useState('');
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [itemData, setItemData] = React.useState([]);


  const handleOpen = (imgArr) => {
    setItemData(imgArr)
    setIsViewerOpen(true)
  }

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

 

  const userEmail = location.state.state; 


  const OVERLAY_STYLE = {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0, .8)",
    zIndex: "1000",
    overflowY: "auto"
  };


  const columns = [
    { field: 'count', headerName: '#', width: 150 },
    { field: 'date', headerName: 'Date', width: 225 },
    {
      field: "assigned_non_bulk",
      headerName: "Assigned NB",
      width: 200,
    },
    {
      field: "assigned_bulk",
      headerName: "Assigned B",
      width: 200,
    },
    {
      field: "total_assigned",
      headerName: "Total Assigned",
      width: 200,
   
    },
    {
      field: "delivered_non_bulk",
      headerName: "Delivered NB",
      width: 200,

    },
    {
      field: "delivered_bulk",
      headerName: "Delivered B",
      width: 200,

    },
    {
      field: "total_delivered_parcel",
      headerName: "Total Delivered",
      width: 200,
 
    },
    {
      field: "receipt",
      headerName: "Image",
      width: 200,
   
    },
    {
      field: "screenshot",
      headerName: "Image",
      width: 200, 
    },
    {
      field: "img",
      headerName: "Photo",
      width: 180,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const currentRow = params.row;
        const check = params.row.receipt;
        const viewReceipt = (e) => {
          
          const imgArr = currentRow.receipt
          
          handleOpen(imgArr);
    
        };

        const viewScreenshot = (e) => {
          const imgArr = [currentRow.screenshot]
          console.log(imgArr)

          handleOpen(imgArr);
        };

      
        return (
      
          <>
          {check !== "no record" ? (
            <Stack style={{ marginTop: 10 }}
             direction="row"
             spacing={1}>
              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={() => {
                  viewReceipt();
                }}
              >
                <ReceiptLong/>
              </Button>
              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={() => {
                  viewScreenshot();
                }}
              >
                <InsertPhoto/>
              </Button>

            </Stack>
          ) : (
            <Stack style={{ marginBottom: 100 }}>no record</Stack>
          )}
        </>
        );
      },
    },

  ];


    
   
    async function getUser(){
        const body = {user: userEmail };

        await  axios
          .post('http://192.168.50.139:8082/retrieve-user-parcel-data', body)
          .then(async response=> {
            const data = await response.data.data;

            console.log(data)
  
            const newData = data.map((data, key) => {
              return {
                 count : key + 1,
                 date : data.date,
                 bulk: data.count_bulk,
                 non_bulk : data.count_non_bulk,
                 assigned_parcel: data.assigned_parcel_count,
                 total: data.count_total_parcel,
                 receipt : data.receipt? data.receipt : "no record",
                 screenshot : data.screenshot
             
              };
             }
            );
            console.log(newData, "testing get data");
            setUserData(newData);
  
          });
  
    }


     React.useEffect(() => {
        getUser();
    }, []);

    const items = [
        { id: 1, item: 'Paperclip', quantity: 100},
        { id: 2, item: 'Paper', quantity: 100},
        { id: 3, item: 'Pencil', quantity: 100 },
      ];
      
      const rows = [
        ...parcelItem,
        { id: 'BULK', label: 'Bulk', bulk: parcelItemBulk },
        { id: 'NON-BULK', label: 'Non-Bulk',  non_bulk: parcelItemNonBulk },
        { id: 'TOTAL', label: 'Total', total: parcelItemBulk + parcelItemNonBulk },
      ];
      
      const baseColumnOptions = {
        sortable: false,
        pinnable: false,
        hideable: false,
      };
      
      const columnss = [
     
        {
          field: 'id',
          headerName: 'Parcel Input',
          ...baseColumnOptions,
          flex: 3,
          colSpan: (value, row) => {
            if (row.id === 'BULK' || row.id === 'TOTAL') {
              return 1;
            }
            if (row.id === 'NON-BULK') {
              return 1;
            }
            return undefined;
          },
          valueGetter: (value, row) => {
            if (row.id === 'BULK' || row.id === 'NON-BULK' || row.id === 'TOTAL') {
              return row.label;
            }
            return value;
          },
        },
        {
          field: 'parcel_type',
          headerName: 'Type',
          ...baseColumnOptions,
          flex: 1,
          ...baseColumnOptions,
          valueGetter: (value, row) => {
            if (row.id === 'BULK') {
              return row.bulk;
            }
            if (row.id === 'NON-BULK') {
              return row.non_bulk;
            }
            if (row.id === 'TOTAL') {
              return row.total;
            }
            return row.parcel_type;
          },
       
        },

        // {
        //   field: 'id',
        //   headerName: 'Quantity',
         
        //   },
        
      ];


      const getCellClassName = ({ row, field }) => {
        if (row.id === 'SUBTOTAL' || row.id === 'TOTAL' || row.id === 'TAX') {
          if (field === 'item') {
            return 'bold';
          }
        }
        return '';
      };


    return(
        <div className="parcel">
          <Topbar/>
         <div className="container">
          <Sidebar/>  
          <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={userData}
        columns={columns}
       
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
          columns: {
            columnVisibilityModel: {
              screenshot: false,
              receipt: false
            },
          },
        }}
        pageSizeOptions={[5, 10]}
        getRowId={(row) =>  row.count}
      />
       </div> 

       {isViewerOpen && (
        <ImageViewer
          src={ itemData }
          currentIndex={0}
          disableScroll={ true }
          closeOnClickOutside={ true }
          onClose={ closeImageViewer }
        />
      )}


        </div>
      </div>
    )
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