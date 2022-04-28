import NextAuth from 'next-auth';
import GitHibProvider from 'next-auth/providers/github';

const options = {
  providers: [
    GitHibProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })  
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    async signIn({ profile }) {
      if(profile.id === 48928345) {
        return true;
      }
      return false;
    }
  }
};

const restAPI = (req, res) =>  {
  return NextAuth(req, res, options );
};

export default restAPI;