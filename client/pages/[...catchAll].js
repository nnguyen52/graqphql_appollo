import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
const CatchAll = () => {
  const router = useRouter();
  useEffect(() => {
    console.log('run4');
    alert('catch all');
    router.push('/');
  });
  return <></>;
};
export default CatchAll;
