import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { query as q } from "faunadb";

import { fauna } from "../../../services/faunadb";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: ["read:user"],
    }),
  ],
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
    signingKey: process.env.NEXTAUTH_JWT_SIGNINGKEY,
  },
  callbacks: {
    session: async (session) => {
      try {
        /*  const activeSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_stripe_status"), "active"),
            ])
          )
        );*/
        const activeSubscription = null;

        return {
          ...session,
          activeSubscription,
        };
      } catch {
        return session;
      }
    },
    signIn: async (user, account, profile) => {
      try {
        /*await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(user.email))
              )
            ),

            q.Create(q.Collection("users"), {
              data: {
                email: q.Casefold(user.email),
              },
            }),
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(user.email)))
          )
        );*/

        return true;
      } catch {
        return false;
      }
    },
  },
});
