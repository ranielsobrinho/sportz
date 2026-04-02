import { z } from "zod";

export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
} as const;

export const listMatchesQuerySchema = z
  .object({
    limit: z.coerce.number().positive().max(100).optional(),
  })
  .strict();

export const matchIdParamSchema = z
  .object({
    id: z.coerce.number().positive().int(),
  })
  .strict();

export const createMatchSchema = z
  .object({
    sport: z.string().min(1, "Sport is required"),
    homeTeam: z.string().min(1, "Home team is required"),
    awayTeam: z.string().min(1, "Away team is required"),
    startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Start time must be a valid ISO date string",
    }),
    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "End time must be a valid ISO date string",
    }),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time",
        path: ["endTime"],
      });
    }
  });

export const updateScoreSchema = z
  .object({
    homeScore: z.coerce.number().int().nonnegative(),
    awayScore: z.coerce.number().int().nonnegative(),
  })
  .strict();