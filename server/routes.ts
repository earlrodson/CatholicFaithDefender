import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookmarkSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // QA Questions
  app.get("/api/qa", async (req, res) => {
    try {
      const language = (req.query.lang as string) || 'english';
      console.log(`Fetching Q&A questions for language: ${language}`);
      
      // Ensure we always get an array, even if the storage layer returns undefined
      let questions = await storage.getQAQuestions(language);
      
      // If questions is not an array, log the error and return an empty array
      if (!Array.isArray(questions)) {
        console.error('Expected an array of questions but got:', questions);
        questions = [];
      }
      
      console.log(`Found ${questions.length} questions for language: ${language}`);
      return res.json(questions);
    } catch (error) {
      console.error('Error in /api/qa:', error);
      // Always return an array, even in error cases
      return res.status(500).json([]);
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
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const language = (req.query.lang as string) || 'english';
      console.log(`Searching Q&A questions for "${query}" in language: ${language}`);
      
      // Ensure we always get an array, even if the storage layer returns undefined
      let questions = await storage.searchQAQuestions(query, language);
      
      // If questions is not an array, log the error and return an empty array
      if (!Array.isArray(questions)) {
        console.error('Expected an array of questions but got:', questions);
        questions = [];
      }
      
      console.log(`Found ${questions.length} matching questions`);
      return res.json(questions);
    } catch (error) {
      console.error('Error in /api/qa/search:', error);
      // Always return an array, even in error cases
      return res.status(500).json([]);
    }
  });

  // Prayers
  app.get("/api/prayers", async (req, res) => {
    try {
      const language = req.query.lang as string || 'english';
      const prayers = await storage.getPrayers(language);
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
      const language = req.query.lang as string || 'english';
      const prayers = await storage.searchPrayers(query, language);
      res.json(prayers);
    } catch (error) {
      res.status(500).json({ message: "Failed to search prayers" });
    }
  });

  // Documents
  app.get("/api/documents", async (req, res) => {
    try {
      const language = req.query.lang as string || 'english';
      const documents = await storage.getDocuments(language);
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
      const language = req.query.lang as string || 'english';
      const documents = await storage.searchDocuments(query, language);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to search documents" });
    }
  });

  // Bible
  app.get("/api/bible", async (req, res) => {
    try {
      const language = req.query.lang as string || 'english';
      const verses = await storage.getBibleVerses(language);
      res.json(verses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Bible verses" });
    }
  });

  app.get("/api/bible/books", async (req, res) => {
    try {
      const language = req.query.lang as string || 'english';
      const books = await storage.getBibleBooks(language);
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
      const language = req.query.lang as string || 'english';
      const verses = await storage.searchBibleVerses(query, language);
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
