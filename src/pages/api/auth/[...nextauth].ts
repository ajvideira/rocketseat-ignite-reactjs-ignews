import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import { query as q } from 'faunadb';

import { fauna } from '../../../services/faunadb';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: ['read:user'],
    }),
  ],
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
    signingKey: process.env.NEXTAUTH_JWT_SIGNINGKEY,
  },
  callbacks: {
    signIn: async (user, account, profile) => {
      try {
        await fauna.query(
          q.Create(q.Collection('users'), {
            data: {
              email: user.email,
            },
          })
        );
        return true;
      } catch {
        return false;
      }
    },
  },
});
