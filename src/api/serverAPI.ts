import { server } from "typescript";
import baseRequest from "./baseRequest";
import type { ServerInfo } from "@/api/entity"


// 添加服务器信息
export const addServers = (serverInfo: any) => {
    return baseRequest.post("/serverInfo/addServers", serverInfo);
}


// 分页获取服务器信息列表
export const getServersList = (pageSize: number, pageNo: number, queryParams: any, isOnlyShowOnline: boolean) => {
    return baseRequest.get("/serverInfo/getPage", {
        params: {
            "pageSize": pageSize,
            "pageNo": pageNo,
            "queryParams": queryParams,
            "onlyShowOnline": isOnlyShowOnline
        }
    });
}


// 分页获取服务器信息列表过滤白名单
export const getServersListFilterWhite = (pageSize: number, pageNo: number, queryParams: any, isOnlyShowOnline: boolean) => {
    return baseRequest.get("/serverInfo/getPage", {
        params: {
            "pageSize": pageSize,
            "pageNo": pageNo,
            "queryParams": queryParams,
            "onlyShowOnline": isOnlyShowOnline,
            "inWhite": true
        }
    });
}


// 根据serverId获取服务器详细信息
export const getServerInfo = (id: number) => {
    return baseRequest.get("/serverInfo/getServerInfo", {
        params: {
            id
        }
    });
}


// 根据serverIds获取服务器详细列表信息
export const getServerInfoList = (ids: number[]) => {
    return baseRequest.post("/serverInfo/getServerInfoByIds", ids);
}


// 根据ids更新服务器并获取新的信息列表
export const updateHardwareInfoByIds = (ids: number[]) => {
    return baseRequest.post("/serverInfo/updateHardwareInfoByIds", ids);
}


// 根据ids关闭服务器
export const closeServerById = (serverId: number) => {
    return baseRequest.post("/serverInfo/shutdownById", serverId);
}


// 根据id取消关闭服务器
export const cancelShutdownById = (serverId: number) => {
    return baseRequest.post("/serverInfo/cancelShutdownById", serverId);
}


// 重启服务器
export const rebootById = (serverId: number) => {
    return baseRequest.post("/serverInfo/rebootById", serverId);
}


// 通过id关闭服务器，若列表为空则默认关闭所有服务器
export const shutdownByIds = (serverIdList: number[] | null) => {
    return baseRequest.post("/serverInfo/shutdownByIds", serverIdList);
}


// 通过id取消关闭服务器，若列表为空则默认取消关闭所有服务器
export const cancelShutdownByIds = (serverIdList: number[] | null) => {
    return baseRequest.post("/serverInfo/cancelShutdownByIds", serverIdList);
}


// 根据id更新服务器信息
export const updateServerInfoById = (serverInfo: ServerInfo) => {
    return baseRequest.post("/serverInfo/updateServerInfoById", serverInfo);
}


// 获取所有服务器信息白名单
export const getWhiteList = (isWhite: boolean) => {
    return baseRequest.get("/serverInfo/getWhiteList", {
        params: {
            "isWhite": isWhite
        }
    });
}


// 添加白名单
export const addWhiteList = (id: string) => {
    return baseRequest.get("/serverInfo/addServer2White", {
        params: {
            "id": id
        }
    });
}


// 删除白名单
export const removeWhite = (id: string) => {
    return baseRequest.delete(`/serverInfo/removeWhite/${id}`)
}

// 获取dashboard中关于服务器的信息
export const getDashboardServerInfo = () => {
    return baseRequest.get("/serverInfo/getDashboardInfo");
}


// 根据id删除服务器信息
export const deleteServerInfoById = (id: number) => {
    return baseRequest.delete(`/serverInfo/${id}`);
}


// 根据服务器id获取用户权限信息
export const getServerUserAuthInfo = (serverId: number) => {
    return baseRequest.get(`/serverUserAuthorityInfo/getCurrentServerUserAuth/${serverId}`);
}


// 根据信息修改用户权限
export const updateUserAuthInfo = (serverId: number, userId: number, auth: boolean) => {
    return baseRequest.put(`/serverUserAuthorityInfo/updateUserAuthInfo/${serverId}/${userId}/${auth}`);
}