import axios from 'axios';

export const getApiUrl = async () => {
    const ec2Url = 'http://3.131.213.236:5000';
    const localhostUrl = 'http://localhost:5000';

    try {
        await axios.get(`${localhostUrl}/healthcheck`);
        return localhostUrl;
    } catch (error) {
        console.error('EC2 instance not available, falling back to localhost');
        return ec2Url;
    }
};