export interface Article {
    slug: string;
    title: Record<string, string>;
    excerpt: Record<string, string>;
    content: Record<string, string[]>; // Paragraphs
}

export const ARTICLES: Article[] = [
    {
        slug: "tarot-guide",
        title: {
            en: "Comprehensive Guide to Tarot Reading & Card Meanings",
            th: "คู่มือการอ่านไพ่ทาโรต์ดั้งเดิมและความหมายของไพ่ 78 ใบ",
        },
        excerpt: {
            en: "Discover the mysteries of the 78-card Tarot deck, from Major Arcana life lessons to Minor Arcana daily influences.",
            th: "ค้นพบความลึกลับของไพ่ทาโรต์ทั้ง 78 ใบ ตั้งแต่บทเรียนชีวิตจากเมเจอร์อาร์คานา ไปจนถึงอิทธิพลรายวันจากไมเนอร์อาร์คานา",
        },
        content: {
            th: [
                "ไพ่ทาโรต์ (Tarot) เป็นเครื่องมือสำหรับการหยั่งรู้และสำรวจจิตวิญญาณที่มีประวัติศาสตร์ยาวนาน สำรับไพ่ทาโรต์มาตรฐานประกอบไปด้วยไพ่ทั้งหมด 78 ใบ ซึ่งแบ่งออกเป็นสองชุดหลักๆ คือ เมเจอร์อาร์คานา (Major Arcana) 22 ใบ และ ไมเนอร์อาร์คานา (Minor Arcana) 56 ใบ",
                "ไพ่ชุดเมเจอร์อาร์คานา (Major Arcana): จะพูดถึงเหตุการณ์สำคัญในชีวิต จุดเปลี่ยน และบทเรียนทางจิตวิญญาณ ไพ่ชุดนี้มักเป็นตัวแทนของพลังงานที่ควบคุมได้ยากหรือโชคชะตาที่กำลังเข้ามาหาคุณ เช่น ไพ่ The Fool (การผจญภัยใหม่) หรือ The World (ความสำเร็จที่สมบูรณ์)",
                "ไพ่ชุดไมเนอร์อาร์คานา (Minor Arcana): จะสะท้อนถึงเหตุการณ์ในชีวิตประจำวัน ปฏิสัมพันธ์กับผู้คนรอบข้าง และอารมณ์ความรู้สึกที่เปลี่ยนไปมา ประกอบด้วยไพ่ 4 ชุดย่อยยย ได้แก่ ไม้เท้า (การกระทำ/พลังงาน), ถ้วย (อารมณ์/ความรัก), ดาบ (ความคิด/อุปสรรค) และ เหรียญ (วัตถุ/การเงิน)",
                "วิธีการอ่านไพ่ทาโรต์: เริ่มต้นจากการตั้งคำถามที่ชัดเจน หลีกเลี่ยงคำถามที่ต้องการคำตอบแค่ ใช่ หรือ ไม่ แต่ให้มุ่งเน้นไปที่คำถามเปิดที่ช่วยให้ไพ่สามารถให้คำแนะนำได้ เช่น 'ฉันควรทำอย่างไรเพื่อปรับปรุงความสัมพันธ์นี้?' จากนั้นเลือกรูปแบบการวางไพ่ (Spread) เช่น แบบ 3 ใบ (อดีต ปัจจุบัน อนาคต) หรือแบบเซลติกครอส (Celtic Cross) แบบ 10 ใบเพื่อการวิเคราะห์เชิงลึก"
            ],
            en: [
                "The Tarot is a profound tool for divination and self-reflection. A standard deck consists of 78 cards divided into two main sections: the Major Arcana (22 cards) and the Minor Arcana (56 cards).",
                "The Major Arcana represents significant life events, major turning points, and spiritual wisdom. These cards speak to the overarching themes in your life, such as The Fool representing a leap of faith or The World symbolizing completion.",
                "The Minor Arcana reflects the day-to-day happenings, emotions, and practical aspects of living. It is divided into four suits: Wands (action and passion), Cups (emotions and relationships), Swords (thoughts and challenges), and Pentacles (material wealth and work).",
                "To read Tarot, start with a clear, open-ended question. Avoid simple yes/no questions to allow the cards to provide meaningful guidance. Choose a card spread, such as the simple 3-card spread (Past, Present, Future) or the detailed 10-card Celtic Cross, to uncover the story the cards are telling."
            ]
        }
    },
    {
        slug: "lenormand-guide",
        title: {
            en: "Beginner's Guide to Lenormand Card Reading",
            th: "คู่มือการอ่านไพ่เลอนอร์ม็อง (Lenormand) สำหรับผู้เริ่มต้น",
        },
        excerpt: {
            en: "Learn how to read the 36-card Lenormand deck by combining symbols for practical, straightforward answers.",
            th: "เรียนรู้วิธีการอ่านไพ่เลอนอร์ม็อง 36 ใบ โดยการผสมความหมายของสัญลักษณ์เพื่อหาคำตอบที่ชัดเจนและตรงไปตรงมา",
        },
        content: {
            th: [
                "ไพ่เลอนอร์ม็อง (Lenormand) เป็นสำรับไพ่พยากรณ์ที่มีต้นกำเนิดจากยุโรป แตกต่างจากไพ่ทาโรต์อย่างชัดเจนตรงที่ไพ่เลอนอร์ม็องมีเพียง 36 ใบ และเน้นการทำนายเรื่องราวในชีวิตประจำวันที่จับต้องได้ มากกว่าเรื่องลี้ลับหรือจิตวิญญาณเจาะลึก",
                "จุดเด่นของการอ่านไพ่เลอนอร์ม็องคือการ 'ผสมคำ' (Combining) ไพ่แต่ละใบจะเป็นเพียงคำนาม หรือเงื่อนไขหนึ่งอย่าง เมื่อนำมาวางติดกัน ความหมายของไพ่จะเปลี่ยนไปตามไพ่ใบที่อยู่ใกล้เคียง เช่น การนำไพ่ Rider (ข่าวสาร) มาจับคู่กับ Clover (โชคดี) เกิดเป็นความหมายของ 'ข่าวดี' ที่เข้ามากะทันหัน",
                "สัญลักษณ์ในไพ่เลอนอร์ม็องเป็นสิ่งที่เข้าใจง่ายและตรงตัว เช่น สุนัข (Dog) หมายถึงเพื่อนหรือความซื่อสัตย์, จิ้งจอก (Fox) หมายถึงความฉลาดแกมโกงหรือการงานที่ไม่ใช่ของตัวเอง, และแหวน (Ring) หมายถึงสัญญาหรือการแต่งงาน",
                "ในการดูไพ่เลอนอร์ม็อง มักใช้วิธีวางไพ่แบบ 3 ใบ, 5 ใบ หรือ 9 ใบ (3x3 Box) และขั้นสูงสุดคือ Grand Tableau ที่ใช้ไพ่ทั้งหมด 36 ใบในการทำนายวิถีชีวิตทั้งหมดของผู้ถาม"
            ],
            en: [
                "The Lenormand deck is a traditional 36-card fortune-telling system from Europe. Unlike the psychological and spiritual depth of Tarot, Lenormand is highly practical and focuses on everyday life, direct events, and clear answers.",
                "The core of reading Lenormand lies in 'combining' cards. A single card rarely gives the full picture. Instead, cards are read together like words in a sentence. For example, the Rider card (news) paired with the Clover card (luck) translates to 'lucky news' arriving quickly.",
                "Symbols on Lenormand cards are literal and straightforward. The Dog represents a loyal friend, the Fox can indicate trickery or a traditional 9-to-5 job, and the Ring symbolizes contracts or marriage.",
                "Common Lenormand spreads include the 3-card line, the 5-card line, the 9-card square (3x3 Box), and the ultimate Grand Tableau, which uses all 36 cards to map out the querent's entire life situation."
            ]
        }
    },
    {
        slug: "oracle-guide",
        title: {
            en: "The Way of Oracle Cards: Connecting with Your Intuition",
            th: "วิถีแห่งไพ่ออราเคิล: เชื่อมต่อกับสัญชาตญาณของคุณ",
        },
        excerpt: {
            en: "Explore the gentle and uplifting world of Oracle cards. Perfect for daily inspiration, spiritual healing, and connecting with universe.",
            th: "สำรวจโลกที่นุ่มนวลและเยียวยาจิตใจของไพ่ออราเคิล เหมาะสำหรับแรงบันดาลใจรายวัน การเยียวยาทางจิตวิญญาณ และการพูดคุยกับจักรวาล",
        },
        content: {
            th: [
                "ไพ่ออราเคิล (Oracle Cards) เป็นไพ่พยากรณ์ที่ไม่มีรูปแบบหรือข้อบังคับตายตัวเหมือนไพ่ทาโรต์ จำนวนไพ่ในหนึ่งสำรับ ความหมายบนหน้าไพ่ และโครงสร้างต่างๆ ล้วนขึ้นอยู่กับผู้สร้างสรรค์ไพ่ชุดนั้นๆ ทำให้ไพ่ออราเคิลมีความเป็นอิสระสูงและอ่านง่าย",
                "เนื้อหาหลักของไพ่ออราเคิลมักเกี่ยวข้องกับพลังงานบวก การเยียวยาจิตใจ คำแนะนำจากจักรวาล และนางฟ้าประจำตัว หากคุณรู้สึกเครียด หรือต้องการคำยืนยันในบางเรื่อง ไพ่ออราเคิลจะเป็นเหมือนเพื่อนใจดีที่คอยให้กำลังใจมากกว่าที่จะทักเรื่องร้าย",
                "วิธีการใช้งานไพ่ออราเคิลนั้นง่ายมาก คุณไม่จำเป็นต้องจำความหมายซับซ้อน เพียงแค่ตั้งคำถามในใจ สับไพ่ และสุ่มหยิบขึ้นมา 1-3 ใบ ภาพวาดและคีย์เวิร์ดบนไพ่จะทำงานร่วมกับสัญชาตญาณของคุณโดยตรง ให้คุณใช้จินตนาการวิเคราะห์ความรู้สึกตอนเห็นไพ่นั้นเพื่อค้นหาคำตอบภายในตัวคุณ"
            ],
            en: [
                "Oracle cards are a free-flowing divination tool unbound by the traditional rules, structures, or numbered suits found in Tarot. The number of cards, themes, and meanings are entirely up to the deck's creator, making them incredibly intuitive and easy to use.",
                "Oracle decks generally focus on positive energy, spiritual healing, and gentle guidance. When you are feeling stressed or need gentle reassurance, an Oracle deck acts as a compassionate friend, offering uplifting messages rather than harsh warnings.",
                "Using Oracle cards is very straightforward. You don't need to memorize complex meanings. Simply hold your question in mind, shuffle, and draw 1 to 3 cards. The imagery and keywords on the cards connect directly with your intuition. Trust what you feel when you look at the card to find the answers within."
            ]
        }
    },
    {
        slug: "playing-cards-guide",
        title: {
            en: "Cartomancy: How to Read Standard Playing Cards",
            th: "Cartomancy: ศิลปะการดูดวงด้วยไพ่ป๊อก 52 ใบ",
        },
        excerpt: {
            en: "Turn a standard 52-card playing deck into a powerful tool for fortune-telling and gaining insights into your daily life.",
            th: "เปลี่ยนไพ่ป๊อก 52 ใบมาตรฐานให้เป็นเครื่องมือพยากรณ์ที่ทรงพลังและแม่นยำ เพื่อทำนายเรื่องราวในชีวิตประจำวันของคุณ",
        },
        content: {
            th: [
                "Cartomancy หรือการดูดวงด้วยไพ่ เป็นศาสตร์ที่เก่าแก่มากที่สุดวิชาหนึ่ง และการใช้ 'ไพ่ป๊อก' หรือสำรับไพ่คลาสสิค 52 ใบ ก็เป็นวิธีที่ได้รับความนิยมอย่างแพร่หลายทั่วโลก เพราะหาซื้อได้ง่ายและให้คำทำนายที่แม่นยำและซื่อตรงเกี่ยวกับสถานการณ์ในชีวิตจริง",
                "ความหมายของหน้าไพ่ (Suits): ไพ่ป๊อกจะถูกแบ่งออกเป็น 4 ดอก ได้แก่ โพแดง (Hearts) ซึ่งเกี่ยวโยงกับความรักและอารมณ์, โพดำ (Spades) ที่เกี่ยวโยงกับความท้าทาย อุปสรรค และการเปลี่ยนแปลง, ข้าวหลามตัด (Diamonds) เกี่ยวโยงกับการเงิน อาชีพ และความรุ่งเรือง, และ ดอกจิก (Clubs) เกี่ยวโยงกับธุรกิจ โชคลาภ และการลงมือทำ",
                "ในการดูดวงด้วยไพ่ป๊อก คุณสามารถประยุกต์ใช้วิธีการวางไพ่แบบเดียวกับไพ่ทาโรต์ได้ ความต่างคือไพ่ป๊อกจะไม่มีไพ่ชุดเมเจอร์อาร์คานา (Major arcana) ดังนั้นคำทำนายมักจะออกไปในแนวทางของเหตุและผลในชีวิตที่เป็นรูปธรรม เช่น จะได้เงินเดือนขึ้นไหม? หรือจะมีคนติดต่อมาเรื่องงานหรือไม่? เป็นศาสตร์ที่เน้นเรื่องจริง มากกว่าการสะท้อนอารมณ์"
            ],
            en: [
                "Cartomancy is the art of fortune-telling using a standard deck of playing cards. It is one of the oldest forms of divination. A regular 52-card deck is easily accessible and provides remarkably blunt and accurate predictions regarding practical matters.",
                "The four suits in playing cards correspond to different areas of life: Hearts (emotions, love, and relationships), Spades (challenges, obstacles, and sudden changes), Diamonds (money, career, and material success), and Clubs (business, luck, and action).",
                "You can use typical Tarot spreads when reading playing cards. The main difference is that playing cards lack the Major Arcana, meaning readings typically focus on blunt, worldly events rather than deep spiritual life journeys. It is an excellent tool for practical, straightforward questions like 'Will I get the job?' or 'Is a financial windfall coming?'"
            ]
        }
    },
    // User Guides
    {
        slug: "how-to-use-app",
        title: {
            en: "How to Use Mystic Cards",
            th: "คู่มือการใช้งานเว็บไซต์ Mystic Cards",
        },
        excerpt: {
            en: "Step-by-step instructions on selecting decks, asking questions, and interpreting reading results.",
            th: "แนะนำขั้นตอนการเลือกสำรับไพ่ การตั้งคำถาม และการอ่านผลลัพธ์คำทำนาย",
        },
        content: {
            th: [
                "ยินดีต้อนรับสู่ Mystic Cards! การเริ่มต้นดูดวงด้วยตัวคุณเองผ่านเว็บไซต์ของเรานั้นง่ายมาก เพียงทำตามขั้นตอนดังต่อไปนี้:",
                "1. เลือกสำรับไพ่ที่คุณสนใจจากหน้าจอหลัก (เช่น ไพ่ทาโรต์ ไพ่เลอนอร์ม็อง ไพ่ออราเคิล หรือไพ่ป๊อก) ไพ่แต่ละประเภทมีสไตล์การตอบคำถามที่ต่างกัน หากคุณต้องการเจาะลึกจิตใจ แนะนำไพ่ทาโรต์ แต่ถ้าต้องการคำตอบที่ตรงไปตรงมา แนะนำไพ่เลอนอร์ม็อง",
                "2. เลือกรูปแบบการวางไพ่ (Spread) เช่น ดึงไพ่ 1 ใบเพื่อเช็คดวงประจําวัน หรือ ดึงไพ่ 3 ใบ (อดีต ปัจจุบัน อนาคต) เพื่อคำทำนายที่ครอบคลุม",
                "3. ตั้งสมาธิ ระลึกถึงเรื่องราวหรือคำถามที่คุณสงสัย จากนั้นทำการ 'สับไพ่' หากรู้สึกว่าไพ่พร้อมแล้ว ทำการ 'ตัดไพ่'",
                "4. เลือกหยิบไพ่ที่ดึงดูดสายตาคุณมากที่สุดตามจำนวนที่ระบบกำหนด ระบบจะทำการเปิดไพ่และอ่านคำทำนายให้คุณทันที!",
                "ในระบบ Freemium ของเรา ผู้ใช้งานทั่วไปสามารถรับสิทธิ์การเปิดไพ่พยากรณ์ฟรีจำกัดจำนวนต่อวัน (เมื่อหมดสามารถกดดูวิดีโอโฆษณาเพื่อรับสิทธิ์ดูดวงฟรีเพิ่มได้เรื่อยๆ)"
            ],
            en: [
                "Welcome to Mystic Cards! Starting your own reading through our website is simple. Just follow these steps:",
                "1. Choose the deck that draws you in from the main screen (Tarot, Lenormand, Oracle, or Playing Cards). Each type of deck has its own unique voice. For deep psychological insights, we recommend Tarot. For blunt, practical answers, try Lenormand.",
                "2. Select a card spread style. You can draw a single card for a quick daily insight, or a 3-card spread (Past, Present, Future) for a more comprehensive reading.",
                "3. Focus your mind on your question or current situation. Click 'Shuffle' to randomize the deck, and when you feel ready, click 'Cut Deck'.",
                "4. Pick the cards you are most drawn to. Once you have selected the required amount of cards, the system will reveal your cards and provide a detailed reading result instantly!",
                "With our Freemium model, you can enjoy a limited number of free readings every day. If you run out, simply watch a short advertisement to instantly unlock another free reading."
            ]
        }
    },
    {
        slug: "how-to-topup",
        title: {
            en: "How to Top Up Coins",
            th: "วิธีเติมเหรียญ (Coin) สำหรับเจาะลึกคำทำนาย",
        },
        excerpt: {
            en: "Learn how to top up coins to unlock the powerful 'Ask-A-Question' AI reading feature.",
            th: "ขั้นตอนการเติม Coin เพื่อนำไปใช้สิทธิ์การถามคำถามปลายเปิดให้ AI วิเคราะห์แบบเจาะจง",
        },
        content: {
            th: [
                "Mystic Cards ใช้ระบบเหรียญ (Coins) ในการเข้าถึงฟีเจอร์พรีเมียม โดยเฉพาะฟีเจอร์เด่นอย่าง 'Ask A Question' (ตั้งคำถาม) ที่ให้คุณส่งพิมพ์คำถามหรือพิมพ์เหตุการณ์เฉพาะหน้าของคุณให้ระบบ AI อ่านไพ่ตอบรับแบบมีรายละเอียดและแม่นยำยิ่งขึ้น เสมือนถามนักพยากรณ์ตัวจริง!",
                "การเติมเหรียญทำได้ง่ายและปลอดภัยผ่านระบบของ Stripe (ผู้ให้บริการชำระเงินระดับโลก) ดังนี้:",
                "1. ล็อกอินเข้าสู่ระบบสมาชิกของคุณ (มุมขวาบนของเมนู)",
                "2. กดคลิกที่ยอดเหรียญ (มุมขวาบนใกล้ชื่อโปรไฟล์) เพื่อเปิดหน้าต่างเติมเหรียญ",
                "3. เลือกแพ็กเกจเหรียญที่คุณต้องการ ระบบของเรามีเหรียญลดราคาหลากหลายแพ็กเกจเพื่อให้เหมาะกับความต้องการ",
                "4. กดยืนยัน ระบบจะนำคุณไปยังหน้าต่างการรับชำระเงินที่มีความปลอดภัยสูงของ Stripe. กรอกข้อมูลบัตรเครดิต หรือช่องทางการชำระเงินอื่นๆ ที่รองรับให้ครบถ้วน",
                "5. หลังจากการชำระเงินสำเร็จ ระบบจะนำคุณกลับมายังหน้าเว็บไซต์และอัปเดตยอดคงเหลือเหรียญในบัญชีของคุณโดยอัตโนมัติ คุณสามารถนำเหรียญเหล่านั้นไปใช้ในการขอคำทำนายแบบส่วนตัวและเจาะลึกได้ทันที!"
            ],
            en: [
                "Mystic Cards utilizes a Coin system to grant access to premium features, most notably the 'Ask A Question' reading type. This premium reading allows you to type out your specific situation and ask a direct, open-ended question that our AI analyzes directly, giving you tailored and incredibly accurate advice—just like a personal reading!",
                "Topping up your coins is simple and secure via Stripe, a globally trusted payment gateway. Here is how to do it:",
                "1. Sign in to your account (available in the top right menu).",
                "2. Click on your active Coin balance (the number next to the coin icon on the top right) to open the top-up window.",
                "3. Select the coin package that best suits your needs. We offer various tiered packages with bonus coins for larger amounts.",
                "4. Confirm your selection. You will be redirected to Stripe’s highly secured checkout page. Fill in your credit card details or use any of the supported express checkout methods.",
                "5. Once your payment succeeds, you will be automatically returned to our site. Your new coin balance will be updated instantly, and you can immediately use them to dive deeper into your fortune!"
            ]
        }
    }
];
