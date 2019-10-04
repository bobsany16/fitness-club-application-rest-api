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
        }))].filter(exId => exId !== undefined)
        let exercises = await getExerciseData(jwtClient);
        let exerciseNames = exercises.map(exercise => {
            if (exerciseIds.includes(exercise[0])) {
                return exercise[1];
            }
        }).filter(exName => exName !== undefined)
        return exerciseNames
    } catch (e) {
        console.log(e);
    }
}

async function getDataForSelectedWorkout(workoutId) {
    try {
        const jwtClient = await connect();
        let workoutExercises = await getWorkoutExerciseData(jwtClient);
        let setToExerciseMap = {};
        workoutExercises = workoutExercises.filter(workoutEx => {
            return workoutEx[0] === workoutId
        })
        for (workoutEx of workoutExercises) {
            if (!Object.keys(setToExerciseMap).includes(workoutEx[3])) {
                setToExerciseMap[`${workoutEx[3]}`] = new Array();
                setToExerciseMap[`${workoutEx[3]}`].push({
                    exerciseId: workoutEx[1],
                    rep: workoutEx[2]
                });
            } else {
                setToExerciseMap[`${workoutEx[3]}`].push({
                    exerciseId: workoutEx[1],
                    rep: workoutEx[2]
                });
            }
        }
        let exerciseData = await getExerciseRelatedData(jwtClient);
        for (var key in setToExerciseMap) {
            setToExerciseMap[key] = setToExerciseMap[key].map(elementObj => {
                let exName = ''
                for (var key in exerciseData) {
                    let exData = exerciseData[key];
                    if (elementObj.exerciseId === exData[0]) {
                        exName = exData[1]
                    }
                }
                return ({
                    exerciseName: exName,
                    rep: elementObj.rep
                })
            })
        }
        return setToExerciseMap;
    } catch (e) {
        console.log(e);
    }
}


async function getCurrentDate() {
    let dateObject = new Date();
    let currentMonth = dateObject.getMonth() + 1;
    let day = dateObject.getDate();
    let year = dateObject.getFullYear();
    let month = (currentMonth >= 0 && currentMonth <= 9) ? '0' + currentMonth : currentMonth;
    let currentDate = `${month}/${day}/${year}`
    return currentDate;
}

async function getWorkoutNamesForWeek() {
    try {
        const jwtClient = await connect();
        let workoutData = await getWorkoutData(jwtClient);
        let listOfIndices = [];
        let dateObject = new Date();
        let currentDay = Number(dateObject.getDay());
        let currentDate = await getCurrentDate();
        let currentWorkout = workoutData.filter(workout => {
            if (workout[2] === currentDate) {
                return true
            }
        })
        let currentWorkoutIndex = Number(currentWorkout[0][0]);
        currentWorkoutIndex = currentWorkoutIndex - currentDay;
        for (let i = 0; i < 7; i++) {
            listOfIndices.push(currentWorkoutIndex);
            currentWorkoutIndex++;
        }
        let workoutNames = workoutData.map(workout => {
            if (listOfIndices.includes(Number(workout[0]))) {
                return workout[1];
            }
        }).filter(workoutName => {
            if (workoutName !== undefined) {
                return workoutName
            }
        })
        return workoutNames;
    } catch (e) {
        console.log(e);
    }
}

async function getYoutubeLinkForExercise(exerciseId) {
    try {
        const jwtClient = await connect();
        let exerciseData = await getExerciseData(jwtClient);
        let exDataObj = {};
        exDataObj = exerciseData.filter(
            exData => exData[0] === exerciseId
        );
        let youtubeURL = { youtubeUrl: exDataObj[0][3] };
        return youtubeURL;
    } catch (e) {
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
        let sheetName = 'Workout-Exercise!A2:D300'
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
    getWorkoutNamesForWeek,
    getYoutubeLinkForExercise,
    getDataForSelectedWorkout
}
