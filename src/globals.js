import axios from 'axios'
import { bot } from '../index.js'
import { Talent } from './models/Talent.js'

export const channelId = -1001947838378
export const talentCaption = (talent, category) => `
${talent.firstname} \n\n${category.description}\n\n🆔 @${
  talent.username
} \n💰starting price: $${category.price} \n ⭐rating: ${
  talent.rating.total == 0
    ? 'no rating yet'
    : talent.rating.total / talent.rating.qty + '/5'
}`

export const talentText = `thanks for choosing Gigpin\n
we know without the developers and freelancers we couldn't make it this far\n
please make sure to read the FAQ section as well for further information about gigpin\n
here is how gigpin works for freelancers in a nutshell:\n\n
1- you create your gig(s) and we'll recommend you to the clients based on your ratings\n
2- we will give all our new freelancers a fair chance, even if you don't have any ratings, you won't be ghosted\n
3- the client will reach out to you by your username in private messages\n
4- it is very important to keep your username when you created a gig\n
5- after talking about the details of the project with your client you can create a ticket for them\n
6- when your client pays the ticket, you'll be notified\n
7- when the client agrees that the project is completed, you can withdraw your money\n
8- withdrawing money is only available through crypto (USDT TRON network)\n
9- our team will process the withdrawal request and send the amount to your address\n`

export const faqText = `1) what is Gigpin?\n
Gigpin is a freelancing platform that aims to connect people looking to get projects done with skilled individuals who can provide those services\n
2) why should I choose Gigpin over other freelancing platforms?\n
in a nutshell, to save/make more money and do it as fast and as easy as possible\n
3) how Gigpin is more budget-friendly than other platforms?\n
With just a 7% fee, our platform empowers you to keep more of what you earn. this number for most platforms is above 20%\n
4) other than low fees is there any other benefit to using Gigpin?\n
Gigpin is a telegram bot, which means joining the platform is as easy as clicking the start button, with no registration, and no email confirmation. also, all the payments and withdrawals in Gigpin are done with crypto, to make everything as accessible and as easy as possible.\n
5) how can I make sure the freelancer is going to deliver my project after the payment?\n
the freelancer gets the paid amount when you agree that the project is completed. until your confirmation, we keep the money\n
6) what happens if I deliver the project but the buyer doesn't mark it as completed?\n
if such a conflict happens that the freelancer claims the project is done but the buyer disagrees, we will handle the conflict after talking to both sides\n`

export const fetchImageFromURL = async url => {
  console.log(url)
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    return response.data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch image from URL.')
  }
}

export const sendTalents = async (talents, job, id, bot) => {
  if (talents.length == 0) return bot.sendMessage(id, 'no more talents to load')
  for (const [index, talent] of talents.entries()) {
    let category = talent.categories.find(category => category.name == job)
    const bannerData = await fetchImageFromURL(category.banner)
    await bot.sendPhoto(id, Buffer.from(bannerData), {
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
}

export const askForBanner = async chatId => {
  return await bot.sendMessage(
    chatId,
    'send an image that will be the banner for this gig',
    { reply_markup: { force_reply: true } }
  )
}
export const askForDescription = async chatId => {
  return await bot.sendMessage(
    chatId,
    'write a description about your service and what you offer as the talent\nmax 200 characters',
    { reply_markup: { force_reply: true } }
  )
}
export const askForPrice = async chatId => {
  return await bot.sendMessage(
    chatId,
    'send me the starting price for this service',
    { reply_markup: { force_reply: true } }
  )
}

export const withdrawThreshold = 10

export const gigOperationsButtons = [
  [
    {
      text: 'update description',
      callback_data: 'gig/update_description'
    },
    { text: 'update price', callback_data: 'gig/update_price' }
  ],
  [
    { text: 'update banner', callback_data: 'gig/update_banner' },
    { text: 'X delete this gig X', callback_data: 'gig/delete' }
  ]
]

export const jobs = [
  [
    {
      text: 'web app',
      callback_data: 'job/web_app'
    },
    {
      text: 'mobile app',
      callback_data: 'job/mobile_app'
    },
    {
      text: 'web3/dapp',
      callback_data: 'job/dapp'
    }
  ],
  [
    {
      text: 'design',
      callback_data: 'job/design'
    },
    {
      text: 'illustration',
      callback_data: 'job/illustration'
    },
    {
      text: 'A.I.',
      callback_data: 'job/ai'
    }
  ],
  [
    {
      text: 'game',
      callback_data: 'job/game'
    },
    {
      text: 'network',
      callback_data: 'job/network'
    },
    {
      text: 'social media manager',
      callback_data: 'job/social_media_manager'
    }
  ]
]
export const registeringTalents = [
  [
    {
      text: 'web app',
      callback_data: 'register_talent/web_app'
    },
    {
      text: 'mobile app',
      callback_data: 'register_talent/mobile_app'
    },
    {
      text: 'web3/dapp',
      callback_data: 'register_talent/dapp'
    }
  ],
  [
    {
      text: 'design',
      callback_data: 'register_talent/design'
    },
    {
      text: 'illustration',
      callback_data: 'register_talent/illustration'
    },
    {
      text: 'A.I.',
      callback_data: 'register_talent/ai'
    }
  ],
  [
    {
      text: 'game',
      callback_data: 'register_talent/game'
    },
    {
      text: 'network',
      callback_data: 'register_talent/network'
    },
    {
      text: 'social media manager',
      callback_data: 'register_talent/social_media_manager'
    }
  ]
]
export const talents = [
  new Talent({
    userId: '1',
    username: 'kingping',
    firstname: 'chris',
    rating: {
      qty: 4,
      total: 10
    },
    categories: [
      {
        name: 'web_app',
        description: 'I will develop web apps with react and nodejs',
        banner:
          'https://pbs.twimg.com/profile_banners/1323316082397089793/1674081414/1080x360',
        price: 20
      }
    ]
  }),
  new Talent({
    userId: '2',
    username: 'eliza.eth',
    firstname: 'eliza',
    rating: {
      qty: 4,
      total: 12
    },
    image:
      'https://pbs.twimg.com/profile_images/1639724269159456769/3w701fkh_400x400.png',
    categories: [
      {
        name: 'web_app',
        description: 'I will develop web apps with vue and express',
        banner:
          'https://pbs.twimg.com/profile_banners/1516992030139985921/1679782996/1500x500',
        price: 25
      }
    ]
  }),
  new Talent({
    userId: '3',
    username: 'noah.eth',
    firstname: 'noah',
    rating: {
      qty: 4,
      total: 16
    },
    image:
      'https://pbs.twimg.com/profile_images/1650846039002214402/x_dAGmve_400x400.jpg',
    categories: [
      {
        name: 'web_app',
        description: 'I will develop web apps with sveletejs',
        banner:
          'https://pbs.twimg.com/profile_banners/1551558508084068355/1686400721/1080x360',
        price: 20
      },
      {
        name: 'mobile_app',
        description: 'I will develop mobile apps with flutter and express',
        banner:
          'https://pbs.twimg.com/profile_banners/1551558508084068355/1686400721/1080x360',
        price: 25
      }
    ]
  }),
  new Talent({
    userId: '4',
    username: 'masterjan12',
    firstname: 'masterjan',
    rating: {
      qty: 6,
      total: 18
    },
    image:
      'https://pbs.twimg.com/profile_images/1674412187690074112/yJVrtyFm_400x400.png',
    categories: [
      {
        name: 'web_app',
        description: 'I will develop web apps with master.js',
        banner:
          'https://pbs.twimg.com/profile_banners/1586289584220012544/1686836191/1080x360',
        price: 50
      },
      {
        name: 'mobile_app',
        description: 'I will develop mobile apps javaaa and dart',
        banner:
          'https://pbs.twimg.com/profile_banners/1586289584220012544/1686836191/1080x360',
        price: 60
      }
    ]
  })
]
export const checkTheReply = (msg, replyText, errorText = '') => {
  let repltRegex = new RegExp(replyText)
  let errorRegex = new RegExp(errorText)
  let isValidReply =
    msg.reply_to_message &&
    (repltRegex.test(msg.reply_to_message.text) ||
      errorRegex.test(msg.reply_to_message.text))
  return isValidReply
}
