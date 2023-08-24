import axios from 'axios'
import { bot } from '../../../index.js'
import tgresolve from 'tg-resolve'
import {
  createTicket,
  getMyBalance,
  getTickets,
  resetBalance,
  saveWithdrawReq
} from './db.js'
import { channelId, checkTheReply, withdrawThreshold } from '../../globals.js'
import { withdrawalPaidOut } from '../admin/db.js'
import { adminPaidOut } from '../admin/payout.js'
export const createTicketHandle = async (msg, alreadyCalled) => {
  let ticket = { price: '', to: '', description: '' }
  const id = msg.from.id
  await bot.sendMessage(
    id,
    'send me the username of the person you want to create a ticket for\n✔️correct format:@john_doe',
    { reply_markup: { force_reply: true } }
  )
  //bot.ontext causes problems if multiple instnce is running, only call if it is the first time
  !alreadyCalled
    ? bot.on('message', async msg => {
        if (
          checkTheReply(
            msg,
            'send me the username',
            'username format is incorrect'
          )
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
          checkTheReply(
            msg,
            'send me the price that',
            'price should be a number'
          )
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

          try {
            await createTicket(ticket.price, ticket.to, ticket.description, id)
            bot.sendMessage(
              id,
              `you succesfully created a ticket for ${ticket.to} \n\nonce they paid the specified amount you'll be notified\n\nalso you can get the status of your tickets by clicking the /tickets_created_by_me in the menu`
            )
          } catch (error) {
            return bot.sendMessage(
              from,
              'an unknown error occured while saving the ticket'
            )
          }
        }
      })
    : null
  alreadyCalled = true
}

export const getTicketHandle = async (msg, alreadyCalled) => {
  const { id } = msg.from
  let tickets = await getTickets(id)
  console.log(tickets)
  bot.sendMessage(id, 'select the specific ticket for more details', {
    reply_markup: {
      inline_keyboard: tickets.map(ticket => {
        // Create a new array with a single object based on the properties of the original object
        return [
          {
            text: ticket.description,
            callback_data: `ticket/${ticket.id}/${ticket.to}/${ticket.isPaid}/${ticket.isCompleted}`
          }
        ]
      })
    }
  })
  !alreadyCalled
    ? bot.on('callback_query', async msg => {
        const data = msg.data.split('/')
        if (data[0] == 'ticket') {
          const tikcetId = data[1]
          const to = data[2]
          const isPaid = data[3]
          const isCompleted = data[4]
          console.log(data[3])
          await bot.sendMessage(
            id,
            `to: ${to}\n\n${
              isPaid == 'true'
                ? "your client paid for this ticket✔️"
                : "client hasn't paid for this ticket yet❌"
            }\n\n${
              isCompleted == 'true'
                ? "client agreed this project is completed✔️"
                : "client hasn't agreed for the completion of the project❌"
            }`
          )
        }
      })
    : null
}

export const myBalanceHandle = async (msg, alreadyCalled) => {
  const id = msg.from.id
  try {
    let balance = await getMyBalance(id)
    if(!balance){
      return bot.sendMessage(id, 'only talents can check their balance')
    }
    const condition = balance >= withdrawThreshold
    await bot.sendMessage(
      id,
      `your balance is: $${balance}${
        condition ? '' : '\n\n the minimun amount for a withdrawal is 10$'
      }`,
      {
        reply_markup: {
          inline_keyboard: [
            condition
              ? [
                  {
                    text: 'withdraw your balance',
                    callback_data: 'withdraw/' + balance
                  }
                ]
              : []
          ]
        }
      }
    )
  } catch (error) {
    console.log(error)
    return bot.sendMessage(
      id,
      'an unknown error occured while getting your balance'
    )
  }

  !alreadyCalled
    ? bot.on('callback_query', async msg => {
        const id = msg.from.id
        if (msg.data.split('/')[0] == 'withdraw') {
          if (msg.data.split('/')[1] == 'paid_out') {
            console.log('fsdf');
            await adminPaidOut(msg)
            return
          }
          const balance = msg.data.split('/')[1]
          await bot.sendMessage(
            id,
            'send your USDT TRC-20 address\n\nthe withdrawals only happen on TRON network(TRC-20)',
            { reply_markup: { force_reply: true } }
          )
        }
      })
    : null

  !alreadyCalled
    ? bot.on('message', async msg => {
        const id = msg.from.id
        if (/send your USDT/.test(msg.reply_to_message.text)) {
          console.log(checkTheReply(msg, 'send your USDT'))
          console.log('test')
          const amount = await getMyBalance(id)
          const address = msg.text
          const receiver = id
          try {
            let withdrawal = await saveWithdrawReq(amount, address, receiver)
            await resetBalance(id)
            await bot.sendMessage(
              channelId,
              `withdrawal request\n\namount: $${amount}\n\naddress: ${address}`,
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: 'paid out',
                        callback_data: 'withdraw/paid_out/' + withdrawal._id
                      }
                    ]
                  ]
                }
              }
            )
            await bot.sendMessage(
              id,
              'your withdrawal request has been submitted\n\nwe will send the amount shortly to your address'
            )
          } catch (error) {
            console.log(error)
            return bot.sendMessage(
              id,
              'an unknown error occured while saving the withdrawal request'
            )
          }
        }
      })
    : null
}
