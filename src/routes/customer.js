import { bot } from '../../index.js'
import { jobs, talentCaption } from '../globals.js'
import { Talent } from '../models/Talent.js'
export const Customer = () => {
  const LIMIT = 1
  let skip = LIMIT
  const getTalents = async job => {
    return await Talent.aggregate([
      {
        $match: {
          categories: { $elemMatch: { name: job } }
        }
      },
      {
        $addFields: {
          totalRating: {
            $divide: ['$rating.total', '$rating.qty']
          }
        }
      }
    ])
      .sort({ totalRating: -1 })
      .limit(LIMIT)
  }

  const load_talents = async(job)=>{
    return await Talent.aggregate([
      {
        $match: {
          categories: { $elemMatch: { name: job } }
        }
      },
      {
        $addFields: {
          totalRating: {
            $divide: ['$rating.total', '$rating.qty']
          }
        }
      }
    ])
      .sort({ totalRating: -1, 'rating.qty': 1 })
      .skip(skip)
      .limit(LIMIT)
  }
  bot.onText(/I wanna hire people for my project/, msg => {
    const chatId = msg.chat.id
    console.log('I wanna hire people')
    bot.sendMessage(chatId, 'select the type of your project', {
      reply_markup: {
        inline_keyboard: jobs
      }
    })
  })

  bot.on('callback_query', async callback_message => {
    const title = callback_message.data.split('/')[0] //job
    //send the talents with this category
    if (title == 'job') {
      const job = callback_message.data.split('/')[1] //dapp

      let talents = await getTalents(job)
      for (const [index, talent] of talents.entries()) {
        let category = talent.categories.find(category => category.name == job)
        await bot.sendPhoto(callback_message.from.id, category.banner, {
          caption: talentCaption(talent, category),
          //sending the inline keyboard only with the last talent
          reply_markup:
            index == talents.length - 1
              ? {
                  inline_keyboard: [
                    [
                      {
                        text: 'load more',
                        callback_data: 'load_more/' + job
                      }
                    ]
                  ]
                }
              : undefined
        })
      }
    } else if (title == 'load_more') {
      console.log('load more')
      const job = callback_message.data.split('/')[1] //dapp
      let talents = await load_talents(job)
      //skipping the elements we fetched before
      skip += LIMIT
      console.log(talents)
    }
  })
}
