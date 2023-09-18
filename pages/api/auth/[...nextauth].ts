import { posApi } from "@/api"
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
            password: { label: 'Password:', type: 'password', placeholder: 'Codigo 4 digitos' },
            turno: { label: 'Turno:', type: 'text', placeholder: 'Codigo 4 digitos' },
            isla: { label: 'Isla:', type: 'text' },
            terminal: { label: 'Terminal:', type: 'text' }            
        },
        async authorize (credentials) {
          //const { createOrder, numeroComprobante, codigoHash, codigoQr, emptyOrder, findRuc } = useContext(FuelContext)
          const body = {
            "user": credentials!.user,
            "password": Buffer.from(credentials!.password, 'binary').toString('base64'),
            "turno": credentials!.turno,
            "isla": credentials!.isla,
            "terminal": credentials!.terminal
          }

          const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/usuarios/login`, body);
          if(data){
            return { id: data.usuario.login.UsuarioId, usuario: data.usuario.usuario.usuario, correo: data.usuario.usuario.correo, nombre: data.usuario.usuario.nombre, rol: data.usuario.usuario.rol, grifo: data.usuario.login.terminal, isla: data.usuario.login.isla, jornada: data.usuario.login.jornada, fecha_registro: data.usuario.login.fecha_registro };
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
    // error: '/auth/login',
    // signOut: '/auth/login',
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
    async session({ session, token, user }) {
      session.user.id = String(token.id)
      session.user.usuario = String(token.usuario)
      session.user.nombre = String(token.nombre)
      session.user.correo = String(token.correo)
      session.user.rol = String(token.rol)
      session.user.grifo = String(token.grifo)
      session.user.isla = String(token.isla)
      session.user.jornada = String(token.jornada)
      session.user.fecha_registro = String(token.fecha_registro)
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
        token.fecha_registro = user.fecha_registro;
      }

      return token;
    },
    
  },
}

export default NextAuth(authOptions)