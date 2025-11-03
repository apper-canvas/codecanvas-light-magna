import pensData from "@/services/mockData/pens.json";

class PenService {
  constructor() {
    this.pens = [...pensData];
    this.nextId = Math.max(...this.pens.map(pen => pen.Id)) + 1;
  }

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.pens].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async getById(id) {
    await this.delay();
    const pen = this.pens.find(p => p.Id === parseInt(id));
    return pen ? { ...pen } : null;
  }

  async getTrending() {
    await this.delay();
    return [...this.pens]
      .sort((a, b) => (b.likes + b.views) - (a.likes + a.views))
      .slice(0, 10);
  }

async search(query, options = {}) {
    await this.delay(200);
    if (!query.trim()) return [];
    
    const { sortBy = "recent", filterBy = "all" } = options;
    const searchTerm = query.toLowerCase();
    
    // Generate tags for each pen (simulated)
    const pensWithTags = this.pens.map(pen => ({
      ...pen,
      tags: this.generateTags(pen)
    }));
    
    let results = pensWithTags.filter(pen => {
      switch (filterBy) {
        case "title":
          return pen.title.toLowerCase().includes(searchTerm);
        case "author":
          return pen.author.name.toLowerCase().includes(searchTerm);
        case "tags":
          return pen.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        case "all":
        default:
          return (
            pen.title.toLowerCase().includes(searchTerm) ||
            pen.author.name.toLowerCase().includes(searchTerm) ||
            pen.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          );
      }
    });

    // Sort results
    results.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.likes + b.views) - (a.likes + a.views);
        case "views":
          return b.views - a.views;
        case "likes":
          return b.likes - a.likes;
        case "recent":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return results;
  }

  generateTags(pen) {
    const tags = [];
    const title = pen.title.toLowerCase();
    
    // Generate tags based on pen content
    if (title.includes('css')) tags.push('CSS');
    if (title.includes('javascript') || title.includes('js')) tags.push('JavaScript');
    if (title.includes('html')) tags.push('HTML');
    if (title.includes('animation')) tags.push('Animation');
    if (title.includes('hover')) tags.push('Hover Effects');
    if (title.includes('button')) tags.push('Buttons');
    if (title.includes('card')) tags.push('Cards');
    if (title.includes('grid')) tags.push('Grid Layout');
    if (title.includes('canvas')) tags.push('Canvas');
    if (title.includes('particle')) tags.push('Particles');
    if (title.includes('color')) tags.push('Colors');
    if (title.includes('gradient')) tags.push('Gradients');
    if (title.includes('morph')) tags.push('Morphing');
    if (title.includes('glass')) tags.push('Glassmorphism');
    if (title.includes('weather')) tags.push('Weather');
    if (title.includes('dashboard')) tags.push('Dashboard');
    if (title.includes('interactive')) tags.push('Interactive');
    
    // Add some random popular tags
    const commonTags = ['UI', 'Design', 'Frontend', 'Creative', 'Modern'];
    tags.push(...commonTags.slice(0, Math.floor(Math.random() * 3) + 1));
    
    return [...new Set(tags)]; // Remove duplicates
  }

  async create(penData) {
    await this.delay();
    
    const newPen = {
      Id: this.nextId++,
      title: penData.title || "Untitled Pen",
      html: penData.html || "",
      css: penData.css || "",
      javascript: penData.javascript || "",
      thumbnail: null,
      author: {
        name: "Anonymous",
        avatar: null,
        id: "anonymous"
      },
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.pens.unshift(newPen);
    
    // Save to localStorage
    localStorage.setItem(`pen_${newPen.Id}`, JSON.stringify(newPen));
    
    return { ...newPen };
  }

  async update(id, penData) {
    await this.delay();
    
    const penIndex = this.pens.findIndex(p => p.Id === parseInt(id));
    if (penIndex === -1) return null;

    const updatedPen = {
      ...this.pens[penIndex],
      ...penData,
      updatedAt: new Date().toISOString()
    };

    this.pens[penIndex] = updatedPen;
    
    // Save to localStorage
    localStorage.setItem(`pen_${id}`, JSON.stringify(updatedPen));
    
    return { ...updatedPen };
  }

  async delete(id) {
    await this.delay();
    
    const penIndex = this.pens.findIndex(p => p.Id === parseInt(id));
    if (penIndex === -1) return false;

    this.pens.splice(penIndex, 1);
    localStorage.removeItem(`pen_${id}`);
    
    return true;
  }

  async likePen(id) {
    await this.delay(100);
    
    const pen = this.pens.find(p => p.Id === parseInt(id));
    if (!pen) return null;

    pen.likes += 1;
    pen.updatedAt = new Date().toISOString();
    
    return { ...pen };
  }

  async viewPen(id) {
    await this.delay(50);
    
    const pen = this.pens.find(p => p.Id === parseInt(id));
    if (!pen) return null;

    pen.views += 1;
    pen.updatedAt = new Date().toISOString();
    
    return { ...pen };
  }
}

export default new PenService();