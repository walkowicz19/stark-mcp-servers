const express = require('express');
const router = express.Router();

// Get memory graph
router.get('/graph', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const nodes = db.getAllMemoryNodes();
    const relationships = db.getMemoryRelationships();
    
    res.json({ 
      nodes: nodes.map(n => ({
        ...n,
        metadata: n.metadata ? JSON.parse(n.metadata) : {}
      })),
      relationships 
    });
  } catch (error) {
    console.error('Error fetching memory graph:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get memory statistics
router.get('/stats', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const nodes = db.getAllMemoryNodes();
    const relationships = db.getMemoryRelationships();
    
    const typeCount = {};
    nodes.forEach(node => {
      typeCount[node.type] = (typeCount[node.type] || 0) + 1;
    });

    const stats = {
      totalNodes: nodes.length,
      totalRelationships: relationships.length,
      nodesByType: typeCount,
      mostAccessed: nodes.sort((a, b) => b.access_count - a.access_count).slice(0, 10)
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching memory stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search memory
router.get('/search', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    const nodes = db.getAllMemoryNodes();
    const results = nodes.filter(node => 
      node.content.toLowerCase().includes(query.toLowerCase()) ||
      node.type.toLowerCase().includes(query.toLowerCase())
    );

    res.json({ results, query });
  } catch (error) {
    console.error('Error searching memory:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add memory node
router.post('/nodes', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { nodeId, type, content, metadata } = req.body;
    
    if (!nodeId || !type || !content) {
      return res.status(400).json({ error: 'nodeId, type, and content are required' });
    }

    db.saveMemoryNode(nodeId, type, content, metadata || {});
    
    req.app.locals.broadcast({
      type: 'memory_node_updated',
      data: { nodeId, type, content, metadata },
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, nodeId });
  } catch (error) {
    console.error('Error adding memory node:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add memory relationship
router.post('/relationships', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { sourceId, targetId, type, weight } = req.body;
    
    if (!sourceId || !targetId || !type) {
      return res.status(400).json({ error: 'sourceId, targetId, and type are required' });
    }

    db.saveMemoryRelationship(sourceId, targetId, type, weight || 1.0);
    
    req.app.locals.broadcast({
      type: 'memory_relationship_created',
      data: { sourceId, targetId, type, weight },
      timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding memory relationship:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get node details
router.get('/nodes/:nodeId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { nodeId } = req.params;
    
    const node = db.getMemoryNode(nodeId);
    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    const relationships = db.getMemoryRelationships(nodeId);
    db.incrementNodeAccess(nodeId);

    res.json({ 
      node: {
        ...node,
        metadata: node.metadata ? JSON.parse(node.metadata) : {}
      },
      relationships 
    });
  } catch (error) {
    console.error('Error fetching node:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
