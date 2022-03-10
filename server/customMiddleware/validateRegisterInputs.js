export const validateRegisterInput = ({ userName, email, password }) => {
  if (email.includes('@'))
    return {
      message: 'Invalid email',
      errors: [{ field: 'email', detailedMessage: 'Email must include @ symbol' }],
    };

  if (userName.length < 1)
    return {
      message: 'Inalid username',
      errors: [{ field: 'userName', detailedMessage: 'Username must have at least 1 character' }],
    };

  if (userName.length > 30)
    return {
      message: 'Inalid username',
      errors: [{ field: 'userName', detailedMessage: 'Username must be less than 30 character' }],
    };

  if (userName.includes('@'))
    return {
      message: 'Inalid username',
      errors: [{ field: 'userName', detailedMessage: 'Username cannot include @' }],
    };

  if (registerInput.password.length < 1)
    return {
      message: 'Invalid password',
      errors: [{ field: 'password', detailedMessage: 'Password must have at least 1 character' }],
    };

  return null;
};
