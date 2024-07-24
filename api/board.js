router.get('/:projectId', authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const projectInfo = await fetchProjectInfoFromBoardAPI(projectId);
        res.json(projectInfo);
    } catch (error) {
        console.error('Error fetching project info:', error);
        if (error.response && error.response.status === 404) {
            res.status(404).json({ message: 'Project not found' });
        } else {
            res.status(500).json({ message: 'Error fetching project info', error: error.message });
        }
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
            throw new Error('Project data not found in response');
        }
    } catch (error) {
        console.error('Error calling Board API:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}