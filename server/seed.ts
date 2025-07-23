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
      language: "english",
      subjectOverview: "The Eucharist, also known as Holy Communion, is the source and summit of the Christian life. It is one of the seven sacraments of the Catholic Church and is considered the most important form of worship. In this sacrament, Catholics believe that the bread and wine truly become the Body, Blood, Soul, and Divinity of Jesus Christ while retaining the appearance of bread and wine.",
      etymology: "The word 'Eucharist' comes from the Greek word 'eucharistia', meaning 'thanksgiving'. This reflects the prayer of thanksgiving said during the Mass, which is central to the celebration of this sacrament.",
      churchDocuments: "• Catechism of the Catholic Church (CCC) 1322-1419\n• Council of Trent, Session XIII (1551)\n• Pope Paul VI, Mysterium Fidei (1965)\n• Pope John Paul II, Ecclesia de Eucharistia (2003)",
      scriptureSupport: "Primary:\n• Matthew 26:26-28 - 'This is my body... this is my blood'\n• John 6:51-58 - 'Unless you eat the flesh of the Son of Man...'\n\nSupporting:\n• 1 Corinthians 10:16-17 - The cup of blessing\n• 1 Corinthians 11:23-29 - Paul's account of the Last Supper\n• Luke 24:30-31 - The Road to Emmaus",
      earlyChurchFathers: "• St. Ignatius of Antioch (c. 110 AD): 'The Eucharist is the flesh of our Savior Jesus Christ.'\n• St. Justin Martyr (c. 150 AD): Described the Eucharistic liturgy in his First Apology\n• St. Augustine (5th century): 'What you see is the bread and the chalice... but your faith must be instructed concerning it: the bread is the Body of Christ, the chalice the Blood of Christ.'",
      summaryPoints: "• The Eucharist is the true Body and Blood of Jesus Christ\n• It was instituted by Christ at the Last Supper\n• The transformation is called transubstantiation\n• It is the source and summit of Christian life\n• It unites us with Christ and the Church\n• We must be in a state of grace to receive it worthily"
    },
    // Cebuano translation
    {
      question: "Unsa ang pagtudlo sa Katoliko bahin sa Eukaristiya?",
      answer: "Nagtoo ang mga Katoliko sa Tinuod nga Presensya—nga sa panahon sa Misa, ang tinapay ug bino mahimong tinuod nga Lawas ug Dugo ni Cristo (transubstantiation), samtang nagpabilin ang ilang pisikal nga panagway.",
      fullAnswer: "Nagtoo ang mga Katoliko sa Tinuod nga Presensya—nga sa panahon sa Misa, ang tinapay ug bino mahimong tinuod nga Lawas ug Dugo ni Cristo pinaagi sa transubstantiation, samtang nagpabilin ang ilang pisikal nga panagway. Kini nga pagtudlo nakabase sa mga pulong ni Jesus sa Katapusang Panihapon: 'Kini akong lawas' ug 'Kini akong dugo.' Nagtudlo ang Simbahan nga kini nga pagbag-o mahitabo pinaagi sa konsagrasyon sa pari sa panahon sa Misa, nga naglihok sa persona Christi (sa pagka-tawo ni Cristo).",
      category: "Mga Sacramento",
      language: "cebuano",
      subjectOverview: "Ang Eukaristiya, nailhan usab nga Balaang Komunyon, mao ang tinubdan ug kinatumyan sa kinabuhing Kristiyano. Kini usa sa pito ka mga sakramento sa Simbahang Katoliko ug giisip nga pinakahinungdanon nga porma sa pagsimba. Niining sakramentoha, nagtoo ang mga Katoliko nga ang tinapay ug bino tinuod nga nahimong Lawas, Dugo, Kalag, ug Pagkadios ni Jesukristo samtang nagpabilin ang panagway sa tinapay ug bino.",
      etymology: "Ang pulong nga 'Eukaristiya' naggikan sa Griyegong pulong nga 'eucharistia', nga nagpasabot og 'pagpasalamat'. Kini nagpakita sa pag-ampo sa pagpasalamat nga gisulti sa panahon sa Misa, nga tigpundok sa pagsaulog niini nga sakramento.",
      churchDocuments: "• Katekismo sa Simbahang Katoliko (CCC) 1322-1419\n• Konseho sa Trento, Sesyon XIII (1551)\n• Papa Pablo VI, Mysterium Fidei (1965)\n• Papa Juan Pablo II, Ecclesia de Eucharistia (2003)",
      scriptureSupport: "Pangunang Kasulatan:\n• Mateo 26:26-28 - 'Kini akong lawas... kini akong dugo'\n• Juan 6:51-58 - 'Gawas kon kan-on ninyo ang unod sa Anak sa Tawo...'\n\nDugang Kasulatan:\n• 1 Corinto 10:16-17 - Ang kopa sa panalangin\n• 1 Corinto 11:23-29 - Ang taho ni Pablo bahin sa Katapusang Panihapon\n• Lucas 24:30-31 - Ang Dalan paingon sa Emaus",
      earlyChurchFathers: "• San Ignacio de Antioquia (c. 110 AD): 'Ang Eukaristiya mao ang unod atong Manluluwas nga si Jesukristo.'\n• San Justino Martir (c. 150 AD): Mihisgot sa liturhiya sa Eukaristiya sa iyang Unang Apolohiya\n• San Agustin (ika-5 nga siglo): 'Ang imong nakita mao ang tinapay ug kalis... apan ang imong pagtoo kinahanglan tudloan bahin niini: ang tinapay mao ang Lawas ni Kristo, ang kalis mao ang Dugo ni Kristo.'",
      summaryPoints: "• Ang Eukaristiya tinuod nga Lawas ug Dugo ni Jesukristo\n• Gisugdan kini ni Kristo sa Katapusang Panihapon\n• Ang pagbag-o gitawag og transubstantiation\n• Kini ang tinubdan ug kinatumyan sa kinabuhing Kristiyano\n• Kini naghiusa kanato kang Kristo ug sa Simbahan\n• Kinahanglan nga anaa kita sa kahimtang sa grasya aron makadawat niini nga takos"
    },
    // Tagalog translation
    {
      question: "Ano ang turo ng Katoliko tungkol sa Eukaristiya?",
      answer: "Naniniwala ang mga Katoliko sa Tunay na Presensya—na sa panahon ng Misa, ang tinapay at alak ay nagiging tunay na Katawan at Dugo ni Cristo (transubstantiation), habang nananatiling ang kanilang pisikal na anyo.",
      fullAnswer: "Naniniwala ang mga Katoliko sa Tunay na Presensya—na sa panahon ng Misa, ang tinapay at alak ay nagiging tunay na Katawan at Dugo ni Cristo sa pamamagitan ng transubstantiation, habang nananatiling ang kanilang pisikal na anyo. Ang aral na ito ay batay sa mga salita ni Jesus sa Huling Hapunan: 'Ito ang aking katawan' at 'Ito ang aking dugo.' Itinuturo ng Simbahan na ang pagbabagong ito ay nangyayari sa pamamagitan ng konsagrasyon ng pari sa panahon ng Misa, na kumikilos sa persona Christi (sa pagkatao ni Cristo).",
      category: "Mga Sacramento",
      language: "tagalog",
      subjectOverview: "Ang Eukaristiya, na kilala rin bilang Banal na Komunyon, ay ang pinagmumulan at rurok ng buhay Kristiyano. Ito ay isa sa pitong sakramento ng Simbahang Katoliko at itinuturing na pinakamahalagang anyo ng pagsamba. Sa sakramentong ito, naniniwala ang mga Katoliko na ang tinapay at alak ay tunay na nagiging Katawan, Dugo, Kaluluwa, at Pagka-Diyos ni Jesucristo habang nananatili ang anyo ng tinapay at alak.",
      etymology: "Ang salitang 'Eukaristiya' ay nagmula sa salitang Griyego na 'eucharistia', na nangangahulugang 'pasasalamat'. Ito ay sumasalamin sa panalangin ng pasasalamat na binabanggit sa panahon ng Misa, na siyang sentro ng pagdiriwang ng sakramentong ito.",
      churchDocuments: "• Katekismo ng Simbahang Katoliko (CCC) 1322-1419\n• Konseho ng Trento, Session XIII (1551)\n• Papa Pablo VI, Mysterium Fidei (1965)\n• Papa Juan Pablo II, Ecclesia de Eucharistia (2003)",
      scriptureSupport: "Pangunahing Kasulatan:\n• Mateo 26:26-28 - 'Ito ang aking katawan... ito ang aking dugo'\n• Juan 6:51-58 - 'Malibang kanin ninyo ang laman ng Anak ng Tao...'\n\nKaragdagang Kasulatan:\n• 1 Corinto 10:16-17 - Ang kalis ng pagpapala\n• 1 Corinto 11:23-29 - Ang salaysay ni Pablo tungkol sa Huling Hapunan\n• Lucas 24:30-31 - Ang Daan Patungong Emaus",
      earlyChurchFathers: "• San Ignacio ng Antioquia (c. 110 AD): 'Ang Eukaristiya ay ang laman ng ating Tagapagligtas na si Jesucristo.'\n• San Justino Martir (c. 150 AD): Inilarawan ang liturhiya ng Eukaristiya sa kanyang Unang Apolohiya\n• San Agustin (ika-5 siglo): 'Ang iyong nakikita ay ang tinapay at ang kalis... ngunit ang iyong pananampalataya ay dapat turuan tungkol dito: ang tinapay ay ang Katawan ni Kristo, ang kalis ay ang Dugo ni Kristo.'",
      summaryPoints: "• Ang Eukaristiya ay ang tunay na Katawan at Dugo ni Jesucristo\n• Itinatag ito ni Kristo sa Huling Hapunan\n• Ang pagbabago ay tinatawag na transubstantiation\n• Ito ang pinagmumulan at rurok ng buhay Kristiyano\n• Nagdudugtong ito sa atin kay Kristo at sa Simbahan\n• Dapat tayong nasa kalagayan ng biyaya upang tumanggap nito nang nararapat"
    },
    {
      question: "Why do Catholics pray to saints?",
      answer: "Catholics don't worship saints but ask them to intercede with God on their behalf, similar to asking a friend to pray for them. Saints are believed to be closer to God in heaven.",
      fullAnswer: "Catholics don't worship saints but ask them to intercede with God on their behalf, similar to asking a friend to pray for them. Saints are believed to be closer to God in heaven and can therefore petition Him more effectively. This practice is called the 'communion of saints'—the spiritual union between those on earth, in purgatory, and in heaven. Saints serve as powerful intercessors and examples of holy living. The practice is rooted in Scripture (James 5:16) and early Christian tradition.",
      category: "Saints",
      subjectOverview: "The Catholic practice of praying to saints is based on the belief in the communion of saints, which is the spiritual union of all the faithful, both living and deceased. Catholics believe that saints, as friends of God in heaven, can intercede for us with God. This practice is not worship (latria), which is due to God alone, but rather honor (dulia) or special honor in the case of the Virgin Mary (hyperdulia).",
      etymology: "The word 'saint' comes from the Latin 'sanctus' meaning 'holy' or 'consecrated'. The practice of seeking intercession is rooted in the Greek word 'paraklesis', meaning 'to call to one's aid' or 'intercession'.",
      churchDocuments: "• Catechism of the Catholic Church (CCC) 946-962, 2683-2684\n• Lumen Gentium, Chapter VII (Vatican II)\n• Pope Paul VI, Lumen Gentium (1964)\n• Catechism of the Council of Trent, Article IX",
      scriptureSupport: "Primary:\n• James 5:16 - 'The prayer of a righteous person has great power'\n• Revelation 5:8 - The prayers of the saints as incense\n• Revelation 8:3-4 - Angels offering prayers\n\nSupporting:\n• 2 Maccabees 15:12-16 - Vision of Jeremiah praying for God's people\n• 1 Timothy 2:1-3 - Exhortation to pray for all people\n• Hebrews 12:1 - 'Cloud of witnesses' surrounding us",
      earlyChurchFathers: "• Origen (c. 185-254 AD): 'The prayer of the Church is supported by the prayers of the martyrs.'\n• St. Cyril of Jerusalem (c. 313-386 AD): 'We commemorate those who have fallen asleep... believing that it will be a very great advantage to the souls of those for whom the prayer is offered.'\n• St. Augustine (354-430 AD): 'At the Lord's table we do not commemorate martyrs in the same way that we do others who rest in peace so as to pray for them, but rather that they may pray for us.'",
      summaryPoints: "• Catholics believe in the communion of saints\n• We ask saints to pray for us, not worship them\n• This practice is biblical and dates to early Christianity\n• Saints are powerful intercessors before God\n• The practice is based on the unity of Christ's Body\n• Mary has a special role as the greatest of all saints"
    },
    {
      question: "What is the Immaculate Conception?",
      answer: "The Immaculate Conception refers to Mary being conceived without original sin, not Jesus' conception. This doctrine states Mary was preserved from original sin from the moment of her conception.",
      fullAnswer: "The Immaculate Conception refers to Mary being conceived without original sin, not Jesus' conception. This doctrine states that Mary was preserved from original sin from the moment of her conception in preparation for her role as Mother of God. Declared as dogma by Pope Pius IX in 1854, it teaches that Mary was filled with grace from the first instant of her existence. This preservation was made possible by the anticipated merits of Christ's sacrifice and was necessary so that Christ could be born of a sinless mother.",
      category: "Marian Doctrine",
      subjectOverview: "The Immaculate Conception is a dogma of the Catholic Church which states that the Virgin Mary was conceived without original sin by virtue of the merits of her son Jesus Christ. This means that from the first moment of her existence, Mary was preserved by God's grace from the stain of original sin that affects all human beings. This special privilege was granted to Mary in view of her future role as the Mother of God.",
      etymology: "The term 'Immaculate Conception' comes from the Latin 'Immaculata Conceptio', which means 'immaculate conception'. The word 'immaculate' comes from the Latin 'in-' (not) + 'maculare' (to stain, spot), meaning 'without stain'.",
      churchDocuments: "• Ineffabilis Deus (1854) - Papal bull by Pope Pius IX defining the dogma\n• Catechism of the Catholic Church 490-493\n• Lumen Gentium 56 (Vatican II)\n• Pope John Paul II, Redemptoris Mater 8-11",
      scriptureSupport: "Primary:\n• Luke 1:28 - 'Hail, full of grace' (kecharitomene)\n• Genesis 3:15 - The Protoevangelium (first gospel)\n\nSupporting:\n• Song of Songs 4:7 - 'You are all fair, my love; there is no flaw in you.'\n• Judges 6:12 - 'The Lord is with you, O valiant one' (often seen as a type of Mary)",
      earlyChurchFathers: "• St. Irenaeus (2nd century): 'The knot of Eve's disobedience was untied by Mary's obedience.'\n• St. Augustine (5th century): 'The honor of the Lord does not allow that the question of sin should be raised in connection with Mary.'\n• St. Ephrem the Syrian (4th century): 'You alone and your Mother are more beautiful than any others; For there is no blemish in you, nor any stains upon your Mother.'",
      summaryPoints: "• Mary was conceived without original sin\n• This was a unique privilege granted by God\n• It prepared her to be the Mother of God\n• The dogma was defined in 1854 by Pope Pius IX\n• It's celebrated on December 8th\n• Different from the Virgin Birth of Jesus"
    },
    {
      question: "Why do Catholics confess to priests?",
      answer: "Catholics believe Jesus gave the Apostles authority to forgive sins (John 20:23), which was passed to their successors (bishops and priests). The priest acts in persona Christi (in the person of Christ).",
      fullAnswer: "Catholics believe Jesus gave the Apostles authority to forgive sins (John 20:23: 'Whose sins you forgive are forgiven them'), which was passed to their successors through apostolic succession. The priest acts in persona Christi (in the person of Christ) during the sacrament of confession. This sacrament provides several benefits: assurance of God's forgiveness, spiritual counsel, appropriate penance, and grace to avoid future sin. The seal of confession ensures absolute confidentiality, and the priest serves as Christ's instrument of mercy and reconciliation.",
      category: "Sacraments",
      subjectOverview: "The Sacrament of Penance and Reconciliation, commonly called Confession, is one of the seven sacraments of the Catholic Church. It is the ordinary means by which Catholics obtain forgiveness for sins committed after Baptism. The sacrament involves several elements: contrition (sorrow for sins), confession (disclosing sins to a priest), absolution (forgiveness by God through the priest), and satisfaction (performing the assigned penance). The priest acts in the person of Christ (in persona Christi) to grant sacramental absolution.",
      etymology: "The word 'confess' comes from the Latin 'confiteri', meaning 'to acknowledge' or 'to admit'. The Greek word used in the New Testament is 'exomologeō', meaning 'to acknowledge fully' or 'to confess openly'. The sacrament is also called 'penance' from the Latin 'paenitentia' meaning 'repentance' or 'penitence'.",
      churchDocuments: "• Catechism of the Catholic Church 1420-1498\n• Council of Trent, Session XIV (1551)\n• Pope John Paul II, Reconciliatio et Paenitentia (1984)\n• Canon 959-997 of the Code of Canon Law",
      scriptureSupport: "Primary:\n• John 20:21-23 - Jesus gives authority to forgive sins\n• Matthew 16:19 - Power of the keys given to Peter\n• 2 Corinthians 5:18 - Ministry of reconciliation\n\nSupporting:\n• James 5:16 - 'Confess your sins to one another'\n• Matthew 18:18 - Binding and loosing authority\n• 1 John 1:9 - God's faithfulness to forgive",
      earlyChurchFathers: "• St. Ignatius of Antioch (c. 110 AD): 'Let that be considered a valid Eucharist which is celebrated by the bishop or by one whom he appoints.'\n• Origen (c. 250 AD): 'The sinner... must be exposed in accordance with the teaching of the priest.'\n• St. Ambrose (4th century): 'This right is given to priests only. God forgives sins only through them.'",
      summaryPoints: "• Jesus gave authority to forgive sins to the Apostles\n• This authority continues through apostolic succession\n• The priest acts in the person of Christ\n• Confession provides grace and spiritual healing\n• The seal of confession is absolute and inviolable\n• Regular confession helps in spiritual growth"
    },
    {
      question: "What is Purgatory?",
      answer: "Purgatory is a state of purification where souls destined for Heaven are cleansed of the temporal effects of sin before entering God's presence. It's not a second chance but a final preparation.",
      fullAnswer: "Purgatory is a state of purification where souls destined for Heaven are cleansed of the temporal effects of sin before entering God's perfect presence. It's not a second chance for salvation but a final preparation for those who died in God's grace but with venial sins or attachment to sin. The doctrine is supported by Scripture (1 Corinthians 3:15, 2 Maccabees 12:46) and developed through Church tradition. Prayers and indulgences from the living can help souls in purgatory, demonstrating the communion of saints.",
      category: "Afterlife",
      subjectOverview: "Purgatory is a state of final purification after death for those who die in God's grace and friendship, but are still imperfectly purified. It is not a second chance at salvation, as the eternal destiny of each soul is decided at the moment of death. Rather, it is a process of cleansing from the temporal effects of sin and growth in holiness before entering heaven. The Catholic Church teaches that the faithful on earth can help the souls in purgatory through their prayers, good works, and especially through the Holy Sacrifice of the Mass.",
      etymology: "The word 'purgatory' comes from the Latin 'purgare', meaning 'to cleanse' or 'to purify'. The concept is often referred to in Latin as 'purgatorium', meaning 'place of cleansing'. The Greek term 'katharsis' (κάθαρσις) is also used in early Christian writings to describe this purification.",
      churchDocuments: "• Catechism of the Catholic Church 1030-1032\n• Council of Florence (1439)\n• Council of Trent (1563)\n• Pope Benedict XII, Benedictus Deus (1336)\n• Pope Paul VI, Indulgentiarum Doctrina (1967)",
      scriptureSupport: "Primary:\n• 1 Corinthians 3:13-15 - Saved through fire\n• 2 Maccabees 12:44-45 - Prayer for the dead\n• Matthew 12:32 - Forgiveness in the age to come\n\nSupporting:\n• 1 Peter 1:7 - Testing by fire\n• Revelation 21:27 - Nothing unclean enters heaven\n• 2 Timothy 1:16-18 - Paul's prayer for Onesiphorus",
      earlyChurchFathers: "• Tertullian (c. 200 AD): 'We make offerings for the dead on their birthday anniversaries.'\n• St. Augustine (5th century): 'Temporal punishments are suffered by some in this life only, by some after death, by some both here and hereafter, but all of them before that last and strictest judgment.'\n• St. Gregory the Great (6th century): 'As for certain lesser faults, we must believe that, before the Final Judgment, there is a purifying fire.'",
      summaryPoints: "• A state of purification after death\n• For those who die in God's grace but need cleansing\n• Not a second chance at salvation\n• Duration depends on the soul's need for purification\n• We can help the souls in purgatory through prayer\n• The Eucharist is the most powerful help for them"
    },
    {
      question: "Why isn't the Bible alone sufficient for Catholic teaching?",
      answer: "Catholics believe in both Scripture and Tradition as authoritative. The Bible itself doesn't claim to be the sole authority, and the early Church relied on oral tradition before the New Testament was compiled.",
      fullAnswer: "Catholics believe in both Scripture and Sacred Tradition as authoritative sources of revelation, not Scripture alone (sola scriptura). The Bible itself doesn't claim to be the sole authority—in fact, it speaks of the importance of tradition (2 Thessalonians 2:15). The early Church relied on oral tradition and apostolic teaching before the New Testament was compiled and canonized by the Church in the 4th century. The Magisterium (teaching authority of the Church) interprets Scripture authentically, preventing individual misinterpretation and maintaining unity of faith.",
      category: "Scripture and Tradition",
      subjectOverview: "The Catholic Church teaches that Divine Revelation comes to us through two complementary sources: Sacred Scripture (the Bible) and Sacred Tradition, with the Magisterium (the Church's teaching authority) as their authentic interpreter. This 'two-source' view contrasts with the Protestant doctrine of 'sola scriptura' (Scripture alone). The Catholic position is that the Bible itself points to the importance of both written and oral tradition, and that the Church's living Tradition is necessary for the proper interpretation of Scripture. The canon of Scripture itself was determined by the authority of the Church in the 4th century.",
      etymology: "The term 'Tradition' comes from the Latin 'traditio', meaning 'handing down' or 'handing over'. In Greek, it's 'paradosis' (παράδοσις). The word 'Scripture' comes from the Latin 'scriptura', meaning 'writing'. The phrase 'sola scriptura' means 'Scripture alone' in Latin.",
      churchDocuments: "• Dei Verbum (Vatican II) - Dogmatic Constitution on Divine Revelation\n• Catechism of the Catholic Church 74-141\n• Council of Trent, Fourth Session (1546)\n• Pope Pius XII, Divino Afflante Spiritu (1943)",
      scriptureSupport: "Primary:\n• 2 Thessalonians 2:15 - 'Stand firm and hold to the traditions'\n• 2 Timothy 2:2 - Entrust to faithful teachers\n• 2 Peter 1:20 - No prophecy is a matter of private interpretation\n\nSupporting:\n• John 21:25 - Not everything is written\n• 1 Corinthians 11:2 - Hold to traditions\n• 2 Thessalonians 3:6 - Keep away from those not living according to tradition",
      earlyChurchFathers: "• St. Irenaeus (2nd century): 'Suppose there arises a dispute... ought we not to have recourse to the most ancient Churches...?'\n• St. Basil the Great (4th century): 'Of the dogmas and kerygmas preserved in the Church, some we possess from written teaching and others we receive... from apostolic tradition.'\n• St. Augustine (5th century): 'I would not believe the Gospel except moved by the authority of the Catholic Church.'",
      summaryPoints: "• Divine Revelation comes through Scripture and Tradition\n• The Bible itself points to oral tradition\n• The Church determined the biblical canon\n• Scripture needs authoritative interpretation\n• The Magisterium preserves unity of faith\n• Early Christians followed apostolic tradition"
    },
    {
      question: "Why do Catholics baptize infants?",
      answer: "Catholics baptize infants to cleanse them of original sin and make them members of God's family. This practice has roots in early Christianity and is supported by Acts 16:15, 33 where entire households were baptized.",
      fullAnswer: "Catholics baptize infants to cleanse them of original sin and incorporate them into God's family, the Church. This practice has roots in early Christianity and is supported by Scripture (Acts 16:15, 33) where entire households, presumably including children, were baptized. Infant baptism recognizes that salvation is God's gift, not earned by human action or understanding. Parents and godparents promise to raise the child in the faith until they can make their own mature commitment at Confirmation. The practice emphasizes grace over works and God's desire that all be saved.",
      category: "Sacraments",
      subjectOverview: "Infant baptism is the practice of baptizing infants or young children, which has been the historical practice of the Catholic Church since ancient times. The Church teaches that baptism is necessary for salvation and that it cleanses the soul of original sin, incorporates the baptized into the Body of Christ (the Church), and imparts the gift of sanctifying grace. The practice reflects the belief that God's grace is not earned but is a free gift, and that the faith of the Church can support the child until they are old enough to make their own profession of faith.",
      etymology: "The word 'baptism' comes from the Greek 'baptizein' (βαπτίζειν) meaning 'to immerse' or 'to wash'. The term 'infant' comes from the Latin 'infans' meaning 'unable to speak' or 'young child'. The practice is sometimes called 'paedobaptism' (from Greek 'pais' meaning 'child').",
      churchDocuments: "• Catechism of the Catholic Church 1213-1284, 1250-1252\n• Council of Trent, Session VII (1547)\n• Code of Canon Law, Canons 849-878\n• Vatican II, Lumen Gentium 14\n• Pope John Paul II, Familiaris Consortio (1981)",
      scriptureSupport: "Primary:\n• Acts 16:15, 33 - Household baptisms\n• John 3:5 - 'Unless one is born of water and the Spirit...'\n• Mark 10:14 - 'Let the children come to me'\n\nSupporting:\n• 1 Corinthians 1:16 - Household of Stephanas baptized\n• Colossians 2:11-12 - Spiritual circumcision in baptism\n• Acts 2:38-39 - Promise is for children too",
      earlyChurchFathers: "• St. Irenaeus (2nd century): 'He came to save all through himself... infants and children, boys and youth, and old men.'\n• Origen (3rd century): 'The Church received from the Apostles the tradition of giving baptism even to infants.'\n• St. Augustine (5th century): 'The custom of Mother Church in baptizing infants is certainly not to be scorned... nor is it to be believed that its tradition is anything except apostolic.'",
      summaryPoints: "• Cleanses from original sin\n• Makes the child a child of God\n• Incorporates into the Church\n• Based on household baptisms in Acts\n• Early Christian practice\n• Parents and godparents make promises"
    },
    {
      question: "What is the Catholic view on salvation?",
      answer: "Catholics believe salvation comes through God's grace, received through faith and expressed in good works. It's not earned but requires cooperation with grace through faith, sacraments, and charity.",
      fullAnswer: "Catholics believe salvation comes through God's grace alone, not human works, but this grace must be received through faith and expressed in good works. Salvation is not earned but requires cooperation with God's grace through faith, participation in the sacraments, and works of charity. This differs from 'faith alone' (sola fide) by teaching that faith must be 'working through love' (Galatians 5:6). Good works are the fruit and evidence of true faith, not the cause of salvation. Catholics emphasize both the necessity of grace and human cooperation with that grace.",
      category: "Salvation",
      subjectOverview: "The Catholic understanding of salvation is that it is a free gift from God, initiated by His grace and made possible through the life, death, and resurrection of Jesus Christ. Unlike some Protestant views that emphasize 'faith alone,' the Catholic Church teaches that salvation involves both God's grace and human cooperation. This cooperation includes faith, participation in the sacraments, and living a life of charity. The Church teaches that good works are not the cause of salvation but are the necessary fruit of a living faith and the means by which we cooperate with God's grace.",
      etymology: "The word 'salvation' comes from the Latin 'salvatio' meaning 'a saving, deliverance'. In Greek, it's 'soteria' (σωτηρία), meaning 'deliverance, preservation, salvation'. The Hebrew word 'yeshuah' (יְשׁוּעָה) carries the sense of 'deliverance' or 'victory'.",
      churchDocuments: "• Catechism of the Catholic Church 1987-2029, 2067-2082\n• Council of Trent, Sixth Session (1547) - Decree on Justification\n• Vatican II, Lumen Gentium 14-16\n• Pope John Paul II, Veritatis Splendor (1993)\n• Joint Declaration on the Doctrine of Justification (1999) with Lutherans",
      scriptureSupport: "Primary:\n• Ephesians 2:8-10 - 'By grace you have been saved through faith... created for good works'\n• James 2:14-26 - 'Faith without works is dead'\n• Philippians 2:12-13 - 'Work out your salvation... for God is at work in you'\n\nSupporting:\n• Matthew 7:21 - 'Not everyone who says \"Lord, Lord\"...'\n• Galatians 5:6 - 'Faith working through love'\n• 1 Corinthians 13:2 - 'Faith without love is nothing'",
      earlyChurchFathers: "• St. Clement of Rome (1st century): 'We are not justified by ourselves... but by faith.'\n• St. Augustine (5th century): 'God created us without us: but he did not will to save us without us.'\n• St. John Chrysostom (4th century): 'Faith without works is dead, and as much dead as a lifeless body.'",
      summaryPoints: "• Salvation is God's free gift of grace\n• Requires both faith and works (faith working through love)\n• Received through the sacraments\n• Ongoing process of sanctification\n• Requires cooperation with God's grace\n• Culminates in eternal life with God"
    },
    {
      question: "Why do Catholics use statues and images in worship?",
      answer: "Catholics don't worship statues but use them as visual reminders of holy people and events, similar to keeping family photos. This practice distinguishes between veneration (respect) and worship (reserved for God alone).",
      fullAnswer: "Catholics don't worship statues and images but use them as visual reminders of holy people and events, similar to keeping family photos or war memorials. This practice distinguishes between veneration (dulia for saints, hyperdulia for Mary) and worship/adoration (latria), which is reserved for God alone. Religious art serves as 'books for the illiterate' and helps focus prayer and meditation. The practice is rooted in the Incarnation—God became visible in Christ, making religious imagery appropriate. The Second Council of Nicaea (787 AD) settled this question definitively.",
      category: "Worship",
      subjectOverview: "The use of religious images and statues in Catholic worship is rooted in the Incarnation—the belief that God became visible in Jesus Christ. Catholics make a clear distinction between veneration (dulia) given to saints and the worship (latria) owed to God alone. Religious art serves as a visual catechism, helping to educate the faithful and direct their minds to heavenly realities. The practice has biblical roots and was affirmed by the Second Council of Nicaea (787 AD) in response to the iconoclast controversy.",
      etymology: "The word 'venerate' comes from the Latin 'venerari', meaning 'to worship, revere'. 'Dulia' comes from the Greek 'douleia' (δουλεία) meaning 'servitude' or 'veneration'. 'Latria' comes from the Greek 'latreia' (λατρεία) meaning 'worship' or 'adoration'. The term 'hyperdulia' refers to the special veneration given to the Blessed Virgin Mary, with 'hyper' meaning 'above' or 'beyond'.",
      churchDocuments: "• Catechism of the Catholic Church 1159-1162, 2131-2132\n• Second Council of Nicaea (787 AD) - On the Veneration of Images\n• Council of Trent, Session 25 (1563) - On the Invocation, Veneration, and Relics of Saints and Sacred Images\n• Vatican II, Sacrosanctum Concilium 125-127\n• Pope John Paul II, Letter to Artists (1999)",
      scriptureSupport: "Primary:\n• Exodus 25:18-20 - God commands the making of cherubim for the Ark\n• Numbers 21:8-9 - The bronze serpent as a type of Christ\n• 1 Kings 6:23-29 - Solomon's Temple decorated with carved figures\n\nSupporting:\n• Hebrews 1:1-3 - Christ is the image of the invisible God\n• John 1:14 - The Word became flesh\n• Colossians 1:15 - Christ is the image of the invisible God",
      earlyChurchFathers: "• St. John of Damascus (8th century): 'I do not worship matter, I worship the Creator of matter who became matter for my sake.'\n• St. Basil the Great (4th century): 'The honor paid to the image passes to its prototype.'\n• Pope St. Gregory the Great (6th century): 'What writing presents to readers, a picture presents to the unlearned who behold it.'",
      summaryPoints: "• Images are visual reminders of holy people and events\n• Veneration is different from worship (latria)\n• Rooted in the Incarnation of Christ\n• Used for catechesis and devotion\n• Biblical precedent exists\n• Helps direct our minds to heavenly realities"
    },
    {
      question: "What is the significance of the Rosary?",
      answer: "The Rosary is a meditative prayer that reflects on key events in the lives of Jesus and Mary. It combines vocal prayer with meditation on the mysteries of salvation history, helping Catholics grow in faith and devotion.",
      fullAnswer: "The Rosary is a meditative prayer that combines vocal prayer (Apostles' Creed, Our Father, Hail Mary, Glory Be) with meditation on key events in the lives of Jesus and Mary, known as the Joyful, Sorrowful, Glorious, and Luminous Mysteries. It's called a 'spiritual weapon' and was given to St. Dominic by Our Lady. The Rosary helps Catholics grow in faith, hope, and charity while contemplating Christ's life through Mary's eyes. Pope St. John Paul II called it his 'favorite prayer' and added the Luminous Mysteries in 2002.",
      category: "Prayer",
      subjectOverview: "The Rosary is a Christ-centered prayer that leads us through the principal events of salvation history. It combines vocal prayer with meditation on the mysteries of Christ's life, death, and resurrection. The prayer is traditionally attributed to St. Dominic in the 13th century, who received it from the Blessed Virgin Mary as a spiritual weapon against heresy. The Rosary consists of four sets of mysteries (Joyful, Sorrowful, Glorious, and Luminous) that help us meditate on the life of Christ through the eyes of Mary, his mother.",
      etymology: "The word 'rosary' comes from the Latin 'rosarium' meaning 'rose garden' or 'garland of roses'. In medieval times, it was common to compare prayers to roses, with each prayer forming a spiritual bouquet. The term reflects the beauty and fragrance of this prayer that is offered to Mary, the Mystical Rose.",
      churchDocuments: "• Catechism of the Catholic Church 2678, 2708, 971\n• Pope St. John Paul II, Rosarium Virginis Mariae (2002)\n• Pope Leo XIII, Supremi Apostolatus Officio (1883) - On Devotion of the Rosary\n• Vatican II, Lumen Gentium 66-67\n• Pope Pius XII, Ingruentium Malorum (1951) - On Reciting the Rosary",
      scriptureSupport: "Primary:\n• Luke 1:28-42 - The Hail Mary in Scripture\n• Philippians 4:8 - 'Whatever is true... think about these things'\n• 1 Thessalonians 5:17 - 'Pray without ceasing'\n\nSupporting:\n• Revelation 12:1 - The woman clothed with the sun\n• John 19:25-27 - Mary given as mother to the Church\n• Acts 1:14 - Mary praying with the Apostles",
      earlyChurchFathers: "• St. Louis de Montfort (18th century): 'The Rosary is the most powerful weapon to touch the Heart of Jesus, our redeemer, who loves his mother.'\n• St. Padre Pio (20th century): 'The Rosary is the 'weapon' for these times.'\n• St. Therese of Lisieux (19th century): 'The Rosary is a long chain that links heaven and earth.'",
      summaryPoints: "• Combines vocal prayer and meditation\n• Focuses on Christ through Mary's eyes\n• Covers the full scope of salvation history\n• Spiritual weapon against evil\n• Strengthens faith, hope, and charity\n• Unites us with the universal Church"
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