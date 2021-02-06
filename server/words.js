const adjs = {three: ["all", "any", "apt", "bad", "big", "dim", "dry", "far", "fat", "few", "hot", "icy", "ill", "key", "low", "mad", "new", "odd", "old", "our", "raw", "red", "sad", "shy", "tan", "wan", "wee", "wet", "wry"], four: ["able", "aged", "ajar", "arid", "back", "bare", "best", "blue", "bold", "bony", "both", "busy", "calm", "cold", "cool", "cute", "damp", "dark", "dead", "dear", "deep", "drab", "dual", "dull", "each", "easy", "even", "evil", "fair", "fake", "fast", "fine", "firm", "flat", "fond", "free", "full", "glum", "good", "gray", "grim", "half", "hard", "high", "huge", "icky", "idle", "keen", "kind", "lame", "last", "late", "lazy", "lean", "left", "limp", "live", "lone", "long", "lost", "loud", "male", "mean", "meek", "mild", "near", "neat", "next", "nice", "numb", "oily", "only", "open", "oval", "pale", "past", "pink", "poor", "posh", "puny", "pure", "rare", "rash", "real", "rich", "ripe", "rosy", "rude", "safe", "same", "sane", "sick", "slim", "slow", "smug", "soft", "some", "sore", "sour", "spry", "tall", "tame", "tart", "taut", "that", "thin", "this", "tidy", "tiny", "torn", "trim", "true", "twin", "ugly", "used", "vain", "vast", "warm", "wary", "wavy", "weak", "wide", "wild", "wiry", "wise", "worn", "zany"], five: ["adept", "agile", "alert", "alive", "ample", "angry", "aware", "awful", "baggy", "basic", "black", "bland", "blank", "bleak", "blind", "blond", "bogus", "bossy", "bowed", "brave", "brief", "brisk", "brown", "bulky", "bumpy", "burly", "cheap", "chief", "clean", "clear", "close", "corny", "crazy", "crisp", "cruel", "curly", "curvy", "dense", "dirty", "dizzy", "dopey", "eager", "early", "empty", "equal", "every", "faint", "false", "fancy", "fatal", "first", "fixed", "flaky", "fluid", "frail", "frank", "fresh", "front", "funny", "fussy", "fuzzy", "giant", "giddy", "glass", "grand", "grave", "great", "green", "grimy", "gross", "grown", "gummy", "hairy", "handy", "happy", "harsh", "hasty", "heavy", "hefty", "husky", "ideal", "itchy", "jaded", "joint", "jolly", "juicy", "jumbo", "jumpy", "known", "kooky", "lanky", "large", "leafy", "legal", "light", "lined", "livid", "loose", "loyal", "lucky", "lumpy", "major", "mealy", "meaty", "merry", "messy", "milky", "minor", "minty", "misty", "mixed", "moist", "moral", "muddy", "murky", "mushy", "musty", "muted", "naive", "nasty", "needy", "nifty", "nippy", "noisy", "noted", "novel", "nutty", "obese", "other", "perky", "pesky", "petty", "phony", "plain", "plump", "plush", "prime", "prize", "proud", "pushy", "quick", "quiet", "rapid", "ready", "regal", "rigid", "right", "rough", "round", "rowdy", "royal", "ruddy", "runny", "rural", "rusty", "salty", "sandy", "scaly", "scary", "shady", "sharp", "shiny", "short", "showy", "silky", "silly", "slimy", "small", "smart", "soggy", "solid", "soupy", "spicy", "staid", "stale", "stark", "steep", "stiff", "steel", "sunny", "super", "sweet", "swift", "tasty", "tense", "tepid", "testy", "these", "thick", "third", "those", "tight", "tired", "total", "tough", "tubby", "unfit", "upset", "urban", "utter", "vague", "valid", "vapid", "vital", "vivid", "weary", "weepy", "weird", "which", "white", "whole", "windy", "witty", "woozy", "wordy", "worse", "worst", "wrong", "young", "yummy", "zesty"], six: ["aching", "acidic", "active", "actual", "adored", "afraid", "amused", "annual", "arctic", "barren", "better", "bitter", "boring", "bouncy", "bright", "broken", "bronze", "bubbly", "candid", "canine", "caring", "cheery", "chilly", "chubby", "clever", "closed", "cloudy", "clumsy", "coarse", "common", "cooked", "costly", "crafty", "creamy", "creepy", "cuddly", "dapper", "daring", "deadly", "decent", "dental", "direct", "dismal", "dreary", "dismal", "doting", "double", "drafty", "dreary", "droopy", "edible", "elated", "entire", "exotic", "expert", "famous", "feisty", "feline", "female", "fickle", "filthy", "flashy", "flawed", "flimsy", "fluffy", "forked", "formal", "frayed", "French", "frigid", "frilly", "frizzy", "frosty", "frozen", "frugal", "gentle", "gifted", "giving", "gloomy", "glossy", "golden", "greedy", "grubby", "grumpy", "guilty", "hearty", "hidden", "hoarse", "hollow", "homely", "honest", "humble", "hungry", "impish", "impure", "inborn", "intent", "jagged", "jaunty", "jovial", "joyful", "joyous", "junior", "kindly", "klutzy", "knobby", "knotty", "kosher", "lavish", "lawful", "likely", "linear", "liquid", "little", "lively", "lonely", "lovely", "loving", "mature", "meager", "measly", "medium", "mellow", "modern", "modest", "narrow", "nimble", "normal", "oblong", "oblong", "orange", "ornate", "ornery", "paltry", "pastel", "polite", "poised", "portly", "pretty", "pricey", "proper", "purple", "putrid", "quaint", "queasy", "quirky", "ragged", "recent", "remote", "ringed", "robust", "rotten", "scarce", "scared", "second", "secret", "serene", "severe", "shabby", "shoddy", "shrill", "silent", "silver", "simple", "sinful", "single", "skinny", "sleepy", "slight", "slushy", "smoggy", "smooth", "snappy", "sneaky", "snoopy", "somber", "sparse", "speedy", "spiffy", "square", "stable", "starry", "sticky", "stingy", "stormy", "strict", "strong", "stupid", "sturdy", "subtle", "sudden", "sugary", "superb", "svelte", "sweaty", "tender", "thorny", "timely", "tinted", "tragic", "tricky", "trusty", "uneven", "unique", "united", "unripe", "unruly", "unsung", "untidy", "untrue", "unused", "upbeat", "usable", "useful", "vacant", "violet", "warped", "watery", "webbed", "weekly", "wicked", "wiggly", "wilted", "winged", "wobbly", "woeful", "wooden", "worthy", "yearly", "yellow", "zigzag"], seven: ["admired", "alarmed", "amazing", "amusing", "ancient", "angelic", "another", "antique", "anxious", "ashamed", "assured", "austere", "average", "awesome", "awkward", "babyish", "belated", "beloved", "blaring", "boiling", "bruised", "buoyant", "buttery", "buzzing", "capital", "careful", "classic", "complex", "content", "corrupt", "crooked", "crowded", "damaged", "darling", "dearest", "decimal", "defiant", "delayed", "devoted", "digital", "dimpled", "distant", "distant", "dutiful", "earnest", "elastic", "elderly", "elegant", "eminent", "enraged", "envious", "ethical", "exalted", "excited", "failing", "faraway", "far-off", "fearful", "fitting", "flowery", "focused", "foolish", "gaseous", "general", "genuine", "glaring", "gleeful", "grouchy", "growing", "harmful", "hateful", "healthy", "helpful", "hideous", "honored", "hopeful", "humming", "hurtful", "idiotic", "illegal", "immense", "jealous", "jittery", "knowing", "lasting", "leading", "likable", "limited", "limping", "lovable", "made-up", "mammoth", "married", "massive", "medical", "melodic", "miserly", "monthly", "muffled", "mundane", "natural", "naughty", "nervous", "nonstop", "notable", "noxious", "obvious", "oddball", "offbeat", "optimal", "opulent", "orderly", "organic", "overdue", "parched", "partial", "peppery", "perfect", "pitiful", "plastic", "playful", "pleased", "pointed", "popular", "potable", "present", "prickly", "primary", "private", "profuse", "prudent", "pungent", "puzzled", "radiant", "regular", "roasted", "rubbery", "rundown", "scented", "scrawny", "selfish", "serious", "several", "shadowy", "shallow", "shocked", "similar", "soulful", "Spanish", "spotted", "squeaky", "stained", "starchy", "strange", "striped", "stylish", "subdued", "tedious", "teeming", "thirsty", "thrifty", "trained", "trivial", "unaware", "unhappy", "uniform", "unkempt", "unknown", "unlined", "unlucky", "untried", "unusual", "upright", "useless", "velvety", "vibrant", "vicious", "violent", "virtual", "visible", "warlike", "wealthy", "weighty", "welcome", "willing", "winding", "worldly", "worried", "yawning", "zealous"], eight: ["absolute", "adorable", "academic", "accurate", "adorable", "advanced", "agitated", "alarming", "anchored", "animated", "aromatic", "artistic", "athletic", "attached", "blissful", "blushing", "bustling", "carefree", "careless", "cautious", "charming", "cheerful", "circular", "clueless", "colorful", "colossal", "complete", "composed", "concrete", "confused", "constant", "creative", "criminal", "critical", "crushing", "cultured", "dazzling", "decisive", "definite", "deserted", "detailed", "diligent", "discrete", "disloyal", "distinct", "dramatic", "ecstatic", "educated", "electric", "enormous", "esteemed", "euphoric", "exciting", "fabulous", "faithful", "familiar", "fatherly", "favorite", "fearless", "feminine", "finished", "flawless", "flippant", "forceful", "forsaken", "fragrant", "frequent", "friendly", "fruitful", "fumbling", "generous", "gigantic", "gleaming", "glorious", "gorgeous", "graceful", "gracious", "granular", "grateful", "gripping", "grizzled", "grounded", "growling", "gruesome", "gullible", "handmade", "handsome", "harmless", "haunting", "heavenly", "helpless", "horrible", "idolized", "ignorant", "impolite", "indolent", "infamous", "inferior", "infinite", "informal", "innocent", "insecure", "internal", "intrepid", "ironclad", "jubilant", "juvenile", "lopsided", "luminous", "lustrous", "majestic", "mediocre", "menacing", "metallic", "mindless", "motherly", "nautical", "negative", "obedient", "official", "ordinary", "original", "outlying", "outgoing", "parallel", "peaceful", "perfumed", "periodic", "personal", "physical", "piercing", "pleasant", "pleasing", "polished", "positive", "possible", "powerful", "precious", "precious", "previous", "pristine", "probable", "punctual", "puzzling", "quixotic", "reckless", "reliable", "relieved", "required", "rotating", "sardonic", "scornful", "scratchy", "separate", "shameful", "shocking", "sizzling", "skeletal", "slippery", "snarling", "sociable", "specific", "spirited", "spiteful", "splendid", "spotless", "squiggly", "standard", "straight", "strident", "striking", "studious", "stunning", "suburban", "superior", "tangible", "tattered", "tempting", "terrible", "terrific", "thankful", "thorough", "trifling", "troubled", "trusting", "truthful", "ultimate", "uncommon", "unfolded", "unlawful", "unsteady", "untimely", "unwieldy", "utilized", "valuable", "variable", "vengeful", "vigilant", "vigorous", "virtuous", "wasteful", "watchful", "well-lit", "well-off", "whopping", "wrathful", "wretched", "writhing", "youthful"]};

const nouns = {three: ["way", "art", "map", "two", "law", "mom", "lab", "mud", "pie", "son", "tea", "dad", "ear", "hat", "sir", "air", "day", "job", "end", "fat", "key", "top", "web", "fun", "oil", "age", "bad", "tax", "man", "act", "car", "dog", "sun", "war", "bus", "eye", "box", "bit", "pot", "egg", "ice", "gas", "sky", "fan", "red", "log", "net", "sea", "dot", "fee", "bat", "kid", "sex", "cap", "cup", "lie", "tip", "bag", "bed", "gap", "arm", "bet", "god", "pin", "bar", "boy", "row", "bid", "bug", "cat", "cow", "guy", "leg", "lip", "pen", "toe", "you", "can", "one", "use", "few", "she", "put", "set", "big", "cut", "try", "pay", "let", "ask", "buy", "low", "run", "due", "mix", "fly", "hit", "cry", "eat", "fix", "tap", "win", "raw", "dig", "tie", "sad", "lay", "pop", "rip", "rub"], four: ["meat", "year", "data", "food", "bird", "love", "fact", "idea", "area", "oven", "week", "exam", "army", "goal", "news", "user", "disk", "road", "role", "soup", "math", "wood", "unit", "cell", "lake", "mood", "city", "debt", "loss", "bath", "mall", "hair", "mode", "song", "town", "wife", "gate", "girl", "hall", "meal", "poem", "desk", "king", "menu", "beer", "dirt", "gene", "lady", "poet", "tale", "time", "work", "film", "game", "life", "form", "part", "fish", "back", "heat", "hand", "book", "type", "home", "body", "size", "card", "list", "mind", "line", "care", "risk", "word", "name", "boss", "page", "term", "test", "kind", "soil", "rate", "site", "case", "boat", "cash", "plan", "side", "rule", "head", "rock", "salt", "note", "rent", "bank", "half", "fire", "step", "face", "item", "room", "view", "ball", "gift", "tool", "wind", "sign", "task", "hope", "date", "link", "post", "star", "self", "shot", "exit", "lack", "spot", "wing", "foot", "rain", "wall", "base", "pair", "text", "file", "bowl", "club", "edge", "lock", "pack", "park", "skin", "sort", "baby", "dish", "trip", "gear", "land", "sale", "tree", "wave", "belt", "copy", "drop", "path", "tour", "blue", "duty", "hour", "luck", "milk", "pipe", "seat", "team", "crew", "gold", "mark", "pain", "shop", "suit", "tone", "band", "bone", "coat", "door", "east", "hole", "hook", "nose", "rice", "bill", "cake", "code", "ease", "farm", "host", "loan", "nail", "race", "sand", "west", "wine", "blow", "chip", "dust", "golf", "iron", "mail", "mess", "pool", "shoe", "tank", "bake", "bell", "bike", "clue", "diet", "fear", "fuel", "pace", "peak", "till", "yard", "bend", "bite", "harm", "knee", "load", "neck", "ruin", "ship", "snow", "tune", "zone", "boot", "camp", "hell", "joke", "jury", "mate", "ring", "roof", "rope", "sail", "sock", "will", "many", "most", "make", "good", "look", "help", "read", "keep", "give", "long", "play", "feel", "high", "past", "show", "call", "move", "turn", "hold", "main", "cook", "cold", "deal", "fall", "talk", "tell", "cost", "glad", "rest", "safe", "stay", "rise", "walk", "pick", "lift", "stop", "gain", "rich", "save", "fail", "lead", "meet", "sell", "ride", "wait", "deep", "flow", "dump", "push", "fill", "jump", "kick", "pass", "vast", "beat", "burn", "dark", "draw", "hire", "join", "kill", "drag", "pull", "soft", "wear", "dead", "feed", "sing", "wish", "hang", "hunt", "hate", "sick", "hurt", "swim", "wash", "fold", "grab", "hide", "miss", "roll", "sink", "slip", "calm", "male", "mine", "rush", "suck", "bear", "dare", "dear", "kiss", "neat", "quit", "tear", "wake", "wrap"], five: ["world", "music", "power", "story", "media", "thing", "video", "movie", "basis", "paper", "child", "month", "truth", "night", "event", "phone", "scene", "death", "woman", "blood", "skill", "depth", "heart", "photo", "topic", "steak", "union", "entry", "virus", "actor", "drama", "hotel", "owner", "bread", "guest", "bonus", "queen", "ratio", "tooth", "error", "river", "buyer", "chest", "honey", "piano", "salad", "apple", "cheek", "pizza", "shirt", "uncle", "youth", "water", "money", "while", "study", "place", "field", "point", "value", "guide", "state", "radio", "price", "trade", "group", "force", "light", "level", "order", "sense", "piece", "sport", "house", "sound", "focus", "board", "range", "image", "cause", "coast", "mouse", "class", "store", "space", "stock", "model", "earth", "birth", "scale", "speed", "style", "craft", "frame", "issue", "cycle", "metal", "paint", "share", "black", "shape", "table", "north", "voice", "brush", "front", "plant", "taste", "theme", "track", "brain", "click", "staff", "sugar", "phase", "stage", "stick", "title", "novel", "carry", "fruit", "glass", "joint", "chart", "ideal", "party", "bench", "south", "stuff", "angle", "dream", "essay", "juice", "limit", "mouth", "peace", "storm", "trick", "beach", "blank", "catch", "chain", "cream", "match", "score", "screw", "agent", "block", "court", "layer", "curve", "dress", "fight", "grade", "horse", "noise", "pause", "proof", "smoke", "towel", "wheel", "aside", "buddy", "bunch", "coach", "cross", "draft", "floor", "habit", "judge", "knife", "pound", "shame", "trust", "blame", "brick", "chair", "devil", "glove", "lunch", "nurse", "panic", "plane", "shock", "spite", "spray", "alarm", "blind", "cable", "clerk", "cloud", "plate", "skirt", "slice", "trash", "anger", "award", "candy", "clock", "crack", "fault", "grass", "motor", "nerve", "pride", "prize", "tower", "truck", "other", "great", "being", "might", "still", "start", "human", "local", "today", "major", "check", "guard", "offer", "whole", "dance", "worth", "spend", "drive", "green", "leave", "reach", "serve", "watch", "break", "visit", "cover", "white", "final", "teach", "broad", "maybe", "stand", "young", "heavy", "hello", "worry", "press", "tough", "brown", "shoot", "touch", "pitch", "total", "treat", "abuse", "print", "raise", "sleep", "equal", "claim", "drink", "guess", "minor", "solid", "weird", "count", "doubt", "round", "slide", "strip", "march", "smell", "adult", "brief", "crazy", "prior", "rough", "laugh", "nasty", "royal", "split", "train", "upper", "crash", "funny", "quote", "spare", "sweet", "swing", "twist", "usual", "brave", "grand", "quiet", "shake", "shift", "shine", "steal", "delay", "drunk", "hurry", "punch", "reply", "silly", "smile", "spell"], six: ["people", "family", "health", "system", "thanks", "person", "method", "theory", "nature", "safety", "player", "policy", "series", "camera", "growth", "income", "energy", "nation", "moment", "office", "driver", "flight", "length", "dealer", "member", "advice", "effort", "wealth", "county", "estate", "recipe", "studio", "agency", "memory", "aspect", "cancer", "region", "device", "engine", "height", "sample", "cousin", "editor", "extent", "guitar", "leader", "singer", "tennis", "basket", "church", "coffee", "dinner", "orange", "poetry", "police", "sector", "volume", "farmer", "injury", "speech", "winner", "worker", "writer", "breath", "cookie", "drawer", "insect", "ladder", "potato", "sister", "tongue", "affair", "client", "throat", "number", "market", "course", "school", "amount", "answer", "matter", "access", "garden", "reason", "future", "demand", "action", "record", "result", "period", "chance", "figure", "source", "design", "object", "profit", "inside", "stress", "review", "screen", "medium", "bottom", "choice", "impact", "career", "credit", "square", "effect", "friend", "couple", "debate", "living", "summer", "button", "desire", "notice", "damage", "target", "animal", "author", "budget", "ground", "lesson", "minute", "bridge", "letter", "option", "plenty", "weight", "factor", "master", "muscle", "appeal", "mother", "season", "signal", "spirit", "street", "status", "ticket", "degree", "doctor", "father", "stable", "detail", "shower", "window", "corner", "finger", "garage", "manner", "winter", "battle", "bother", "horror", "phrase", "relief", "string", "border", "branch", "breast", "expert", "league", "native", "parent", "salary", "silver", "tackle", "assist", "closet", "collar", "jacket", "reward", "bottle", "candle", "flower", "lawyer", "mirror", "purple", "stroke", "switch", "bitter", "carpet", "island", "priest", "resort", "scheme", "script", "public", "common", "change", "simple", "second", "single", "travel", "excuse", "search", "remove", "return", "middle", "charge", "active", "visual", "affect", "report", "beyond", "junior", "unique", "listen", "handle", "finish", "normal", "secret", "spread", "spring", "cancel", "formal", "remote", "double", "attack", "wonder", "annual", "nobody", "repeat", "divide", "survey", "escape", "gather", "repair", "strike", "employ", "mobile", "senior", "strain", "yellow", "permit", "abroad", "prompt", "refuse", "regret", "reveal", "female", "invite", "resist", "stupid"], seven: ["history", "reading", "problem", "control", "ability", "science", "library", "product", "society", "quality", "variety", "country", "physics", "thought", "freedom", "writing", "article", "fishing", "failure", "meaning", "teacher", "disease", "success", "student", "context", "finding", "message", "concept", "housing", "opinion", "payment", "reality", "passion", "setting", "college", "storage", "version", "alcohol", "highway", "mixture", "tension", "anxiety", "climate", "emotion", "manager", "charity", "outcome", "revenue", "session", "cabinet", "clothes", "drawing", "hearing", "vehicle", "airport", "arrival", "chapter", "village", "warning", "courage", "garbage", "grocery", "penalty", "wedding", "analyst", "bedroom", "diamond", "fortune", "funeral", "speaker", "surgery", "trainer", "example", "process", "economy", "company", "service", "picture", "section", "nothing", "subject", "weather", "program", "chicken", "feature", "purpose", "outside", "benefit", "account", "balance", "machine", "address", "average", "culture", "morning", "contact", "network", "attempt", "capital", "plastic", "feeling", "savings", "officer", "trouble", "maximum", "quarter", "traffic", "kitchen", "minimum", "project", "finance", "mission", "contest", "lecture", "meeting", "parking", "partner", "profile", "respect", "routine", "airline", "evening", "holiday", "husband", "mistake", "package", "patient", "stomach", "tourist", "brother", "opening", "pattern", "request", "shelter", "comment", "monitor", "weekend", "welcome", "bicycle", "concert", "counter", "leather", "pension", "channel", "comfort", "passage", "promise", "station", "witness", "general", "tonight", "current", "natural", "special", "working", "primary", "produce", "present", "support", "complex", "regular", "reserve", "classic", "private", "western", "concern", "leading", "release", "display", "extreme", "deposit", "advance", "consist", "forever", "impress", "whereas", "combine", "command", "initial", "mention", "scratch", "illegal", "respond", "convert", "recover", "resolve", "suspect", "anybody", "stretch"], eight: ["computer", "software", "internet", "activity", "industry", "language", "security", "analysis", "strategy", "instance", "audience", "marriage", "medicine", "location", "addition", "painting", "politics", "decision", "property", "shopping", "category", "magazine", "teaching", "customer", "resource", "patience", "solution", "attitude", "director", "response", "argument", "contract", "emphasis", "currency", "republic", "delivery", "election", "football", "guidance", "priority", "elevator", "employee", "employer", "disaster", "feedback", "homework", "judgment", "relation", "accident", "baseball", "database", "hospital", "presence", "proposal", "quantity", "reaction", "weakness", "ambition", "bathroom", "birthday", "midnight", "platform", "stranger", "sympathy", "business", "interest", "training", "practice", "research", "exercise", "building", "material", "question", "standard", "exchange", "position", "pressure", "function", "distance", "discount", "register", "campaign", "evidence", "strength", "relative", "progress", "daughter", "pleasure", "calendar", "district", "schedule", "swimming", "designer", "mountain", "occasion", "sentence", "shoulder", "vacation", "document", "mortgage", "sandwich", "surprise", "champion", "engineer", "entrance", "incident", "resident", "specific", "possible", "personal", "national", "physical", "increase", "purchase", "positive", "creative", "original", "negative", "anything", "familiar", "official", "valuable", "chemical", "conflict", "opposite", "anywhere", "internal", "constant", "external", "ordinary", "struggle", "upstairs", "estimate", "surround", "tomorrow"]};

module.exports = { nouns, adjs };