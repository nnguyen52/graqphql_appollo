import React from 'react';
import { useField } from 'formik';
import { TextareaAutosize, FormHelperText, FormControl, TextField } from '@mui/material';

const InputField = ({ textarea, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl
      error={!!error}
      sx={{
        display: 'flex',
      }}
    >
      {textarea ? (
        <TextareaAutosize
          minRows={10}
          sx={{ width: '100%' }}
          {...field}
          id={field.name}
          {...props}
        />
      ) : (
        <TextField error={error} {...field} id={field.name} {...props} />
      )}
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default InputField;
