import dotenv from 'dotenv';
import { seedProjects } from '../src/lib/seed-data';

// Load environment variables
dotenv.config();

async function main() {
  console.log('Starting database seeding...');
  
  try {
    await seedProjects();
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main();