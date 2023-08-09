import { bot } from '../../../index.js'
import { loadTickets } from './db.js'
export const ticketHandleCustomer = async msg => {
  const { id, username } = msg.from

  await loadTickets(id, '@' + username)
}
