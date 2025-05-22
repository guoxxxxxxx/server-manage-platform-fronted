import { server } from "typescript";
import baseRequest from "./baseRequest";
import type { ServerInfo } from "@/api/entity"


// 添加服务器信息
export const addServers = (serverInfo: any) => {
    return baseRequest.post("/serverInfo/addServers", serverInfo);
}


// 分页获取服务器信息列表
export const getServersList = (pageSize: number, pageNo: number) => {
    return baseRequest.get("/serverInfo/getPage", {
        params: {
            pageSize,
            pageNo
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


// 关闭所有服务器
export const shutdownByIds = (serverIdList: number[] | null) => {
    return baseRequest.post("/serverInfo/shutdownByIds", serverIdList);
}