import axios from 'axios';

export const getApiUrl = async () => {
    // const ec2Url = 'https://foodhealthnutrininja.com/backend';
    const localhostUrl = 'http://localhost:5000/backend';

    try {
        await axios.get(`${localhostUrl}/healthcheck`);
        return localhostUrl;
    } catch (error) {
        console.error('EC2 instance not available, falling back to localhost');
        return localhostUrl;
    }
};