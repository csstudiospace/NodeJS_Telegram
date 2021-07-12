const TelegramBot = require('node-telegram-bot-api');

//下方輸入你在 Telegram botfather 所拿到 bot的 API Token
const token = 'Your_Token_from_botfather';

//建立一個機器人，並設定自動接收訊息更新通知
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "hello normalmessage");
  
  //with HTML format
  bot.sendMessage(msg.chat.id,"<b>This</b> \n <i>is</i> \n <a href=\"#\">Normal</a> \n <code>mesg</code> \n <pre>example</pre>" ,
                  {parse_mode : "HTML"});

});

console.log("csstudiobot bot is start(normalmessage)");


