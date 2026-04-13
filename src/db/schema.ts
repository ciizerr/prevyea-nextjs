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
    instagram: text("instagram"),
    discord: text("discord"),
    github: text("github"),
    notifyPyqs: integer("notify_pyqs", { mode: "boolean" }).default(true),
    notifyNotices: integer("notify_notices", { mode: "boolean" }).default(true),
    semester: text("semester"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
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
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Notices Table
export const notices = sqliteTable("notices", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    type: text("type", { enum: ["Exam", "Event", "General"] }).notNull(),
    authorId: text("author_id").references(() => users.id),
    expiresAt: integer("expires_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Role Applications Table
export const roleApplications = sqliteTable("role_applications", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["MODERATOR", "REVIEWER"] }).notNull(),
    reason: text("reason").notNull(),
    status: text("status", { enum: ["PENDING", "APPROVED", "REJECTED"] }).default("PENDING"),
    adminNote: text("admin_note"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Bug Reports Table
export const bugReports = sqliteTable("bug_reports", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: text("status", { enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"] }).default("PENDING"),
    adminNote: text("admin_note"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Notifications Table
export const notifications = sqliteTable("notifications", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    read: integer("read", { mode: "boolean" }).default(false),
    link: text("link"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
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

// Holidays Table
export const holidays = sqliteTable("holidays", {
    date: text("date").primaryKey(), // Using YYYY-MM-DD string
    name: text("name").notNull(),
    year: integer("year").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Routines Table
export const routines = sqliteTable("routines", {
    id: text("id").primaryKey(),
    courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    semester: text("semester").notNull(), // e.g., "Sem 3"
    dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
    schedule: text("schedule").notNull(), // e.g., "OS (10:00-11:00 AM), DBMS (11:00-12:00 PM)"
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Relationships
import { relations } from "drizzle-orm";

export const usersRelations = relations(users, ({ many, one }) => ({
    pyqs: many(pyqs),
    roleApplications: many(roleApplications),
    bugReports: many(bugReports),
    notifications: many(notifications),
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
    routines: many(routines),
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

export const bugReportsRelations = relations(bugReports, ({ one }) => ({
    user: one(users, {
        fields: [bugReports.userId],
        references: [users.id],
    }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id],
    }),
}));

export const routinesRelations = relations(routines, ({ one }) => ({
    course: one(courses, {
        fields: [routines.courseId],
        references: [courses.id],
    }),
}));
