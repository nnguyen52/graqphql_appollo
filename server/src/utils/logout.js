export const logout = async ({ req, res }) => {
  return new Promise((resolve, _reject) => {
    res.clearCookie(process.env.COOKIE_NAME);
    req.session.destroy((error) => {
      if (error) {
        console.log("Destroying cookie error: ", error);
        resolve(false);
      }
      resolve(true);
    });
  });
};
