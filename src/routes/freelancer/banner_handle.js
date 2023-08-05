import axios from 'axios'
import { bot, supabase, web3Storage } from '../../../index.js'
import { saveTalentToDB } from './db.js'
import { File } from 'web3.storage'
const fetchImageFromURL = async url => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    return response.data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch image from URL.')
  }
}
const uploadImageToSupabaseStorage = async (imageData, fileName) => {
  // try {
  //   // Upload the image data to Supabase Storage
  //   const { data, error } = await supabase.storage
  //     .from('banners')
  //     .upload(fileName, imageData)
  //   console.log(data)
  //   if (error) {
  //     console.log('bang')
  //     console.log(error)
  //     if (error.error == 'Duplicate') {
  //       return { path: fileName }
  //     }
  //     throw new Error('Failed to upload image to Supabase Storage.')
  //   }

  //   // The `data` object contains information about the uploaded file
  //   console.log(data)
  //   return data;
  // } catch (error) {
  //   console.log(error)
  //   throw new Error('Failed to upload image to Supabase Storage.')
  // }
  const imageFile = new File([imageData], 'test.jpg', { type: 'image/*' })
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
      const bannerUrl = `https://${cid}.ipfs.dweb.link/test.jpg`
      const bannerData = await fetchImageFromURL(bannerUrl)
      await bot.sendPhoto(msg.from.id, Buffer.from(bannerData))
      talent_details.banner = photoURL
      console.log(talent_details)
      // saveTalentToDB(msg, talent_details).then(async () => {
      //   await bot.sendMessage(msg.from.id, 'your gig successfully created ✅')
      // })
      // console.log('banner got')
    }
  })
}
