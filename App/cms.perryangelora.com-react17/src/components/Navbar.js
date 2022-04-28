import * as React from 'react';
import Button from './Button';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const {data: session} = useSession();
  // const a = useSession()
  // console.log(a)

  const handleSignIn = () => signIn('github');

  return (
    <div className='nav-header'>
      <h1>Perry<br />Angelora</h1>
      {session ? <Button action={signOut} label='Logout' /> : <Button action={handleSignIn} label='Login'/> }
      
    </div>
  );
}