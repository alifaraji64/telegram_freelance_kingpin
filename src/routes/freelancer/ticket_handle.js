import axios from 'axios'
import { bot } from '../../../index.js'
import tgresolve from 'tg-resolve'
import { createTicket } from './db.js'
const checkTheReply = (msg, replyText, errorText) => {
  let repltRegex = new RegExp(replyText)
  let errorRegex = new RegExp(errorText)
  let isValidReply =
    msg.reply_to_message &&
    (repltRegex.test(msg.reply_to_message.text) ||
      errorRegex.test(msg.reply_to_message.text))
  return isValidReply
}
export const ticketHandle = async (msg,alreadyCalled) => {
  let ticket = { price: '', to: '', description: '' }
  const id = msg.from.id
  await bot.sendMessage(
    id,
    'send me the username of the person you want to create a ticket for\n✔️correct format:@john_doe',
    { reply_markup: { force_reply: true } }
  )
  //bot.ontext causes problems if multiple instnce is running, only call if it is the first time
  !alreadyCalled ?
  bot.onText(/./, async msg => {
    if (
      checkTheReply(msg, 'send me the username', 'username format is incorrect')
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
      checkTheReply(msg, 'send me the price that', 'price should be a number')
    ) {
      const price = msg.text
      if (isNaN(price))
        return await bot.sendMessage(id, 'price should be a number', {
          reply_markup: { force_reply: true }
        })

      ticket.price = price
      await bot.sendMessage(
        id,
        'write a short description for this ticket\nmax 100 characters',
        { reply_markup: { force_reply: true } }
      )
    }
    if (
      checkTheReply(
        msg,
        'write a short description for this ticket',
        'description has more than 100'
      )
    ) {
      const description = msg.text
      if (description.length > 100)
        return await bot.sendMessage(
          id,
          'description has more than 100 characters',
          {
            reply_markup: { force_reply: true }
          }
        )
      ticket.description = description
      console.log(ticket)
      createTicket(ticket.price, ticket.to, ticket.description, id).then(() => {
        bot.sendMessage(
          id,
          `you succesfully created a ticket for ${ticket.to} \n\nonce they paid the specified amount you'll be notified\n\nalso you can get the status of your tickets by clicking the /tickets_created_by_me in the menu`
        )
      })
    }
    return;
  }):null;
  alreadyCalled=true;

}
