import React, { useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../App';

export const Filterpagnation = async ({
  create_new_array = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
  user = undefined,
}) => {
  let obj;

  let headers = {};

  if (user) {
    headers.headers = {
      Authorization: `Bearer ${user}`,
    };
  }

  try {
    if (state !== null && !create_new_array) {
      obj = {
        ...state,
        resulte: [...(state?.resulte || []), ...data],
        page: page,
      };
    } else {
      const response = await axios.post(`${baseUrl}${countRoute}`, data_to_send, headers);

      const totalDocs = response.data?.totalDocs || 0;

      obj = {
        resulte: [...data],
        page: 1,
        totalDocs: totalDocs,
      };
    }

    return obj;
  } catch (error) {
    console.log('Pagination error:', error);
    throw error;
  }
};
