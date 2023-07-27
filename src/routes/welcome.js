import { bot } from '../../index.js'

const welcomeF = () => {
  bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id
    bot.sendMessage(
      chatId,
      `welcome to kingpinGig where you can start hiring developers, designers and engineers for your dream project
      \n choose which one you want to countine as`,
      {
        reply_markup: {
          keyboard: [
            [
              'I wanna hire people for my project',
              'I wanna work as a freelancer'
            ]
          ]
        }
      }
    )
  })
  bot.onText(/I wanna hire people for my project/, msg => {
    const chatId = msg.chat.id
    console.log('woho')
    bot.sendMessage(chatId, 'select the type of your project', {
      reply_markup: {
        inline_keyboard: [
          [
            //   [{text:'jhkjhk',}, 'mobile app', 'web3/dapps'],
            //   ['design', 'illustration', 'AI'],
            //   ['game', 'network', 'social media manager']
            {
              text: 'Yes',
              callback_data: 'btn_yes'
            },
            {
              text: 'No',
              callback_data: 'btn_no'
            }
          ]
        ]
      }
    })
  })

  bot.onText(/mobile app/, msg => {
    console.log(msg)
  })
}

export default welcomeF
