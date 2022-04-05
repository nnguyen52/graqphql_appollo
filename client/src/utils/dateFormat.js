import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
export const dateFormat = (data) => {
  try {
    return dayjs(data).fromNow();
  } catch (err) {
    return console.log(err);
  }
};
