// Wait for the DOM to load before starting the game
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SETUP GAME STATE ---
    const characters = {
        adam: { name: "Prof. Wagler", sprite: "sprites/Adam Sprite.png" },
        stamm: { name: "Prof. Stamm", sprite: "sprites/Stamm Sprite.png" },
        rick: { name: "Prof. Alloway", sprite: "sprites/Rick Sprite.png" },
        alan: { name: "Prof. Eno", sprite: "sprites/Alan Sprite.png" },
        doleman: { name: "Prof. Doleman", sprite: "sprites/doleman sprite.png" }, // Check this filename!
        fischer: { name: "Prof. Fischer", sprite: "sprites/Fischer Sprite.png" },
        kristian: { name: "Prof. Anderson", sprite: "sprites/Kristian Sprite.png" }, 
        shoun: { name: "Prof. Hill", sprite: "sprites/Shoun Sprite.png" },
        shrader: { name: "Prof. Shrader", sprite: "sprites/Shrader Sprite.png" },
        waite: { name: "Prof. Waite", sprite: "sprites/Waite Sprite.png" },
        narrator: { name: "", sprite: "" } 
    };

    const backgrounds = {
        campus_exterior: "sprites/backgrounds/campus_exterior.png",
        main_hallway: "sprites/backgrounds/campus_exterior.png",
        classroom: "sprites/backgrounds/classroom.png",
        cafe_patio: "sprites/backgrounds/cafe_patio.png",
        production_studio: "sprites/backgrounds/production_studio.png",
        control_room_wide: "sprites/backgrounds/control_room_wide.png",
        control_room_close: "sprites/backgrounds/control_room_close.png",
        your_office: "sprites/backgrounds/cafe_patio.png", // Using cafe patio as a placeholder for now
        lab: "sprites/backgrounds/control_room_close.png" // Placeholder for Eno/Doleman's lab
    };

    let affection = {
        adam: 0,
        stamm: 0,
        rick: 0,
        alan: 0,
        doleman: 0,
        fischer: 0,
        kristian: 0,
        shoun: 0,
        shrader: 0,
        waite: 0
    };

    let currentScene = "start";

    // --- 2. GET HTML ELEMENTS ---
    const speakerName = document.getElementById('speaker-name');
    const dialogueText = document.getElementById('dialogue-text');
    const choicesContainer = document.getElementById('choices-container');
    const spriteImage = document.getElementById('character-sprite');
    const backgroundImageContainer = document.getElementById('background-image-container');


    // --- 3. GAME LOGIC FUNCTIONS ---
    function showScene(sceneId) {
        const scene = story[sceneId];
        if (!scene) {
            console.error(`Scene "${sceneId}" not found!`);
            return;
        }
        currentScene = sceneId;

        if (scene.background) {
            backgroundImageContainer.style.backgroundImage = `url('${backgrounds[scene.background]}')`;
        }

        spriteImage.classList.remove('visible');
        
        setTimeout(() => {
            if (scene.character && scene.character !== "narrator") { 
                const char = characters[scene.character];
                speakerName.textContent = char.name;
                spriteImage.src = char.sprite;
                spriteImage.classList.add('visible');
            } else {
                speakerName.textContent = "";
                spriteImage.src = ""; 
            }
        }, 500); 

        dialogueText.textContent = scene.dialogue;
        choicesContainer.innerHTML = '';

        if (scene.choices) {
            scene.choices.forEach(choice => {
                const button = document.createElement('button');
                button.textContent = choice.text;
                button.className = 'choice-button';
                button.onclick = () => handleChoice(choice);
                choicesContainer.appendChild(button);
            });
        } else if (scene.nextScene) { // This allows for linear, non-choice dialogue
            const button = document.createElement('button');
            button.textContent = "Continue...";
            button.className = 'choice-button';
            button.onclick = () => showScene(scene.nextScene);
            choicesContainer.appendChild(button);
        } else {
            // If no choices and no nextScene, it's an end point.
            const button = document.createElement('button');
            button.textContent = "Restart Demo";
            button.className = 'choice-button';
            button.onclick = () => showScene('start');
            choicesContainer.appendChild(button);
        }
    }

    function handleChoice(choice) {
        // Updated to handle multiple affection changes from one choice
        if (choice.affection) {
            // Check if it's a single affection object or an array
            if (Array.isArray(choice.affection)) {
                choice.affection.forEach(aff => {
                    affection[aff.character] += aff.points;
                    console.log(`Affection for ${aff.character} is now ${affection[aff.character]}`);
                });
            } else {
                // Handle as a single object (backward compatibility)
                const char = choice.affection.character;
                const points = choice.affection.points;
                affection[char] += points;
                console.log(`Affection for ${char} is now ${affection[char]}`); 
            }
        }

        if (choice.nextScene) {
            showScene(choice.nextScene);
        } else {
            console.error("Choice has no nextScene!");
        }
    }

    // --- 4. THE STORY ---
    // UPDATED with Day 1 fixes, Day 2, Day 3, Day 4, and Day 5
    const story = {
        // --- DAY 1: THE TOUR ---
        "start": {
            character: "narrator",
            background: "campus_exterior",
            dialogue: "It's your first day as a new professor at the esteemed College of Journalism and Mass Communications. A fresh start.",
            choices: [
                { text: "Take a deep breath and head inside.", nextScene: "arrive_department" }
            ]
        },
        "arrive_department": {
            character: "narrator",
            background: "classroom",
            dialogue: "You step into the bustling main hallway of the department. The air buzzes with student chatter and the faint scent of coffee. A friendly face approaches.",
            choices: [
                { text: "Smile and greet them.", nextScene: "meet_fischer_prof" }
            ]
        },
        "meet_fischer_prof": {
            character: "fischer",
            background: "classroom",
            dialogue: "Welcome, Professor! You must be our new hire. I'm Ken Fischer, one of the resident 'old guards' around here. Thrilled to have you!",
            choices: [
                { text: "It's great to be here, Professor Fischer! Thanks for the warm welcome.", affection: { character: "fischer", points: 1 }, nextScene: "fischer_tour_intro" },
                { text: "Thanks. Just hoping I can find my office without getting lost.", affection: { character: "fischer", points: -1 }, nextScene: "fischer_tour_intro" }
            ]
        },
        "fischer_tour_intro": {
            character: "fischer",
            background: "classroom",
            dialogue: "No worries there, I'm here to guide you! First, let's swing by the main classroom. It's usually busy with a class.",
            nextScene: "classroom_intro"
        },
        "classroom_intro": {
            character: "narrator",
            background: "classroom",
            dialogue: "Inside a large, modern classroom, students are busy. Professor Stamm is animatedly leading a discussion.",
            nextScene: "meet_stamm_prof"
        },
        "meet_stamm_prof": {
            character: "stamm",
            background: "classroom",
            dialogue: "(Stamm notices you) Ah, the new blood! Welcome! Jason Stamm, digital media. Don't mind us, just dissecting the latest viral campaign. What's your take on influencer marketing?",
            choices: [
                { text: "It's a powerful tool, but authenticity is key to avoid backlash.", affection: { character: "stamm", points: 1 }, nextScene: "fischer_tour_studio" },
                { text: "Honestly, it often feels a bit superficial to me.", affection: { character: "stamm", points: -1 }, nextScene: "fischer_tour_studio" }
            ]
        },
        "fischer_tour_studio": {
            character: "fischer",
            background: "classroom",
            dialogue: "Stamm certainly keeps things lively! Now, let's head to our crown jewel: the production studio. Always something happening there.",
            nextScene: "studio_entrance"
        },
        "studio_entrance": {
            character: "narrator",
            background: "production_studio",
            dialogue: "You enter a professional studio. Professor Alloway is overseeing students, and Professor Anderson is prepping a camera.",
            choices: [
                { text: "Introduce yourself to Professor Alloway.", nextScene: "meet_rick_prof" },
                { text: "Approach Professor Anderson.", nextScene: "meet_kristian_prof" }
            ]
        },
        "meet_rick_prof": {
            character: "rick",
            background: "production_studio",
            dialogue: "Greetings, Professor! Rick Alloway, broadcasting. We're prepping for the evening news segment. Ever worked in a studio environment before?",
            choices: [
                { text: "Yes, I have some experience. It's exhilarating!", affection: { character: "rick", points: 1 }, nextScene: "kristian_observes" },
                { text: "Not really, but I'm eager to learn.", affection: { character: "rick", points: 0 }, nextScene: "kristian_observes" }
            ]
        },
        "kristian_observes": {
            character: "kristian",
            background: "production_studio",
            dialogue: "(Prof. Anderson nods to you) Welcome to the team, Professor. I'm Kristian Anderson. Great to have another pro on board.",
            choices: [
                { text: "It's great to meet you, Professor Anderson.", affection: { character: "kristian", points: 1 }, nextScene: "fischer_tour_control" },
            ]
        },
        "meet_kristian_prof": {
            character: "kristian",
            background: "production_studio",
            dialogue: "Hey! You're the new faculty, right? Kristian Anderson. I teach sports media and production. Welcome to the madness!",
            choices: [
                { text: "Glad to be here! Looks like you have a great setup.", affection: { character: "kristian", points: 1 }, nextScene: "rick_observes" },
                { text: "It... certainly looks busy.", affection: { character: "kristian", points: 0 }, nextScene: "rick_observes" }
            ]
        },
        "rick_observes": {
            character: "rick",
            background: "production_studio",
            dialogue: "(Prof. Alloway nods) New faculty, excellent. Rick Alloway. Welcome to the controlled chaos.",
            choices: [
                { text: "Happy to be part of it, Professor.", affection: { character: "rick", points: 1 }, nextScene: "fischer_tour_control" }
            ]
        },
        "fischer_tour_control": {
            character: "fischer",
            background: "production_studio",
            dialogue: "Next, we'll pop into the control room. It's the brains behind the brawn.",
            nextScene: "control_room_intro"
        },
        "control_room_intro": {
            character: "narrator",
            background: "control_room_wide",
            dialogue: "The control room is a wall of monitors. Professor Wagler is intensely focused on an editing suite, while Professor Hill is calmly making adjustments.",
            choices: [
                { text: "Approach Professor Wagler.", nextScene: "meet_adam_prof" },
                { text: "Approach Professor Hill.", nextScene: "meet_shoun_prof" }
            ]
        },
        "meet_adam_prof": {
            character: "adam",
            background: "control_room_close", 
            dialogue: "(Without looking up) ...if I just tweak this gamma... Oh, new professor. Adam Wagler, video. Try not to touch any buttons.",
            choices: [
                { text: "(Laugh) Understood. Impressive setup!", affection: { character: "adam", points: 1 }, nextScene: "shoun_observes" },
                { text: "I think I know how to use a keyboard, Professor.", affection: { character: "adam", points: -1 }, nextScene: "shoun_observes" }
            ]
        },
        "shoun_observes": {
            character: "shoun",
            background: "control_room_close", 
            dialogue: "(Shoun looks up) Don't mind Professor Wagler, he lives for perfection. Shoun Hill, multimedia. Welcome.",
            choices: [
                { text: "It's good to meet you, Professor Hill. This room is amazing.", affection: { character: "shoun", points: 1 }, nextScene: "fischer_tour_cafe" },
            ]
        },
        "meet_shoun_prof": {
            character: "shoun",
            background: "control_room_wide",
            dialogue: "(Shoun offers a calm, friendly smile) Welcome to the heart of our media operations. I'm Shoun Hill, multimedia. It's a pleasure.",
            choices: [
                { text: "The pleasure's mine. This is an incredible facility!", affection: { character: "shoun", points: 1 }, nextScene: "adam_observes" },
            ]
        },
        "adam_observes": {
            character: "adam",
            background: "control_room_wide",
            dialogue: "(Adam grunts from his station) Just don't bump anything.",
            choices: [
                { text: "Noted!", affection: { character: "adam", points: 0 }, nextScene: "fischer_tour_cafe" }
            ]
        },
        "fischer_tour_cafe": {
            character: "fischer",
            background: "control_room_wide",
            dialogue: "Alright, let's get some fresh air. Time for the faculty cafe and patio.",
            nextScene: "cafe_patio_intro"
        },
        "cafe_patio_intro": {
            character: "narrator",
            background: "cafe_patio",
            dialogue: "The cafe patio is bright and open. You see Professor Shrader laughing loudly, and Professor Waite meticulously organizing papers.",
            choices: [
                { text: "Go talk to the boisterous Professor Shrader.", nextScene: "meet_shrader_prof" },
                { text: "Approach the focused Professor Waite.", nextScene: "meet_waite_prof" }
            ]
        },
        "meet_shrader_prof": {
            character: "shrader",
            background: "cafe_patio",
            dialogue: "(Shrader turns) Look who it is! Our newest addition! John Shrader, sports media. Welcome to the best department on campus! Grab a coffee!",
            choices: [
                { text: "Great to meet you! You certainly bring the energy!", affection: { character: "shrader", points: 1 }, nextScene: "waite_observes" },
                { text: "Thanks. I'm more of a quiet observer myself.", affection: { character: "shrader", points: -1 }, nextScene: "waite_observes" }
            ]
        },
        "waite_observes": {
            character: "waite",
            background: "cafe_patio",
            dialogue: "(Waite looks up) Matt Waite, new media. Welcome. Just trying to finalize my syllabus. Deadlines, you know.",
            choices: [
                { text: "I understand completely. Deadlines never end.", affection: { character: "waite", points: 1 }, nextScene: "fischer_tour_lab" },
            ]
        },
        "meet_waite_prof": {
            character: "waite",
            background: "cafe_patio",
            dialogue: "Ah, the new professor. Matt Waite, new media. Welcome. I'm just trying to make sense of the latest university policy update. A never-ending battle.",
            choices: [
                { text: "I'm sure I'll learn that quickly. Thanks for the heads up.", affection: { character: "waite", points: 1 }, nextScene: "shrader_observes" },
            ]
        },
        "shrader_observes": {
            character: "shrader",
            background: "cafe_patio",
            dialogue: "(Shrader winks) Don't listen to Matt! It's not *all* paperwork. There's plenty of fun too!",
            choices: [
                { text: "I hope so!", nextScene: "fischer_tour_lab" }
            ]
        },
        "fischer_tour_lab": {
            character: "fischer",
            background: "cafe_patio",
            dialogue: "Just a couple more stops. I want you to meet Professors Eno and Doleman. They're in the new Digital Innovation Lab.",
            nextScene: "lab_intro"
        },
        "lab_intro": {
            character: "narrator",
            background: "lab",
            dialogue: "Fischer leads you to a room full of VR headsets. Professor Eno is tinkering with a gadget, and Professor Doleman is reviewing a script.",
            choices: [
                { text: "Approach Professor Eno.", nextScene: "meet_alan_prof" },
                { text: "Approach Professor Doleman.", nextScene: "meet_doleman_prof" }
            ]
        },
        "meet_alan_prof": {
            character: "alan",
            background: "lab",
            dialogue: "Oh, hi! You're the new hire! Awesome. I'm Alan Eno. I teach... well, all the weird stuff. VR, AR, game design. You into gaming?",
            choices: [
                { text: "I dabble! Mostly indie games. What are you working on?", affection: { character: "alan", points: 1 }, nextScene: "doleman_observes" },
                { text: "Not really, but I'm fascinated by the technology.", affection: { character: "alan", points: 0 }, nextScene: "doleman_observes" }
            ]
        },
        "doleman_observes": {
            character: "doleman",
            background: "lab",
            dialogue: "(Prof. Doleman looks up and smiles) Bill Doleman. Professor of Practice. Don't let Alan's toys fool you, we get real work done here. Welcome.",
            choices: [
                { text: "A pleasure to meet you both. 'Professor of Practice'?", affection: { character: "doleman", points: 1 }, nextScene: "doleman_explains" }
            ]
        },
        "meet_doleman_prof": {
            character: "doleman",
            background: "lab",
            dialogue: "Ah, the new arrival. Bill Doleman. I'm a Professor of Practice here. It's a pleasure to have you. Welcome to the team.",
            choices: [
                { text: "It's an honor, Professor. What does a 'Professor of Practice' focus on?", affection: { character: "doleman", points: 1 }, nextScene: "doleman_explains" },
            ]
        },
        "doleman_explains": {
            character: "doleman",
            background: "lab",
            dialogue: "It means I spent 30 years in the field—in my case, broadcasting—before coming here to teach. I try to bring that real-world experience.",
            choices: [
                { text: "That's an incredible asset for the students.", affection: { character: "doleman", points: 1 }, nextScene: "alan_chimes_in" }
            ]
        },
        "alan_chimes_in": {
            character: "alan",
            background: "lab",
            dialogue: "See? He handles the 'real' world, I handle the 'virtual' one! (He winks) I'm Alan Eno, by the way. Welcome!",
            choices: [
                { text: "A perfect balance! Great to meet you, Professor Eno.", affection: { character: "alan", points: 1 }, nextScene: "fischer_office_final" }
            ]
        },
        "fischer_office_final": {
            character: "fischer",
            background: "lab",
            dialogue: "Right then, Professor. That's everyone! Your office is just down the hall. I'll let you get settled. My door's always open!",
            choices: [
                { text: "Thanks again for the excellent tour, Professor Fischer!", nextScene: "day_1_your_office" }
            ]
        },
        "day_1_your_office": {
            character: "narrator",
            background: "your_office",
            dialogue: "You finally arrive at your own office. A blank canvas, ready for your academic journey. You unpack a few things as the day winds down.",
            nextScene: "day_2_start" 
        },

        // --- DAY 2: THE FACULTY MEETING ---
        "day_2_start": {
            character: "narrator",
            background: "your_office",
            dialogue: "It's the morning of your second day. You grab a coffee and head to your first official faculty meeting. You get the feeling this will be... illuminating.",
            nextScene: "day_2_faculty_meeting"
        },
        "day_2_faculty_meeting": {
            character: "narrator",
            background: "classroom",
            dialogue: "You take a seat in the classroom. Most of the faculty are here. Professor Waite is at the front, tapping his laptop impatiently.",
            nextScene: "day_2_waite_starts"
        },
        "day_2_waite_starts": {
            character: "waite",
            background: "classroom",
            dialogue: "Alright, people, let's get started. We have 14 items on the agenda. First up: the new curriculum proposal for...",
            nextScene: "day_2_stamm_interrupts"
        },
        "day_2_stamm_interrupts": {
            character: "stamm",
            background: "classroom",
            dialogue: "Hold on, Matt. Before we get into the weeds, I think we need to address the elephant in the room: our college's web *branding*. It's a disaster!",
            nextScene: "day_2_shrader_joke"
        },
        "day_2_shrader_joke": {
            character: "shrader",
            background: "classroom",
            dialogue: "(Laughing) The only elephant in the room, Jason, is the 'N' logo on Kristian's jacket over there! Kidding, kidding! But he's right, the site is ugly.",
            nextScene: "day_2_waite_annoyed"
        },
        "day_2_waite_annoyed": {
            character: "waite",
            background: "classroom",
            dialogue: "(Sighs) That is item *seven*, Jason. 'Digital Outreach.' We will get to it. Now, about the curriculum... I see our new professor is here. Welcome. What are your initial thoughts on the syllabus integration?",
            choices: [
                { text: "Side with Stamm: 'Actually, I agree. A strong brand is the foundation.'", affection: [{ character: "stamm", points: 2 }, { character: "waite", points: -1 }], nextScene: "day_2_convo_stamm" },
                { text: "Side with Waite: 'I'm happy to discuss the syllabus. Branding can wait.'", affection: [{ character: "waite", points: 2 }, { character: "stamm", points: -1 }], nextScene: "day_2_convo_waite" },
                { text: "Side with Shrader: 'I'm just trying to learn where the coffee machine is!'", affection: [{ character: "shrader", points: 2 }, { character: "waite", points: -1 }], nextScene: "day_2_convo_shrader" },
                { text: "Offer a neutral, technical point.", affection: [{ character: "adam", points: 1 }, { character: "rick", points: 1 }], nextScene: "day_2_convo_neutral" }
            ]
        },
        "day_2_convo_stamm": {
            character: "stamm",
            background: "classroom",
            dialogue: "See? Thank you! A fresh perspective! (He beams at you). Matt, we need to table this and talk *vision*.",
            nextScene: "day_2_end"
        },
        "day_2_convo_waite": {
            character: "waite",
            background: "classroom",
            dialogue: "Thank you. (He gives you a grateful nod). As I was saying, the syllabus for JOMC 101...",
            nextScene: "day_2_end"
        },
        "day_2_convo_shrader": {
            character: "shrader",
            background: "classroom",
            dialogue: "(Shrader barks a laugh) Ha! I like this one! Don't worry, Professor, I'll show you the good coffee machine after this.",
            nextScene: "day_2_end"
        },
        "day_2_convo_neutral": {
            character: "adam",
            background: "classroom",
            dialogue: "(From the back, Prof. Wagler speaks up) 'That's a valid technical point.' (Prof. Alloway nods in agreement).",
            nextScene: "day_2_end"
        },
        "day_2_end": {
            character: "narrator",
            background: "classroom",
            dialogue: "The meeting continues for another... two hours. You learn a lot about the faculty's personalities. As it breaks up, you head back to your office.",
            nextScene: "day_3_start"
        },

        // --- DAY 3: THE PROJECT ---
        "day_3_start": {
            character: "narrator",
            background: "your_office",
            dialogue: "It's the start of your third day. You're finally getting your bearings. As you're planning your week, there's a knock on your door.",
            nextScene: "day_3_shoun_visit"
        },
        "day_3_shoun_visit": {
            character: "shoun",
            background: "your_office",
            dialogue: "Professor. How are you settling in? I hope yesterday's meeting didn't scare you off.",
            choices: [
                { text: "It was... intense. But I survived.", affection: { character: "shoun", points: 1 }, nextScene: "day_3_shoun_explains" },
                { text: "I've seen worse. It's all part of the process, right?", affection: { character: "shoun", points: 1 }, nextScene: "day_3_shoun_explains" }
            ]
        },
        "day_3_shoun_explains": {
            character: "shoun",
            background: "your_office",
            dialogue: "That's the spirit. Listen, I'm here because I'm leading the new inter-departmental multimedia project. I was hoping you'd be a key part of it.",
            nextScene: "day_3_shoun_explains_2"
        },
        "day_3_shoun_explains_2": {
            character: "shoun",
            background: "your_office",
            dialogue: "Professor Wagler is... *passionate* about the technical specs. He's in the control room now. Or, we could grab a coffee and discuss the 'vibe' of it all.",
            choices: [
                { text: "I should talk to Prof. Wagler. Best to get the specs right.", nextScene: "day_3_meet_adam" },
                { text: "Coffee sounds great. I'd love to hear your take on the 'vibe.'", nextScene: "day_3_meet_shoun" }
            ]
        },
        "day_3_meet_adam": {
            character: "narrator",
            background: "control_room_close",
            dialogue: "You head to the control room. Professor Wagler is exactly where you saw him last, squinting at a monitor.",
            nextScene: "day_3_adam_convo"
        },
        "day_3_adam_convo": {
            character: "adam",
            background: "control_room_close",
            dialogue: "What? Oh. You. Shoun's project? Look, I *need* 4K, 10-bit, 4:2:2 files, or this whole thing is a waste of time. Can you deliver that?",
            choices: [
                { text: "Absolutely. I live for high-end specs.", affection: { character: "adam", points: 2 }, nextScene: "day_3_adam_end" },
                { text: "Isn't that... massive overkill for a web project?", affection: { character: "adam", points: -2 }, nextScene: "day_3_adam_end_bad" },
                { text: "I'll do my best to match the quality standards, Professor.", affection: { character: "adam", points: 1 }, nextScene: "day_3_adam_end" }
            ]
        },
        "day_3_adam_end": {
            character: "adam",
            background: "control_room_close",
            dialogue: "Good. Finally, someone who gets it. Just... don't mess it up.",
            nextScene: "day_3_end"
        },
        "day_3_adam_end_bad": {
            character: "adam",
            background: "control_room_close",
            dialogue: "'Overkill'? (He scoffs) 'Overkill' is why our work wins awards, Professor. Maybe you're not ready for this project.",
            nextScene: "day_3_end"
        },
        "day_3_meet_shoun": {
            character: "narrator",
            background: "cafe_patio",
            dialogue: "You meet Professor Hill at the cafe patio. He hands you a coffee.",
            nextScene: "day_3_shoun_convo"
        },
        "day_3_shoun_convo": {
            character: "shoun",
            background: "cafe_patio",
            dialogue: "See? Better, right? Adam... he sees the pixels. I'm more interested in the picture. This project needs a *soul*, you know? Not just high-resolution.",
            choices: [
                { text: "I completely agree. Story over specs, always.", affection: { character: "shoun", points: 2 }, nextScene: "day_3_shoun_end" },
                { text: "But surely the specs matter for the *quality* of the story?", affection: { character: "shoun", points: -1 }, nextScene: "day_3_shoun_end_bad" },
                { text: "The challenge is balancing both, right?", affection: { character: "shoun", points: 1 }, nextScene: "day_3_shoun_end" }
            ]
        },
        "day_3_shoun_end": {
            character: "shoun",
            background: "cafe_patio",
            dialogue: "(He smiles) Exactly. I think we're going to work well together, Professor.",
            nextScene: "day_3_end"
        },
        "day_3_shoun_end_bad": {
            character: "shoun",
            background: "cafe_patio",
            dialogue: "(His smile fades slightly) Yes, of course. But... don't lose the message in the medium. Just a thought.",
            nextScene: "day_3_end"
        },
        "day_3_end": {
            character: "narrator",
            background: "your_office",
            dialogue: "You head back to your office, your first big project secured. You've made some progress and are starting to understand your colleagues.",
            nextScene: "day_4_start"
        },

        // --- DAY 4: THE HUB CHOICE ---
        "day_4_start": {
            character: "narrator",
            background: "your_office",
            dialogue: "It's Thursday morning. Your first week is almost over. You've got some free time before your afternoon class. What's the plan?",
            choices: [
                { text: "Head to the Studio. See what the broadcast folks are up to.", nextScene: "day_4_choice_studio" },
                { text: "Go to the Faculty Patio. It's a nice day for a coffee.", nextScene: "day_4_choice_patio" },
                { text: "Check the Digital Innovation Lab. See what Eno is tinkering with.", nextScene: "day_4_choice_lab" }
            ]
        },
        // --- Day 4, Path 1: Studio ---
        "day_4_choice_studio": {
            character: "narrator",
            background: "production_studio",
            dialogue: "You walk into the studio and find Professor Shrader and Professor Anderson in a... *spirited* debate over a highlight reel.",
            nextScene: "day_4_studio_shrader"
        },
        "day_4_studio_shrader": {
            character: "shrader",
            background: "production_studio",
            dialogue: "Kristian, I'm TELLING you! You can't cut away from the action to show the coach! The *ball* is the story! (He turns to you) New prof! Back me up here!",
            nextScene: "day_4_studio_kristian"
        },
        "day_4_studio_kristian": {
            character: "kristian",
            background: "production_studio",
            dialogue: "Professor, with all due respect, the *emotion* is the story. The coach's reaction *is* the story. (He also looks at you) What do you think, Professor?",
            choices: [
                { text: "I'm with Prof. Shrader. In sports, you follow the ball. Period.", affection: [{ character: "shrader", points: 2 }, { character: "kristian", points: -1 }], nextScene: "day_4_end_scene" },
                { text: "I have to agree with Prof. Anderson. The human drama is what sells.", affection: [{ character: "kristian", points: 2 }, { character: "shrader", points: -1 }], nextScene: "day_4_end_scene" },
                { text: "Can't you just use a picture-in-picture? Show both.", affection: [{ character: "shrader", points: 1 }, { character: "kristian", points: 1 }], nextScene: "day_4_end_scene" }
            ]
        },
        // --- Day 4, Path 2: Patio ---
        "day_4_choice_patio": {
            character: "narrator",
            background: "cafe_patio",
            dialogue: "You head to the patio and find Professor Stamm and Professor Waite at a table. Stamm looks like he's about to explode.",
            nextScene: "day_4_patio_stamm"
        },
        "day_4_patio_stamm": {
            character: "stamm",
            background: "cafe_patio",
            dialogue: "I'm telling you, Matt, it's *criminal*! The university just spent thousands on a new branding guide and they're recommending... *Comic Sans* for 'informal' emails! Comic Sans!",
            nextScene: "day_4_patio_waite"
        },
        "day_4_patio_waite": {
            character: "waite",
            background: "cafe_patio",
            dialogue: "(He sips his coffee) Jason, it's a *guideline* for *accessibility*. The data shows it's highly legible for dyslexic readers. It's not about your artistic sensibilities.",
            choices: [
                { text: "I'm with Stamm. Comic Sans is a design travesty. There are other accessible fonts.", affection: [{ character: "stamm", points: 2 }, { character: "waite", points: -1 }], nextScene: "day_4_end_scene" },
                { text: "I have to side with Waite. If the data supports it for accessibility, that trumps aesthetics.", affection: [{ character: "waite", points: 2 }, { character: "stamm", points: -1 }], nextScene: "day_4_end_scene" },
                { text: "You're both just lucky you're not forced to use Papyrus.", affection: [{ character: "stamm", points: 1 }, { character: "waite", points: 1 }], nextScene: "day_4_end_scene" }
            ]
        },
        // --- Day 4, Path 3: Lab ---
        "day_4_choice_lab": {
            character: "narrator",
            background: "lab",
            dialogue: "You pop into the Innovation Lab. Professor Eno is wearing a VR headset, and Professor Doleman is watching him, looking amused.",
            nextScene: "day_4_lab_alan"
        },
        "day_4_lab_alan": {
            character: "alan",
            background: "lab",
            dialogue: "(He pulls the headset off) Whoa. You gotta try this, Bill. It's a simulation of the '62 World Series! (He sees you) Oh, hey! You're next! I'm trying to convince Prof. Doleman that this is the future of sports journalism.",
            nextScene: "day_4_lab_doleman"
        },
        "day_4_lab_doleman": {
            character: "doleman",
            background: "lab",
            dialogue: "(He chuckles) I've been in a *real* press box, Alan. It has the smell of stale coffee and hot dogs. This has... pixels. What do you think, Professor? Is this the future, or a gimmick?",
            choices: [
                { text: "It's the future, Prof. Doleman. Immersive storytelling is the next frontier.", affection: [{ character: "alan", points: 2 }, { character: "doleman", points: -1 }], nextScene: "day_4_end_scene" },
                { text: "It's a fun gimmick, Prof. Eno, but I agree with Prof. Doleman. You can't replace being there.", affection: [{ character: "doleman", points: 2 }, { character: "alan", points: -1 }], nextScene: "day_4_end_scene" },
                { text: "It's a tool, like any other. It'll find its place, but it won't *replace* the press box.", affection: [{ character: "alan", points: 1 }, { character: "doleman", points: 1 }], nextScene: "day_4_end_scene" }
            ]
        },
        // --- Day 4 End ---
        "day_4_end_scene": {
            character: "narrator",
            background: "your_office",
            dialogue: "That was an... interesting diversion. You make a mental note of the conversation and head back to your office to prep for class.",
            nextScene: "day_5_start"
        },

        // --- DAY 5: THE 1-on-1 ---
        "day_5_start": {
            character: "narrator",
            background: "your_office",
            dialogue: "It's Friday afternoon. Your last class is done. You have some time and you were thinking of connecting with a colleague.",
            choices: [
                { text: "Ask Professor Alloway for some broadcasting advice.", nextScene: "day_5_choice_rick" },
                { text: "See what Professor Fischer is up to.", nextScene: "day_5_choice_fischer" },
                { text: "Compare notes on the curriculum with Professor Eno.", nextScene: "day_5_choice_alan" }
            ]
        },
        // --- Day 5, Path 1: Rick ---
        "day_5_choice_rick": {
            character: "narrator",
            background: "production_studio",
            dialogue: "You find Professor Alloway in the studio, coiling a cable. He smiles warmly as you approach.",
            nextScene: "day_5_rick_1"
        },
        "day_5_rick_1": {
            character: "rick",
            background: "production_studio",
            dialogue: "Professor! Good to see you. How's the first week treating you? Found all the squeaky chairs and bad coffee spots?",
            choices: [
                { text: "It's been a whirlwind, but I'm loving it. I was hoping to get your take on something.", affection: { character: "rick", points: 1 }, nextScene: "day_5_rick_2" },
                { text: "Just trying to survive, Professor. This place is... a lot.", affection: { character: "rick", points: -1 }, nextScene: "day_5_rick_2" }
            ]
        },
        "day_5_rick_2": {
            character: "rick",
            background: "production_studio",
            dialogue: "I hear you. (He gestures to a stool) Ask away. I'm all ears.",
            choices: [
                { text: "What's the one piece of advice you'd give a new professor here?", nextScene: "day_5_rick_3" },
                { text: "How do you keep up with all the new technology? It's overwhelming.", nextScene: "day_5_rick_3" }
            ]
        },
        "day_5_rick_3": {
            character: "rick",
            background: "production_studio",
            dialogue: "(He thinks for a moment) Don't... get so caught up in the 'new' that you forget the 'good'. Tech changes. Good storytelling doesn't. Good ethics don't.",
            choices: [
                { text: "That's... really profound. Thank you.", affection: { character: "rick", points: 2 }, nextScene: "day_5_end_scene" },
                { text: "But what if the 'new' *is* the story?", affection: { character: "rick", points: 0 }, nextScene: "day_5_end_scene" }
            ]
        },
        // --- Day 5, Path 2: Fischer ---
        "day_5_choice_fischer": {
            character: "narrator",
            background: "classroom", // Placeholder for his office
            dialogue: "You find Professor Fischer's office. The door is open, and he's grading papers with a smile.",
            nextScene: "day_5_fischer_1"
        },
        "day_5_fischer_1": {
            character: "fischer",
            background: "classroom",
            dialogue: "Ah, come in, come in! Don't mind the mess. Just enjoying these student essays. You'd be surprised, they're pretty good!",
            choices: [
                { text: "It's great you're so positive about grading! I'm dreading it.", affection: { character: "fischer", points: 1 }, nextScene: "day_5_fischer_2" },
                { text: "A rare optimist, I see!", affection: { character: "fischer", points: 1 }, nextScene: "day_5_fischer_2" }
            ]
        },
        "day_5_fischer_2": {
            character: "fischer",
            background: "classroom",
            dialogue: "(He laughs) Someone has to be! But really, how are *you* doing? First week is always the hardest. You finding your place okay?",
            choices: [
                { text: "Honestly? It's a bit overwhelming. Everyone is... a character.", affection: { character: "fischer", points: 2 }, nextScene: "day_5_fischer_3" },
                { text: "I'm doing great! Everyone's been so welcoming.", affection: { character: "fischer", points: 1 }, nextScene: "day_5_fischer_3" }
            ]
        },
        "day_5_fischer_3": {
            character: "fischer",
            background: "classroom",
            dialogue: "They are that! (He winks) But don't you worry. You'll fit right in. You've got a good head on your shoulders. Just... don't let Stamm rope you into redesigning the website.",
            choices: [
                { text: "(Laugh) I'll try not to. Thanks, Professor.", affection: { character: "fischer", points: 1 }, nextScene: "day_5_end_scene" }
            ]
        },
        // --- Day 5, Path 3: Alan ---
        "day_5_choice_alan": {
            character: "narrator",
            background: "lab",
            dialogue: "You head to the Digital Lab, where Professor Eno is... not playing a game. He's staring at a complex curriculum chart.",
            nextScene: "day_5_alan_1"
        },
        "day_5_alan_1": {
            character: "alan",
            background: "lab",
            dialogue: "Oh, hey! Come in. Don't mind the... chaos. Just trying to figure out how to cram 'Advanced Game Ethics' and 'Procedural Rhetoric' into one semester.",
            choices: [
                { text: "'Procedural Rhetoric'? That sounds... intense.", affection: { character: "alan", points: 1 }, nextScene: "day_5_alan_2" },
                { text: "You're lucky. I'm stuck with the 'Intro to...' courses.", affection: { character: "alan", points: 0 }, nextScene: "day_5_alan_2" }
            ]
        },
        "day_5_alan_2": {
            character: "alan",
            background: "lab",
            dialogue: "Right? It's how games make arguments with their systems! But the curriculum committee... (he sighs) ...they just want more 'practical' skills. 'How to Use Unity.' They don't get the *why*.",
            choices: [
                { text: "The 'why' is everything! The philosophy *is* the practical skill.", affection: { character: "alan", points: 2 }, nextScene: "day_5_alan_3" },
                { text: "Well... they have a point. Students need jobs. 'Why' doesn't pay the bills.", affection: { character: "alan", points: -2 }, nextScene: "day_5_alan_3_bad" }
            ]
        },
        "day_5_alan_3": {
            character: "alan",
            background: "lab",
            dialogue: "YES! Exactly! You get it! Oh, that's a relief. I was worried I was the only one. We should co-teach a class!",
            choices: [
                { text: "I'd be honored, Professor!", affection: { character: "alan", points: 1 }, nextScene: "day_5_end_scene" }
            ]
        },
        "day_5_alan_3_bad": {
            character: "alan",
            background: "lab",
            dialogue: "Oh. Right. (He looks disappointed) Yeah, I guess. 'Jobs.' Well, I guess I should add a 'How to Get Hired' module.",
            choices: [
                { text: "I didn't mean it like that...", nextScene: "day_5_end_scene" }
            ]
        },
        // --- Day 5 End ---
        "day_5_end_scene": {
            character: "narrator",
            background: "your_office",
            dialogue: "You head home after a long, but productive, first week. You've made some connections and have a much better feel for the department. (End of Demo)",
            // No nextScene or choices will make the "Restart Demo" button appear.
        }
    };

    // --- 5. START THE GAME ---
    showScene('start');
});