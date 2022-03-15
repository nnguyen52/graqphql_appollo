import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Mutation_register } from '../graphql-client/mutations/register';
import { useRouter } from 'next/router';
import { Query_me } from '../graphql-client/queries/user';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
import { initializeApollo } from '../lib/apolloClient';
import NextLink from 'next/link';
const Register = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    userName: '',
    email: '',
    password: '',
  });

  const { userName, email, password } = formState;
  const [register, { data, loading: registerLoading, error }] = useMutation(Mutation_register);
  const { data: meData, loading: meLoading } = useQuery(Query_me);
  const [registerErrors, setRegisterErrors] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        variables: {
          userName,
          email,
          password,
        },
        update(cache, { data }) {
          if (!data.register.network.success) {
            return setRegisterErrors(mapFieldErrors(data.register.network.errors));
          } else {
            cache.writeQuery({
              query: Query_me,
              data: { me: { ...data.register, data: data.register.data } },
            });
            const apolloClient = initializeApollo();
            apolloClient.resetStore();
            router.push('/');
          }
        },
      });
    } catch (e) {
      console.log('___ERROR: ', e);
    }
  };

  const handleFormChange = (e) => {
    setRegisterErrors([]);
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  if (meLoading) return <h1>loading authentication</h1>;
  if (meData?.me?.data) {
    router.push('/');
    return null;
  }
  if (registerLoading) return <h1>Building new account...</h1>;
  if (error) return <h3>Server error.... </h3>;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username'
          name='userName'
          value={formState.userName}
          onChange={(e) => handleFormChange(e)}
        />
        {registerErrors['userName'] && (
          <b style={{ color: 'red', border: '1px solid red' }}>{registerErrors.userName} </b>
        )}
        <br />
        <input
          type='text'
          placeholder='email'
          name='email'
          value={formState.email}
          onChange={(e) => handleFormChange(e)}
        />
        {registerErrors['email'] && (
          <b style={{ color: 'red', border: '1px solid red' }}>{registerErrors['email']} </b>
        )}
        <br />
        <input
          type='password'
          placeholder='Password'
          name='password'
          value={formState.password}
          onChange={(e) => handleFormChange(e)}
        />
        {registerErrors['password'] && (
          <b style={{ color: 'red' }}>{registerErrors['password']} </b>
        )}
        <button type='submit'>Register</button>
        <NextLink href={`/login`}>
          <button type='submit'>Login</button>
        </NextLink>
        <br />
      </form>
      <NextLink href={'/'}>
        <button>home</button>
      </NextLink>
    </div>
  );
};

export default Register;
