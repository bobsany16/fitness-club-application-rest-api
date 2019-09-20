const { google } = require('googleapis');
const connect = require('../connect')

async function getExercisesForWorkout(workoutId) {
    try {
        const jwtClient = await connect();
        let workoutExercises = await getWorkoutExerciseData(jwtClient);
        let exerciseIds = [...new Set(workoutExercises.map(workoutEx => {
            if (workoutEx[0] === workoutId) {
                return workoutEx[1];
            }
        }))]
        exerciseIds = exerciseIds.filter(exId => exId !== undefined)
        let exercises = await getExerciseData(jwtClient);
        let exerciseNames = exercises.map(exercise => {
            if (exerciseIds.includes(exercise[0])) {
                return exercise[1];
            }
        })
        exerciseNames = exerciseNames.filter(exName => exName !== undefined)
        return exerciseNames
    } catch (e) {
        console.log(e);
    }
}

async function getWorkoutNames() {
    try {
        const jwtClient = await connect();
        let workoutData = await getWorkoutData(jwtClient);
        let workoutNames = workoutData.filter(workout => {
            if (workout[1] !== undefined) {
                return workout
            }
        })
        workoutNames = workoutNames.map(data => {
            return data[1]
        })
        return workoutNames
    } catch (e) {
        console.log(e);
    }
}

async function getYoutubeLinkForExercise(exerciseId){
    try{
        const jwtClient = await connect();
        let exerciseData = await getExerciseData(jwtClient);
        let exDataObj = {};
        exDataObj = exerciseData.filter(
            exData => exData[0] === exerciseId
          );
        let youtubeURL = {youtubeUrl: exDataObj[0][3]};
        return youtubeURL;
    }catch(e){
        console.log(e)
    }
}

async function getWorkoutRelatedData() {
    try {
        const jwtClient = await connect();
        let resData = await getWorkoutData(jwtClient);
        return resData;
    } catch (e) {
        console.log(e);
    }
}

async function getExerciseRelatedData() {
    try {
        const jwtClient = await connect();
        let resData = await getExerciseData(jwtClient);
        return resData;
    } catch (e) {
        console.log(e);
    }
}

async function getWorkoutExerciseRelatedData() {
    try {
        const jwtClient = await connect();
        let resData = await getWorkoutExerciseData(jwtClient);
        return resData;
    } catch (e) {
        console.log(e);
    }
}

async function getWorkoutExerciseData(jwtClient) {
    try {
        let spreadsheetId = '1ywV6xgrtStloSIVnPzpNVlOk3ggoBwgBGgJ56sFfJS8';
        let sheetName = 'Workout-Exercise!A2:C300'
        let sheets = google.sheets('v4');
        const res = await sheets.spreadsheets.values.get({
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: sheetName
        })
        return res.data.values;
    }
    catch (err) {
        console.log('The API returned an error: ' + err);
    }
}

async function getWorkoutData(jwtClient) {
    try {
        let spreadsheetId = '1ywV6xgrtStloSIVnPzpNVlOk3ggoBwgBGgJ56sFfJS8';
        let sheetName = 'Workout!A2:C300'
        let sheets = google.sheets('v4');
        const res = await sheets.spreadsheets.values.get({
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: sheetName
        })
        return res.data.values;
    }
    catch (err) {
        console.log('The API returned an error: ' + err);
    }
}

async function getExerciseData(jwtClient) {
    try {
        let spreadsheetId = '1ywV6xgrtStloSIVnPzpNVlOk3ggoBwgBGgJ56sFfJS8';
        let sheetName = 'Exercise!A2:D300'
        let sheets = google.sheets('v4');
        const res = await sheets.spreadsheets.values.get({
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: sheetName
        })
        return res.data.values;
    }
    catch (err) {
        console.log('The API returned an error: ' + err);
    }
}

module.exports = {
    getWorkoutRelatedData,
    getExerciseRelatedData,
    getWorkoutExerciseRelatedData,
    getExercisesForWorkout,
    getWorkoutNames,
    getYoutubeLinkForExercise
}
