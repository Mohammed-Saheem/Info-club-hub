require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

try {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const existingAdmin = db.findOne('profiles', p => p.email === 'admin@infoclub.com');
  
  if (!existingAdmin) {
    db.insert('profiles', {
      id: uuidv4(),
      user_id: uuidv4(),
      email: 'admin@infoclub.com',
      password_hash: adminPassword,
      full_name: 'Admin User',
      is_admin: true
    });
    console.log('✅ Admin user created (admin@infoclub.com / admin123)');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // Seed some sample events
  const events = [
    { title: 'Hackathon 2026', description: '24-hour coding competition with amazing prizes!', event_date: '2026-02-15', venue: 'Main Auditorium', is_featured: true },
    { title: 'Web Development Workshop', description: 'Learn modern web development with React and Node.js', event_date: '2026-01-20', venue: 'Computer Lab A', is_featured: true },
    { title: 'AI/ML Seminar', description: 'Introduction to Machine Learning and its applications', event_date: '2026-03-10', venue: 'Seminar Hall', is_featured: false }
  ];

  for (const event of events) {
    db.insert('events', { id: uuidv4(), ...event });
  }
  console.log('✅ Sample events created');

  // Seed some sample projects
  const projects = [
    { title: 'Campus Connect', description: 'A mobile app connecting students across campus', tech_stack: ['React Native', 'Node.js', 'MongoDB'], github_url: 'https://github.com/infoclub/campus-connect', is_featured: true },
    { title: 'Study Buddy', description: 'AI-powered study companion for students', tech_stack: ['Python', 'TensorFlow', 'Flask'], github_url: 'https://github.com/infoclub/study-buddy', is_featured: true }
  ];

  for (const project of projects) {
    db.insert('projects', { id: uuidv4(), ...project });
  }
  console.log('✅ Sample projects created');

  // Seed some team members
  const teamMembers = [
    { name: 'John Doe', role: 'President', bio: 'Final year CS student passionate about technology', display_order: 1 },
    { name: 'Jane Smith', role: 'Vice President', bio: 'Third year IT student with a love for open source', display_order: 2 },
    { name: 'Alex Johnson', role: 'Technical Lead', bio: 'Full-stack developer and ML enthusiast', display_order: 3 }
  ];

  for (const member of teamMembers) {
    db.insert('team_members', { id: uuidv4(), ...member });
  }
  console.log('✅ Sample team members created');

  console.log('🎉 Database seeded successfully!');
} catch (error) {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
}
