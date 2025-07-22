
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Simplified auth handler that bypasses database for testing
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // For testing, accept any email/password combination
        // In production, this should validate against a database
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Return a mock user for testing
        return {
          id: 'test-user-1',
          email: credentials.email,
          name: 'Test User',
          role: 'ADMIN',
        } as any;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
