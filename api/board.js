const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const axios = require('axios');
require('dotenv').config();

const BOARD_API_URL = process.env.BOARD_API_URL;
const BOARD_API_KEY = process.env.BOARD_API_KEY;
const BOARD_API_TOKEN = process.env.BOARD_API_TOKEN;

router.get('/:projectId', authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const projectInfo = await fetchProjectInfoFromBoardAPI(projectId);
        
        if (projectInfo) {
            res.json(projectInfo);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error fetching project info:', error);
        res.status(500).json({ message: 'Error fetching project info' });
    }
});

async function fetchProjectInfoFromBoardAPI(projectId) {
    try {
        const response = await axios.get(`${BOARD_API_URL}/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${BOARD_API_TOKEN}`,
                'x-api-key': BOARD_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.data) {
            const projectData = response.data.data;
            return {
                projectName: projectData.attributes.name,
                customerName: projectData.attributes.customer.name
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error calling Board API:', error);
        throw error;
    }
}

module.exports = router;