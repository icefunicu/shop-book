
import {
    get,
    post
  } from "./../util/http";

// 资讯的增删改查
export const addConsult = params => post('/addCampus', params);
export const editConsult = params => post('/editCampus', params);
export const deleteConsult = params => post('/deleteCampus', params);
export const getConsultList = params => post('/getCampusList', params);