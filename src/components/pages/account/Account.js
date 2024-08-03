import "./account.css"
import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbar} from '@mui/x-data-grid';
import axios, { isAxiosError } from "axios";
import { Button, Stack } from "@mui/material";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDemoData  } from '@mui/x-data-grid-generator';
import TextField from '@mui/material/TextField';
import { Warehouse} from "@mui/icons-material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

    
  
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

export default function Account(){
    
    const { data, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6,
    });

    const [userData, setUserData] = React.useState([]);  
   
    const [openModal, setOpenModal] = React.useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);  
    const [openHubDialog, setOpenHubDialog] = React.useState(false);
    const [updateHub, setUpdateHub] = React.useState('');
    const [updateHubId, setUpdateHubId] = React.useState('');



    const [updateStatus, setUpdateStatus] = React.useState('');
    const [userEmail, setUserEmail] = React.useState('');

    const requestBody  = { isActivate: updateStatus, email: userEmail  };

    const[modalFullName, setModalFullName] = React.useState('');
    const[modalAddress, setModalAddress] = React.useState('');
    const[modalEmail, setModalEmail] = React.useState('');
    const[modalPhone, setModalPhone] = React.useState('');
    const[modalJDate, setModalJDate] = React.useState('');
    const[modalHubName, setModalHubName] = React.useState('');
    const[modalHubId, setModalHubId] = React.useState('');
    const[hubList, setHubList] = React.useState([]);


    const handleSelectHub = (event) => {
      setUpdateHub(event.target.value || '');

    };

    const handleOpenHubDialog = () => {
      setOpenHubDialog(true);
    };

    const handleCloseHubDialog = (event, reason) => {
      if (reason !== 'backdropClick') {
       
        setOpenHubDialog(false);
        setUpdateHub('');
      }

    };


    const [openDialog, setOpenDialog] = React.useState(false);

    const handleOpenDialog = () => {
      setOpenDialog(true);
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
   
    };


    const columns = [
      { field: 'count', headerName: '#', width: 150 },
      { field: 'first_name', headerName: 'First name', width: 200 },
      { field: 'middle_name', headerName: 'Middle name', width: 200 },
      { field: 'last_name', headerName: 'Last name', width: 200 },
      {
        field: 'email',
        headerName: 'Email',
        width: 200,
      },
      {
        field: 'phone',
        headerName: 'Phone',
      },
      {
        field: 'address',
        headerName: 'Address',
      },
      {
        field: 'date_join',
        headerName: 'Date Join',
      },
      {
        field: 'hub_name',
        headerName: 'Hub Name',
      },
      {
        field: 'hub_id',
        headerName: 'Hub ID',
      },
      {
        field: 'isActive',
        headerName: 'Status',
        width: 180,
        sortable: false,
        disableClickEventBubbling: true,
        
        renderCell: (params) => {
            const status =  params.row.isActive;
            const rowEmail = params.row.email;
            const onClick = (e) => {
             {status? 
                
                setUpdateStatus(false)
                :
                setUpdateStatus(true)
              }
              setUserEmail(rowEmail)
              handleOpenDialog()
            };
           
            return (
         <>
          {status? 
            <Stack>
          
                <ColorButton variant="contained" size="small" style={{width: "50%" ,marginTop: "13px"}} onClick={onClick}>Active</ColorButton>
   
            </Stack>
            :
            <Stack>
    
                <Button variant="contained" color="error" size="small" style={{width: "50%" ,marginTop: "13px"}} onClick={onClick} >Inactive</Button>
         
            </Stack>

          } 
         </>       
            );
        },
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 90,
        sortable: false,
        disableClickEventBubbling: true,
        
        renderCell: (params) => {
            const onClick = (e) => {

              let mFullname
              let condition = params.row.middle_name;
              let mAddress = params.row.address;
              let mEmail = params.row.email;
              let mPhone = params.row.phone;
              let mJDate = params.row.date_join;
              let mHubName = params.row.hub_name;
              let mHubId = params.row.hub_id;
              if (condition === "Null"){
                mFullname = params.row.first_name + " " + params.row.last_name;
              }else{
                mFullname = params.row.first_name + " " +params.row.middle_name + " " + params.row.last_name;
              }
              
              setModalFullName(mFullname);
              setModalAddress(mAddress);
              setModalEmail(mEmail);
              setModalPhone(mPhone);
              setModalJDate(mJDate);
              setModalHubId(mHubId);
              setModalHubName(mHubName);
             
              return handleOpen();
            };
            
            return (
            <Stack>
              
                      <Button variant="contained" size="small" color="info" onClick={onClick} style={{width: "50%" ,marginTop: "13px"}}>View</Button>
                     
            </Stack>
            );
        },
      }
    ];

    async function getUser(){
      await  axios
        .post('https://rider-monitoring-app-backend.onrender.com/get-rider-user', requestBody)
        .then(async response=> {
          const data = await response.data.data;

        

          const newData = data.map((data, key) => {
            return {
               count : key + 1,
               first_name : data.first_name,
               middle_name : data.middle_name? data.middle_name : "Null" ,
               last_name : data.last_name,
               email: data.email,
               address: data.address,
               phone: data.phone,
               date_join: data.j_date? new Date(data.j_date).toLocaleDateString('en-us', {month: 'long', day: 'numeric', year: 'numeric'}): "Null",
               isActive: data.isActivate,
               hub_id: data.hub_id,
               hub_name: data.hub_name[0]? data.hub_name[0] : "no data"
               
            };
           }
          );
          console.log(newData, "testing par");
          setUserData(newData);


        });

    }


    async function getHubList(){
      await  axios
        .post('https://rider-monitoring-app-backend.onrender.com/fetch-hub', requestBody)
        .then(async response=> {
          const data = await response.data.data;

        
          console.log(data);
          const newData = data.map((data, key) => {
            return {
              count : key + 1,
              id: data._id,
              hub_name : data.hub_name,
               
            };
           }
          );
          console.log(newData, "testing par");
          setHubList(newData);
          setUpdateHub(modalHubId);

          handleOpenHubDialog();
        });

    }

    async function setStatus(){
        console.log("check body" , requestBody);
        await  axios
          .put('https://rider-monitoring-app-backend.onrender.com/update-status', requestBody)
          .then(async response=> {
            const data = await response.data.data;
  
            console.log(data);
            window.location.reload();
  
          });
  
    }

    async function updateUserHub(){
        await  axios
          .put('https://rider-monitoring-app-backend.onrender.com/update-user-hub', {hub_id: updateHub, email: modalEmail} )
          .then(async response=> {
            const data = await response.data.data;
  
            console.log(data);
            window.location.reload();
  
          });
  
    }


    
    React.useEffect(() => {
        getUser();
      
    }, []);



    return(
        <div className="account">
          <Topbar/>
         <div className="container">
         <Sidebar/>
        <div style={{ height: '100%', width : '100%', marginLeft: '100'}}>
        <DataGrid
          rows={userData}
          sx={{ overflowX: 'scroll' }}
          columns={columns}

          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                address: false,
                phone: false,
                date_join: false,
                hub_name: false,
                hub_id: false
               
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
              printOptions: { disableToolbarButton: true },
              csvOptions: { disableToolbarButton: true },
            },
          }}
          loading={!userData.length}
          disableDen
          sitySelector
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          disableDensitySelector
          disableVirtualization
          pageSizeOptions={[5, 10]}
          getRowId={(row) =>  row.count}

        />
        </div>

        <Modal
            open={openModal}
            onClose={handleCloseDialog}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
             
              <Stack spacing={3}>
              <p>
                Full Details :
              </p>

              <TextField
                label="Fullname"
                id="outlined-read-only-input"
                defaultValue={modalFullName}
                InputProps={{
                    readOnly: true,
                }}
              />
              <TextField
                label="Address"
                id="outlined-read-only-input"
                defaultValue={modalAddress}
                InputProps={{
                    readOnly: true,
                }}
              />
              <TextField
                label="Email"
                id="outlined-read-only-input"
                defaultValue={modalEmail}
                InputProps={{
                    readOnly: true,
                }}
              />
              <TextField
                label="Phone"
                id="outlined-read-only-input"
                defaultValue={modalPhone}
                InputProps={{
                    readOnly: true,
                }}
              />
               <TextField
                label="Hub"
                id="outlined-read-only-input"
                defaultValue={modalHubName}
                InputProps={{
                    readOnly: true,
                    endAdornment: <Button variant="contained" onClick={getHubList} ><Warehouse/></Button>
                }}
              />
              <TextField
                label="Date Joined"
                id="outlined-read-only-input"
                defaultValue={modalJDate}
                InputProps={{
                    readOnly: true,
                }}
              />
              {/* <TextField
                label="Hub"
                id="outlined-read-only-input"
                defaultValue={modalhub}
                InputProps={{
                    readOnly: true,
                }}
              /> */}
              </Stack>
              {/* </Typography> */}
              <Stack>
              

          <DialogActions>
            <Button onClick= {handleClose}>Close</Button>
      
          </DialogActions>
              </Stack>
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
            {updateStatus?
            "Are you sure you want to set this user as active?" 
             :
             "Are you sure you want to set this user as inactive?"
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick= {handleCloseDialog}>Cancel</Button>
          <Button onClick={setStatus} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog disableEscapeKeyDown open={openHubDialog} onClose={handleCloseHubDialog}>
        <DialogTitle>Select Hub</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-dialog-native">Hub</InputLabel>
              <Select
                value={updateHub}
                onChange={handleSelectHub}
                input={<OutlinedInput label="Age"/>}
              >
                 {/* <MenuItem disabled value="">
                    <em>Placeholder</em>
                </MenuItem> */}
                
                {
                  hubList.map((hub) => (
                  
                    <MenuItem value={hub.id} key={hub.id}>
                      {hub.hub_name}
                    </MenuItem>
                  ))
                }


              </Select>
            </FormControl>
            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHubDialog}>Cancel</Button>
          <Button onClick={updateUserHub}>Ok</Button>
        </DialogActions>
      </Dialog>
       </div>
      </div>
          
    );
}




  const ColorButton = styled(Button)(({ theme }) => ({
    color: "#000",
    backgroundColor: "#F6FAB9",
    '&:hover': {
      backgroundColor: "#CAE6B2",
    },
  }));

  
  