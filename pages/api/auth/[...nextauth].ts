import { posApi } from "@/api"
import { AuthContext } from "@/context"
import { log4js } from "@/helpers/log4js"
import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"



export const authOptions: NextAuthOptions = {
  
  // Configure one or more authentication providers
  providers: [
    Credentials({
        name: 'Custom Login',
        credentials: {
            user: { label: 'Codigo:', type: 'text', placeholder: 'Codigo 4 digitos' },
            password: { label: 'Password:', type: 'password', placeholder: 'Codigo 4 digitos' }
        },
        async authorize (credentials) {
          //const { createOrder, numeroComprobante, codigoHash, codigoQr, emptyOrder, findRuc } = useContext(FuelContext)
          const body = {
            "user": credentials!.user,
            "password": Buffer.from(credentials!.password, 'binary').toString('base64')
          }

          const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/usuarios`, body);
          if(data){
            return { id: data.usuario.id, usuario: data.usuario.usuario, correo: data.usuario.correo, nombre: data.usuario.nombre, rol: data.usuario.rol, grifo: data.usuario.grifo, isla: data.usuario.isla, jornada: data.usuario.jornada };
          }else{
            //return null;
            log4js( "NexthAuthCredentials",data, 'error');
            throw new Error( JSON.stringify({ errors: data, status: false }))
          }
        }
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },  
  jwt: {
    // secret: process.env.JWT_SECRET_SEED, // deprecated
  },
  session: {
    maxAge: 2592000,//30d
    strategy: 'jwt',
    updateAge: 86400//cada dia
  },
  callbacks: {
    session({ session, token, user }) {
      //console.log({ session, token, user })
      session.user.id = String(token.id)
      session.user.usuario = String(token.usuario)
      session.user.nombre = String(token.nombre)
      session.user.correo = String(token.correo)
      session.user.rol = String(token.rol)
      session.user.grifo = String(token.grifo)
      session.user.isla = String(token.isla)
      session.user.jornada = String(token.jornada)
      return session // The return type will match the one returned in `useSession()`
    },    
    
    async jwt({ token, account, user }) {
      if ( account ) {
        token.id = user.id;
        token.accessToken = account.access_token;
        token.usuario = user.usuario;
        token.nombre = user.nombre;
        token.correo = user.correo;
        token.rol = user.rol;
        token.grifo = user.grifo;
        token.isla = user.isla;
        token.jornada = user.jornada;
      }

      return token;
    },
    
  },
}

export default NextAuth(authOptions)