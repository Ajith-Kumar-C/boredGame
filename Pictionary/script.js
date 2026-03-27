const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const wordDisplay = document.getElementById('wordToDraw');
let painting = false;
let usedWords = new Set();

// Imagine 1000 words here - drawing friendly!
const wordPool = [
"Apple","Ball","Cat","Dog","Egg","Fish","Tree","House","Car","Sun",
"Moon","Star","Cloud","Rain","Book","Chair","Table","Cup","Shoe","Hat",
"Eye","Ear","Nose","Mouth","Hand","Foot","Boy","Girl","Baby","Man",
"Woman","Bus","Train","Boat","Plane","Road","Bridge","River","Lake","Hill",
"Flower","Grass","Leaf","Root","Branch","Bird","Duck","Goat","Cow","Horse",
"Pig","Sheep","Lion","Tiger","Bear","Monkey","Frog","Snake","Ant","Bee",
"Spider","Butterfly","Fishbowl","Key","Lock","Door","Window","Wall","Roof","Bed",
"Pillow","Blanket","Clock","Watch","Phone","Laptop","Mouse","Keyboard","TV","Fan",
"Light","Bulb","Battery","Charger","Wire","Bag","Box","Bottle","Plate","Spoon",
"Fork","Knife","Pan","Pot","Stove","Fridge","Sink","Soap","Brush","Toothpaste",
"Towel","Mirror","Comb","Shampoo","Shirt","Pants","Socks","Gloves","Jacket","Belt",
"Cap","Helmet","Scarf","Dress","Skirt","Ring","Necklace","Bracelet","Crown","Sword",
"Shield","Arrow","Bow","Gun","Bomb","Rocket","Satellite","Planet","Earth","Mars",
"Jupiter","Alien","Robot","Drone","Camera","Photo","Video","Game","Dice","Card",
"Puzzle","Toy","Doll","Teddy","Balloon","Kite","Swing","Slide","Seesaw","Park",
"School","Classroom","Teacher","Student","Board","Chalk","Pen","Pencil","Eraser","Sharpener",
"Notebook","Paper","File","Folder","Desk","Chair","Bagpack","Lunchbox","Bottlecap","Snack",
"Pizza","Burger","Fries","Sandwich","Cake","Icecream","Donut","Cookie","Bread","Rice",
"Noodles","Soup","Eggplant","Carrot","Potato","Tomato","Onion","Garlic","Corn","Peas",
"Banana","Mango","Grapes","Orange","Lemon","Watermelon","Pineapple","Strawberry","Cherry","Coconut",
"Milk","Juice","Tea","Coffee","Water","Soda","Candy","Chocolate","Popcorn","Honey",
"Fire","Smoke","Ash","Spark","Match","Candle","Torch","Lamp","Lantern","Flashlight",
"Wind","Storm","Thunder","Lightning","Snow","Ice","Rainbow","Shadow","Echo","Wave",
"Beach","Sand","Shell","Starfish","Crab","Shark","Whale","Octopus","Dolphin","Coral",
"Boatman","Fisherman","Net","Hook","Anchor","Island","Volcano","Forest","Jungle","Desert",
"Oasis","Mountain","Cave","Rock","Stone","Pebble","Path","Trail","Sign","Signal",
"Traffic","Police","Doctor","Nurse","Fireman","Chef","Farmer","Driver","Pilot","Artist",
"Painter","Singer","Dancer","Actor","Clown","Magician","King","Queen","Prince","Princess",
"Knight","Wizard","Dragon","Ghost","Zombie","Vampire","Skeleton","Monster","Fairy","Angel",
"Devil","Hero","Villain","Superman","Batman","Spiderman","Mask","Cape","Glasses","Goggles",
"Helmet","Boots","Wheel","Tyre","Engine","Fuel","Petrol","Diesel","Garage","Parking",
"Lift","Escalator","Stairs","Gate","Fence","Garden","Yard","Pool","Fountain","Bench",
"Statue","Temple","Church","Mosque","Schoolbus","Taxi","Auto","Cycle","Bicycle","Scooter",
"Bike","Truck","Van","Jeep","Ship","Submarine","Helicopter","Rocketship","SatelliteDish","Radar",
"Map","Compass","Flag","Ticket","Passport","Visa","Suitcase","Travel","Trip","Holiday",
"Beachball","Surfboard","Skateboard","Skates","Bat","Ball","Goal","Net","Whistle","Medal",
"Trophy","Score","Team","Player","Coach","Referee","Gym","Workout","Run","Jump",
"Climb","Swim","Dive","Throw","Catch","Kick","Punch","Lift","Push","Pull",
"Sleep","Wake","Eat","Drink","Cook","Clean","Wash","Dry","Fold","Cut",
"Open","Close","Start","Stop","Play","Pause","Fast","Slow","Hot","Cold",
"Warm","Cool","Big","Small","Tall","Short","Wide","Narrow","Heavy","Light",
"Happy","Sad","Angry","Laugh","Cry","Smile","Frown","Think","Dream","Imagine",
"Write","Read","Draw","Paint","Build","Break","Fix","Repair","Create","Design",
"Search","Find","Hide","Seek","Catch","Escape","Win","Lose","Try","Fail",
"Learn","Teach","Help","Share","Give","Take","Buy","Sell","Pay","Save",
"Openbook","Closedbook","Bookmark","Library","Shelf","Cupboard","Drawer","Closet","Hanger","Hook",
"Bucket","Mug","Glass","Jug","Bottle","Cap","Lid","Tray","Basket","Cart",
"Trolley","Wheelbarrow","Spade","Shovel","Hoe","Rake","Axe","Hammer","Nail","Screw",
"Drill","Saw","Toolbox","Wrench","Plier","Tape","Glue","Sticker","Label","Tag",
"Bell","Alarm","Siren","Horn","Speaker","Mic","Radio","Headphone","Earphone","Remote",
"Screen","Monitor","Projector","Printer","Scanner","Router","Cable","Plug","Socket","Switch",
"Battery","Cell","Chip","Board","Circuit","Code","Bug","Fix","Update","Download",
"Upload","Login","Logout","Password","User","Admin","Server","Cloud","Data","File",
"Folder","Zip","Unzip","Backup","Restore","Sync","Sharefile","Link","URL","Browser",
"Searchbar","Tab","Window","Icon","App","Gamepad","Joystick","VR","AR","AI"
];
function nextWord() {
    clearCanvas();
    if (usedWords.size >= wordPool.length) {
        usedWords.clear();
        console.log("All words used! Resetting session...");
    }

    let available = wordPool.filter(w => !usedWords.has(w));
    const word = available[Math.floor(Math.random() * available.length)];
    usedWords.add(word);
    wordDisplay.innerText = word.toUpperCase();
}

// Adaptive Canvas Logic
function setupCanvas() {
    const size = canvas.parentElement.clientWidth;
    canvas.width = size;
    canvas.height = size;
    ctx.lineCap = 'round';
    ctx.lineWidth = 6;
}

function draw(e) {
    if (!painting) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

canvas.addEventListener('mousedown', () => painting = true);
canvas.addEventListener('mouseup', () => { painting = false; ctx.beginPath(); });
canvas.addEventListener('mousemove', draw);
window.addEventListener('resize', setupCanvas);

setupCanvas();
nextWord();
function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }