import { io } from 'socket.io-client';

const getSocketToken = () => localStorage.getItem('vison_token');

const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', {
  autoConnect: true,
  auth: {
    token: getSocketToken()
  },
  transports: ['websocket', 'polling']
});

export function refreshSocketAuth() {
  socket.auth = { token: getSocketToken() };
  if (getSocketToken() && !socket.connected) {
    socket.connect();
  }
}

export function getPedidoJoinPayload(pedidoId) {
  refreshSocketAuth();
  return {
    pedidoId,
    token: getSocketToken()
  };
}

export default socket;
