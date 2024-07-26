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
        console.log(`Received request for project number: ${projectNo}`);
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
        console.log(`Fetching info for project number: ${projectNo}`);
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

        console.log('API Response:', response.data);

        if (response.data && response.data.length > 0) {
            const project = response.data[0];
            return {
                projectName: project.name,
                clientName: project.client.name,
                contactName: project.contact ? `${project.contact.last_name} ${project.contact.first_name}` : 
                             project.user ? `${project.user.last_name} ${project.user.first_name}` : '担当者不明'
            };
        } else {
            console.log('No project found for the given project number');
            return null;
        }
    } catch (error) {
        console.error('Error calling Board API:', error);
        if (error.response) {
            console.error('API Response:', error.response.data);
        }
        throw error;
    }
}

module.exports = router;