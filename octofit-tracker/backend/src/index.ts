import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { connectToDatabase } from './config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(cors());
app.use(express.json());

const serialize = <T extends { _id?: unknown }>(item: T) => ({
  ...item,
  id: item?._id ? String(item._id) : undefined
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Octofit Tracker API is running',
    baseUrl,
    endpoints: [
      '/api/users/',
      '/api/teams/',
      '/api/activities/',
      '/api/leaderboard/',
      '/api/workouts/'
    ]
  });
});

app.get('/api/users/', async (_req: Request, res: Response) => {
  const users = await User.find({}).sort({ createdAt: 1 }).lean();
  res.json(users.map((user) => serialize(user)));
});

app.post('/api/users/', async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  res.status(201).json(serialize(user.toObject()));
});

app.get('/api/teams/', async (_req: Request, res: Response) => {
  const teams = await Team.find({}).sort({ createdAt: 1 }).lean();
  res.json(teams.map((team) => serialize(team)));
});

app.post('/api/teams/', async (req: Request, res: Response) => {
  const team = await Team.create(req.body);
  res.status(201).json(serialize(team.toObject()));
});

app.get('/api/activities/', async (_req: Request, res: Response) => {
  const activities = await Activity.find({}).sort({ date: 1 }).lean();
  res.json(activities.map((activity) => serialize(activity)));
});

app.post('/api/activities/', async (req: Request, res: Response) => {
  const activity = await Activity.create(req.body);
  res.status(201).json(serialize(activity.toObject()));
});

app.get('/api/leaderboard/', async (_req: Request, res: Response) => {
  const leaderboard = await LeaderboardEntry.find({}).sort({ rank: 1 }).lean();
  res.json(leaderboard.map((entry) => serialize(entry)));
});

app.post('/api/leaderboard/', async (req: Request, res: Response) => {
  const entry = await LeaderboardEntry.create(req.body);
  res.status(201).json(serialize(entry.toObject()));
});

app.get('/api/workouts/', async (_req: Request, res: Response) => {
  const workouts = await Workout.find({}).sort({ createdAt: 1 }).lean();
  res.json(workouts.map((workout) => serialize(workout)));
});

app.post('/api/workouts/', async (req: Request, res: Response) => {
  const workout = await Workout.create(req.body);
  res.status(201).json(serialize(workout.toObject()));
});

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Octofit Tracker API listening on port ${port}`);
      console.log(`API base URL: ${baseUrl}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start API server:', error);
    process.exit(1);
  });
