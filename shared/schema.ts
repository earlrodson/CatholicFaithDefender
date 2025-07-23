import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const qaQuestions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  fullAnswer: text("full_answer"),
  category: text("category"),
  language: text("language").notNull().default("english"),
  subjectOverview: text("subject_overview"),
  etymology: text("etymology"),
  churchDocuments: text("church_documents"),
  scriptureSupport: text("scripture_support"),
  earlyChurchFathers: text("early_church_fathers"),
  summaryPoints: text("summary_points"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prayers = pgTable("prayers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category"),
  latin: text("latin"),
  language: text("language").notNull().default("english"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // encyclical, catechism, etc.
  author: text("author"),
  articleCount: integer("article_count"),
  language: text("language").notNull().default("english"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bibleVerses = pgTable("bible_verses", {
  id: serial("id").primaryKey(),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  verse: integer("verse").notNull(),
  content: text("content").notNull(),
  testament: text("testament").notNull(), // old, new
  language: text("language").notNull().default("english"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // qa, prayer, document, bible
  contentId: integer("content_id").notNull(),
  userId: text("user_id").notNull().default("default"), // For offline, we'll use a default user
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQAQuestionSchema = createInsertSchema(qaQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertPrayerSchema = createInsertSchema(prayers).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertBibleVerseSchema = createInsertSchema(bibleVerses).omit({
  id: true,
  createdAt: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export type QAQuestion = typeof qaQuestions.$inferSelect;
export type InsertQAQuestion = z.infer<typeof insertQAQuestionSchema>;
export type Prayer = typeof prayers.$inferSelect;
export type InsertPrayer = z.infer<typeof insertPrayerSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type BibleVerse = typeof bibleVerses.$inferSelect;
export type InsertBibleVerse = z.infer<typeof insertBibleVerseSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
