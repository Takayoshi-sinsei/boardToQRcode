const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const axios = require('axios');
require('dotenv').config();

const BOARD_API_URL = process.env.BOARD_API_URL;
const BOARD_API_KEY = process.env.BOARD_API_KEY;
const BOARD_API_TOKEN = process.env.BOARD_API_TOKEN;

router.get('/:projectNo', authenticateToken, async (req, res) => {
    try {
        const { projectNo } = req.params;
        const projectInfo = await fetchProjectInfoFromBoardAPI(projectNo);
        
        if (projectInfo) {
            res.json(projectInfo);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error fetching project info:', error);
        res.status(500).json({ message: 'Error fetching project info', error: error.message });
    }
});

async function fetchProjectInfoFromBoardAPI(projectNo) {
    try {
        const response = await axios.get(`${BOARD_API_URL}/projects`, {
            params: {
                project_no_eq: projectNo
            },
            headers: {
                'Authorization': `Bearer ${BOARD_API_TOKEN}`,
                'x-api-key': BOARD_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.projects && response.data.projects.length > 0) {
            const project = response.data.projects[0];
            return {
                projectName: project.name,
                clientName: project.client.name,
                contactName: `${project.contact.last_name} ${project.contact.first_name}`
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