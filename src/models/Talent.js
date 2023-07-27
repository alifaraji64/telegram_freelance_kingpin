import mongoose from 'mongoose'
import {categorySchema} from './Category.js'
const talentSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  firstname:{
    type: String,
    required: true
  },
  rating:{
    qty:{
        type:Number,
        required: true
    },
    total:{
        type: Number,
        required: true
    }
  },
  image:{
    type: String,
    required: true
  },
  categories:[categorySchema]
})
export const Talent = mongoose.model('Talent', talentSchema)
