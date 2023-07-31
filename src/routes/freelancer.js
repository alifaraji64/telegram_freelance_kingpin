import { bot } from '../../index.js'
import { registeringTalents } from '../globals.js'

export const Freelancer = () => {
  let talent_details = {
    category_name: '',
    banner: '',
    price: '',
    description: ''
  }
  bot.onText(/I wanna work as a freelancer/, async msg => {
    const chatId = msg.chat.id
    console.log('I wanna work as a freelancer')
    await bot.sendMessage(
      chatId,
      `sure let's start
      \nthink of this section as creating you profile
      \nthe information you give to me in this section will be shared with people who need to hire someone of your talent
      \n click the checkbox below to start`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: '✅', callback_data: 'register_start' }]]
        }
      }
    )
  })
  bot.on('callback_query', async msg => {
    console.log(msg)
    if (msg.data == 'register_start') {
      try {
        return await bot.sendMessage(
          msg.from.id,
          'select the field you want to work \n\nyou can add more later on, just select one for now',
          {
            reply_markup: { inline_keyboard: registeringTalents }
          }
        )
      } catch (e) {
        console.log(e)
      }
    }
    if (msg.data.split('/')[0] == 'register_talent') {
      const field = msg.data.split('/')[1]
      talent_details.category_name = field
      return await bot.sendMessage(
        msg.from.id,
        'send me the starting price for this service',
        { reply_markup: { force_reply: true } }
      )
    }
  })
  bot.onText(/./, async msg => {
    if (
      msg.reply_to_message &&
      (msg.reply_to_message.text ==
        'send me the starting price for this service' ||
        msg.reply_to_message.text == 'price is not valid')
    ) {
      //validation
      if (isNaN(msg.text)) {
        //text is not a number(price is not valid)
        return await bot.sendMessage(msg.from.id, 'price is not valid', {
          reply_markup: { force_reply: true }
        })
      }
      //price is valid
      talent_details.price = msg.text
      return await bot.sendMessage(
        msg.from.id,
        'write a description about your service and what you offer as the talent\nmax 200 characters',
        { reply_markup: { force_reply: true } }
      )
    }
    if (
      msg.reply_to_message &&
      (/write a description/i.test(msg.reply_to_message.text) ||
        msg.reply_to_message.text == 'not more than 200 characters')
    ) {
      if (msg.text.length > 200) {
        return await bot.sendMessage(
          msg.from.id,
          'not more than 200 characters',
          { reply_markup: { force_reply: true } }
        )
      }
      console.log('desc valid');
      talent_details.description = msg.text;
      console.log(talent_details);
    }
  })
  bot.on('message', async(msg) => {
    if (msg.photo) {
        // Get the largest size of the photo (last element in the 'photo' array)
        const largestSizePhoto = msg.photo[msg.photo.length - 1];
        const file_id = largestSizePhoto.file_id;

        // Use 'getFile' method to get more information about the image file
        bot.getFile(file_id).then(async(fileInfo) => {
            console.log(fileInfo);
          const photoURL = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileInfo.file_path}`;

          // 'photoURL' now contains the valid URL of the image sent by the user
          console.log('Photo URL:', photoURL);
          //await bot.sendPhoto(msg.from.id,photoURL)
        });
        bot.getFileLink(file_id).then(data=>{
            console.log('data');
            console.log(data);
        })
      }
  });
}
