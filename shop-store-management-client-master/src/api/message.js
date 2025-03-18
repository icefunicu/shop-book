import {
  post
} from "./../util/http";

// 获取留言
export const getMessages = params => post("/message/getMessages", params);
// 删除留言
export const deleteMessage = params => post("/message/deleteMessage", params);
