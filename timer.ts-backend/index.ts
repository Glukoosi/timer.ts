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
    if (timer.endTimestamp !== undefined && timer.startTimestamp !== undefined) {
      const diff = timer.endTimestamp.getTime() - timer.startTimestamp.getTime();
      timer.startTimestamp = new Date(new Date().getTime() - diff);
    } else {
      timer.startTimestamp = new Date();
    }

    timer.endTimestamp = undefined;

    timer.nowTimestamp = new Date();
    io.emit("timer", timer);
  });

  socket.on("stop", () => {
    if (timer.endTimestamp === undefined) {
      timer.endTimestamp = new Date();
    }

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
