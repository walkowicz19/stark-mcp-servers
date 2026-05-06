// Memory Graph Visualization using Cytoscape.js

let cy = null;
let selectedNode = null;

// Initialize memory graph when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeMemoryGraph();
});

function initializeMemoryGraph() {
  console.log('Initializing Cytoscape.js memory graph...');
  const container = document.getElementById('memoryGraph');
  if (!container) {
    console.log('Container #memoryGraph not found');
    return;
  }

  // Clear container and make it fill the card
  container.innerHTML = '';
  container.style.height = '280px'; // Set container height
  container.style.display = 'flex';
  container.style.margin = '0';
  container.style.padding = '0';
  
  // Create wrapper for graph and details - fills entire container
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.gap = '0'; // No gap to maximize space
  wrapper.style.width = '100%';
  wrapper.style.height = '100%'; // Fill entire container
  wrapper.style.margin = '0';
  wrapper.style.padding = '0';
  
  // Create graph container - fills entire left side
  const graphContainer = document.createElement('div');
  graphContainer.id = 'cy-container';
  graphContainer.style.flex = '1';
  graphContainer.style.height = '100%';
  graphContainer.style.background = '#f8f9fa';
  graphContainer.style.borderRadius = '0';
  graphContainer.style.border = 'none';
  graphContainer.style.margin = '0';
  graphContainer.style.padding = '0';
  
  // Create details panel - fills entire right side
  const detailsPanel = document.createElement('div');
  detailsPanel.id = 'node-details';
  detailsPanel.style.width = '300px';
  detailsPanel.style.height = '100%';
  detailsPanel.style.background = '#ffffff';
  detailsPanel.style.borderRadius = '0';
  detailsPanel.style.border = 'none';
  detailsPanel.style.borderLeft = '1px solid #e0e0e0';
  detailsPanel.style.padding = '20px';
  detailsPanel.style.margin = '0';
  detailsPanel.style.overflowY = 'auto';
  detailsPanel.style.boxSizing = 'border-box';
  detailsPanel.innerHTML = '<p style="color: #6c757d; text-align: center; margin-top: 50px;">Click a node to view details</p>';
  
  wrapper.appendChild(graphContainer);
  wrapper.appendChild(detailsPanel);
  container.appendChild(wrapper);

  // Check if Cytoscape is loaded
  if (typeof cytoscape === 'undefined') {
    console.error('Cytoscape.js library not loaded');
    graphContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #dc3545;">Error: Cytoscape.js library not loaded</div>';
    return;
  }

  // Initialize Cytoscape
  try {
    console.log('Creating Cytoscape instance...');
    cy = cytoscape({
      container: graphContainer,
      
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'width': 'data(size)',
            'height': 'data(size)',
            'color': '#2c3e50',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '14px',
            'font-weight': 'bold',
            'text-outline-width': 2,
            'text-outline-color': '#ffffff'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 3,
            'border-color': '#fbbf24'
          }
        },
        {
          selector: 'node.highlighted',
          style: {
            'border-width': 3,
            'border-color': '#fbbf24'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 'data(weight)',
            'line-color': '#6366f1',
            'target-arrow-color': '#6366f1',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '11px',
            'color': '#495057',
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.9,
            'text-background-padding': '4px'
          }
        }
      ],
      
      layout: {
        name: 'circle',
        animate: true,
        animationDuration: 500
      },
      
      // Set initial zoom level - higher to fill space
      zoom: 2,
      minZoom: 0.5,
      maxZoom: 4
    });

    console.log('Cytoscape instance created successfully');

    // Node tap event - show details
    cy.on('tap', 'node', function(evt) {
      const node = evt.target;
      const nodeData = node.data();
      console.log('Node tapped:', node.id());
      selectedNode = node.id();
      
      // Highlight the node
      cy.nodes().removeClass('highlighted');
      node.addClass('highlighted');
      
      // Show node details
      showNodeDetails(nodeData);
    });

    // Background tap event - hide details
    cy.on('tap', function(evt) {
      if (evt.target === cy) {
        selectedNode = null;
        cy.nodes().removeClass('highlighted');
        hideNodeDetails();
      }
    });

    // Setup controls
    setupMemoryControls();
    setupMemorySearch();

    console.log('Memory graph initialized, waiting for data...');
  } catch (error) {
    console.error('Error initializing Cytoscape:', error);
    graphContainer.innerHTML = `<div style="padding: 20px; text-align: center; color: #dc3545;">Error initializing graph: ${error.message}</div>`;
  }
}

function setupMemoryControls() {
  const resetBtn = document.getElementById('resetZoomBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (cy) {
        cy.fit(50);
        cy.nodes().removeClass('highlighted');
        selectedNode = null;
        hideNodeDetails();
      }
    });
  }
}

function renderMemoryGraph(data) {
  if (!cy) {
    console.log('Cytoscape not initialized yet');
    return;
  }

  try {
    console.log('Rendering memory graph with data:', data);
    
    const nodes = data.nodes || [];
    const relationships = data.relationships || [];

    // Clear existing elements
    cy.elements().remove();

    // Add nodes with larger size
    nodes.forEach(node => {
      const nodeId = node.node_id || node.id;
      const size = 120 + (node.access_count || 0) * 5; // Larger base size and scaling
      
      cy.add({
        group: 'nodes',
        data: {
          id: nodeId,
          label: node.content ? node.content.substring(0, 20) + '...' : nodeId,
          type: node.type || 'default',
          color: getNodeColor(node.type),
          size: size,
          content: node.content,
          access_count: node.access_count,
          importance: node.importance,
          created_at: node.created_at,
          last_accessed: node.last_accessed,
          metadata: node.metadata
        }
      });
    });

    console.log(`Added ${nodes.length} nodes`);

    // Add edges
    relationships.forEach(rel => {
      const sourceId = rel.source_node_id || rel.source;
      const targetId = rel.target_node_id || rel.target;
      const edgeId = `${sourceId}-${targetId}`;
      
      // Check if both nodes exist
      const sourceExists = cy.getElementById(sourceId).length > 0;
      const targetExists = cy.getElementById(targetId).length > 0;
      
      if (sourceExists && targetExists) {
        cy.add({
          group: 'edges',
          data: {
            id: edgeId,
            source: sourceId,
            target: targetId,
            label: rel.relationship_type || '',
            weight: (rel.weight || 1) * 2
          }
        });
      } else {
        console.log(`Skipping edge ${edgeId}: source or target node not found`);
      }
    });

    // Apply layout with larger radius to fill space
    cy.layout({
      name: 'circle',
      animate: true,
      animationDuration: 500,
      radius: 80  // Even smaller radius for tighter layout
    }).run();
    
    // Fit to viewport with minimal padding to fill space
    setTimeout(() => {
      cy.fit(10);  // Minimal 10px padding to fill more space
      cy.zoom(cy.zoom() * 1.5);  // Zoom in 50% more to fill empty space
    }, 600);

    console.log('Graph rendered successfully');
  } catch (error) {
    console.error('Error rendering graph:', error);
  }
}

function getNodeColor(type) {
  const colors = {
    'code': '#3b82f6',      // blue
    'api': '#8b5cf6',       // purple
    'data': '#ec4899',      // pink
    'context': '#f59e0b',   // orange
    'concept': '#6366f1',   // indigo
    'entity': '#a855f7',    // violet
    'relationship': '#ec4899', // pink
    'fact': '#10b981',      // green
    'default': '#6b7280'    // gray
  };
  return colors[type] || colors.default;
}

function setupMemorySearch() {
  const searchInput = document.getElementById('memorySearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (!query || !cy) {
      cy.nodes().removeClass('highlighted');
      cy.fit();
      return;
    }
    
    // Find matching nodes
    const matchingNodes = cy.nodes().filter(node => {
      const label = node.data('label')?.toLowerCase() || '';
      const type = node.data('type')?.toLowerCase() || '';
      const id = node.id().toLowerCase();
      
      return label.includes(query) || type.includes(query) || id.includes(query);
    });
    
    if (matchingNodes.length > 0) {
      // Highlight matching nodes
      cy.nodes().removeClass('highlighted');
      matchingNodes.addClass('highlighted');
      
      // Fit to matching nodes
      cy.fit(matchingNodes, 50);
    } else {
      cy.nodes().removeClass('highlighted');
    }
  });
}

// Show node details in the panel
function showNodeDetails(nodeData) {
  const detailsPanel = document.getElementById('node-details');
  if (!detailsPanel) return;
  
  const typeColors = {
    context: '#f59e0b',
    code: '#3b82f6',
    api: '#8b5cf6',
    data: '#ec4899'
  };
  
  const color = typeColors[nodeData.type] || '#6b7280';
  
  detailsPanel.innerHTML = `
    <div style="border-bottom: 2px solid ${color}; padding-bottom: 10px; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #2c3e50; font-size: 18px;">${nodeData.label}</h3>
      <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; background: ${color}; color: white; border-radius: 12px; font-size: 12px; font-weight: 500;">
        ${nodeData.type.toUpperCase()}
      </span>
    </div>
    
    <div style="margin-bottom: 15px;">
      <div style="color: #6c757d; font-size: 12px; font-weight: 600; margin-bottom: 5px;">ID</div>
      <div style="color: #2c3e50; font-family: monospace; font-size: 13px;">${nodeData.id}</div>
    </div>
    
    <div style="margin-bottom: 15px;">
      <div style="color: #6c757d; font-size: 12px; font-weight: 600; margin-bottom: 5px;">CONTENT</div>
      <div style="color: #2c3e50; font-size: 13px; line-height: 1.5;">${nodeData.content || 'No content available'}</div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
      <div>
        <div style="color: #6c757d; font-size: 12px; font-weight: 600; margin-bottom: 5px;">ACCESS COUNT</div>
        <div style="color: #2c3e50; font-size: 20px; font-weight: 600;">${nodeData.access_count || 0}</div>
      </div>
      <div>
        <div style="color: #6c757d; font-size: 12px; font-weight: 600; margin-bottom: 5px;">IMPORTANCE</div>
        <div style="color: #2c3e50; font-size: 20px; font-weight: 600;">${nodeData.importance || 0}</div>
      </div>
    </div>
    
    ${nodeData.created_at ? `
      <div style="margin-bottom: 15px;">
        <div style="color: #6c757d; font-size: 12px; font-weight: 600; margin-bottom: 5px;">CREATED</div>
        <div style="color: #2c3e50; font-size: 13px;">${new Date(nodeData.created_at).toLocaleString()}</div>
      </div>
    ` : ''}
    
    ${nodeData.last_accessed ? `
      <div style="margin-bottom: 15px;">
        <div style="color: #6c757d; font-size: 12px; font-weight: 600; margin-bottom: 5px;">LAST ACCESSED</div>
        <div style="color: #2c3e50; font-size: 13px;">${new Date(nodeData.last_accessed).toLocaleString()}</div>
      </div>
    ` : ''}
    
    ${nodeData.metadata ? `
      <div style="margin-bottom: 15px;">
        <div style="color: #6c757d; font-size: 12px; font-weight: 600; margin-bottom: 5px;">METADATA</div>
        <pre style="color: #2c3e50; font-size: 11px; background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 0;">${JSON.stringify(nodeData.metadata, null, 2)}</pre>
      </div>
    ` : ''}
  `;
}

// Hide node details
function hideNodeDetails() {
  const detailsPanel = document.getElementById('node-details');
  if (!detailsPanel) return;
  
  detailsPanel.innerHTML = '<p style="color: #6c757d; text-align: center; margin-top: 50px;">Click a node to view details</p>';
}

// Export for use in other modules
window.renderMemoryGraph = renderMemoryGraph;

// Made with Bob using Cytoscape.js