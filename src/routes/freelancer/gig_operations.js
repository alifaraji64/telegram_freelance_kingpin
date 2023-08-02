import { bot } from "../../../index.js";
import { getGigDetails } from "./db.js";
export const gigOperations = ()=>{
    bot.on('callback_query', async msg=>{
        console.log(msg);
        if(msg.data.split('/')[0] == 'gig'){
            if(msg.data.split('/')[1] == 'display'){
                const categoryId = msg.data.split('/')[2];
                console.log(categoryId);
                let gigDetails = await getGigDetails(categoryId);
                console.log(gigDetails);
            }
        }
    })
}