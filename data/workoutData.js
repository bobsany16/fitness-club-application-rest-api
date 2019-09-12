const { google } = require('googleapis');
const connect = require('../connect')

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

async function getWorkoutData(jwtClient) {
    try {
        let spreadsheetId = '1TmIRcTKQPEkdBRtlxegqM_73LcHp6WkAgisDtEiKEm4';
        let sheetName = 'Workout-Exercise!A2:C100'
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
        let spreadsheetId = '1TmIRcTKQPEkdBRtlxegqM_73LcHp6WkAgisDtEiKEm4';
        let sheetName = 'Exercise-Video!A2:C100'
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
    getExerciseRelatedData
}
