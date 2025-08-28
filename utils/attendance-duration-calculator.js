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
    const now = new Date();
    const startTime = new Date(attendance.createdAt);
    const durationMs = getDurationInMs(attendance.duration, attendance.duration_unit);
    const endTime = new Date(startTime.getTime() + durationMs);

    if (now > endTime) {
        return res.status(400).json({ message: 'Attendance has expired' });
    }
}


export function remainingTime(attendance) {
    const now = new Date();
    const durationMs = getDurationInMs(attendance.duration, attendance.duration_unit);
    const endTime = new Date(attendance.createdAt.getTime() + durationMs);

    const remainingMs = endTime - now;

    if (remainingMs <= 0) {
        return res.status(400).json({ message: 'Attendance has expired' });
    }

    const remainingMinutes = Math.floor(remainingMs / (1000 * 60));

    res.json({
        attendance_name: attendance.attendance_name,
        time_left_minutes: remainingMinutes
    });
}

