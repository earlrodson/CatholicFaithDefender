import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookmarkSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // QA Questions
  app.get("/api/qa", async (req, res) => {
    try {
      const questions = await storage.getQAQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Q&A questions" });
    }
  });

  app.get("/api/qa/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const question = await storage.getQAQuestion(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch question" });
    }
  });

  app.get("/api/qa/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const questions = await storage.searchQAQuestions(query);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to search questions" });
    }
  });

  // Prayers
  app.get("/api/prayers", async (req, res) => {
    try {
      const prayers = await storage.getPrayers();
      res.json(prayers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prayers" });
    }
  });

  app.get("/api/prayers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const prayer = await storage.getPrayer(id);
      if (!prayer) {
        return res.status(404).json({ message: "Prayer not found" });
      }
      res.json(prayer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prayer" });
    }
  });

  app.get("/api/prayers/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const prayers = await storage.searchPrayers(query);
      res.json(prayers);
    } catch (error) {
      res.status(500).json({ message: "Failed to search prayers" });
    }
  });

  // Documents
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.get("/api/documents/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const documents = await storage.searchDocuments(query);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to search documents" });
    }
  });

  // Bible
  app.get("/api/bible", async (req, res) => {
    try {
      const verses = await storage.getBibleVerses();
      res.json(verses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Bible verses" });
    }
  });

  app.get("/api/bible/books", async (req, res) => {
    try {
      const books = await storage.getBibleBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Bible books" });
    }
  });

  app.get("/api/bible/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const verse = await storage.getBibleVerse(id);
      if (!verse) {
        return res.status(404).json({ message: "Verse not found" });
      }
      res.json(verse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch verse" });
    }
  });

  app.get("/api/bible/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const verses = await storage.searchBibleVerses(query);
      res.json(verses);
    } catch (error) {
      res.status(500).json({ message: "Failed to search verses" });
    }
  });

  // Bookmarks
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const userId = req.query.userId as string || 'default';
      const bookmarks = await storage.getBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const validatedData = insertBookmarkSchema.parse(req.body);
      const bookmark = await storage.createBookmark(validatedData);
      res.json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bookmark data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  app.delete("/api/bookmarks/:contentType/:contentId", async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      const userId = req.query.userId as string || 'default';
      const success = await storage.deleteBookmark(contentType, parseInt(contentId), userId);
      if (success) {
        res.json({ message: "Bookmark deleted successfully" });
      } else {
        res.status(404).json({ message: "Bookmark not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  app.get("/api/bookmarks/:contentType/:contentId/check", async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      const userId = req.query.userId as string || 'default';
      const isBookmarked = await storage.isBookmarked(contentType, parseInt(contentId), userId);
      res.json({ isBookmarked });
    } catch (error) {
      res.status(500).json({ message: "Failed to check bookmark status" });
    }
  });

  // Global search across all content
  app.get("/api/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const [qaResults, prayerResults, documentResults, bibleResults] = await Promise.all([
        storage.searchQAQuestions(query),
        storage.searchPrayers(query),
        storage.searchDocuments(query),
        storage.searchBibleVerses(query),
      ]);

      const results = {
        qa: qaResults,
        prayers: prayerResults,
        documents: documentResults,
        bible: bibleResults,
        total: qaResults.length + prayerResults.length + documentResults.length + bibleResults.length
      };

      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to perform global search" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
