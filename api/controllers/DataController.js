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
    getWorkoutNames: async(req, res) => {
        const data = await workoutData.getWorkoutNamesForWeek();
        return res.send(data);
    },
    getDataForClickedWorkout: async(req, res) => {
        const data = await workoutData.getDataForSelectedWorkout(req.param('workoutId'));
        return res.send(data);
    },
    getBodyPartsAndAssociatedExercises: async(req, res) => {
        const data = await workoutData.getBodyPartsAndAssociatedExercises();
        return res.send(data);
    },
    getYoutubeLinkForExerciseByName: async(req, res) => {
        const data = await workoutData.getYoutubeLinkForExerciseByName(req.param('exerciseName'))
        return res.send(data);
    }
}
