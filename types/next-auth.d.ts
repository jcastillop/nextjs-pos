import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as
     * a prop on the `SessionProvider` React Context
     */
    interface Session {
      user: User;
    }
  
    interface User {
        id: string;
        usuario?: string;
        nombre?: string;
        correo?: string;        
        rol?: string; 
        grifo?: string;
        isla?: string;
        jornada?: string;
        otro?: string;
        fecha_registro?: string;
    }
  }