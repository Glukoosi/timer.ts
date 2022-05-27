import { Button } from '@mui/material';

import { Socket } from "socket.io-client";

interface ButtonProps {
  socket?: Socket
  command: string
}

export const TimerButton = (props: ButtonProps) => {
  return (
    <>
      <Button variant="contained" type="button" onClick={() => props.socket?.emit(props.command)}>
        {props.command}
      </Button>
    </>
  )
}
