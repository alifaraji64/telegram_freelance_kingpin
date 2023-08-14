import { bot } from '../../../index.js'
import { withdrawalPaidOut } from './db.js'
export const adminPaidOut = async msg => {
  const withdrawalId = msg.data.split('/')[2]
  try {
    let withdrawal = await withdrawalPaidOut(withdrawalId)
    //deleting the paid out message from the channel
    await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
    const receiver = withdrawal.receiver
    await bot.sendMessage(
      receiver,
      'we have processed your withdrawal request and sent the respective amount to your address✅'
    )
  } catch (error) {
    console.log(error)
    return bot.sendMessage(
      msg.from.id,
      'an unknown error occured while paying out the withdrawal'
    )
  }
  return
}
