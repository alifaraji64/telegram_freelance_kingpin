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
  categories: [categorySchema]
})
export const Talent = mongoose.model('Talent', talentSchema)
