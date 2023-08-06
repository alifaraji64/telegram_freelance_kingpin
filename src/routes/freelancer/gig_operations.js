import axios from 'axios'
import { bot } from '../../../index.js'
import {
  fetchImageFromURL,
  gigOperationsButtons,
  talentCaption
} from '../../globals.js'
import {
  deleteGig,
  getGigDetails,
  updateBanner,
  updateDescription,
  updatePrice
} from './db.js'
export const gigOperations = () => {
  let categoryIdToBeChanged
  bot.on('message', async msg => {
    const id = msg.from.id
    if (msg.reply_to_message) {
      if (msg.reply_to_message.text == 'send your new description') {
        await updateDescription(id, categoryIdToBeChanged, msg.text)
        await bot.sendMessage(id, 'description updated successfully ✅')
      }
      if (msg.reply_to_message.text == 'send your new price') {
        await updatePrice(id, categoryIdToBeChanged, msg.text)
        await bot.sendMessage(id, 'price updated successfully ✅')
      }
      if (msg.reply_to_message.text == 'send your new banner' && msg.photo) {
        const largestSizePhoto = msg.photo[msg.photo.length - 1]
        const file_id = largestSizePhoto.file_id
        const photoURL = await bot.getFileLink(file_id)
        await updateBanner(id, categoryIdToBeChanged, photoURL)
        await bot.sendMessage(id, 'banner updated successfully ✅')
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
        console.log('categoryId: ' + categoryId)
        const photoData = await fetchImageFromURL(gigDetails.category.banner)
        await bot.sendPhoto(id, Buffer.from(photoData), {
          caption: talentCaption(gigDetails.talent, gigDetails.category),
          //sending the inline keyboard only with the last talent
          reply_markup: {
            inline_keyboard: gigOperationsButtons
          }
        })
        categoryIdToBeChanged = categoryId
      }
      //updatng the description
      if (msg.data.split('/')[1] == 'update_description') {
        await bot.sendMessage(id, 'send your new description', {
          reply_markup: { force_reply: true }
        })
      }
      //updating the price
      if (msg.data.split('/')[1] == 'update_price') {
        await bot.sendMessage(id, 'send your new price', {
          reply_markup: { force_reply: true }
        })
      }
      if (msg.data.split('/')[1] == 'update_banner') {
        await bot.sendMessage(id, 'send your new banner', {
          reply_markup: { force_reply: true }
        })
      }
      if (msg.data.split('/')[1] == 'delete') {
        await deleteGig(id, categoryIdToBeChanged)
        await bot.sendMessage(id, 'gig deleted successfully ✅')
      }
    }
  })
}
