import { bot } from '../../../index.js'
import { myGigs } from '../freelancer/db.js'

export const menuHandle = () => {
  bot.onText(/\/mygigs/, async msg => {
    console.log('mygigs')
    let mygigs = await myGigs(msg.from.id)
    console.log(mygigs);
  })
}
