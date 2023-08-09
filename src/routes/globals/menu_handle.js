import { bot } from '../../../index.js'
import { registeringTalents } from '../../globals.js'
import { ticketHandleCustomer } from '../customer/ticket_handle_customer.js'
import { myGigs } from '../freelancer/db.js'
import { ticketHandle } from '../freelancer/ticket_handle.js'
export const menuHandle = () => {
  let alreadyCalled = false
  bot.onText(/\/my_gigs/, async msg => {
    console.log('mygigs')
    let mygigs = await myGigs(msg.from.id)
    console.log(mygigs)
    mygigs
      ? await bot.sendMessage(
          msg.from.id,
          `select the gig you want to check or update ⬇️`,
          {
            reply_markup: {
              inline_keyboard: mygigs.categories.map(category => [
                {
                  text: category.description,
                  callback_data: 'gig/display/' + category._id
                }
              ])
            }
          }
        )
      : await bot.sendMessage(msg.from.id, "you don't have any gigs yet", {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'create a gig', callback_data: 'register_start' }]
            ]
          }
        })
  })

  bot.onText(/\/create_gig/, async msg => {
    await bot.sendMessage(
      msg.from.id,
      'select the field you want to work \n\nyou can add more later on, just select one for now',
      {
        reply_markup: { inline_keyboard: registeringTalents }
      }
    )
  })

  bot.onText(/\/create_ticket/, async msg => {
    ticketHandle(msg, alreadyCalled).then(() => {
      alreadyCalled = true
    })
  })
  bot.onText(/\/tickets_created_for_me/, async msg => {
    ticketHandleCustomer(msg).catch(console.log)
  })
  bot.onText(/\tickets_created_by_me/, async msg => {})
}
