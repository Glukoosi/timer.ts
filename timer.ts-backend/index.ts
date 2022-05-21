import { Server } from "socket.io";

interface Timer {
  startTimestamp?: Date,
  endTimestamp?: Date,
  nowTimestamp?: Date,
}

let timer: Timer = {
  startTimestamp: undefined,
  endTimestamp: undefined,
}

const io = new Server({
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  timer.nowTimestamp = new Date();
  socket.emit("timer", timer);

  socket.on("start", () => {
    timer.startTimestamp = new Date();
    timer.endTimestamp = undefined;

    timer.nowTimestamp = new Date();
    io.emit("timer", timer);
  });

  socket.on("stop", () => {
    timer.endTimestamp = new Date();

    timer.nowTimestamp = new Date();
    io.emit("timer", timer);
  });

  socket.on("reset", () => {
    timer.startTimestamp = undefined;
    timer.endTimestamp = undefined;

    timer.nowTimestamp = new Date();
    io.emit("timer", timer);
  });
});

io.listen(3000);
