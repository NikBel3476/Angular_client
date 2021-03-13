import { io } from "socket.io-client";
// import { Socket } from 'ngx-socket-io';

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

/*
//const { HOST, PORT, MESSAGES } = SETTINGS;

    const socket = io(`${HOST}:${PORT}`);

    let login;

    // чат
    // отправка сообщений
    document.getElementById('sendText').addEventListener(
        'click', () => {
            const message = document.getElementById('textLine').value;
            socket.emit(MESSAGES.SEND_MESSAGE, { message, login });
            return true;
        }
    );

    document.getElementById('reg_button').addEventListener(
        'click', () => {
            const name = document.getElementById('reg_input').value;
            socket.emit(MESSAGES.SEND_LOGIN, { name });
            return true;
        }
    );

    socket.on(MESSAGES.SEND_MESSAGE, data => {
        const chat = document.getElementById('chat');
        chat.value += data.login + ': ' + data.message + '\n';
    });

    socket.on(MESSAGES.SEND_LOGIN, data => {
        if (data.result) {
            login = data.result;
            ui.hideElem('reg_container');
            ui.showElem('chat_container');
        }
    });
*/