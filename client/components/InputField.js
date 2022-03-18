import React from 'react';
import { useField } from 'formik';
import { TextareaAutosize, FormHelperText, FormControl, TextField } from '@mui/material';

const InputField = ({ textarea, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl error={!!error}>
      {textarea ? (
        <TextareaAutosize
          minRows={3}
          style={{ width: 200 }}
          {...field}
          id={field.name}
          {...props}
        />
      ) : (
        <TextField {...field} id={field.name} {...props} />
      )}
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default InputField;
