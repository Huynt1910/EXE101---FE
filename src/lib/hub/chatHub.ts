import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;
let startPromise: Promise<signalR.HubConnection> | null = null;
let latestAccessToken = "";

const GUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeToken(token: string) {
  return token.trim();
}

function maskToken(token: string) {
  if (!token) return "(empty)";
  if (token.length <= 20) return `${token.slice(0, 4)}...${token.slice(-4)} (len=${token.length})`;
  return `${token.slice(0, 12)}...${token.slice(-8)} (len=${token.length})`;
}

function assertValidRoomId(roomId: string) {
  const normalizedRoomId = roomId.trim();
  if (!GUID_PATTERN.test(normalizedRoomId)) {
    throw new Error("roomId không hợp lệ (không đúng GUID)");
  }
  return normalizedRoomId;
}

function getHubUrl() {
  const rootUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const hubPath = process.env.NEXT_PUBLIC_CHAT_HUB_PATH;

  if (!rootUrl || !hubPath) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_CHAT_HUB_PATH");
  }

  const hubUrl = `${rootUrl}${hubPath}`;

  return hubUrl;
}

export async function getOrCreateChatConnection(accessToken: string) {
  const normalizedToken = normalizeToken(accessToken);
  if (!normalizedToken) {
    throw new Error("Thiếu access token cho SignalR");
  }

  if (normalizedToken !== accessToken) {
    console.warn("[SignalR] access token có khoảng trắng đầu/cuối, đã được trim.");
  }

  latestAccessToken = normalizedToken;

  if (connection?.state === signalR.HubConnectionState.Connected) {
    console.log("[SignalR] reusing connected connection. token=", maskToken(latestAccessToken));
    return connection;
  }

  if (startPromise) return startPromise;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(getHubUrl(), {
      // Always read latest token to avoid stale closure during reconnect.
      accessTokenFactory: () => latestAccessToken,
      withCredentials: false,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .configureLogging(signalR.LogLevel.Information)
    .build();

  startPromise = connection
    .start()
    .then(() => {
      return connection!;
    })
    .finally(() => {
      startPromise = null;
    });

  return startPromise;
}

export function getChatConnection() {
  return connection;
}

export function getChatConnectionState() {
  return connection?.state ?? signalR.HubConnectionState.Disconnected;
}

export function getChatConnectionDiagnostics() {
  return {
    state: getChatConnectionState(),
    hasAccessToken: Boolean(latestAccessToken),
    accessTokenMasked: maskToken(latestAccessToken),
  };
}

export async function joinRoom(roomId: string) {
  if (!connection) throw new Error("SignalR not initialized");
  if (connection.state !== signalR.HubConnectionState.Connected) {
    throw new Error("SignalR chưa connected, không thể JoinRoom");
  }

  await connection.invoke("JoinRoom", assertValidRoomId(roomId));
}

export async function leaveRoom(roomId: string) {
  if (!connection) return;
  if (!GUID_PATTERN.test(roomId.trim())) return;
  await connection.invoke("LeaveRoom", roomId.trim());
}