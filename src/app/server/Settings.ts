export const SETTINGS = {
    HOST: window.location.protocol + '//' + window.location.hostname,
    PORT: 3001,

    // все события, котореы есть в сокетах
    MESSAGES: {
        GET_MESSAGES: 'GET_MESSAGES', // получить все сообщения
        SEND_MESSAGE: 'SEND_MESSAGE', // послать сообщение
        LOGIN: 'LOGIN',
        REGISTRATION: 'REGISTRATION'
    }
};