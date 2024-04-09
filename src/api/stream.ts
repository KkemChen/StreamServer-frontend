import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data?: Array<any>;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};
/** 获取系统管理-用户管理列表 */
// export const getUserList = (data?: object) => {
//   return http.request<ResultTable>("post", "/user", { data });
// };

/** 获取全部流信息 */
export const getStreamInfo = (data?: object) => {
  return http.request<ResultTable>("post", "/api/v1/stream/info", { data });
};

/** 新增一个流 */
export const addStreamInfo = (data?: object) => {
  return http.request<Result>("post", "/api/v1/stream/add", { data });
};

/** 删除一个流 */
export const delStreamInfo = (data?: object) => {
  return http.request<Result>("post", "/api/v1/stream/del", { data });
};
// /** 系统管理-用户管理-获取所有角色列表 */
// export const getAllRoleList = () => {
//   return http.request<Result>("get", "/list-all-role");
// };

// /** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
// export const getRoleIds = (data?: object) => {
//   return http.request<Result>("post", "/list-role-ids", { data });
// };

// /** 获取系统管理-角色管理列表 */
// export const getRoleList = (data?: object) => {
//   return http.request<ResultTable>("post", "/role", { data });
// };
// /** 获取系统管理-部门管理列表 */
// // export const getDeptList = (data?: object) => {
// //   return http.request<Result>("post", "/dept", { data });
// // };
