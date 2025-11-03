function getDurationInMs(value, unit) {
  switch (unit) {
    case 'seconds':
      return value * 1000;
    case 'minutes':
      return value * 60 * 1000;
    case 'hours':
      return value * 60 * 60 * 1000;
    ult:   
      throw new Error('Invalid duration unit');
  }
}

export function durationValid(attendance) {
    const now = new Date();
    const startTime = attendance.createdAt;
    const durationMs = getDurationInMs(attendance.duration, attendance.duration_unit);
    const endTime = startTime + durationMs;

    if (now > endTime) {
        return { expired: true, message: 'Attendance has expired' };
    } else {
      return { expired: false, message: 'Attendance still active' };
    }
}


export function remainingTime(attendance) {
  const now = new Date();
  const durationMs = getDurationInMs(attendance.duration, attendance.duration_unit);
  const endTime = attendance.createdAt + durationMs;

  const remainingMs = endTime - now;

  if (remainingMs <= 0) {
    return { expired: true, message: 'Attendance has expired' };
  }

  const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
  return {
    ok: true,
    attendance_name: attendance.attendance_name,
    createdAt: attendance.createdAt,
    duration: attendance.duration,
    unit: attendance.duration_unit,
    serverTime: Date.now()
  };
}

