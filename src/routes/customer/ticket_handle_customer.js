import { bot } from '../../../index.js'
export const ticketHandleCustomer = async msg => {
  const id = msg.from.id
  await bot.sendMessage(id, 'here are my tickets')
}
