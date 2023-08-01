import { Talent } from "../../models/Talent.js";
export const saveTalentToDB = async(msg,talent_details) => {
    if (
      !talent_details.category_name ||
      !talent_details.banner ||
      !talent_details.price ||
      !talent_details.description
    ) return;
    new Talent({
      userId: msg.from.id,
      username: msg.from.username,
      firstname: msg.from.first_name,
      categories: [
        {
          name: talent_details.category_name,
          description: talent_details.description,
          banner: talent_details.banner,
          price: talent_details.price
        }
      ]
    })
      .save()
      .then(() => console.log('saved'))
      .catch(console.log)
  }
  export const myGigs = async(id)=>{
    console.log(id);
    return await Talent.find({userId:id})
  }