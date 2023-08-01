import { bot } from "../../../index.js"
import { saveTalentToDB } from "./db.js"
export const bannerHandle = (talent_details) => {
  bot.on('message', async msg => {
    if (
      msg.photo &&
      msg.reply_to_message&&
      msg.reply_to_message.text &&
      /will be the banner/i.test(msg.reply_to_message.text)
    ) {
      // Get the largest size of the photo (last element in the 'photo' array)

        const largestSizePhoto = msg.photo[msg.photo.length - 1]
        const file_id = largestSizePhoto.file_id
        const photoURL = await bot.getFileLink(file_id)
        talent_details.banner = photoURL
        console.log(talent_details)
        saveTalentToDB(msg,talent_details).then(async()=>{
          await bot.sendMessage(msg.from.id, 'your gig successfully created ✅')
        })
      console.log('banner got')
    }
  })
}
