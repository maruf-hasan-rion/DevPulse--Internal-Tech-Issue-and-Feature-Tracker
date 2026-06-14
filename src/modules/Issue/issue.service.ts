import { sql } from "./../../db/index";
import type { ICreateIssue } from "./issue.interface";

const createIssueInDB = async (
  issue: ICreateIssue,
  reporterId: string | number,
) => {
  const result = await sql`
    INSERT INTO issues (title, description, type, status, reporter_id, created_at, updated_at)
    VALUES (${issue.title}, ${issue.description}, ${issue.type}, 'open', ${reporterId}, NOW(), NOW())
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;

  return result[0];
};
const getAllIssues = async (filters: {
  sort?: string;
  type?: string;
  status?: string;
}) => {
  const { sort = "newest", type, status } = filters;

  let query = sql`SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues WHERE 1=1`;

  if (type) query = sql`${query} AND type = ${type}`;
  if (status) query = sql`${query} AND status = ${status}`;

  if (sort === "oldest") {
    query = sql`${query} ORDER BY created_at ASC`;
  } else {
    query = sql`${query} ORDER BY created_at DESC`;
  }

  const issues = await query;
  if (issues.length === 0) return [];

  const reporterIds = [
    ...new Set(issues.map((i: any) => Number(i.reporter_id))),
  ];
  if (reporterIds.length === 0)
    return issues.map((issue: any) => ({
      ...issue,
      reporter: null,
    }));

  const users = await sql`
    SELECT id, name, role FROM users WHERE id = ANY(${reporterIds})
  `;

  const userMap = users.reduce((acc: any, user: any) => {
    acc[user.id] = user;
    return acc;
  }, {});

  return issues.map((issue: any) => {
    const { reporter_id, ...issueData } = issue;
    return {
      ...issueData,
      reporter: userMap[reporter_id] || null,
    };
  });
};

const getIssueById = async (id: string) => {
  const issueResult = await sql`
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at 
    FROM issues WHERE id = ${id}
  `;

  if (issueResult.length === 0) return null;
  const issue = issueResult[0];
  if (!issue) return null;

  const userResult = await sql`
    SELECT id, name, role FROM users WHERE id = ${issue.reporter_id}
  `;

  const { reporter_id, ...issueData } = issue;
  return {
    ...issueData,
    reporter: userResult[0] || null,
  };
};

const updateIssue = async (
  id: string,
  payload: { title?: string; description?: string; type?: string },
) => {
  const currentIssue =
    await sql`SELECT title, description, type FROM issues WHERE id = ${id}`;
  if (currentIssue.length === 0) throw new Error("Issue not found");

  const existing = currentIssue[0];
  if (!existing) throw new Error("Issue not found");

  const title = payload.title ?? existing.title;
  const description = payload.description ?? existing.description;
  const type = payload.type ?? existing.type;

  const result = await sql`
    UPDATE issues 
    SET title = ${title}, description = ${description}, type = ${type}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;
  return result[0];
};

const deleteIssue = async (id: string) => {
  const result = await sql`
    DELETE FROM issues WHERE id = ${id} RETURNING id
  `;
  return result.length > 0;
};

export const issueService = {
  createIssueInDB,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
