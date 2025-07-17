import "./dashboard.css";
import React, {useEffect, useState} from "react";
import axios, { isAxiosError } from "axios";
import { Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDemoData } from "@mui/x-data-grid-generator";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PermContactCalendarRoundedIcon from "@mui/icons-material/PermContactCalendarRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MapsHomeWorkRoundedIcon from "@mui/icons-material/MapsHomeWorkRounded";
import { dataset, valueFormatter } from "./weather";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';


const pData = [400, 300, 200, 278, 189, 239, 349];



const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

const customize = {
  height: 250,
  width: 1250,
  legend: { hidden: true },
  // margin: { top: 5 },
};

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



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function Dashboard() {

  const [activeData, setActiveData] = useState([]);
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [registryMonth, setRegistryMonth] = useState([]);
  const [registryCount, setRegistryCount] = useState([]);
  const [dailyAttendance, setDailyAttendance] = useState(0);
  const [registeredUser, setRegisteredUser] = useState(0);
  const [dailyDeliveredParcel, setDailyDeliveredParcel] = useState(0);
  const [hubNumber, setHubNumber] = useState(0);

  


  async function getDashboardData() {
    await axios
      .post("http://54.255.154.99:8082/get-admin-data-dashboard")
      .then(async (response) => {
        const data = await response.data;
        const monthData = [];
        const countData = [];

        const newData = data.registryCount.map((data, key) => {
           monthData.push(data.month);
           countData.push(data.count);
   
        });
        console.log(data);
        console.log(countData);

        setRegistryCount(countData);
        setRegistryMonth(monthData);

        setRegisteredUser(data.registeredData ? data.registeredData : 0);
        setDailyAttendance(data.dailyAttendance[0] ? data.dailyAttendance[0].count : 0);
        setDailyDeliveredParcel(data.dailyDelivery[0] ? data.dailyDelivery[0].delivered : 0);
        setHubNumber(data.hubData ? data.hubData : 0);

        setActiveData(data.activeData);
        setWeeklyAttendance(data.weeklyAttendance);
       
      });
  }

  React.useEffect(() => {
    getDashboardData();
  }, []);

  const chartSetting = {
    yAxis: [
      {
        label: "",
      },
    ],
    series: [
      { dataKey: "value", label: "Attendance per week",},
    ],
    height: 175,
    // sx: {
    //   [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
    //     transform: "translateX(-10px)",
    //   },
    // },
  };

  return (
    <div className="dashboard">
      <Topbar />
      <div className="container">
        <Sidebar />

        <div
          style={{
            height: "100%",
            width: "100%",
            marginLeft: "100",
            marginTop: "100",
          }}
        >
          {/* <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid>
        <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label:wwww 'series B' },
          ],
        },
      ]}
      width={400}
      height={200}
    />
      
        </Grid>
      </Grid>
    </Box> */}

          <Stack style={{ margin: 15 }}>
            <Stack direction="row" spacing={1}>
              <Box style={{ width: "25%", margin: 5 }}>
                <Card
                  style={{
                    height: 175,
                    alignContent: "center",
                    borderRadius: 12,
                    boxShadow: 5000,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PersonRoundedIcon
                      sx={{ fontSize: 75, color: "#551a8b" }}
                    ></PersonRoundedIcon>
                    <Stack spacing={0}>
                      <p style={{ fontSize: 20, fontWeight: 500 }}>{registeredUser}</p>
                      <p style={{ fontSize: 10, marginTop: -10 }}>
                        Total user registered
                      </p>
                    </Stack>
                  </Stack>
                </Card>
              </Box>

              <Box style={{ width: "25%", margin: 5 }}>
                <Card
                  style={{
                    height: 175,
                    alignContent: "center",
                    borderRadius: 12,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PermContactCalendarRoundedIcon
                      sx={{ fontSize: 75, color: "#551a8b" }}
                    ></PermContactCalendarRoundedIcon>
                    <Stack spacing={0}>
                      <p style={{ fontSize: 20, fontWeight: 500 }}>{dailyAttendance}</p>
                      <p style={{ fontSize: 10, marginTop: -10 }}>
                        Daily attendance
                      </p>
                    </Stack>
                  </Stack>
                </Card>
              </Box>

              <Box style={{ width: "25%", margin: 5 }}>
                <Card
                  style={{
                    height: 175,
                    alignContent: "center",
                    borderRadius: 12,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Inventory2RoundedIcon
                      sx={{ fontSize: 75, color: "#551a8b" }}
                    ></Inventory2RoundedIcon>
                    <Stack spacing={0}>
                      <p style={{ fontSize: 20, fontWeight: 500 }}>{dailyDeliveredParcel}</p>
                      <p style={{ fontSize: 10, marginTop: -10 }}>
                        Total parcel delivered
                      </p>
                    </Stack>
                  </Stack>
                </Card>
              </Box>
              <Box style={{ width: "25%", margin: 5 }}>
                <Card
                  style={{
                    height: 175,
                    alignContent: "center",
                    borderRadius: 12,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MapsHomeWorkRoundedIcon
                      sx={{ fontSize: 75, color: "#551a8b" }}
                    ></MapsHomeWorkRoundedIcon>
                    <Stack spacing={0}>
                      <p style={{ fontSize: 20, fontWeight: 500 }}>{hubNumber}</p>
                      <p style={{ fontSize: 10, marginTop: -10 }}>Hubs</p>
                    </Stack>
                  </Stack>
                </Card>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Box style={{ width: "40%", margin: 5 }}>
                <Card
                  style={{
                    height: 200,
                    alignContent: "center",
                    borderRadius: 12,
                  }}
                >
                  <PieChart
                  colors={['#CCDF92', '#DE3163']}
                    series={[
                      {
                        data: activeData
                      },
                    ]}
                    width={400}
                    height={150}
                  />
                </Card>
              </Box>

              <Box style={{ width: "60%", margin: 5 }}>
                <Card
                  style={{
                    height: 200,
                    alignContent: "center",
                    borderRadius: 12,
                  }}
                >
                  <BarChart
                    dataset={weeklyAttendance}
                    grid={{ horizontal: true }}
                    xAxis={[
                      {
                        scaleType: "band",
                        dataKey: "key",
                        tickPlacement: "middle",
                        tickLabelPlacement: "middle",
                        color: '#F4F8D3'
                      },
                    ]}
               
                    sx={{
                      [`& .${axisClasses.left} .${axisClasses.label}`]: {
                        transform: 'translateX(-10px)',
                      },
                      [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3', strokeWidth: 2 },
                    }}
                    {...chartSetting}
                  />
                </Card>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Box style={{ width: "100%", margin: 5 }}>
                <Card
                  style={{
                    height: 250,
                    alignContent: "center",
                    borderRadius: 12,
                  }}
                >
                  <LineChart
                    // width={1100'}
                    // height={225}
                    series={[
                      { data: registryCount, label: "registry" },
                    ]}
                    {...customize}
                    xAxis={[{ scaleType: "point", data: registryMonth }]}
                  />
                </Card>
              </Box>
            </Stack>
          </Stack>
        </div>
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
