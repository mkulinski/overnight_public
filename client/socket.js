var socket;

function initSocket(io) {
  socket = io();
  return socket;
}

export { initSocket, socket };
