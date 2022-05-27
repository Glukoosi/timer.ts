import { useEffect, useState } from 'react'

import { ButtonGroup, Grid } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Typography from '@mui/material/Typography';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { io, Socket } from "socket.io-client";

import { TimerButton } from "./Button"

interface ServerIsoTimestamps {
  startTimestamp?: string,
  endTimestamp?: string,
  nowTimestamp?: string,
}

interface Timer {
  hours: string,
  minutes: string,
  seconds: string,
  milliseconds: string,
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const calculateTimer = (timestamps: ServerIsoTimestamps, timeDiff: number): Timer => {

  if (timestamps.startTimestamp !== undefined && timestamps.nowTimestamp !== undefined) {
    const nowDate = new Date().getTime();
    const startTime = new Date(timestamps.startTimestamp).getTime();

    let distance = nowDate - startTime + timeDiff;

    if (timestamps.endTimestamp !== undefined) {
      const endTime = new Date(timestamps.endTimestamp).getTime();
      distance = endTime - startTime;
    }

    return {
      hours: (Math.floor(distance / (1000 * 60 * 60))).toString(),
      minutes: ('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).slice(-2),
      seconds: ('0' + Math.floor((distance % (1000 * 60)) / 1000)).slice(-2),
      milliseconds: ('0' + Math.floor((distance % (1000)) / 10)).slice(-2),
    }

  } else {
    return {
      hours: '0',
      minutes: '00',
      seconds: '00',
      milliseconds: '00',
    }
  }
}

const App = () => {

  const [timer, setTimer] = useState<Timer | undefined>(undefined)
  const [timestamps, setTimestamps] = useState<ServerIsoTimestamps>({})
  const [timeDiff, setTimeDiff] = useState(0);
  const [socket, setSocket] = useState<Socket>();


  useEffect(() => {
    setSocket(io("http://localhost:3000/"));
  }, [])

  useEffect(() => {
    if (socket !== undefined) {
      socket.on("timer", (serverTimestamps) => {
        const serverTime = new Date(serverTimestamps.nowTimestamp).getTime();
        setTimeDiff(serverTime - new Date().getTime());
        setTimestamps(serverTimestamps)
      });
    }
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timerObj = calculateTimer(timestamps, timeDiff)
      setTimer(timerObj)
    }, 10)
    return () => clearInterval(interval)
  }, [timestamps]);


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Grid container justifyContent="center" direction="column" alignItems="center" style={{ minHeight: '100vh' }}>
          <Typography variant="h3">
            {timer?.hours}:
            {timer?.minutes}:
            {timer?.seconds}.
            {timer?.milliseconds}
          </Typography>

          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <TimerButton socket={socket} command="start" />
            <TimerButton socket={socket} command="stop" />
            <TimerButton socket={socket} command="reset" />
          </ButtonGroup>
        </Grid>
      </div>
    </ThemeProvider>
  )
}

export default App
