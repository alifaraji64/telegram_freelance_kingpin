import axios from 'axios'
import { bot } from '../../index.js'
import {
  askForBanner,
  askForDescription,
  askForPrice,
  registeringTalents
} from '../globals.js'
import { Talent } from '../models/Talent.js'
import { bannerHandle } from './freelancer/banner_handle.js'

export const Freelancer = () => {
  let talent_details = {
    category_name: '',
    banner: '',
    price: '',
    description: ''
  }
  bot.on('callback_query', async msg => {
    console.log(msg)
    if (msg.data == 'register_start') {
      return await bot.sendMessage(
        msg.from.id,
        'select the field you want to work \n\nyou can add more later on, just select one for now',
        {
          reply_markup: { inline_keyboard: registeringTalents }
        }
      )
    }
    if (msg.data.split('/')[0] == 'register_talent') {
      const field = msg.data.split('/')[1]
      talent_details.category_name = field
      try {
        await askForPrice(msg.from.id)
      } catch (error) {
        console.log(error)
      }
    }
  })
  bot.onText(/./, async msg => {
    if (msg.text == 'I wanna work as a freelancer') {
      return await bot.sendMessage(
        msg.from.id,
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
    }
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
      await askForDescription(msg.from.id)
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
      //desc is valid
      talent_details.description = msg.text
      await askForBanner(msg.from.id)
    }
  })
  bannerHandle(talent_details);
}
