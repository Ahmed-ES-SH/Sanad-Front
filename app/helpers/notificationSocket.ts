/* eslint-disable @typescript-eslint/no-explicit-any */
import io from "socket.io-client";
import { SOCKET_CONFIG } from "@/app/constants/notifications";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

export function createNotificationSocket() {
  return io(API_BASE_URL, {
    withCredentials: true,
    transports: [...SOCKET_CONFIG.TRANSPORTS],
    reconnection: SOCKET_CONFIG.RECONNECTION,
    reconnectionDelay: SOCKET_CONFIG.RECONNECTION_DELAY,
    reconnectionDelayMax: SOCKET_CONFIG.RECONNECTION_DELAY_MAX,
    reconnectionAttempts: SOCKET_CONFIG.RECONNECTION_ATTEMPTS,
  } as any);
}

/**
 * Disconnects and cleans up a Socket.IO connection.
 * @param socket - Socket.IO instance to disconnect
 */
export function disconnectNotificationSocket(
  socket: ReturnType<typeof createNotificationSocket> | null,
): void {
  if (socket) {
    socket.disconnect();
  }
}
