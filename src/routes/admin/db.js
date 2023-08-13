import { Withdrawal } from '../../models/Withdrawal.js'

export const withdrawalPaidOut = async withdrawalId => {
  return await Withdrawal.findOneAndUpdate(
    { _id: withdrawalId },
    { isPaid: true },
    { new: true }
  )
}
