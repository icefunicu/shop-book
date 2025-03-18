
import {
    get,
    post
  } from "./../util/http";

// 资讯的增删改查
export const addConsult = params => post('/campus/addCampus', params);
export const editConsult = params => post('/campus/editCampus', params);
export const deleteConsult = params => post('/campus/deleteCampus', params);
export const getConsultList = params => post('/campus/getCampusList', params);