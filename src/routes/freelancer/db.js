import mongoose from 'mongoose'
import { Category } from '../../models/Category.js'
import { Talent } from '../../models/Talent.js'
import { Ticket } from '../../models/Ticket.js'
import { bot } from '../../../index.js'
import { Withdrawal } from '../../models/Withdrawal.js'
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
    .catch(error => {
      return bot.sendMessage(
        userId,
        'an unknown error occured while getting your gig'
      )
    })
}
export const myGigs = async id => {
  return await Talent.findOne({ userId: id })
    .select('categories.description')
    .select('categories._id')
}

export const getGigDetails = async (
  categoryId,
  userId,
  username,
  first_name
) => {
  console.log(categoryId)
  try {
    let data = await Talent.findOne({ userId })
      .select('categories')
      .select('rating')
    //this will return an array only with the category that is selected
    let categoryData = data.categories.filter(category => {
      return category._id.toString() == categoryId
    })
    console.log('categordata')
    console.log(categoryData)
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
    return bot.sendMessage(
      userId,
      'an unknown error occured while getting your gig'
    )
  }
}

export const updateDescription = async (userId, categoryId, newDescription) => {
  try {
    let talent = await Talent.findOne({ userId })
    let category = talent.categories.find(c => c._id == categoryId)
    category['description'] = newDescription
    await talent.save()
    console.log('updated')
  } catch (e) {
    console.log(e)
    return bot.sendMessage(
      userId,
      'an unknown error occured while updating the description'
    )
  }
}

export const updatePrice = async (userId, categoryId, newPrice) => {
  try {
    let talent = await Talent.findOne({ userId })
    let category = talent.categories.find(c => c._id == categoryId)
    category['price'] = newPrice
    await talent.save()
  } catch (e) {
    console.log(e)
    return bot.sendMessage(
      userId,
      'an unknown error occured while updating the price'
    )
  }
}

export const updateBanner = async (userId, categoryId, newBanner) => {
  try {
    let talent = await Talent.findOne({ userId })
    let category = talent.categories.find(c => c._id == categoryId)
    category['banner'] = newBanner
    await talent.save()
  } catch (e) {
    console.log(e)
    return bot.sendMessage(
      userId,
      'an unknown error occured while updating the banner'
    )
  }
}
export const deleteGig = async (userId, categoryId) => {
  try {
    let talent = await Talent.findOne({ userId })
    let newCategories = talent.categories.filter(c => c._id != categoryId)
    talent.categories = newCategories
    console.log(talent)
    console.log(newCategories)
    await talent.save()
  } catch (e) {
    console.log(e)
    return bot.sendMessage(
      userId,
      'an unknown error occured while deleting the gig'
    )
  }
}

export const createTicket = async (price, to, description, from) => {
  if (!price || !to || !description || !from)
    return bot.sendMessage(from, 'empty field while saving your ticket')
  const newTicket = new Ticket({ price, to, description, from })
  await newTicket.save()
}
export const getTickets = async id => {
  try {
    let tickets = await Ticket.find({ from: id })
    return tickets
  } catch (e) {
    return bot.sendMessage(
      id,
      'an unknown error occured while getting your tickets'
    )
  }
}

export const getMyBalance = async id => {
  let obj = await Talent.findOne({ userId: id }).select('balance')
  return obj ? obj.balance : false
}

export const saveWithdrawReq = async (amount, address, receiver) => {
  let withdrawal = new Withdrawal({ amount, address, receiver })
  return await withdrawal.save()
}

export const updateUnconfirmedBalance = async (balance, id) => {
  await Talent.findOneAndUpdate(
    { userId: id },
    { $inc: { unconfirmedBalance: balance } }
  )
}

export const resetBalance = async id => {
  await Talent.findOneAndUpdate({ userId: id }, { balance: 0 })
}
