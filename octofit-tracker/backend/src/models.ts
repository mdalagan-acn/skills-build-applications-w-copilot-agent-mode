import mongoose, { Schema } from 'mongoose';

const baseJsonOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    delete ret._id;
    return ret;
  }
};

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    streak: { type: Number, default: 0 },
    teamIds: [{ type: String }]
  },
  { timestamps: true }
);
userSchema.virtual('id').get(function getId() {
  return this._id.toString();
});
userSchema.set('toJSON', baseJsonOptions);

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    members: [{ type: String }]
  },
  { timestamps: true }
);
teamSchema.virtual('id').get(function getId() {
  return this._id.toString();
});
teamSchema.set('toJSON', baseJsonOptions);

const activitySchema = new Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: String, required: true }
  },
  { timestamps: true }
);
activitySchema.virtual('id').get(function getId() {
  return this._id.toString();
});
activitySchema.set('toJSON', baseJsonOptions);

const leaderboardEntrySchema = new Schema(
  {
    rank: { type: Number, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    score: { type: Number, required: true }
  },
  { timestamps: true }
);
leaderboardEntrySchema.virtual('id').get(function getId() {
  return this._id.toString();
});
leaderboardEntrySchema.set('toJSON', baseJsonOptions);

const workoutSchema = new Schema(
  {
    title: { type: String, required: true },
    difficulty: { type: String, required: true },
    duration: { type: Number, required: true }
  },
  { timestamps: true }
);
workoutSchema.virtual('id').get(function getId() {
  return this._id.toString();
});
workoutSchema.set('toJSON', baseJsonOptions);

export const User = mongoose.model('User', userSchema);
export const Team = mongoose.model('Team', teamSchema);
export const Activity = mongoose.model('Activity', activitySchema);
export const LeaderboardEntry = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);
export const Workout = mongoose.model('Workout', workoutSchema);
