const net = require('net');

let clients = [];

const server = net.createServer(client => {
  console.log('CLIENT CONNECTED');
  client.write('WELCOME TO SPARTASERVE');
  client.on('data', data => {
    console.log(data.toString());

    const msg = data.toString();

    clients.forEach(socket => {
      if(client !== socket) {
        socket.write(msg);
      }
    });
  });
  clients.push(client);
});

server.listen(6969, () => {
  console.log('Server listening on port 6969');
});