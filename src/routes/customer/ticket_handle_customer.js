import { bot } from '../../../index.js'
import { loadTickets } from './db.js'
export const ticketHandleCustomer = async msg => {
  const { id, username } = msg.from

  let tickets = await loadTickets(id, '@' + username)
  for (const ticket of tickets) {
    await bot.sendMessage(
      id,
      `${ticket.description}\n\nprice:${ticket.price}`,
      { reply_markup: { inline_keyboard: {} } }
    )
  }
}
