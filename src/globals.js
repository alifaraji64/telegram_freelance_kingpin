import { Talent } from './models/Talent.js'

export const talentCaption = (talent, category) => `
${talent.firstname} \n${category.description}\n🆔 @${
  talent.username
} \n💰starting price: $${category.price} \n ⭐rating: ${
  talent.rating.total / talent.rating.qty
}/5`

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
export const talents = [
  new Talent({
    username: 'kingping',
    firstname: 'chris',
    rating: {
      qty: 4,
      total: 10
    },
    image:
      'https://pbs.twimg.com/profile_images/1562188825366892544/PvfYbkNO_400x400.jpg',
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
    username: 'masterjan12',
    firstname: 'masterjan',
    rating: {
      qty: 4,
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