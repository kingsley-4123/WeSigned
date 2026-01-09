function getDurationInMs(value, unit) {
  switch (unit) {
    case 'seconds':
      return value * 1000;
    case 'minutes':
      return value * 60 * 1000;
    case 'hours':
      return value * 60 * 60 * 1000;
    default:   
      throw new Error('Invalid duration unit');
  }
}

export function durationValid(attendance) {
    const now = Date.now();
    const startTime = Number(attendance.createdAt);
    const durationMs = getDurationInMs(Number(attendance.duration), attendance.duration_unit);
    const endTime = startTime + durationMs;

    if (now > endTime) {
        return { expired: true, message: 'Attendance has expired' };
    } else {
      return { expired: false, message: 'Attendance still active' };
    }
}


export function remainingTime(attendance) {
  const now = Date.now();
  const startTime = Number(attendance.createdAt); 
  const durationMs = getDurationInMs(Number(attendance.duration), attendance.duration_unit);
  const endTime = startTime + durationMs;

  const remainingMs = endTime - now;

  if (remainingMs <= 0) {
    return { expired: true, message: 'Attendance has expired' };
  } else {
    return { ok: true, expired: false, message: "Attendance still active", attendance_name: attendance.attendance_name, createdAt: attendance.createdAt, duration: attendance.duration, unit: attendance.duration_unit };
  }
}

