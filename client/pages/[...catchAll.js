import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
const CatchAll = () => {
  const router = useRouter();
  useEffect(() => router.push('/'));
  return <></>;
};
export default CatchAll;
