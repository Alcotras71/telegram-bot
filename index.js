const TelegramApi = require('node-telegram-bot-api');

const { gameOptions, againOptions } = require('./options');

const token = '5398864871:AAGmJs4pq5PxjGucVB4q5kCWIjZZo4LluXM'

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Now I will think of a number from 1 to 9, and you have to guess it');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Guess', gameOptions);
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Initial greeting'},
    {command: '/info', description: 'Your info'},
    {command: '/game', description: `Let's play`}
  ])

  bot.on('message', async msg => {
    const { text, chat: { id: chatId }, from: {first_name, last_name} } = msg;

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/c31/808/c31808b2-313e-3cc1-9cd0-bdc310f95708/4.webp');
      return bot.sendMessage(chatId, `Welcome to my telegram BOT`);
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Your name is ${first_name} ${last_name}`)
    }
    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, `I don't understand you, please try again`)
  })

  bot.on('callback_query', async msg => {
    const { data, message: {chat: {id: chatId}} } = msg;
    if (data === '/again') {
      return startGame(chatId);
    }
    if (Number(data) === Number(chats[chatId])) {
      return await bot.sendMessage(chatId, `Congrats, you was right, it's the number ${chats[chatId]}`, againOptions)
    } else {
      return await bot.sendMessage(chatId, `You loose, bot guessed the number ${chats[chatId]}`, againOptions)
    }
  })
}

start();