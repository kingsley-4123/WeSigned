import { Attendance } from "../models/attendance.js";

(async () => {
    await Attendance.collection.getIndexes().then(indexes => {
        console.log(indexes);
    }).catch(err => console.error(err));
})();
