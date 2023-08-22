import mongoose from 'mongoose'
import { categorySchema } from './Category.js'
const talentSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  rating: {
    qty: {
      type: Number,
      required: true,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      default: 0
    }
  },
  categories: [categorySchema],
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  //the balance that is paid by the client but the project is not complete yet
  unconfirmedBalance:{
    type: Number,
    required: true,
    default: 0
  }
})
export const Talent = mongoose.model('Talent', talentSchema)
