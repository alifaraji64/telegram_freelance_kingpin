import axios from 'axios'
import { bot } from '../../../index.js'
import tgresolve from 'tg-resolve'
import { createTicket } from './db.js'
export const ticketHandle = async msg => {
  let ticket = { price: '', to: '' }
  const id = msg.from.id
  await bot.sendMessage(
    id,
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
        return await bot.sendMessage(id, 'username format is incorrect', {
          reply_markup: { force_reply: true }
        })
      ticket.to = username
      await bot.sendMessage(
        id,
        'send me the price that your client must pay $$',
        {
          reply_markup: { force_reply: true }
        }
      )
    }
    if (
      msg.reply_to_message &&
      (/send me the price that/.test(msg.reply_to_message.text) ||
        /price should be a number/.test(msg.reply_to_message.text))
    ) {
      const price = msg.text
      if (isNaN(price)) {
        return await bot.sendMessage(id, 'price should be a number', {
          reply_markup: { force_reply: true }
        })
      }
      ticket.price = price
      await createTicket(ticket.price, ticket.to, id)
      await bot.sendMessage(
        id,
        `you succesfully created a ticket for ${ticket.to} \n\nonce they paid the specified amount you'll be notified`
      )
    }
  })
}
