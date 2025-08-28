import { AttendanceSession } from "../models/attendance_session.js";

function generateSpecialId(length) {
  const chars = '23456789abcdefghjkmnpqrstuvwxyz'; // no 0, 1, l, I, O
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

async function createUniqueSpecialId() {
  let specialId;
  let exists = true;

  while (exists) {
    specialId = generateSpecialId(10);
    exists = await AttendanceSession.exists({ special_id: specialId });
  }

  return specialId;
}


export default createUniqueSpecialId;