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