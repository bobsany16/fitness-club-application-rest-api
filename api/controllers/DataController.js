/* DataController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/
const workoutData = require('../../data/workoutData')
module.exports = {
   welcome: (req, res) => {
       return res.send('Welcome to Fitness Club App RESTful API')
   },
   getWorkoutData: async(req, res) => {
       const data = await workoutData.getWData();
       return res.send(data)
   },
}
