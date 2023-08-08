import mongoose from 'mongoose'

const ticketSchema = mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxLength: 100
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  }
})

export const Ticket = mongoose.model('Ticket', ticketSchema)
