import User from '../models/user';
export const checkAuth = async (req) => {
  const user = await User.findOne({ _id: req.session.userId });
  if (!user) return false;
  return new Promise((resolve) => {
    if (!req.session.userId) return resolve(false);
    return resolve(true);
  });
};
