import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // google sign in
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    // creds sign in
    Credentials({
      name: 'Credentials',

      credentials: {
        id: { label: 'Id', type: 'id' },
        email: { label: 'Email', type: 'email' },
        firstName: {
          label: 'First Name',
          type: 'firstName',
        },
        lastName: {
          label: 'Last Name',
          type: 'lastName',
        },
        token: {
          label: 'Token',
          type: 'token',
        },
        image: {
          label: 'Image',
          type: 'image',
        },
      },

      authorize: async (credentials) => {
        const id = credentials?.id as string | undefined;
        const email = credentials?.email as string | undefined;
        const firstName = credentials?.firstName as string | undefined;
        const lastName = credentials?.lastName as string | undefined;
        const token = credentials?.token as string | undefined;
        const image = credentials?.image as string | undefined;

        // return null;
        return Promise.resolve({
          id: id || '',
          firstName: firstName || '',
          lastName: lastName || '',
          token: token || '',
          email: email || '',
          image: image || '',
        });
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
