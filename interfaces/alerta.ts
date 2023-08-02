import { AlertColor } from "@mui/material";

export interface IAlerta{
    mensaje: string;
    severity?: AlertColor;
    status?: boolean;
    time?: number;
}