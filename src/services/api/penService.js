import { toast } from "react-toastify";

class PenService {
  constructor() {
    // Initialize ApperClient
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  // Database field mapping helper
  mapToDatabase(penData) {
    return {
      title_c: penData.title || penData.title_c,
      html_c: penData.html || penData.html_c || "",
      css_c: penData.css || penData.css_c || "",
      javascript_c: penData.javascript || penData.javascript_c || "",
      thumbnail_c: penData.thumbnail || penData.thumbnail_c,
      views_c: penData.views || penData.views_c || 0,
      likes_c: penData.likes || penData.likes_c || 0,
      created_at_c: penData.createdAt || penData.created_at_c || new Date().toISOString(),
      updated_at_c: penData.updatedAt || penData.updated_at_c || new Date().toISOString(),
      author_name_c: penData.author?.name || penData.author_name_c || "Anonymous",
      author_avatar_c: penData.author?.avatar || penData.author_avatar_c,
      author_id_c: penData.author?.id || penData.author_id_c || "anonymous",
      Tags: penData.tags || penData.Tags || ""
    };
  }

  // Map from database to frontend format
  mapFromDatabase(dbPen) {
    if (!dbPen) return null;
    return {
      Id: dbPen.Id,
      title: dbPen.title_c || "Untitled Pen",
      html: dbPen.html_c || "",
      css: dbPen.css_c || "",
      javascript: dbPen.javascript_c || "",
      thumbnail: dbPen.thumbnail_c,
      views: dbPen.views_c || 0,
      likes: dbPen.likes_c || 0,
      createdAt: dbPen.created_at_c || dbPen.CreatedOn,
      updatedAt: dbPen.updated_at_c || dbPen.ModifiedOn,
      author: {
        name: dbPen.author_name_c || "Anonymous",
        avatar: dbPen.author_avatar_c,
        id: dbPen.author_id_c || "anonymous"
      },
      tags: dbPen.Tags ? dbPen.Tags.split(',').filter(tag => tag.trim()) : []
    };
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_avatar_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords('pen_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(pen => this.mapFromDatabase(pen));
    } catch (error) {
      console.error("Error fetching pens:", error);
      toast.error("Failed to load pens");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_avatar_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('pen_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return this.mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching pen ${id}:`, error);
      return null;
    }
  }

  async getTrending() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_avatar_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        pagingInfo: {"limit": 10, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords('pen_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Sort by popularity (views + likes) on frontend since database sorting is limited
      const pens = response.data.map(pen => this.mapFromDatabase(pen));
      return pens.sort((a, b) => (b.likes + b.views) - (a.likes + a.views)).slice(0, 10);
    } catch (error) {
      console.error("Error fetching trending pens:", error);
      toast.error("Failed to load trending pens");
      return [];
    }
  }

  async search(query, options = {}) {
    try {
      if (!this.apperClient) this.initializeClient();
      if (!query.trim()) return [];
      
      const { sortBy = "recent", filterBy = "all" } = options;
      const searchTerm = query.toLowerCase();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_avatar_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      // Add search filters based on filterBy option
      switch (filterBy) {
        case "title":
          params.where.push({
            "FieldName": "title_c",
            "Operator": "Contains",
            "Values": [searchTerm],
            "Include": true
          });
          break;
        case "author":
          params.where.push({
            "FieldName": "author_name_c",
            "Operator": "Contains",
            "Values": [searchTerm],
            "Include": true
          });
          break;
        case "tags":
          params.where.push({
            "FieldName": "Tags",
            "Operator": "Contains",
            "Values": [searchTerm],
            "Include": true
          });
          break;
        case "all":
        default:
          // Use whereGroups for OR logic across multiple fields
          params.whereGroups = [{
            "operator": "OR",
            "subGroups": [
              {
                "conditions": [
                  {"fieldName": "title_c", "operator": "Contains", "values": [searchTerm]}
                ],
                "operator": ""
              },
              {
                "conditions": [
                  {"fieldName": "author_name_c", "operator": "Contains", "values": [searchTerm]}
                ],
                "operator": ""
              },
              {
                "conditions": [
                  {"fieldName": "Tags", "operator": "Contains", "values": [searchTerm]}
                ],
                "operator": ""
              }
            ]
          }];
          break;
      }
      
      const response = await this.apperClient.fetchRecords('pen_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      let results = response.data.map(pen => this.mapFromDatabase(pen));
      
      // Sort results on frontend
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
    } catch (error) {
      console.error("Error searching pens:", error);
      return [];
    }
  }

  async create(penData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const dbData = this.mapToDatabase({
        ...penData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0
      });
      
      const params = {
        records: [dbData]
      };
      
      const response = await this.apperClient.createRecord('pen_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Pen created successfully!");
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating pen:", error);
      toast.error("Failed to create pen");
      return null;
    }
  }

  async update(id, penData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const dbData = {
        Id: parseInt(id),
        ...this.mapToDatabase({
          ...penData,
          updatedAt: new Date().toISOString()
        })
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await this.apperClient.updateRecord('pen_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Pen updated successfully!");
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating pen:", error);
      toast.error("Failed to update pen");
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('pen_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Pen deleted successfully!");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting pen:", error);
      toast.error("Failed to delete pen");
      return false;
    }
  }

  async likePen(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // First get current pen to increment likes
      const currentPen = await this.getById(id);
      if (!currentPen) return null;
      
      const updatedPen = await this.update(id, {
        ...currentPen,
        likes: currentPen.likes + 1,
        updatedAt: new Date().toISOString()
      });
      
      return updatedPen;
    } catch (error) {
      console.error("Error liking pen:", error);
      return null;
    }
  }

  async viewPen(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // First get current pen to increment views
      const currentPen = await this.getById(id);
      if (!currentPen) return null;
      
      const updatedPen = await this.update(id, {
        ...currentPen,
        views: currentPen.views + 1,
        updatedAt: new Date().toISOString()
      });
      
      return updatedPen;
    } catch (error) {
      console.error("Error viewing pen:", error);
      return null;
    }
  }
}

export default new PenService();