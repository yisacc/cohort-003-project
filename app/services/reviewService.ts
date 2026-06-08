import { eq, and, avg, count, sql } from "drizzle-orm";
import { db } from "~/db";
import { courseReviews } from "~/db/schema";

export function getAverageRatingForCourse(courseId: number) {
  const result = db
    .select({
      average: avg(courseReviews.rating),
      count: count(courseReviews.id),
    })
    .from(courseReviews)
    .where(eq(courseReviews.courseId, courseId))
    .get();

  return {
    average: result?.average ? Number(result.average) : null,
    count: result?.count ?? 0,
  };
}

export function getAverageRatingsForCourses(courseIds: number[]) {
  if (courseIds.length === 0) return new Map<number, { average: number | null; count: number }>();

  const rows = db
    .select({
      courseId: courseReviews.courseId,
      average: avg(courseReviews.rating),
      count: count(courseReviews.id),
    })
    .from(courseReviews)
    .where(
      sql`${courseReviews.courseId} IN (${sql.join(courseIds.map((id) => sql`${id}`), sql`, `)})`
    )
    .groupBy(courseReviews.courseId)
    .all();

  const map = new Map<number, { average: number | null; count: number }>();
  for (const row of rows) {
    map.set(row.courseId, {
      average: row.average ? Number(row.average) : null,
      count: row.count,
    });
  }
  return map;
}

export function getUserReviewForCourse(userId: number, courseId: number) {
  return db
    .select()
    .from(courseReviews)
    .where(
      and(eq(courseReviews.userId, userId), eq(courseReviews.courseId, courseId))
    )
    .get();
}

export function upsertReview(userId: number, courseId: number, rating: number) {
  return db
    .insert(courseReviews)
    .values({ userId, courseId, rating })
    .onConflictDoUpdate({
      target: [courseReviews.userId, courseReviews.courseId],
      set: { rating },
    })
    .returning()
    .get();
}
