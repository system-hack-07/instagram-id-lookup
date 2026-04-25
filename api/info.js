// Instagram API handler

const axios = require('axios');

const getInstagramUserData = async (username) => {
    try {
        const response = await axios.get(`https://api.instagram.com/v1/users/search?q=${username}&access_token=YOUR_ACCESS_TOKEN`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Instagram API:', error);
        throw error;
    }
};

module.exports = { getInstagramUserData };