import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Mutation_Login } from '../graphql-client/mutations/login';
import { useRouter } from 'next/router';
import { Query_me } from '../graphql-client/queries/user';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
import { initializeApollo } from '../lib/apolloClient';
const Login = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    userNameOrEmail: '',
    password: '',
  });

  const { userNameOrEmail, password } = formState;

  const [login, { data, loading: loginLoading, error }] = useMutation(Mutation_Login);
  const { data: meData, loading: meLoading } = useQuery(Query_me);

  const [loginErrors, setLoginErros] = useState([]);

  if (data?.login?.network?.errors) console.log(data);
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({
      variables: {
        userNameOrEmail,
        password,
      },
      update(cache, { data }) {
        if (!data.login.network.success) {
          return setLoginErros(mapFieldErrors(data.login.network.errors));
        } else {
          cache.writeQuery({
            query: Query_me,
            data: { me: data.login.data },
          });
          const apolloClient = initializeApollo();
          apolloClient.resetStore();
          router.push('/');
        }
      },
    });
  };

  const handleFormChange = (e) => {
    setLoginErros([]);
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  if (meLoading) return <h1>loading authentication</h1>;
  if (meData?.me?.data) {
    router.push('/');
    return null;
  }
  if (loginLoading) return <h1>Logging in...</h1>;
  if (error) return <h3>Server error.... </h3>;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username or email'
          name='userNameOrEmail'
          value={formState.userNameOrEmail}
          onChange={(e) => handleFormChange(e)}
        />
        {loginErrors['userNameOrEmail'] && (
          <b style={{ color: 'red', border: '1px solid red' }}>{loginErrors['userNameOrEmail']} </b>
        )}
        <br />
        <input
          type='password'
          placeholder='Password'
          name='password'
          value={formState.password}
          onChange={(e) => handleFormChange(e)}
        />
        {loginErrors['password'] && <b style={{ color: 'red' }}>{loginErrors['password']} </b>}
        <button type='submit'>Login</button>
        <br />
      </form>
    </div>
  );
};

export default Login;
