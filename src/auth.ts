import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: 'Credentials',

      credentials: {
        username: { label: 'username', type: 'text', placeholder: 'username' },
        email: { label: 'Email', type: 'email' },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;

        const url = `${process.env.API_URL_PREFIX}/api/token/`; // this will get token to stay logged in and authorized

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });

        if (res.status == 200) {
          const user = await res.json();

          console.log('---------------------------');
          console.log('----> ', user.access);
          console.log('---------------------------');

          const url = `${process.env.API_URL_PREFIX}/api/user/profile/`; // this will get token to stay logged in and authorized

          const profile_res = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.access}`,
            },
          });

          const profile = await profile_res.json();

          console.log(profile);

          // return null;
          return Promise.resolve({
            username: username ?? '',
            email: email ?? '',
            token: user.access,
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
            image: profile?.photo,
          });
        } else {
          const errorData = await res.json();
          console.log(errorData);

          const errorMessage = errorData?.error;
          console.log('Error:', errorMessage);

          return null;
        }
      },
    }),
  ],
  debug: true,

  callbacks: {
    jwt: async ({ token, user }) => {
      // Default behavior
      return { ...token, ...user };
    },

    session: async ({ session, token, user }) => {
      session.user = { ...token, ...user };
      return session;
    },

    authorized: async ({ auth }) => {
      return !!auth;
    },
  },

  pages: {
    signIn: '/',
    signOut: '/',
  },
});
