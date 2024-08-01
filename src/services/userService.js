import axios from 'axios';

const API_URL = 'https://dummyjson.com/users';

export const fetchUsers = async (limit, skip) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        limit,
        skip,
      },
    });
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
