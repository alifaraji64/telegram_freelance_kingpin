import axios from 'axios'
import { bot } from '../../../index.js'
import {
  changeIsCompleted,
  changeUnconfirmedBalance,
  loadTickets,
  updateRating
} from './db.js'
import { checkTheReply } from '../../globals.js'
const getRatingAndCompleteTheTicket = async (
  id,
  ticketId,
  ticketPrice,
  ticketCreator
) => {
  let rating
  await bot.sendMessage(
    id,
    'rate how satisfied you are with the project out of 5',
    { reply_markup: { force_reply: true } }
  )
  bot.on('message', async msg => {
    if (checkTheReply(msg, 'rate how satisfied', 'rating should be')) {
      if (isNaN(msg.text)) {
        return await bot.sendMessage(
          id,
          'rating should be a number between 0 and 5',
          { reply_markup: { force_reply: true } }
        )
      }
      if (Number(msg.text) > 5 || Number(msg.text) < 0) {
        return await bot.sendMessage(
          id,
          'rating should be a number between 0 and 5',
          { reply_markup: { force_reply: true } }
        )
      }
      rating = msg.text
      try {
        await changeIsCompleted(ticketId)
        await changeUnconfirmedBalance(ticketCreator, ticketPrice)
        await updateRating(ticketCreator,rating);
        await bot.sendMessage(id, 'done✔️');
        console.log(rating);
      } catch (error) {
        console.log(error)
        return bot.sendMessage(
          id,
          'an unknown error occured while marking the ticket as completed'
        )
      }
    }
  })
}
export const ticketHandleCustomer = async (msg, alreadyCalled) => {
  const { id, username } = msg.from

  !alreadyCalled
    ? bot.on('callback_query', async msg => {
        if (msg.data.split('/')[0] == 'complete_ticket') {
          //changing the isCompleted field
          const ticketId = msg.data.split('/')[1]
          const ticketPrice = msg.data.split('/')[2]
          const ticketCreator = msg.data.split('/')[3]
          await getRatingAndCompleteTheTicket(
            id,
            ticketId,
            ticketPrice,
            ticketCreator
          )
        }
      })
    : null

  try {
    let tickets = await loadTickets(id, '@' + username)
    if (tickets.length == 0)
      return await bot.sendMessage(id, 'no ticket has been created for you')
    for (const ticket of tickets) {
      let response =
        !ticket.isPaid &&
        (await axios({
          method: 'post',
          url: 'https://payid19.com/api/v1/create_invoice',
          data: {
            public_key: process.env.PAYID19_PUBLIC_KEY,
            private_key: process.env.PAYID19_PRIVATE_KEY,
            test: 1,
            price_amount: ticket.price,
            merchant_id: id,
            success_url: `http://localhost:3000/payid19?id=${id}&ticketId=${ticket._id}&amount=${ticket.price}`
          }
        }))
      await bot.sendMessage(
        id,
        `${ticket.description}\n\nprice:$${ticket.price}${
          ticket.isPaid ? "\n\nyou've paid for this ticket✔️" : ''
        }${ticket.isCompleted ? '\n\nthis project is completed✔️' : ''}`,
        {
          reply_markup: {
            inline_keyboard: [
              !ticket.isPaid
                ? [{ text: 'pay for this ticket', url: response.data.message }]
                : [],
              !ticket.isCompleted && ticket.isPaid
                ? [
                    {
                      text: 'mark this project as completed',
                      callback_data: `complete_ticket/${ticket._id}/${ticket.price}/${ticket.from}`
                    }
                  ]
                : []
            ]
          }
        }
      )
    }
  } catch (error) {
    console.log(error)
    return bot.sendMessage(
      id,
      'an unknown error occured while getting your tickets'
    )
  }
}
