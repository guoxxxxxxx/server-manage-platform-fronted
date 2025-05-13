// 用户信息
export interface UserInfo {
  id: number;
  avatar: string;
  deleted: boolean;
  lastLoginIp: string;
  lastLoginTime: string;
  locked: boolean;
  password: string;
  registerTime: string;
  roleId: number;
  username: string;
  email: string;
  phone: string;
}


// 服务器信息
export interface ServerInfo {
    id: number,
    configurationDetails: string | null,
    cpu: string | null,
    ip: string | null,
    diskSpace: number | null,
    freeDiskSpace: number | null,
    memorySpace: number | null,
    freeMemorySpace: number | null,
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
}

// socketMessage 交互实体
interface SocketMessage { 
  title: string | null,
  message: string | null,
  status: number | null
}