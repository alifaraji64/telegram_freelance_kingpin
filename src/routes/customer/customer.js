import { bot } from '../../../index.js'
import { jobs, sendTalents, talentCaption } from '../../globals.js'
import { Talent } from '../../models/Talent.js'
import { getTalents, loadTalents } from './db.js'
export const Customer = () => {
  const LIMIT = 2
  let skip = LIMIT
  bot.onText(/I wanna hire people for my project/, msg => {
    const chatId = msg.chat.id
    console.log('I wanna hire people')
    bot.sendMessage(chatId, 'select the type of your project', {
      reply_markup: {
        inline_keyboard: jobs
      }
    })
  })

  bot.on('callback_query', async msg => {
    const title = msg.data.split('/')[0] //job
    //send the talents with this category
    if (title == 'job') {
      const job = msg.data.split('/')[1] //dapp

      let talents = await getTalents(job, LIMIT)
      await sendTalents(talents, job, msg.from.id, bot)
    } else if (title == 'load_more') {
      const job = msg.data.split('/')[1] //dapp
      let talents = await loadTalents(job, LIMIT, skip)
      //skipping the elements we fetched before
      await sendTalents(talents, job, msg.from.id, bot)
      skip += LIMIT
      console.log(talents)
    }
  })
}
