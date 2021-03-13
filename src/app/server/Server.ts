import { io } from "socket.io-client";

import { SETTINGS } from "./Settings";


export class Server {
    HOST = SETTINGS.HOST;
    PORT = SETTINGS.PORT;
    MESSAGES = SETTINGS.MESSAGES;

    socket;

    constructor() {
        this.socket = io(`${this.HOST}:${this.PORT}`);
        if (this.socket) {
            console.log('connected');
        }
    }

    login = (data: object) => {
        console.log(data);
        this.socket.emit(this.MESSAGES.LOGIN, data);
    }

    registration = (data: object) => {
        console.log(data);
        this.socket.emit(this.MESSAGES.REGISTRATION, data);
    }

    

}
