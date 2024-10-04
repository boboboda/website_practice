export declare module 'next-auth' {
    interface User {
      rule?: string
      accounts?: string[];
    }
    interface Session {
      
    }
  }
  export declare module '@auth/core/jwt' {
    interface JWT {
      user?: User
    }
  }