import { db } from "./db";
import { qaQuestions, prayers, documents, bibleVerses } from "@shared/schema";
import type { InsertQAQuestion, InsertPrayer, InsertDocument, InsertBibleVerse } from "@shared/schema";

async function seedDatabase() {
  console.log('Starting database seeding...');

  // Sample QA Questions in multiple languages
  const sampleQAQuestions: InsertQAQuestion[] = [
    // English content
    {
      question: "What is the Catholic teaching on the Eucharist?",
      answer: "Catholics believe in the Real Presence—that during the Mass, the bread and wine become the actual Body and Blood of Christ (transubstantiation), while maintaining their physical appearances.",
      fullAnswer: "Catholics believe in the Real Presence—that during the Mass, the bread and wine become the actual Body and Blood of Christ through transubstantiation, while maintaining their physical appearances. This teaching is based on Jesus's words at the Last Supper: 'This is my body' and 'This is my blood.' The Church teaches that this transformation occurs through the priest's consecration during Mass, acting in persona Christi (in the person of Christ). This doctrine was formally defined by the Council of Trent and remains a central mystery of Catholic faith.",
      category: "Sacraments",
      language: "english"
    },
    // Cebuano translation
    {
      question: "Unsa ang pagtudlo sa Katoliko bahin sa Eukaristiya?",
      answer: "Nagtoo ang mga Katoliko sa Tinuod nga Presensya—nga sa panahon sa Misa, ang tinapay ug bino mahimong tinuod nga Lawas ug Dugo ni Cristo (transubstantiation), samtang nagpabilin ang ilang pisikal nga panagway.",
      fullAnswer: "Nagtoo ang mga Katoliko sa Tinuod nga Presensya—nga sa panahon sa Misa, ang tinapay ug bino mahimong tinuod nga Lawas ug Dugo ni Cristo pinaagi sa transubstantiation, samtang nagpabilin ang ilang pisikal nga panagway. Kini nga pagtudlo nakabase sa mga pulong ni Jesus sa Katapusang Panihapon: 'Kini akong lawas' ug 'Kini akong dugo.' Nagtudlo ang Simbahan nga kini nga pagbag-o mahitabo pinaagi sa konsagrasyon sa pari sa panahon sa Misa, nga naglihok sa persona Christi (sa pagka-tawo ni Cristo).",
      category: "Mga Sacramento",
      language: "cebuano"
    },
    // Tagalog translation
    {
      question: "Ano ang turo ng Katoliko tungkol sa Eukaristiya?",
      answer: "Naniniwala ang mga Katoliko sa Tunay na Presensya—na sa panahon ng Misa, ang tinapay at alak ay nagiging tunay na Katawan at Dugo ni Cristo (transubstantiation), habang nananatiling ang kanilang pisikal na anyo.",
      fullAnswer: "Naniniwala ang mga Katoliko sa Tunay na Presensya—na sa panahon ng Misa, ang tinapay at alak ay nagiging tunay na Katawan at Dugo ni Cristo sa pamamagitan ng transubstantiation, habang nananatiling ang kanilang pisikal na anyo. Ang aral na ito ay batay sa mga salita ni Jesus sa Huling Hapunan: 'Ito ang aking katawan' at 'Ito ang aking dugo.' Itinuturo ng Simbahan na ang pagbabagong ito ay nangyayari sa pamamagitan ng konsagrasyon ng pari sa panahon ng Misa, na kumikilos sa persona Christi (sa pagkatao ni Cristo).",
      category: "Mga Sacramento",
      language: "tagalog"
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

  // Sample Prayers in multiple languages
  const samplePrayers: InsertPrayer[] = [
    // English prayers
    {
      title: "Our Father",
      content: "Our Father, who art in heaven, hallowed be thy name. Thy kingdom come, thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. Amen.",
      category: "Essential",
      latin: "Pater noster, qui es in caelis, sanctificetur nomen tuum...",
      language: "english"
    },
    {
      title: "Hail Mary",
      content: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
      category: "Marian",
      latin: "Ave Maria, gratia plena, Dominus tecum...",
      language: "english"
    },
    // Cebuano prayers
    {
      title: "Amahan Namo",
      content: "Amahan namo nga anaa sa mga langit, pagkabalaan ang imong ngalan. Umabot kanamo ang imong gingharian, matuman ang imong kabubut-on dinhi sa yuta maingon sa langit. Hatagi kami karong adlawa sa among adlaw-adlaw nga tinapay, ug pasayloa kami sa among mga sala, maingon nga nagpasaylo kami sa mga nakasala kanamo. Ug ayaw kami itugyan sa panulay, kondili luwasa kami sa dautan. Amen.",
      category: "Importante",
      latin: "Pater noster, qui es in caelis, sanctificetur nomen tuum...",
      language: "cebuano"
    },
    {
      title: " Ave Maria",
      content: "Aveha Maria, puno ka sa grasya, ang Ginoo anaa kanimo. Bulahan ka sa mga babaye, ug bulahan ang bunga sa imong tagoangkan, si Jesus. Santa Maria, Inahan sa Dios, mag-ampo ka alang kanamo nga mga makasasala, karon ug sa takna sa among kamatayon. Amen.",
      category: "Mariano",
      latin: "Ave Maria, gratia plena, Dominus tecum...",
      language: "cebuano"
    },
    // Tagalog prayers
    {
      title: "Ama Namin",
      content: "Ama namin, sumasalangit ka, sambahin ang ngalan mo. Mapasaamin ang kaharian mo. Sundin ang loob mo, dito sa lupa para nang sa langit. Bigyan mo kami ngayon ng aming kakanin sa araw-araw, at patawarin mo kami sa aming mga sala, para nang pagpapatawad namin sa mga nakakasala sa amin. At huwag mo kaming ipahintulot sa tukso, at iadya mo kami sa lahat ng masama. Amen.",
      category: "Mahalagang Panalangin",
      latin: "Pater noster, qui es in caelis, sanctificetur nomen tuum...",
      language: "tagalog"
    },
    {
      title: "Aba Ginoong Maria",
      content: "Aba Ginoong Maria, napupuno ka ng grasya, ang Panginoon ay sumasaiyo. Pinagpala ka sa mga babae, at pinagpala naman ang bunga ng inyong sinapupunan na si Jesus. Santa Maria, Ina ng Diyos, ipanalangin mo kami na mga makasalanan, ngayon at kung kami ay mamatay. Amen.",
      category: "Panalangin kay Maria",
      latin: "Ave Maria, gratia plena, Dominus tecum...",
      language: "tagalog"
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

  // Sample Documents in multiple languages
  const sampleDocuments: InsertDocument[] = [
    // English documents
    {
      title: "Catechism of the Catholic Church",
      content: "Complete Catholic doctrine and teaching",
      type: "catechism",
      author: "Catholic Church",
      articleCount: 2865,
      language: "english"
    },
    {
      title: "Lumen Gentium",
      content: "Dogmatic Constitution on the Church from Vatican II",
      type: "vatican_ii",
      author: "Second Vatican Council",
      articleCount: 69,
      language: "english"
    },
    // Cebuano documents
    {
      title: "Katekismo sa Simbahang Katoliko",
      content: "Kompleto nga doktrina ug pagtudlo sa Katoliko",
      type: "katekismo",
      author: "Simbahang Katoliko",
      articleCount: 2865,
      language: "cebuano"
    },
    // Tagalog documents
    {
      title: "Katekismo ng Simbahang Katoliko",
      content: "Kumpletong doktrina at aral ng Katoliko",
      type: "katekismo",
      author: "Simbahang Katoliko",
      articleCount: 2865,
      language: "tagalog"
    }
  ];

  // Sample Bible Verses in multiple languages
  const sampleVerses: InsertBibleVerse[] = [
    // English verses
    {
      book: "John",
      chapter: 3,
      verse: 16,
      content: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      testament: "new",
      language: "english"
    },
    {
      book: "Matthew",
      chapter: 28,
      verse: 19,
      content: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,",
      testament: "new",
      language: "english"
    },
    // Cebuano verses
    {
      book: "Juan",
      chapter: 3,
      verse: 16,
      content: "Kay sa ingon gayud pagkahigugma sa Dios sa kalibutan, nga iyang gihatag ang iyang bugtong nga Anak, aron ang bisan kinsa nga motoo kaniya dili mamatay kondili may kinabuhing dayon.",
      testament: "bag-o",
      language: "cebuano"
    },
    // Tagalog verses
    {
      book: "Juan",
      chapter: 3,
      verse: 16,
      content: "Sapagkat gayon na lamang ang pag-ibig ng Diyos sa sanglibutan, kaya't ibinigay niya ang kanyang kaisa-isang Anak, upang ang sinumang sumampalataya sa kanya ay hindi mamatay kundi magkaroon ng buhay na walang hanggan.",
      testament: "bago",
      language: "tagalog"
    }
  ];

  try {
    // Check if data already exists
    const existingQAQuestions = await db.select().from(qaQuestions).limit(1);
    if (existingQAQuestions.length > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    // Insert sample data
    console.log('Inserting QA questions...');
    await db.insert(qaQuestions).values(sampleQAQuestions);

    console.log('Inserting prayers...');
    await db.insert(prayers).values(samplePrayers);

    console.log('Inserting documents...');
    await db.insert(documents).values(sampleDocuments);

    console.log('Inserting Bible verses...');
    await db.insert(bibleVerses).values(sampleVerses);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
seedDatabase()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });

export { seedDatabase };