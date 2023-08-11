import axios from 'axios'
import { bot } from '../../../index.js'
import { loadTickets } from './db.js'
export const ticketHandleCustomer = async msg => {
  const { id, username } = msg.from

  let tickets = await loadTickets(id, '@' + username)
  if (tickets.length == 0)
    return await bot.sendMessage(id, 'no ticket has been created for you')
  for (const ticket of tickets) {
    let response = await axios({
      method: 'post',
      url: 'https://payid19.com/api/v1/create_invoice',
      data: {
        public_key: process.env.PAYID19_PUBLIC_KEY,
        private_key: process.env.PAYID19_PRIVATE_KEY,
        test: 1,
        price_amount: ticket.price,
        merchant_id: id,
        success_url: `http://localhost:3000/payid19?id=${id}&ticketId=${ticket._id}`
      }
    })
    await bot.sendMessage(
      id,
      `${ticket.description}\n\nprice:${ticket.price}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'pay for this ticket', url: response.data.message }]
          ]
        }
      }
    )
  }
}
