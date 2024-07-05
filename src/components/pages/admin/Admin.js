import "./admin.css"
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
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel'; 
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import { Warehouse, Visibility } from "@mui/icons-material";
import Swal from "sweetalert2";


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  const Otpstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
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

export default function Admin(){
    
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
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openStatusDialog, setOpenStatusDialog] = React.useState(false);
    const [openViewModal, setOpenViewModal] = React.useState(false);

    const [updateStatus, setUpdateStatus] = React.useState('');
    const [userEmail, setUserEmail] = React.useState('');

    const requestBody  = { isActivate: updateStatus, email: userEmail  };

    const [showPassword, setShowPassword] = React.useState(false);

    const [otpCode, setOtpCode] = React.useState();
    const [inputOtpCode, setInputOtpCode] = React.useState();
    const [inputOtpCodeError, setInputOtpCodeError] = React.useState();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [adminFirstName, setAdminFirstName] = React.useState('');
    const [adminMiddleName, setAdminMiddleName] = React.useState('');
    const [adminLastName, setAdminLastName] = React.useState('');
    const [adminEmail, setAdminEmail] = React.useState('');
    const [adminAddress, setAdminAddress] = React.useState('');
    const [adminPhone, setAdminPhone] = React.useState('');
    const [adminPassword, setAdminPassword] = React.useState('');
    const [adminConfirmPassword, setAdminConfirmPassword] = React.useState('');

    const [adminFirstNameError, setAdminFirstNameError] = React.useState('');
    const [adminMiddleNameError, setAdminMiddleNameError] = React.useState('');
    const [adminLastNameError, setAdminLastNameError] = React.useState('');
    const [adminEmailError, setAdminEmailError] = React.useState('');
    const [adminAddressError, setAdminAddressError] = React.useState('');
    const [adminPhoneError, setAdminPhoneError] = React.useState('');
    const [adminPasswordError, setAdminPasswordError] = React.useState('');
    const [adminConfirmPasswordError, setAdminConfirmPasswordError] = React.useState('');

    const [adminViewFullName, setAdminViewFullName] = React.useState('');
    const [adminViewEmail, setAdminViewEmail] = React.useState('');
    const [adminViewAddress, setAdminViewAddress] = React.useState('');
    const [adminViewPhone, setAdminViewPhone] = React.useState('');
    const [adminViewJDate, setAdminViewJDate] = React.useState('');


    const handleFirstNameChange = e => {
      setAdminFirstName(e.target.value);
      if (e.target.value.length < 2) {
        setAdminFirstNameError("Please enter valid name");
      } else {
        setAdminFirstNameError(false);
      }
     
    };


    const handleMiddleNameChange = e => {
      setAdminMiddleName(e.target.value);
      if (e.target.value.length < 2) {
        setAdminMiddleNameError("Please enter valid name");
      } else {
        setAdminMiddleNameError(false);
      }
    };

    const handleLastNameChange = e => {
      setAdminLastName(e.target.value);
      if (e.target.value.length < 2) {
        setAdminLastNameError("Please enter valid name");
      } else if (e.target.value.length > 20) {
        setAdminLastNameError("Name must be less than 20 characters long");
      } else if (!/^[a-zA-Z ]+$/.test(e.target.value)) {
        setAdminLastNameError("Name must contain only letters and spaces");
      } else {
        setAdminLastNameError(false);
      }
    };

    const handleEmailChange = e => {
      setAdminEmail(e.target.value);
      if (!/^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/.test(e.target.value)) {
        setAdminEmailError("Invalid email address");
      } else {
        setAdminEmailError(false);
      }
   
    };

    const handlePhoneChange = e => {
     
      if(e.target.value.length > 11) return
      setAdminPhone(e.target.value);
      if (e.target.value.length < 2) {
        setAdminPhoneError("Please enter valid phone number");
      } else {
        setAdminPhoneError(false);
      }
    };

    const handleAddressChange = e => {
      setAdminAddress(e.target.value);
      if (e.target.value.length < 2) {
        setAdminAddressError("NPlease enter valid address");
      } else {
        setAdminAddressError(false);
      }
    };

    const handlePasswordChange = e => {
      setAdminPassword(e.target.value);
      console.log(adminPassword)
      if (e.target.value.length < 2) {
        setAdminPasswordError("Please enter valid password");
      } else {
        setAdminPasswordError(false);
      }
    };

    const handleConfirmPasswordChange = e => {
      setAdminConfirmPassword(e.target.value);
      if (e.target.value !== adminPassword) {
        setAdminConfirmPasswordError("Password does not match!");
      } else {
        setAdminConfirmPasswordError(false);
      }
    };


    const handleOtpCodeChange = e => {

      if(e.target.value.length > 4) return

      setInputOtpCode(e.target.value)
     
    };

    const handleOpenDialog = () => {
      setOpenModal(true);
    };
  
    const handleCloseDialog = () => {
      setOpenModal(false);
   
    };

    const handleCloseOtpDialog = () => {
      setOpenDialog(false);
   
    };


    const handleStatusCloseDialog = () => {
      setOpenStatusDialog(false);
   
    };

    const handleViewCloseModal = () => {
      setOpenViewModal(false);
   
    };


   


    const columns = [
      { field: 'count', headerName: '#', width: 100 },
      { field: 'first_name', headerName: 'First name', width: 150 },
      { field: 'middle_name', headerName: 'Middle name', width: 150 },
      { field: 'last_name', headerName: 'Last name', width: 150 },
      {
        field: 'email',
        headerName: 'Email',
        width: 300,
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
              setOpenStatusDialog(true)
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

              let rFullname;
              let rMiddleName = params.row.middle_name;
              let rAddress = params.row.address;
              let rEmail = params.row.email;
              let rPhone = params.row.phone;
              let rJDate = params.row.date_join;
              if (rMiddleName === "Null"){
                rFullname = params.row.first_name + " " + params.row.last_name;
              }else{
                rFullname = params.row.first_name + " " +params.row.middle_name + " " + params.row.last_name;
              }
              
              setAdminViewFullName(rFullname);
              setAdminViewAddress(rAddress);
              setAdminViewEmail(rEmail);
              setAdminViewPhone(rPhone);
              setAdminViewJDate(rJDate);
             
              return setOpenViewModal(true);
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
        .post('https://rider-monitoring-app-backend.onrender.com/get-admin-user', requestBody)
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
        
            };
           }
          );
          console.log(newData, "testing par");
          setUserData(newData);


        });

    }


    

    async function setStatus(){
        await  axios
          .put('https://rider-monitoring-app-backend.onrender.com/update-status', requestBody)
          .then(async response=> {
            const data = await response.data.data;
  
            window.location.reload();
  
          });
  
    }

    async function sendOtp(){
      await axios
        .post('https://rider-monitoring-app-backend.onrender.com/send-otp-register', {email : adminEmail})
        .then(async response=> {
          const data = await response.data;  
          if(data.status === 200){
            setOtpCode(data.code)
            setOpenDialog(true)
          }else{
            Swal.fire({
              title: "Unable to proceed",
              text: "Sending OTP failed!",
              icon: "error"
            });
          }

        })
        .catch(function (error){
         

          if (error.response) {

            Swal.fire({
              title: "Unable to proceed",
              text: error.response.data,
              icon: "error"
            });
            return
          } else if (error.request) {
            Swal.fire({
              title: "Unable to proceed",
              text: error.request,
              icon: "error"
            });
            return
            
          } else {
            Swal.fire({
              title: "Unable to proceed",
              text: error.message,
              icon: "error"
            });
            return
          }
        });
    }

    async function confirmOtp(){
     

      if(otpCode === inputOtpCode) {

        const userDetails = {
          first_name : adminFirstName,
          middle_name : adminMiddleName,
          last_name : adminLastName,
          phone : adminPhone,
          email: adminEmail,
          address : adminAddress,
          password : adminPassword
        }

        axios
        .post('https://rider-monitoring-app-backend.onrender.com/register-user-admin', userDetails)
        .then(async response=> {
          const data = response.data;
          if (data.status === 200){
            Swal.fire({
              title: "Success",
              text: "User created successfully!",
              icon: "success",
              confirmButtonColor: "#3085d6",
            }). then((result) =>  {
              if (result.isConfirmed) {        
              return   window.location.reload();          
              }else{
              return  window.location.reload();  
              }
            });
          }else{
            Swal.fire({
              title: "Unable to proceed",
              text: "Saving user Error!",
              icon: "error"
            });
          }
        })
        .catch(function (error){
          console.log(error)
        })

      }else if(otpCode !== inputOtpCode){  
        setInputOtpCodeError("OTP code does not match.")

      }else if(inputOtpCode.length < 4) { 
        setInputOtpCodeError("Input must be 4 digits.")
      }
      return 

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
        <div style={{margin: 10}}>
            <Button onClick={handleOpenDialog} variant="contained" endIcon={<PersonAddAlt1Icon/>}>Add User</Button>
        </div>
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
          disableDensitySelector
          disableColumnFilter
          disableColumnSelector
          pageSizeOptions={[5, 10]}
          getRowId={(row) =>  row.count}
          disableRowSelectionOnClick

        />
        </div>


        <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogContent>
        {/* <Box  components="form" noValidate sx={Otpstyle}> */}
          <FormControl sx={{ m: 2 }}>
            <p>Enter OTP code :</p>
            <TextField
            value={inputOtpCode}
            error={inputOtpCodeError}
            helperText={inputOtpCodeError}  
            type="number"
            inputProps={{ maxLength: 4 }}
            onChange={handleOtpCodeChange}
            sx={{
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                       display: "none",
                                     },
             "& input[type=number]": {
                                       MozAppearance: "textfield",
                                     },
            }}
            />
          </FormControl>
          {/* </Box> */}
        </DialogContent>
        <DialogActions>
          <Button onClick= {handleCloseOtpDialog}>Cancel</Button>
          <Button onClick={confirmOtp} autoFocus>
            Create User
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openStatusDialog}
        onClose={handleStatusCloseDialog}
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
          <Button onClick= {handleStatusCloseDialog}>Cancel</Button>
          <Button onClick={setStatus} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>



      <Modal
            open={openViewModal}
            onClose={handleViewCloseModal}
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
                defaultValue={adminViewFullName}
                InputProps={{
                    readOnly: true,
                }}
              />
              <TextField
                label="Address"
                id="outlined-read-only-input"
                defaultValue={adminViewAddress}
                InputProps={{
                    readOnly: true,
                }}
              />
              <TextField
                label="Email"
                id="outlined-read-only-input"
                defaultValue={adminViewEmail}
                InputProps={{
                    readOnly: true,
                }}
              />
              <TextField
                label="Phone"
                id="outlined-read-only-input"
                defaultValue={adminViewPhone}
                InputProps={{
                    readOnly: true,
                }}
              />
              <TextField
                label="Date Joined"
                id="outlined-read-only-input"
                defaultValue={adminViewJDate}
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
            <Button onClick= {handleViewCloseModal}>Close</Button>
      
          </DialogActions>
              </Stack>
            </Box>
          </Modal>


      <Modal
            open={openModal}
            onClose={handleCloseDialog}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            tabindex="-1"
            data-bs-focus="false"
          >
            <Box  components="form" noValidate sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Admin Details : 
              
                {/* {test} */}
              </Typography>
              {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}
          
              <FormControl fullWidth sx={{ m: 1 }}>
                  <TextField
                   label="First Name *"
                   value={adminFirstName}
                   onChange={handleFirstNameChange}
                   error={adminFirstNameError}
                   helperText={adminFirstNameError}   
                   autoComplete='off'
                   InputProps={{autoComplete: "off"}}
                               
                   />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
                  <TextField
                   label="Middle Name"
                   value={adminMiddleName}
                   onChange={handleMiddleNameChange}
                   error={adminMiddleNameError}
                   helperText={adminMiddleNameError}   
                   autoComplete='off'                
                  />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
                  <TextField
                   label="Last Name *"
                   value={adminLastName}
                   onChange={handleLastNameChange}
                   error={adminLastNameError}
                   helperText={adminLastNameError} 
                   autoComplete='off'                  
                  />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
                  <TextField
                   label="Email *"
                   value={adminEmail}
                   onChange={handleEmailChange}
                   error={adminEmailError}
                   helperText={adminEmailError}   
                   autoComplete='off'                
                  />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
                  <TextField
                   label="Phone *"
                   value={adminPhone} 
                   onChange={handlePhoneChange}
                   error={adminPhoneError}
                   type="number"
               
                   sx={{
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                             display: "none",
                                           },
                   "& input[type=number]": {
                                             MozAppearance: "textfield",
                                           },
                   }}
                   helperText={adminPhoneError}  
                   autoComplete='off' 
                               
                  />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
                  <TextField
                    label="Address *"
                    multiline
                    rows={3}
                    value={adminAddress}
                    onChange={handleAddressChange}
                    error={adminAddressError}
                    autoComplete='off'
                  />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
                  <TextField
                   label="Password *"
                   value={adminPassword}
                   onChange={handlePasswordChange}
                   error={adminPasswordError}
                   helperText={adminPasswordError} 
                   type={showPassword? 'text' : 'password'} 
                   autoComplete='off'
                   InputProps={{
                    endAdornment: 
                     <IconButton aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                  }}                 
                  />
         
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
                  <TextField
                   label="Confirm Password"
                   value={adminConfirmPassword}
                   onChange={handleConfirmPasswordChange}
                   error={adminConfirmPasswordError}
                   helperText={adminConfirmPasswordError}   
                   type="password"    
                   autoComplete='off'            
                  />
            </FormControl>  
          

              
          <DialogActions>
            <Button onClick= {handleClose}>
                Close
            </Button>
            <Button  onClick={sendOtp} autoFocus>
              Confirm
            </Button>
      
          </DialogActions>
        
             
            </Box>
        </Modal>


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

  
  