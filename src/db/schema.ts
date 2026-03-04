import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

// Curriculum Tables
export const courses = sqliteTable("courses", {
    id: text("id").primaryKey(), // We will use UUIDs
    name: text("name").notNull().unique(), // e.g., "BCA", "B.Sc IT"
    totalSemesters: integer("total_semesters").default(6).notNull(),
});

export const colleges = sqliteTable("colleges", {
    id: text("id").primaryKey(), // We will use UUIDs
    name: text("name").notNull().unique(), // e.g., "Panjab University"
});

export const subjects = sqliteTable("subjects", {
    id: text("id").primaryKey(), // We will use UUIDs
    name: text("name").notNull(), // e.g., "Operating Systems"
    courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    semester: text("semester").notNull(), // e.g., "Sem 3"
});

// Many-to-Many Join Table: Colleges <-> Courses
export const collegeCourses = sqliteTable("college_courses", {
    collegeId: text("college_id").notNull().references(() => colleges.id, { onDelete: "cascade" }),
    courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
});

// Users Table
export const users = sqliteTable("users", {
    id: text("id").primaryKey(), // We will use UUIDs
    name: text("name"),
    username: text("username").unique(),
    email: text("email").notNull().unique(),
    emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
    image: text("image"),
    role: text("role", { enum: ["ADMIN", "MODERATOR", "REVIEWER", "USER"] }).default("USER"),
    course: text("course"), // e.g., "BCA", "B.Sc IT"
    session: text("session"),
    collegeId: text("college_id").references(() => colleges.id, { onDelete: "set null" }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// PYQs (Past Year Questions) Table
export const pyqs = sqliteTable("pyqs", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    courseId: text("course_id").notNull().references(() => courses.id),
    semester: text("semester").notNull(),
    subjectId: text("subject_id").notNull().references(() => subjects.id),
    type: text("type", { enum: ["PYQ", "Notes", "Syllabus"] }).default("PYQ").notNull(),
    year: integer("year").notNull(),
    driveId: text("drive_id").notNull(), // Google Drive File ID
    viewLink: text("view_link").notNull(), // Google Drive WebViewLink
    downloadLink: text("download_link").notNull(), // Google Drive WebContentLink
    uploaderId: text("uploader_id").references(() => users.id),
    status: text("status", { enum: ["PENDING", "APPROVED", "REJECTED"] }).default("PENDING"),
    views: integer("views").default(0),
    downloads: integer("downloads").default(0),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Notices Table
export const notices = sqliteTable("notices", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    type: text("type", { enum: ["Exam", "Event", "General"] }).notNull(),
    authorId: text("author_id").references(() => users.id),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Role Applications Table
export const roleApplications = sqliteTable("role_applications", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["MODERATOR", "REVIEWER"] }).notNull(),
    reason: text("reason").notNull(),
    status: text("status", { enum: ["PENDING", "APPROVED", "REJECTED"] }).default("PENDING"),
    adminNote: text("admin_note"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// NextAuth Specific Tables (Required for Auth.js Database Adapters)
export const accounts = sqliteTable("accounts", {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
});

export const sessions = sqliteTable("sessions", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable("verificationToken", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

// Relationships
import { relations } from "drizzle-orm";

export const usersRelations = relations(users, ({ many, one }) => ({
    pyqs: many(pyqs),
    roleApplications: many(roleApplications),
    college: one(colleges, {
        fields: [users.collegeId],
        references: [colleges.id],
    }),
}));

export const collegesRelations = relations(colleges, ({ many }) => ({
    users: many(users),
    collegeCourses: many(collegeCourses),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
    collegeCourses: many(collegeCourses),
    subjects: many(subjects),
    pyqs: many(pyqs),
}));

export const collegeCoursesRelations = relations(collegeCourses, ({ one }) => ({
    college: one(colleges, {
        fields: [collegeCourses.collegeId],
        references: [colleges.id]
    }),
    course: one(courses, {
        fields: [collegeCourses.courseId],
        references: [courses.id]
    }),
}));

export const pyqsRelations = relations(pyqs, ({ one }) => ({
    uploader: one(users, {
        fields: [pyqs.uploaderId],
        references: [users.id],
    }),
}));

export const roleApplicationsRelations = relations(roleApplications, ({ one }) => ({
    user: one(users, {
        fields: [roleApplications.userId],
        references: [users.id],
    }),
}));
