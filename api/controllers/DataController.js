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
    getWorkoutData: async (req, res) => {
        const data = await workoutData.getWorkoutRelatedData();
        return res.send(data)
    },
    getExerciseData: async (req, res) => {
        const data = await workoutData.getExerciseRelatedData();
        return res.send(data)
    },
    getWorkoutExerciseData: async(req, res) => {
        const data = await workoutData.getWorkoutExerciseRelatedData();
        return res.send(data)
    },
    getExercisesForWorkout: async(req, res) => {
        const data = await workoutData.getExercisesForWorkout(req.param('workoutId'));
        return res.send(data);
    },
    getWorkoutNames: async(req, res) => {
        const data = await workoutData.getWorkoutNamesForWeek();
        return res.send(data);
    },
    getYoutubeLinkForExercise: async(req, res) => {
        const data = await workoutData.getYoutubeLinkForExercise(req.param('exerciseId'));
        return res.send(data);
    },
    getDataForClickedWorkout: async(req, res) => {
        const data = await workoutData.getDataForSelectedWorkout(req.param('workoutId'));
        return res.send(data);
    }
}
