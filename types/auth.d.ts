export declare module 'next-auth' {
    interface User {
      role?: string
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