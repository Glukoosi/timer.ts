import { useEffect, useState } from 'react'
import './App.css'

import { io, Socket } from "socket.io-client";

interface ServerIsoTimestamps {
  startTimestamp?: string,
  endTimestamp?: string,
  nowTimestamp?: string,
}

interface Timer {
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
}

const socket = io("http://192.168.1.95:3000/");

function calculateTimer(timestamps: ServerIsoTimestamps, timeDiff: number): Timer {

  if (timestamps.startTimestamp !== undefined && timestamps.nowTimestamp !== undefined) {
    const nowDate = new Date().getTime();
    const startTime = new Date(timestamps.startTimestamp).getTime();

    let distance = nowDate - startTime + timeDiff;

    if (timestamps.endTimestamp !== undefined) {
      const endTime = new Date(timestamps.endTimestamp).getTime();
      distance = endTime - startTime;
    }

    return {
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
      milliseconds: Math.floor((distance % (1000)) / 10),
    }

  } else {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    }
  }
}

function App() {

  const [timer, setTimer] = useState<Timer | undefined>(undefined)
  const [timestamps, setTimestamps] = useState<ServerIsoTimestamps>({})

  const [timeDiff, setTimeDiff] = useState(0);

  useEffect(() => {
    socket.on("timer", (serverTimestamps) => {
      const serverTime = new Date(serverTimestamps.nowTimestamp).getTime();
      setTimeDiff(serverTime - new Date().getTime());
      setTimestamps(serverTimestamps)
    });
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timerObj = calculateTimer(timestamps, timeDiff)
      setTimer(timerObj)
    }, 10)
    return () => clearInterval(interval)
  });


  return (
    <div className="App">
      <header className="App-header">
          <button type="button" onClick={() => socket.emit("start")}>
            start
          </button>
          <button type="button" onClick={() => socket.emit("stop")}>
            stop
          </button>
          <button type="button" onClick={() => socket.emit("reset")}>
            reset
          </button>
        <p>h: {timer?.hours?.toString()}</p>
        <p>m: {timer?.minutes?.toString()}</p>
        <p>s: {timer?.seconds?.toString()}</p>
        <p>ms: {timer?.milliseconds?.toString()}</p>
      </header>
    </div>
  )
}

export default App
