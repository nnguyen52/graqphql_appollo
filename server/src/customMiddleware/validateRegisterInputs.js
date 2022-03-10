export const validateRegisterInput = ({ userName, email, password }) => {
  let errors = [] ; 
  if (!email.includes('@'))
    errors.push({ field: 'email', message: 'Email must include @ symbol' })

  if (userName.length < 1)
    errors.push({ field: 'userName', message: 'Username must have at least 1 character' }) 

  if (userName.length > 30)
errors.push(  
{ field: 'userName', message: 'Username must be less than 30 character' })

  if (userName.includes('@'))
    errors.push ({ field: 'userName', message : 'Username cannot include @' }) 

  if (password.length < 1)
    errors.push (
    { field: 'password', message: 'Password must have at least 1 character'}) 

  if (errors.length > 0 ) {
    return errors;
  }
  return null;
};
