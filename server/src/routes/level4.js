import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const teamsFile = path.join(process.cwd(), 'src', 'data', 'teams.json');
const subsFile  = path.join(process.cwd(), 'src', 'data', 'submissions.json');
const datasetsDir = path.join(process.cwd(), 'src', 'data');  // ✅ Correct location



const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf-8'));
const writeJSON = (p, data) => fs.writeFileSync(p, JSON.stringify(data, null, 2));

router.get('/ping', requireAuth, (req, res) => {
  const subs = readJSON(subsFile);
  const mine = subs.find(s => s.teamCode === req.team.teamCode);
  res.json({ ok: true, teamCode: req.team.teamCode, completed: !!mine, submission: mine || null });
});

router.get('/dataset', requireAuth, (req, res) => {
  const teamCode = req.team.teamCode;
  const filePath = path.join(datasetsDir, `${teamCode}.csv`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ ok: false, msg: 'Dataset not found for this team' });
    }
  res.setHeader('Content-Disposition', `attachment; filename="${teamCode}.csv"`);
  res.setHeader('Content-Type', 'text/csv');
  fs.createReadStream(filePath).pipe(res);
});

router.post('/submit', requireAuth, (req, res) => {
  const { answer } = req.body;
  if (!answer) return res.status(400).json({ ok: false, msg: 'Answer is required.' });

  const teams = readJSON(teamsFile);
  const subs = readJSON(subsFile);
  const { teamCode } = req.team;

  const teamData = teams.find(t => t.teamCode === teamCode);
  if (!teamData) return res.status(400).json({ ok: false, msg: 'Team not found.' });

  // Convert both to uppercase to make case-insensitive
  const submittedAns = answer.trim().toUpperCase();
  const correctAns = teamData.solutionWord.trim().toUpperCase();

  // Check if already correctly submitted before
  const previous = subs.find(s => s.teamCode === teamCode && s.correct === true);
  if (previous) {
    return res.json({
      ok: true,
      correct: true,
      msg: 'You have already completed this level.',
      timestamp: previous.timestamp
    });
  }

  // Check answer
  const correct = submittedAns === correctAns;

  // ✅ Save only when correct
  if (correct) {
    const record = {
      teamCode,
      submittedAnswer: submittedAns,
      correct: true,
      timestamp: new Date().toISOString()
    };
    subs.push(record);
    writeJSON(subsFile, subs);

    return res.json({
      ok: true,
      correct: true,
      msg: '✅ Correct! Level 4 completed.',
      timestamp: record.timestamp
    });
  } else {
    // ❌ Wrong answer → Do not lock, allow retry
    return res.json({
      ok: false,
      correct: false,
      msg: '❌ Incorrect answer. Try again!'
    });
  }
});


export default router;
