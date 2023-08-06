import { Talent } from '../../models/Talent.js'
export const getTalents = async (job, LIMIT) => {
  return await Talent.aggregate([
    {
      $match: {
        categories: { $elemMatch: { name: job } }
      }
    },
    {
      $addFields: {
        totalRating: {
          $cond: {
            if: { $eq: ['$rating.qty', 0] }, // Check if rating.qty is zero
            then: 0, // If rating.qty is zero, set totalRating to 0 (or any default value you want)
            else: { $divide: ['$rating.total', '$rating.qty'] } // Otherwise, perform the division
          }
        }
      }
    }
  ])
    .sort({ totalRating: -1 })
    .limit(LIMIT)
}

export const loadTalents = async (job,LIMIT, skip) => {
  return await Talent.aggregate([
    {
      $match: {
        categories: { $elemMatch: { name: job } }
      }
    },
    {
      $addFields: {
        totalRating: {
          $cond: {
            if: { $eq: ['$rating.qty', 0] }, // Check if rating.qty is zero
            then: 0, // If rating.qty is zero, set totalRating to 0 (or any default value you want)
            else: { $divide: ['$rating.total', '$rating.qty'] } // Otherwise, perform the division
          }
        }
      }
    }
  ])
    .sort({ totalRating: -1, 'rating.qty': 1 })
    .skip(skip)
    .limit(LIMIT)
}
