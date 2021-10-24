const { usuarioConectado,
     usuarioDesconectado,
     grabarMensaje,
      getUsuario } = require("../controller/socketController");
const { comprobarJWT } = require("../helpers/jwt");


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async( socket ) => {

        
            const [valido, uid ]= comprobarJWT(socket.handshake.query['x-token'])

            if(!valido){
                console.log('socket no identificado');
                return socket.disconnect();
            }

            await usuarioConectado(uid);
            

            socket.join(uid);
          

            

            // TODO emitir todos los usuarios conectados
            this.io.emit('lista-usuario', await getUsuario());

         

            //TODO: Escuchar cuando el cliente manda un mensaje
            socket.on('mensaje-personal', async(payload)=>{
                const mensaje = await grabarMensaje(payload);
                this.io.to(payload.para).emit('mensaje-personal', mensaje);
                this.io.to(payload.de).emit('mensaje-personal', mensaje);
            });


           

            
            socket.on('disconnect', async()=>{
                await usuarioDesconectado(uid);
                this.io.emit('lista-usuario', await getUsuario());
               // console.log('cliente desconectado', uid);
            })
            
        
        });
    }


}


module.exports = Sockets;