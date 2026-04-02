import { NextFunction, Router, Request, Response } from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validation/matches";
import { db } from "../infra/db/postgres/config";
import { matches } from "../infra/db/postgres/config/schema";
import { getMatchStatus } from "../utils/match-status";
import { desc } from "drizzle-orm";

export const matchRouter = Router();
const MAX_LIMIT = 100;

matchRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid query",
        details: JSON.stringify(parsed.error),
      });
    }

    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);

    try {
      const data = await db
        .select()
        .from(matches)
        .orderBy(desc(matches.createdAt))
        .limit(limit);

      res.json({ data });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to list matches",
        details: JSON.stringify(error),
      });
    }
  },
);

matchRouter.post("/", async (req: Request, res: Response) => {
  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid payload",
      details: JSON.stringify(parsed.error),
    });
  }

  try {
    const {
      sport,
      homeTeam,
      awayTeam,
      startTime,
      endTime,
      homeScore,
      awayScore,
    } = parsed.data;

    const [event] = await db
      .insert(matches)
      .values({
        sport,
        homeTeam,
        awayTeam,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();

    res.status(201).json({ data: event });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create match",
      details: JSON.stringify(error),
    });
  }
});
