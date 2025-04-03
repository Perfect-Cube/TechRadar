  private initializeData() {
    // Clear all existing data
    this.technologies.clear();
    this.quadrants.clear();
    this.rings.clear();
    this.projects.clear();
    this.technologyProjects.clear();
    
    // Reset all IDs
    this.techCurrentId = 1;
    this.quadrantCurrentId = 1;
    this.ringCurrentId = 1;
    this.projectCurrentId = 1;
    this.techProjectCurrentId = 1;
    
    // Create quadrants from the image data
    const techniques = this.createQuadrant({ 
      name: "Techniques", 
      description: "Elements of a software development process, such as experience design and coding practices", 
      color: "#3b82f6" 
    });
    
    const tools = this.createQuadrant({ 
      name: "Tools", 
      description: "Software development tools and supporting services", 
      color: "#8b5cf6" 
    });
    
    const frameworks = this.createQuadrant({ 
      name: "Frameworks", 
      description: "Programming frameworks and foundation libraries", 
      color: "#f97316" 
    });
    
    const platforms = this.createQuadrant({ 
      name: "Platforms", 
      description: "Things that we build software on top of: infrastructure, databases, etc.", 
      color: "#ec4899" 
    });

    // Create rings from the image data
    const adopt = this.createRing({ 
      name: "Adopt", 
      description: "We strongly recommend using these technologies when appropriate", 
      color: "#10b981" 
    });
    
    const trial = this.createRing({ 
      name: "Trial", 
      description: "These technologies are ready for trial use, but not yet for widespread adoption", 
      color: "#3b82f6" 
    });
    
    const assess = this.createRing({ 
      name: "Assess", 
      description: "These technologies are worth exploring to understand how they can be useful", 
      color: "#f59e0b" 
    });
    
    const hold = this.createRing({ 
      name: "Hold", 
      description: "Proceed with caution with these technologies", 
      color: "#ef4444" 
    });

    // Tools - Adopt
    this.createTechnology({ name: "Claude Sonnet", description: "AI assistant model from Anthropic", quadrant: 1, ring: 0 });
    this.createTechnology({ name: "Tuple", description: "Remote pair programming tool", quadrant: 1, ring: 0 });
    this.createTechnology({ name: "YOLO", description: "Real-time object detection system", quadrant: 1, ring: 0 });
    
    // Tools - Trial
    this.createTechnology({ name: "D2", description: "Declarative diagramming language", quadrant: 1, ring: 1 });
    this.createTechnology({ name: "metabase", description: "Business intelligence and analytics tool", quadrant: 1, ring: 1 });
    this.createTechnology({ name: "Anything LLM", description: "Open-source ChatGPT alternative", quadrant: 1, ring: 1 });
    
    // Techniques - Adopt
    this.createTechnology({ name: "GraphRAG", description: "Graph-based Retrieval Augmented Generation", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Small language models", description: "Smaller, efficient AI language models", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Model Distillation", description: "Technique to create smaller models from larger ones", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Prompt Engineering", description: "Designing effective prompts for AI models", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Mixed reality", description: "Blend of physical and digital worlds", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Ambient Computing", description: "Technology integrated into environment", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Explainable AI", description: "AI systems with understandable decisions", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Multimodal AI", description: "AI that handles multiple input/output types", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Shadow AI mastering", description: "AI mastering process", quadrant: 0, ring: 0 });
    
    // Techniques - Trial
    this.createTechnology({ name: "Quantum computing", description: "Computing based on quantum mechanics", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Quantum Sensing", description: "Detecting signals using quantum properties", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Edge Computing", description: "Processing data near the source", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Adaptive AI", description: "AI that adapts to changing conditions", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Advanced Swarm Systems", description: "Decentralized, self-organized systems", quadrant: 0, ring: 1 });
    
    // Techniques - Assess
    this.createTechnology({ name: "Wearable Technologies", description: "Computing devices worn on body", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "HMO", description: "Health maintenance organization", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "Digital Identity", description: "Electronic verification of identity", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "5G/6G", description: "Mobile network technologies", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "3D Data visualization", description: "Visual representation of data in 3D", quadrant: 0, ring: 2 });
    
    // Frameworks - Adopt
    this.createTechnology({ name: "Crew AI", description: "AI framework for team collaboration", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Langraph", description: "Graph-based framework for language models", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Agony", description: "Framework for efficient data processing", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Langchain", description: "Framework for developing applications powered by language models", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Langsmith", description: "Developer platform for LLM applications", quadrant: 2, ring: 0 });
    
    // Platforms - Adopt
    this.createTechnology({ name: "Trino", description: "Distributed SQL query engine", quadrant: 3, ring: 0 });
    this.createTechnology({ name: "Gitlab CI/CD", description: "Continuous integration and delivery platform", quadrant: 3, ring: 0 });
    this.createTechnology({ name: "Deepseek R1", description: "AI platform for research", quadrant: 3, ring: 0 });
    this.createTechnology({ name: "Chain loop", description: "Software supply chain management platform", quadrant: 3, ring: 0 });
    
    // Platforms - Trial
    this.createTechnology({ name: "Railway", description: "Application deployment platform", quadrant: 3, ring: 1 });
    
    // Sample project
    const techRadar = this.createProject({
      name: "VW Tech Radar",
      description: "Visualization tool for technology choices and assessment",
      status: "active"
    });
  }