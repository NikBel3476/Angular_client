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
      LEAVE_GAME: 'LEAVE_GAME',
      CHECK_AUTH: 'CHECK_AUTH',
      GET_GAMES: 'GET_GAMES',
      MOVE: 'MOVE',
      STOP_MOVE: 'STOP_MOVE',
      CHANGE_DIRECTION: 'CHANGE_DIRECTION',
      SPEED_UP: 'SPEED_UP',
      SPEED_DOWN: 'SPEED_DOWN',
      CHANGE_PASSWORD: 'CHANGE_PASSWORD',
      LOGOUT_ALL_USERS: 'LOGOUT_ALL_USERS',
      CHANGE_POSITION: 'CHANGE_POSITION',
      GET_NAMES: 'GET_NAMES',
      USER_ENTER_CHAT: 'USER_ENTER_CHAT',
      USER_LEAVE_CHAT: 'USER_LEAVE_CHAT',
      SPEED_CHANGE: 'SPEED_CHANGE',
      PASSWORD_CHANGE: 'PASSWORD_CHANGE',
      GAMERS_INFO: 'GAMERS_INFO'
    }
};
