import { DefaultJWT } from "next-auth/jwt"

export declare module 'next-auth' {
    interface User {
      role?: string
      accounts?: string[];
    }
    interface Session {
      role?: string
    }
  }
  export declare module '@auth/core/jwt' {
    interface JWT {
      user?: User
    }
  }

  declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
      user?: {
        id?: string | null
        name?: string | null
        email?: string | null
        role?: string | null
      }
      role?: string | null
    }
  }
  
  declare module "next-auth" {
    interface User {
      role?: string | null
    }
    
    interface Session {
      user?: {
        id?: string | null
        name?: string | null
        email?: string | null
        role?: string | null
      }
    }
  }