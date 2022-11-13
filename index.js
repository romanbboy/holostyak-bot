const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')

const token = '5786942150:AAHML7PFFMiuexYKajvqJxPfnyzXoYkA2rc';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async chatId => {
  await bot.sendMessage(chatId, `Я сейчас загадаю число от 0 до 9, не отгадаешь, пизда тебе`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `Жамкай кнопку, пес сутулый`, gameOptions);
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Начало начал'},
    {command: '/info', description: 'инфо'},
    {command: '/game', description: 'Игра отгадай цифру'},
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/1.webp')
      return bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name}`)
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Info короче`)
    }
    if (text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, `Такой нет команды петушара`)
  });
  
  bot.on('callback_query', msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId)
    }

    if (+data === chats[chatId]) {
      return bot.sendMessage(chatId, `А ты хорош! Угадал!`, againOptions);
    } else {
      return bot.sendMessage(chatId, `Нифига не угадал, была цифра ${chats[chatId]}`, againOptions);
    }

  })
}

start()