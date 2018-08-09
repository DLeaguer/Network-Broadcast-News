const net = require('net');
// var os = require("os");
// var hostaddress = os.hostname();
let clients = [];



const server = net.createServer(client => {
  console.log('CL client.remoteAddress =', client.remoteAddress)
  console.log('CL client.remotePort =', client.remotePort)
  console.log('CL client.username =', client.username)

  // Identify client and push to clients list:
  client.id = client.remoteAddress + ':' + client.remotePort;
  client.username;
  client.usernameHasBeenSet = false;
  clients.push(client);
  console.log('CL client =', client)
  console.log('CL CONNECTED: ' + client.id);
  console.log('CL CLIENT CONNECTED');
  // console.log('hostname: ', process.env.host);
  
  client.write('\nWELCOME TO SPARTASERVE');
  client.write('\n')
  client.write('\nWhat is Your Name')

   // Handle incoming data:
  client.on('data', data => {
    console.log('CL data =', data)
    const dataStr = data.toString().slice(0, -1);
    console.log('CL dataStr =',dataStr)
    if (!client.username) {
      if (dataStr.toLowerCase().includes('admin')) {
        client.write(`\nKeyword "ADMIN" reserved. Choose another username: `);
      } else {
        client.username = dataStr;
        client.write(`\nHello ${dataStr}\n`);
      }
    }
    handleIncomingData(client, dataStr);

    console.log(data.toString());

    const msg = data.toString();

    clients.forEach(socket => {
      if(client !== socket) {
        socket.write(msg);
      }
    });
  });

  clients.push(client);

  // Remove client when connection has been closed:
  client.on('end', function () {
    let i = clients.indexOf(client);
    console.log('\nCL i =', i)
    clients.splice(i,1);
    console.log(`Client ${i} Session Ended`)
  })

   // Allow server to send "ADMIN" messages to all clients:
   process.stdin.on('data', data => {
    client.write(`[ADMIN] ${data.toString().slice(0, -1)}`);
  });

});

server.listen(6969, () => {
  console.log('Server listening on port 6969');
});

function handleIncomingData(client, data) {
  if (client.username && !client.usernameHasBeenSet) {
    // Client's first input will be set as the client's username:
    console.log(client.id + ' SET USERNAME: ' + client.username);
    client.usernameHasBeenSet = true;
  } else if (client.usernameHasBeenSet) {
    // Client's message will be logged and dispatched to other clients:
    clients.forEach(client => {
      if (client === client) return;
      client.write(`${client.username}: "${data}"`);
    });
    console.log('SERVER BCAST FROM ' + client.id + ' : ' + data);
  }
}