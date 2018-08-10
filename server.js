const net = require('net');

console.log('\n\nCL process.argv')
console.log(process.argv)
let header = '\n\nHTTP/1.1 200 OK\n\nServer: SPARTASERVE'
// let slashIndex = process.argv[2].indexOf("/");
// let host = process.argv[2].slice(0, slashIndex);
// let path = process.argv[2].slice(slashIndex);

let clients = [];

const server = net.createServer(client => {

  client.write(header)
  // client.write('\n\nHTTP/1.1 200 OK\n\nServer: SpartaServe');
  // client.write("GET " + path + " HTTP/1.1\nhost: " + host);

  console.log('CL client.remoteAddress =', client.remoteAddress)
  console.log('CL client.remotePort =', client.remotePort)
  console.log('CL client.username =', client.username)

  // Identify client and push to clients list:
  client.id = client.remoteAddress + ':' + client.remotePort;
  client.username;
  client.usernameHasBeenSet = false;
  clients.push(client);
  // console.log('CL client =', client)
  console.log('\nCL CONNECTED: ' + client.id);
  console.log('\nCL CLIENT CONNECTED');
 
  client.write('\n\nWELCOME TO SPARTASERVE');
  client.write('\n')
  client.write('\nWhat would you like to be called?')

   // Handle incoming data:
  client.on('data', data => {
    console.log('\nCL data =', data)
    const dataStr = data.toString().slice(0, -1);
    console.log('\nCL dataStr =',dataStr)
    if (!client.username) {
      if (dataStr.toLowerCase().includes('admin')) {
        client.write(`\nKeyword "ADMIN" reserved. Choose another username: `);
      } else if (dataStr.toLowerCase().includes('get')) {

      }
      else {
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

server.listen(8080, () => {
  console.log('\nServer listening on port 8080');
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
    console.log('\nSERVER BCAST FROM ' + client.id + ' : ' + data);
  }
}