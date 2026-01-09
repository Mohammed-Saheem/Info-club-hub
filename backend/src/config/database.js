const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data.json');

// Initialize database
const initDb = () => ({
  profiles: [],
  events: [],
  event_photos: [],
  projects: [],
  team_members: [],
  gallery_photos: [],
  contact_submissions: [],
  join_applications: []
});

// Load database
const loadDb = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
  return initDb();
};

// Save database
const saveDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Database wrapper with simple query-like interface
const db = {
  data: loadDb(),
  
  // Get all records from a table
  all: (table) => {
    return db.data[table] || [];
  },
  
  // Find one record
  findOne: (table, predicate) => {
    return db.data[table]?.find(predicate) || null;
  },
  
  // Find by ID
  findById: (table, id) => {
    return db.data[table]?.find(item => item.id === id) || null;
  },
  
  // Insert a record
  insert: (table, record) => {
    if (!db.data[table]) db.data[table] = [];
    record.created_at = new Date().toISOString();
    record.updated_at = new Date().toISOString();
    db.data[table].push(record);
    saveDb(db.data);
    return record;
  },
  
  // Update a record
  update: (table, id, updates) => {
    const index = db.data[table]?.findIndex(item => item.id === id);
    if (index === -1 || index === undefined) return null;
    db.data[table][index] = { ...db.data[table][index], ...updates, updated_at: new Date().toISOString() };
    saveDb(db.data);
    return db.data[table][index];
  },
  
  // Delete a record
  delete: (table, id) => {
    const index = db.data[table]?.findIndex(item => item.id === id);
    if (index === -1 || index === undefined) return false;
    db.data[table].splice(index, 1);
    saveDb(db.data);
    return true;
  },
  
  // Count records
  count: (table, predicate) => {
    if (predicate) {
      return db.data[table]?.filter(predicate).length || 0;
    }
    return db.data[table]?.length || 0;
  },
  
  // Filter records
  filter: (table, predicate) => {
    return db.data[table]?.filter(predicate) || [];
  },
  
  // Save changes
  save: () => saveDb(db.data)
};

console.log('✅ Connected to JSON database');

module.exports = db;
