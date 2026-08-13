import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await User.deleteMany({});
    await Team.deleteMany({});
    await Activity.deleteMany({});
    await LeaderboardEntry.deleteMany({});
    await Workout.deleteMany({});

    const users = await User.insertMany([
      { name: 'Ada Lovelace', email: 'ada@example.com', streak: 7, teamIds: ['team-night-runners'] },
      { name: 'Grace Hopper', email: 'grace@example.com', streak: 12, teamIds: ['team-stride-squad'] },
      { name: 'Linus Torvalds', email: 'linus@example.com', streak: 9, teamIds: ['team-night-runners'] },
      { name: 'Margaret Hamilton', email: 'margaret@example.com', streak: 14, teamIds: ['team-stride-squad'] }
    ]);

    const teams = await Team.insertMany([
      { name: 'Night Runners', members: [users[0].id, users[2].id] },
      { name: 'Stride Squad', members: [users[1].id, users[3].id] }
    ]);

    await Activity.insertMany([
      { userId: users[0].id, type: 'run', duration: 30, date: '2026-08-13' },
      { userId: users[1].id, type: 'cycle', duration: 45, date: '2026-08-12' },
      { userId: users[2].id, type: 'strength', duration: 22, date: '2026-08-11' },
      { userId: users[3].id, type: 'walk', duration: 40, date: '2026-08-10' }
    ]);

    await LeaderboardEntry.insertMany([
      { rank: 1, userId: users[1].id, name: users[1].name, score: 1450 },
      { rank: 2, userId: users[3].id, name: users[3].name, score: 1325 },
      { rank: 3, userId: users[0].id, name: users[0].name, score: 1180 },
      { rank: 4, userId: users[2].id, name: users[2].name, score: 1095 }
    ]);

    await Workout.insertMany([
      { title: 'Cardio Blast', difficulty: 'medium', duration: 25 },
      { title: 'Core Strength', difficulty: 'easy', duration: 20 },
      { title: 'Hill Sprint Circuit', difficulty: 'hard', duration: 35 }
    ]);

    console.log('Created users:', users.length);
    console.log('Created teams:', teams.length);
    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
