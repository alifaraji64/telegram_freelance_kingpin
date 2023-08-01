import { bot } from '../index.js'
import { Talent } from './models/Talent.js'
export const talentCaption = (talent, category) => `
${talent.firstname} \n${category.description}\n🆔 @${
  talent.username
} \n💰starting price: $${category.price} \n ⭐rating: ${
  talent.rating.total / talent.rating.qty
}/5`

export const sendTalents = async (talents, job, id, bot) => {
  if (talents.length == 0) return bot.sendMessage(id, 'no more talents to load')
  for (const [index, talent] of talents.entries()) {
    let category = talent.categories.find(category => category.name == job)
    await bot.sendPhoto(id, category.banner, {
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
    userId:'1',
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
    userId:'2',
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
    userId:'3',
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
    userId:'4',
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
