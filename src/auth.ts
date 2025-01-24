import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
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
          console.log('----> ', user, username, password, email);
          console.log('---------------------------');

          //   return null;
          return Promise.resolve({
            username: username ?? '',
            email: email ?? '',
            token: user.access,
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
    Google,
  ],

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
