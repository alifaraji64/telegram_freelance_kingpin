import axios from 'axios'
import { bot } from '../../../index.js'
import { gigOperationsButtons, talentCaption } from '../../globals.js'
import { getGigDetails, updateDescription } from './db.js'
export const gigOperations = () => {
  let categoryIdToBeChanged
  bot.onText(/./, async msg => {
    const id = msg.from.id
    if (msg.reply_to_message) {
      if (msg.reply_to_message.text == 'send your new description') {
        console.log('this is new desc ' + msg.text)
        await updateDescription(id, categoryIdToBeChanged, msg.text)
        await bot.sendMessage(id, 'description updated successfully ✅')
      }
    }
  })
  bot.on('callback_query', async msg => {
    const id = msg.from.id
    if (msg.data.split('/')[0] == 'gig') {
      //displaying the gig
      if (msg.data.split('/')[1] == 'display') {
        const categoryId = msg.data.split('/')[2]
        let gigDetails = await getGigDetails(
          categoryId,
          id,
          msg.from.username,
          msg.from.first_name
        )
        const response = await axios.get(gigDetails.category.banner, {
          responseType: 'arraybuffer'
        })
        await bot.sendPhoto(id, Buffer.from(response.data), {
          caption: talentCaption(gigDetails.talent, gigDetails.category),
          //sending the inline keyboard only with the last talent
          reply_markup: {
            inline_keyboard: gigOperationsButtons
          }
        })
        categoryIdToBeChanged = categoryId
      }
      if (msg.data.split('/')[1] == 'update_description') {
        await bot.sendMessage(id, 'send your new description', {
          reply_markup: { force_reply: true }
        })
      }
    }
  })
}
