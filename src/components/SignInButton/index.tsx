import { signIn, signOut, useSession } from 'next-auth/client';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export function SignInButton() {
  const [session] = useSession();

  return (
    <button
      className={styles.container}
      onClick={() => (session ? signOut() : signIn('github'))}
    >
      <FaGithub color={session ? '#04d361' : '#EBA417'} />
      {session ? session.user.name : 'Sign in with GitHub'}
      {session && <FiX color="737380" className={styles.closeIcon} />}
    </button>
  );
}
