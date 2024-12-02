import axios from 'axios';

export const getApiUrl = async () => {
    const gaeUrl = 'https://nutrininja-443507.uw.r.appspot.com/backend';
    const localhostUrl = 'http://localhost:5000/backend';

    try {
        await axios.get(`${gaeUrl}/healthcheck`);
        return gaeUrl;
    } catch (error) {
        console.error('GAE instance not available, falling back to localhost');
        return localhostUrl;
    }
};