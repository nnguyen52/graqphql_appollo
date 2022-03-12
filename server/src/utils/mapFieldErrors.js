export const mapFieldErrors = (errors) => {
  return errors.reduce(
    (accumulatedErrorsObj, error) => ({
      ...accumulatedErrorsObj,
      [error.field]: error.message,
    }),
    {}
  );
};
