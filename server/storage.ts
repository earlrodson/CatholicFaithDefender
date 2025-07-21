import {
  qaQuestions,
  prayers,
  documents,
  bibleVerses,
  bookmarks,
  type QAQuestion,
  type InsertQAQuestion,
  type Prayer,
  type InsertPrayer,
  type Document,
  type InsertDocument,
  type BibleVerse,
  type InsertBibleVerse,
  type Bookmark,
  type InsertBookmark,
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, and } from "drizzle-orm";

export interface IStorage {
  // QA Questions
  getQAQuestions(): Promise<QAQuestion[]>;
  getQAQuestion(id: number): Promise<QAQuestion | undefined>;
  createQAQuestion(question: InsertQAQuestion): Promise<QAQuestion>;
  searchQAQuestions(query: string): Promise<QAQuestion[]>;

  // Prayers
  getPrayers(): Promise<Prayer[]>;
  getPrayer(id: number): Promise<Prayer | undefined>;
  createPrayer(prayer: InsertPrayer): Promise<Prayer>;
  searchPrayers(query: string): Promise<Prayer[]>;

  // Documents
  getDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  searchDocuments(query: string): Promise<Document[]>;

  // Bible
  getBibleVerses(): Promise<BibleVerse[]>;
  getBibleVerse(id: number): Promise<BibleVerse | undefined>;
  createBibleVerse(verse: InsertBibleVerse): Promise<BibleVerse>;
  searchBibleVerses(query: string): Promise<BibleVerse[]>;
  getBibleBooks(): Promise<{ testament: string; books: string[] }[]>;

  // Bookmarks
  getBookmarks(userId?: string): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(contentType: string, contentId: number, userId?: string): Promise<boolean>;
  isBookmarked(contentType: string, contentId: number, userId?: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private qaQuestions: Map<number, QAQuestion>;
  private prayers: Map<number, Prayer>;
  private documents: Map<number, Document>;
  private bibleVerses: Map<number, BibleVerse>;
  private bookmarks: Map<number, Bookmark>;
  private currentQAId: number;
  private currentPrayerId: number;
  private currentDocumentId: number;
  private currentBibleId: number;
  private currentBookmarkId: number;

  constructor() {
    this.qaQuestions = new Map();
    this.prayers = new Map();
    this.documents = new Map();
    this.bibleVerses = new Map();
    this.bookmarks = new Map();
    this.currentQAId = 1;
    this.currentPrayerId = 1;
    this.currentDocumentId = 1;
    this.currentBibleId = 1;
    this.currentBookmarkId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private async initializeData() {
    // Sample QA Questions from the provided data
    const sampleQAQuestions: InsertQAQuestion[] = [
      {
        question: "What is the Catholic teaching on the Eucharist?",
        answer: "Catholics believe in the Real Presence—that during the Mass, the bread and wine become the actual Body and Blood of Christ (transubstantiation), while maintaining their physical appearances.",
        fullAnswer: "Catholics believe in the Real Presence—that during the Mass, the bread and wine become the actual Body and Blood of Christ through transubstantiation, while maintaining their physical appearances. This teaching is based on Jesus's words at the Last Supper: 'This is my body' and 'This is my blood.' The Church teaches that this transformation occurs through the priest's consecration during Mass, acting in persona Christi (in the person of Christ). This doctrine was formally defined by the Council of Trent and remains a central mystery of Catholic faith.",
        category: "Sacraments"
      },
      {
        question: "Why do Catholics pray to saints?",
        answer: "Catholics don't worship saints but ask them to intercede with God on their behalf, similar to asking a friend to pray for them. Saints are believed to be closer to God in heaven.",
        fullAnswer: "Catholics don't worship saints but ask them to intercede with God on their behalf, similar to asking a friend to pray for them. Saints are believed to be closer to God in heaven and can therefore petition Him more effectively. This practice is called the 'communion of saints'—the spiritual union between those on earth, in purgatory, and in heaven. Saints serve as powerful intercessors and examples of holy living. The practice is rooted in Scripture (James 5:16) and early Christian tradition.",
        category: "Saints"
      },
      {
        question: "What is the Immaculate Conception?",
        answer: "The Immaculate Conception refers to Mary being conceived without original sin, not Jesus' conception. This doctrine states Mary was preserved from original sin from the moment of her conception.",
        fullAnswer: "The Immaculate Conception refers to Mary being conceived without original sin, not Jesus' conception. This doctrine states that Mary was preserved from original sin from the moment of her conception in preparation for her role as Mother of God. Declared as dogma by Pope Pius IX in 1854, it teaches that Mary was filled with grace from the first instant of her existence. This preservation was made possible by the anticipated merits of Christ's sacrifice and was necessary so that Christ could be born of a sinless mother.",
        category: "Marian Doctrine"
      },
      {
        question: "Why do Catholics confess to priests?",
        answer: "Catholics believe Jesus gave the Apostles authority to forgive sins (John 20:23), which was passed to their successors (bishops and priests). The priest acts in persona Christi (in the person of Christ).",
        fullAnswer: "Catholics believe Jesus gave the Apostles authority to forgive sins (John 20:23: 'Whose sins you forgive are forgiven them'), which was passed to their successors through apostolic succession. The priest acts in persona Christi (in the person of Christ) during the sacrament of confession. This sacrament provides several benefits: assurance of God's forgiveness, spiritual counsel, appropriate penance, and grace to avoid future sin. The seal of confession ensures absolute confidentiality, and the priest serves as Christ's instrument of mercy and reconciliation.",
        category: "Sacraments"
      },
      {
        question: "What is Purgatory?",
        answer: "Purgatory is a state of purification where souls destined for Heaven are cleansed of the temporal effects of sin before entering God's presence. It's not a second chance but a final preparation.",
        fullAnswer: "Purgatory is a state of purification where souls destined for Heaven are cleansed of the temporal effects of sin before entering God's perfect presence. It's not a second chance for salvation but a final preparation for those who died in God's grace but with venial sins or attachment to sin. The doctrine is supported by Scripture (1 Corinthians 3:15, 2 Maccabees 12:46) and developed through Church tradition. Prayers and indulgences from the living can help souls in purgatory, demonstrating the communion of saints.",
        category: "Afterlife"
      },
      {
        question: "Why isn't the Bible alone sufficient for Catholic teaching?",
        answer: "Catholics believe in both Scripture and Tradition as authoritative. The Bible itself doesn't claim to be the sole authority, and the early Church relied on oral tradition before the New Testament was compiled.",
        fullAnswer: "Catholics believe in both Scripture and Sacred Tradition as authoritative sources of revelation, not Scripture alone (sola scriptura). The Bible itself doesn't claim to be the sole authority—in fact, it speaks of the importance of tradition (2 Thessalonians 2:15). The early Church relied on oral tradition and apostolic teaching before the New Testament was compiled and canonized by the Church in the 4th century. The Magisterium (teaching authority of the Church) interprets Scripture authentically, preventing individual misinterpretation and maintaining unity of faith.",
        category: "Scripture and Tradition"
      },
      {
        question: "Why do Catholics baptize infants?",
        answer: "Catholics baptize infants to cleanse them of original sin and make them members of God's family. This practice has roots in early Christianity and is supported by Acts 16:15, 33 where entire households were baptized.",
        fullAnswer: "Catholics baptize infants to cleanse them of original sin and incorporate them into God's family, the Church. This practice has roots in early Christianity and is supported by Scripture (Acts 16:15, 33) where entire households, presumably including children, were baptized. Infant baptism recognizes that salvation is God's gift, not earned by human action or understanding. Parents and godparents promise to raise the child in the faith until they can make their own mature commitment at Confirmation. The practice emphasizes grace over works and God's desire that all be saved.",
        category: "Sacraments"
      },
      {
        question: "What is the Catholic view on salvation?",
        answer: "Catholics believe salvation comes through God's grace, received through faith and expressed in good works. It's not earned but requires cooperation with grace through faith, sacraments, and charity.",
        fullAnswer: "Catholics believe salvation comes through God's grace alone, not human works, but this grace must be received through faith and expressed in good works. Salvation is not earned but requires cooperation with God's grace through faith, participation in the sacraments, and works of charity. This differs from 'faith alone' (sola fide) by teaching that faith must be 'working through love' (Galatians 5:6). Good works are the fruit and evidence of true faith, not the cause of salvation. Catholics emphasize both the necessity of grace and human cooperation with that grace.",
        category: "Salvation"
      },
      {
        question: "Why do Catholics use statues and images in worship?",
        answer: "Catholics don't worship statues but use them as visual reminders of holy people and events, similar to keeping family photos. This practice distinguishes between veneration (respect) and worship (reserved for God alone).",
        fullAnswer: "Catholics don't worship statues and images but use them as visual reminders of holy people and events, similar to keeping family photos or war memorials. This practice distinguishes between veneration (dulia for saints, hyperdulia for Mary) and worship/adoration (latria), which is reserved for God alone. Religious art serves as 'books for the illiterate' and helps focus prayer and meditation. The practice is rooted in the Incarnation—God became visible in Christ, making religious imagery appropriate. The Second Council of Nicaea (787 AD) settled this question definitively.",
        category: "Worship"
      },
      {
        question: "What is the significance of the Rosary?",
        answer: "The Rosary is a meditative prayer focused on the life of Christ through Mary's perspective. It consists of specific prayers while contemplating Mysteries (events) from Jesus' life, death, and resurrection.",
        fullAnswer: "The Rosary is a meditative prayer focused on the life of Christ through Mary's perspective. It consists of specific prayers (Our Father, Hail Mary, Glory Be) while contemplating the Mysteries—Joyful, Sorrowful, Glorious, and Luminous—events from Jesus' life, passion, death, and resurrection. This devotion combines vocal prayer with meditation, making it accessible to all. Mary leads us to Christ, and the Rosary helps believers contemplate the central mysteries of Christianity. Pope John Paul II called it 'among the finest and most praiseworthy traditions of Christian contemplation.'",
        category: "Prayer"
      }
    ];

    for (const qa of sampleQAQuestions) {
      await this.createQAQuestion(qa);
    }

    // Sample Prayers
    const samplePrayers: InsertPrayer[] = [
      {
        title: "Our Father",
        content: "Our Father, who art in heaven, hallowed be thy name. Thy kingdom come, thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. Amen.",
        category: "Essential",
        latin: "Pater noster, qui es in caelis, sanctificetur nomen tuum..."
      },
      {
        title: "Hail Mary",
        content: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
        category: "Marian",
        latin: "Ave Maria, gratia plena, Dominus tecum..."
      },
      {
        title: "Glory Be",
        content: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
        category: "Essential",
        latin: "Gloria Patri, et Filio, et Spiritui Sancto..."
      },
      {
        title: "Angel of God",
        content: "Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.",
        category: "Guardian Angel"
      }
    ];

    for (const prayer of samplePrayers) {
      await this.createPrayer(prayer);
    }

    // Sample Documents
    const sampleDocuments: InsertDocument[] = [
      {
        title: "Catechism of the Catholic Church",
        content: "Complete Catholic doctrine and teaching",
        type: "catechism",
        author: "Catholic Church",
        articleCount: 2865
      },
      {
        title: "Lumen Gentium",
        content: "Dogmatic Constitution on the Church from Vatican II",
        type: "vatican_ii",
        author: "Second Vatican Council",
        articleCount: 69
      },
      {
        title: "Rerum Novarum",
        content: "On the Rights and Duties of Capital and Labor",
        type: "encyclical",
        author: "Pope Leo XIII",
        articleCount: 63
      }
    ];

    for (const document of sampleDocuments) {
      await this.createDocument(document);
    }

    // Sample Bible Verses
    const sampleVerses: InsertBibleVerse[] = [
      {
        book: "John",
        chapter: 3,
        verse: 16,
        content: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        testament: "new"
      },
      {
        book: "Matthew",
        chapter: 28,
        verse: 19,
        content: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,",
        testament: "new"
      },
      {
        book: "1 Corinthians",
        chapter: 13,
        verse: 4,
        content: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
        testament: "new"
      }
    ];

    for (const verse of sampleVerses) {
      await this.createBibleVerse(verse);
    }
  }

  // QA Questions
  async getQAQuestions(): Promise<QAQuestion[]> {
    return Array.from(this.qaQuestions.values());
  }

  async getQAQuestion(id: number): Promise<QAQuestion | undefined> {
    return this.qaQuestions.get(id);
  }

  async createQAQuestion(insertQuestion: InsertQAQuestion): Promise<QAQuestion> {
    const id = this.currentQAId++;
    const question: QAQuestion = {
      ...insertQuestion,
      id,
      createdAt: new Date(),
    };
    this.qaQuestions.set(id, question);
    return question;
  }

  async searchQAQuestions(query: string): Promise<QAQuestion[]> {
    const questions = Array.from(this.qaQuestions.values());
    return questions.filter(q => 
      q.question.toLowerCase().includes(query.toLowerCase()) ||
      q.answer.toLowerCase().includes(query.toLowerCase()) ||
      (q.fullAnswer && q.fullAnswer.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Prayers
  async getPrayers(): Promise<Prayer[]> {
    return Array.from(this.prayers.values());
  }

  async getPrayer(id: number): Promise<Prayer | undefined> {
    return this.prayers.get(id);
  }

  async createPrayer(insertPrayer: InsertPrayer): Promise<Prayer> {
    const id = this.currentPrayerId++;
    const prayer: Prayer = {
      ...insertPrayer,
      id,
      createdAt: new Date(),
    };
    this.prayers.set(id, prayer);
    return prayer;
  }

  async searchPrayers(query: string): Promise<Prayer[]> {
    const prayers = Array.from(this.prayers.values());
    return prayers.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Documents
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const document: Document = {
      ...insertDocument,
      id,
      createdAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async searchDocuments(query: string): Promise<Document[]> {
    const documents = Array.from(this.documents.values());
    return documents.filter(d => 
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Bible
  async getBibleVerses(): Promise<BibleVerse[]> {
    return Array.from(this.bibleVerses.values());
  }

  async getBibleVerse(id: number): Promise<BibleVerse | undefined> {
    return this.bibleVerses.get(id);
  }

  async createBibleVerse(insertVerse: InsertBibleVerse): Promise<BibleVerse> {
    const id = this.currentBibleId++;
    const verse: BibleVerse = {
      ...insertVerse,
      id,
      createdAt: new Date(),
    };
    this.bibleVerses.set(id, verse);
    return verse;
  }

  async searchBibleVerses(query: string): Promise<BibleVerse[]> {
    const verses = Array.from(this.bibleVerses.values());
    return verses.filter(v => 
      v.book.toLowerCase().includes(query.toLowerCase()) ||
      v.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getBibleBooks(): Promise<{ testament: string; books: string[] }[]> {
    const verses = Array.from(this.bibleVerses.values());
    const oldTestamentBooks = [...new Set(verses.filter(v => v.testament === 'old').map(v => v.book))];
    const newTestamentBooks = [...new Set(verses.filter(v => v.testament === 'new').map(v => v.book))];
    
    return [
      { testament: 'Old Testament', books: oldTestamentBooks },
      { testament: 'New Testament', books: newTestamentBooks }
    ];
  }

  // Bookmarks
  async getBookmarks(userId: string = 'default'): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(b => b.userId === userId);
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.currentBookmarkId++;
    const bookmark: Bookmark = {
      ...insertBookmark,
      id,
      createdAt: new Date(),
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(contentType: string, contentId: number, userId: string = 'default'): Promise<boolean> {
    for (const [id, bookmark] of this.bookmarks.entries()) {
      if (bookmark.contentType === contentType && 
          bookmark.contentId === contentId && 
          bookmark.userId === userId) {
        this.bookmarks.delete(id);
        return true;
      }
    }
    return false;
  }

  async isBookmarked(contentType: string, contentId: number, userId: string = 'default'): Promise<boolean> {
    for (const bookmark of this.bookmarks.values()) {
      if (bookmark.contentType === contentType && 
          bookmark.contentId === contentId && 
          bookmark.userId === userId) {
        return true;
      }
    }
    return false;
  }
}

export class DatabaseStorage implements IStorage {
  // QA Questions
  async getQAQuestions(): Promise<QAQuestion[]> {
    return await db.select().from(qaQuestions);
  }

  async getQAQuestion(id: number): Promise<QAQuestion | undefined> {
    const [question] = await db.select().from(qaQuestions).where(eq(qaQuestions.id, id));
    return question || undefined;
  }

  async createQAQuestion(insertQuestion: InsertQAQuestion): Promise<QAQuestion> {
    const [question] = await db
      .insert(qaQuestions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  async searchQAQuestions(query: string): Promise<QAQuestion[]> {
    return await db
      .select()
      .from(qaQuestions)
      .where(
        or(
          ilike(qaQuestions.question, `%${query}%`),
          ilike(qaQuestions.answer, `%${query}%`),
          ilike(qaQuestions.fullAnswer, `%${query}%`)
        )
      );
  }

  // Prayers
  async getPrayers(): Promise<Prayer[]> {
    return await db.select().from(prayers);
  }

  async getPrayer(id: number): Promise<Prayer | undefined> {
    const [prayer] = await db.select().from(prayers).where(eq(prayers.id, id));
    return prayer || undefined;
  }

  async createPrayer(insertPrayer: InsertPrayer): Promise<Prayer> {
    const [prayer] = await db
      .insert(prayers)
      .values(insertPrayer)
      .returning();
    return prayer;
  }

  async searchPrayers(query: string): Promise<Prayer[]> {
    return await db
      .select()
      .from(prayers)
      .where(
        or(
          ilike(prayers.title, `%${query}%`),
          ilike(prayers.content, `%${query}%`)
        )
      );
  }

  // Documents
  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents);
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document || undefined;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(insertDocument)
      .returning();
    return document;
  }

  async searchDocuments(query: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(
        or(
          ilike(documents.title, `%${query}%`),
          ilike(documents.content, `%${query}%`)
        )
      );
  }

  // Bible
  async getBibleVerses(): Promise<BibleVerse[]> {
    return await db.select().from(bibleVerses);
  }

  async getBibleVerse(id: number): Promise<BibleVerse | undefined> {
    const [verse] = await db.select().from(bibleVerses).where(eq(bibleVerses.id, id));
    return verse || undefined;
  }

  async createBibleVerse(insertVerse: InsertBibleVerse): Promise<BibleVerse> {
    const [verse] = await db
      .insert(bibleVerses)
      .values(insertVerse)
      .returning();
    return verse;
  }

  async searchBibleVerses(query: string): Promise<BibleVerse[]> {
    return await db
      .select()
      .from(bibleVerses)
      .where(
        or(
          ilike(bibleVerses.book, `%${query}%`),
          ilike(bibleVerses.content, `%${query}%`)
        )
      );
  }

  async getBibleBooks(): Promise<{ testament: string; books: string[] }[]> {
    const verses = await db.select().from(bibleVerses);
    const testamentMap = new Map<string, Set<string>>();
    
    verses.forEach(verse => {
      if (!testamentMap.has(verse.testament)) {
        testamentMap.set(verse.testament, new Set());
      }
      testamentMap.get(verse.testament)!.add(verse.book);
    });

    return Array.from(testamentMap.entries()).map(([testament, books]) => ({
      testament,
      books: Array.from(books)
    }));
  }

  // Bookmarks
  async getBookmarks(userId: string = 'default'): Promise<Bookmark[]> {
    return await db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const [bookmark] = await db
      .insert(bookmarks)
      .values(insertBookmark)
      .returning();
    return bookmark;
  }

  async deleteBookmark(contentType: string, contentId: number, userId: string = 'default'): Promise<boolean> {
    const result = await db
      .delete(bookmarks)
      .where(
        and(
          eq(bookmarks.contentType, contentType),
          eq(bookmarks.contentId, contentId),
          eq(bookmarks.userId, userId)
        )
      );
    return (result.rowCount ?? 0) > 0;
  }

  async isBookmarked(contentType: string, contentId: number, userId: string = 'default'): Promise<boolean> {
    const [bookmark] = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.contentType, contentType),
          eq(bookmarks.contentId, contentId),
          eq(bookmarks.userId, userId)
        )
      );
    return !!bookmark;
  }
}

export const storage = new DatabaseStorage();
