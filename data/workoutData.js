const { google } = require('googleapis');
const connect = require('../connect')

async function getCurrentDate() {
    let dateObject = new Date();
    let currentMonth = dateObject.getMonth() + 1;
    let currentDay = dateObject.getDate();
    let year = dateObject.getFullYear();
    let day = (currentDay >= 0 && currentDay <= 9) ? '0' + currentDay : currentDay;
    let month = (currentMonth >= 0 && currentMonth <= 9) ? '0' + currentMonth : currentMonth;
    let currentDate = `${month}/${day}/${year}`
    return currentDate;
}

async function getBodyPartsAndAssociatedExercises() {
    try {
        const jwtClient = await connect();
        let exercises = await getExerciseData(jwtClient);
        let bodyPartsExercises = [];
        let bodyParts = [...new Set(exercises.map(element => {
            return element[2]
        }))];
        for (var i = 0; i < bodyParts.length; i++) {
            let bpExercises = []
            for (var j = 0; j < exercises.length; j++) {
                if (exercises[j][2] === bodyParts[i]) {
                    bpExercises.push(exercises[j][1]);
                }
            }
            bodyPartsExercises.push({
                bodyPartName: bodyParts[i],
                exercises: bpExercises
            })
        }
        return bodyPartsExercises
    } catch (e) {
        console.log(e)
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

async function getYoutubeLinkForExerciseByName(exerciseName) {
    try {
        const jwtClient = await connect();
        let exerciseData = await getExerciseData(jwtClient);
        let exDataObj = {};
        exDataObj = exerciseData.filter(
            exData => exData[1] === exerciseName
        );
        let youtubeURL = { youtubeUrl: exDataObj[0][3] };
        return youtubeURL;
    } catch (e) {
        console.log(e)
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

async function getExerciseRelatedData() {
    try {
        const jwtClient = await connect();
        let resData = await getExerciseData(jwtClient);
        return resData;
    } catch (e) {
        console.log(e);
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
    getWorkoutNamesForWeek,
    getDataForSelectedWorkout,
    getBodyPartsAndAssociatedExercises,
    getYoutubeLinkForExerciseByName
}
