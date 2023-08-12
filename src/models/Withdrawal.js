import mongoose from 'mongoose'

export const withdrawalSchema = mongoose.Schema({
  amount: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  address: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false,
    required: true
  }
})

export const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema)
