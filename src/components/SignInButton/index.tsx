import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export function SignInButton() {
  const isActive = true;
  const username = 'Jonathan Alba Videira';

  return (
    <button className={styles.container}>
      <FaGithub color={isActive ? '#04d361' : '#EBA417'} />
      {isActive ? username : 'Sign in with GitHub'}
      {isActive && <FiX color="737380" className={styles.closeIcon} />}
    </button>
  );
}
//<FiX className={styles.closeButton} />
