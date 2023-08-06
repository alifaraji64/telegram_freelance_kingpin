import axios from 'axios'
import { bot, supabase, web3Storage } from '../../../index.js'
import { saveTalentToDB } from './db.js'
import { File } from 'web3.storage'
import { fetchImageFromURL } from '../../globals.js'
const uploadImageToSupabaseStorage = async (imageData, fileName) => {
  const imageFile = new File([imageData], 'banner.jpg', { type: 'image/*' })
  const rootCid = await web3Storage.put([imageFile]).catch(console.log)
  return rootCid
}
export const bannerHandle = talent_details => {
  bot.on('message', async msg => {
    if (
      msg.photo &&
      msg.reply_to_message &&
      msg.reply_to_message.text &&
      /will be the banner/i.test(msg.reply_to_message.text)
    ) {
      // Get the largest size of the photo (last element in the 'photo' array)
      await bot.sendMessage(msg.from.id, 'wait a few seconds...')
      const file_id = msg.photo[msg.photo.length - 1].file_id
      const photoURL = await bot.getFileLink(file_id)
      const photoData = await fetchImageFromURL(photoURL)
      const cid = await uploadImageToSupabaseStorage(photoData, file_id)
      const bannerUrl = cid && `https://${cid}.ipfs.dweb.link/banner.jpg`
      talent_details.banner = bannerUrl
      console.log(talent_details)
      saveTalentToDB(msg, talent_details).then(async () => {
        await bot.sendMessage(msg.from.id, 'your gig successfully created ✅')
      })
    }
  })
}
