import mongoose from 'mongoose'
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

export const getGigDetails = async (gigId, userId, username, first_name) => {
  console.log(gigId)
  try {
    let data = await Talent.findOne({ userId })
      .select('categories')
      .select('rating')

    //this will return an array only with the category that is selected
    let categoryData = data.categories.filter(
      category => category._id !== gigId
    )
    // data=>{
    //   rating: { qty: 0, total: 0 },
    //   _id: new ObjectId("64c9a9486c991250ca35ab88"),
    //   categories: [ [Object] ]
    // }
    //adding username and firstname to data object
    data.username = username
    data.firstname = first_name
    return { talent: data, category: categoryData[0] }
  } catch (e) {
    console.log(e)
  }
}

export const updateDescription = async (userId, categoryId, newDescription) => {
  try {
    let talent = await Talent.findOne({ userId })
    let category = talent.categories.find(c => c._id == categoryId)
    category['description'] = newDescription;
    await talent.save();
    console.log('updated');
  } catch (e) {
    console.log(e)
  }
}
