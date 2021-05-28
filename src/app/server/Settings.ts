export const SETTINGS = {
    HOST: window.location.protocol + '//' + window.location.hostname,
    PORT: 3001,

    // все события, котореы есть в сокетах
    MESSAGES: {
        GET_MESSAGE: 'GET_MESSAGE', // получить все сообщения
        SEND_MESSAGE: 'SEND_MESSAGE', // послать сообщение
        LOGIN: 'LOGIN',
        LOGOUT: 'LOGOUT',
        REGISTRATION: 'REGISTRATION',
        CREATE_ROOM: 'CREATE_ROOM',
        JOIN_GAME: 'JOIN_GAME',
        LEAVE_ROOM: 'LEAVE_ROOM',
        GET_GAMES: 'GET_GAMES',
        MOVE: 'MOVE',
        STOP_MOVE: 'STOP_MOVE',
        CHANGE_DIRECTION: 'CHANGE_DIRECTION'
    }
};