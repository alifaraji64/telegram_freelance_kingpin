import { Category } from '../../models/Category.js'
import { Talent } from '../../models/Talent.js'
export const saveTalentToDB = async (msg, talent_details) => {
  if (
    !talent_details.category_name ||
    !talent_details.banner ||
    !talent_details.price ||
    !talent_details.description
  )
    return
  let newCategory = new Category({
    name: talent_details.category_name,
    description: talent_details.description,
    banner: talent_details.banner,
    price: talent_details.price
  })
  let gig = await Talent.findOne({ userId: msg.from.id })
  //gig exists push the category to existing array
  if (gig) {
    //update the category array
    await Talent.findOneAndUpdate(
      { userId: msg.from.id },
      { $push: { categories: newCategory } },
      { new: true }
    )
    console.log('categories array updated')
    return
  }
  //create a new document, gig doesn't exist
  new Talent({
    userId: msg.from.id,
    username: msg.from.username,
    firstname: msg.from.first_name,
    categories: [newCategory]
  })
    .save()
    .then(() => console.log('saved'))
    .catch(console.log)
}
export const myGigs = async id =>
  await Talent.findOne({ userId: id })
    .select('categories.description')
    .select('categories._id')

export const getGigDetails = async gigId => {
  console.log(gigId)
  return await Talent.findOne({ categories: { $elemMatch: { _id: gigId } } }).select('categories')
}
