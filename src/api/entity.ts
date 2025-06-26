// 用户信息
export interface UserInfo {
  id: number;
  avatar: string | null;
  deleted: boolean | null;
  lastLoginIp: string | null;
  lastLoginTime: string | null;
  locked: boolean | null;
  password: string | null;
  registerTime: string | null;
  roleId: number | null;
  username: string | null;
  email: string | null;
  phone: string | null;
}


// 服务器信息
export interface ServerInfo {
    id: number,
    configurationDetails: string | null,
    cpu: string | null,
    ip: string | null,
    diskSpace: number,
    freeDiskSpace: number,
    memorySpace: number,
    freeMemorySpace: number,
    status: string | null,
    lastUpdate: string | null,
    lastLoginTime: string | null,
    lastOnlineTime: string | null,
    operatingSystem: string | null,
    location: string | null,
    name: string | null,
    repairer: string | null,
    repairerPhone: string | null,
    principal: string | null,
    price: number | null,
    owner: string | null,
    note: string | null,
    port: string | null,
    pwdIsCorrect: boolean | null,
    loginUsername: string | null,
    loginPassword: string | null,
    shutdownDelayTime: number | null,
    inWhite: boolean | null,
}

// socketMessage 交互实体
interface SocketMessage { 
  title: string | null,
  message: string | null,
  status: number | null
}