import { bot } from '../../../index.js'
import tgresolve from 'tg-resolve'
export const ticketHandle = async msg => {
  await bot.sendMessage(
    msg.from.id,
    'send me the username of the person you want to create a ticket for\n✔️correct format:@john_doe',
    { reply_markup: { force_reply: true } }
  )
  bot.onText(/./, async msg => {
    if (
      msg.reply_to_message &&
      (/send me the username/.test(msg.reply_to_message.text) ||
        /username format is incorrect/.test(msg.reply_to_message.text))
    ) {
      //getting the username
      const username = msg.text
      if (username[0] !== '@')
        return await bot.sendMessage(
          msg.from.id,
          'username format is incorrect',
          { reply_markup: { force_reply: true } }
        )
        tgresolve(process.env.BOT_TOKEN, username, function(error, result) {
            // ... handle error ...
            console.log(error,result);
        });
    }
  })
}
