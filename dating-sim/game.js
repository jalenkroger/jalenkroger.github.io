// Wait for the DOM to load before starting the game
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SETUP GAME STATE ---
    // Character sprites (paths remain the same as they are within the sprites folder)
    const characters = {
        adam: { name: "Prof. Wagler", sprite: "sprites/Adam Sprite.png" },
        stamm: { name: "Prof. Stamm", sprite: "sprites/Stamm Sprite.png" },
        rick: { name: "Prof. Alloway", sprite: "sprites/Rick Sprite.png" },
        alan: { name: "Prof. Eno", sprite: "sprites/Alan Sprite.png" },
        doleman: { name: "Dean Doleman", sprite: "sprites/doleman sprite.jpg" },
        fischer: { name: "Prof. Fischer", sprite: "sprites/Fischer Sprite.png" },
        kristian: { name: "Kristian", sprite: "sprites/Kristian Sprite.png" }, // Intern/TA
        shoun: { name: "Prof. Hill", sprite: "sprites/Shoun Sprite.png" },
        shrader: { name: "Prof. Shrader", sprite: "sprites/Shrader Sprite.png" },
        waite: { name: "Prof. Waite", sprite: "sprites/Waite Sprite.png" },
        narrator: { name: "", sprite: "" } // For no character on screen
    };

    // Background images
    /* * UPDATED: Paths are fixed to use the recommended descriptive names.
     * Your files MUST be named this and be in the 'sprites/backgrounds/' folder.
     */
    const backgrounds = {
        campus_exterior: "sprites/backgrounds/campus_exterior.png",
        main_hallway: "sprites/backgrounds/campus_exterior.png", // Using exterior as a placeholder for a hallway
        classroom: "sprites/backgrounds/classroom.png",
        cafe_patio: "sprites/backgrounds/cafe_patio.png",
        production_studio: "sprites/backgrounds/production_studio.png",
        control_room_wide: "sprites/backgrounds/control_room_wide.png",
        control_room_close: "sprites/backgrounds/control_room_close.png",
        dean_office: "sprites/backgrounds/classroom.png", // Using classroom as a placeholder for now
        your_office: "sprites/backgrounds/cafe_patio.png" // Using cafe patio as a placeholder for now
    };

    // This object will track our relationship progress
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

    // This tracks our current position in the story
    let currentScene = "start";

    // --- 2. GET HTML ELEMENTS ---
    const speakerName = document.getElementById('speaker-name');
    const dialogueText = document.getElementById('dialogue-text');
    const choicesContainer = document.getElementById('choices-container');
    const spriteImage = document.getElementById('character-sprite');
    const backgroundImageContainer = document.getElementById('background-image-container');


    // --- 3. GAME LOGIC FUNCTIONS ---

    // This function shows a new scene
    function showScene(sceneId) {
        // Get the scene data from our story object
        const scene = story[sceneId];
        currentScene = sceneId;

        // Change background image if specified
        if (scene.background) {
            backgroundImageContainer.style.backgroundImage = `url('${backgrounds[scene.background]}')`;
        }

        // Hide the old sprite, then show the new one
        spriteImage.classList.remove('visible');
        
        setTimeout(() => {
            if (scene.character && scene.character !== "narrator") { // Only show sprite for actual characters
                const char = characters[scene.character];
                speakerName.textContent = char.name;
                spriteImage.src = char.sprite;
                spriteImage.classList.add('visible');
            } else {
                // Hide speaker name and sprite for narrator/scene descriptions
                speakerName.textContent = "";
                spriteImage.src = ""; // Clear sprite
            }
        }, 500); // 0.5s delay matches the CSS transition

        // Update dialogue
        dialogueText.textContent = scene.dialogue;

        // Clear old choices
        choicesContainer.innerHTML = '';

        // Create and show new choices
        if (scene.choices) {
            scene.choices.forEach(choice => {
                const button = document.createElement('button');
                button.textContent = choice.text;
                button.className = 'choice-button';
                button.onclick = () => handleChoice(choice);
                choicesContainer.appendChild(button);
            });
        } else {
            // If no choices, allow clicking to continue (for linear dialogue)
            const continueButton = document.createElement('button');
            continueButton.textContent = "Continue...";
            continueButton.className = 'choice-button';
            continueButton.onclick = () => {
                if (scene.nextScene) {
                    showScene(scene.nextScene);
                } else {
                    console.log("End of game/scene path. Implement game over or loop back.");
                    showScene("start_day_2"); // Loop back to start of a new day for now
                }
            };
            choicesContainer.appendChild(continueButton);
        }
    }

    // This function handles a player's choice
    function handleChoice(choice) {
        // Add affection points if any
        if (choice.affection) {
            const char = choice.affection.character;
            const points = choice.affection.points;
            affection[char] += points;
            console.log(`Affection for ${char} is now ${affection[char]}`); // For debugging
        }

        // Move to the next scene
        showScene(choice.nextScene);
    }

    // --- 4. THE STORY ---
    // (The story object is unchanged from the previous step)
    const story = {
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
            background: "classroom", // Placeholder for a generic hallway
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
            choices: [
                { text: "Lead the way!", nextScene: "classroom_intro" }
            ]
        },
        "classroom_intro": {
            character: "narrator",
            background: "classroom",
            dialogue: "Inside a large, modern classroom, students are busy. Professor Stamm is animatedly leading a discussion.",
            choices: [
                { text: "Observe for a moment.", nextScene: "meet_stamm_prof" }
            ]
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
            choices: [
                { text: "Sounds exciting!", nextScene: "studio_entrance" }
            ]
        },
        "studio_entrance": {
            character: "narrator",
            background: "production_studio",
            dialogue: "You enter a professional studio with cameras, lights, and a green screen. Professor Alloway is overseeing some students, while Kristian is helping set up equipment.",
            choices: [
                { text: "Introduce yourself to Professor Alloway.", nextScene: "meet_rick_prof" },
                { text: "Say hello to the student helping out (Kristian).", nextScene: "meet_kristian_student" }
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
            dialogue: "(Kristian nods to you respectfully) Welcome, Professor. I'm Kristian, a student TA. Professor Alloway is a master in here.",
            choices: [
                { text: "It's clear he is. Glad to meet you, Kristian.", affection: { character: "kristian", points: 1 }, nextScene: "fischer_tour_control" },
                { text: "Thanks. (You turn back to Fischer)", nextScene: "fischer_tour_control" }
            ]
        },
        "meet_kristian_student": {
            character: "kristian",
            background: "production_studio",
            dialogue: "Hey Professor! I'm Kristian, I'm a student TA helping Professor Alloway. Can I help you with anything?",
            choices: [
                { text: "Just getting the tour, but thanks! Great to meet a helpful student.", affection: { character: "kristian", points: 1 }, nextScene: "meet_rick_prof_2" },
                { text: "No thanks, I'm just looking.", affection: { character: "kristian", points: -1 }, nextScene: "meet_rick_prof_2" }
            ]
        },
        "meet_rick_prof_2": {
            character: "rick",
            background: "production_studio",
            dialogue: "(Alloway nods) New faculty, excellent. Rick Alloway. Welcome to the controlled chaos.",
            choices: [
                { text: "Chaos is my middle name!", affection: { character: "rick", points: 1 }, nextScene: "fischer_tour_control" },
                { text: "Just trying to survive my first day, Professor.", nextScene: "fischer_tour_control" }
            ]
        },
        "fischer_tour_control": {
            character: "fischer",
            background: "production_studio",
            dialogue: "Next, we'll pop into the control room. It's the brains behind the brawn.",
            choices: [
                { text: "Sounds complex!", nextScene: "control_room_intro" }
            ]
        },
        "control_room_intro": {
            character: "narrator",
            background: "control_room_wide",
            dialogue: "The control room is a wall of monitors and blinking lights. Professor Wagler is deeply focused on an editing suite, while Professor Hill is calmly making adjustments.",
            choices: [
                { text: "Approach Professor Wagler.", nextScene: "meet_adam_prof" },
                { text: "Approach Professor Hill.", nextScene: "meet_shoun_prof" }
            ]
        },
        "meet_adam_prof": {
            character: "adam",
            background: "control_room_close", // Close up on one side of the control room
            dialogue: "(Without looking up) ...if I just tweak this gamma a bit... Oh, new professor, right? Adam Wagler, video production. Try not to touch any buttons, please. These things are expensive.",
            choices: [
                { text: "(Laugh) Understood. Impressive setup!", affection: { character: "adam", points: 1 }, nextScene: "shoun_observes" },
                { text: "I think I know how to use a keyboard, Professor.", affection: { character: "adam", points: -1 }, nextScene: "shoun_observes" }
            ]
        },
        "shoun_observes": {
            character: "shoun",
            background: "control_room_close", // Still in the close-up
            dialogue: "(Shoun looks up from his station) Don't mind Professor Wagler, he lives for perfection. Shoun Hill, multimedia production. Welcome.",
            choices: [
                { text: "It's good to meet you, Professor Hill. This room is amazing.", affection: { character: "shoun", points: 1 }, nextScene: "fischer_tour_cafe" },
                { text: "Thanks. (You feel a bit overwhelmed by the tech)", nextScene: "fischer_tour_cafe" }
            ]
        },
        "meet_shoun_prof": {
            character: "shoun",
            background: "control_room_wide",
            dialogue: "(Shoun offers a calm, friendly smile) Welcome to the heart of our media operations. I'm Shoun Hill, multimedia production. It's a pleasure to have you here.",
            choices: [
                { text: "The pleasure's mine. This is an incredible facility!", affection: { character: "shoun", points: 1 }, nextScene: "adam_observes" },
                { text: "It certainly is... a lot of screens.", affection: { character: "shoun", points: 0 }, nextScene: "adam_observes" }
            ]
        },
        "adam_observes": {
            character: "adam",
            background: "control_room_wide",
            dialogue: "(Adam grunts from his station) Just don't bump anything, Professor.",
            choices: [
                { text: "Noted!", affection: { character: "adam", points: 0 }, nextScene: "fischer_tour_cafe" }
            ]
        },
        "fischer_tour_cafe": {
            character: "fischer",
            background: "control_room_wide",
            dialogue: "Alright, let's get some fresh air. Time for the faculty cafe and patio. A great spot for a break.",
            choices: [
                { text: "I could use some air!", nextScene: "cafe_patio_intro" }
            ]
        },
        "cafe_patio_intro": {
            character: "narrator",
            background: "cafe_patio",
            dialogue: "The cafe patio is bright and open. You see Professor Shrader laughing loudly with someone, and Professor Waite meticulously organizing papers at a table.",
            choices: [
                { text: "Go talk to the boisterous Professor Shrader.", nextScene: "meet_shrader_prof" },
                { text: "Approach the focused Professor Waite.", nextScene: "meet_waite_prof" }
            ]
        },
        "meet_shrader_prof": {
            character: "shrader",
            background: "cafe_patio",
            dialogue: "(Shrader turns, a wide grin on his face) Look who it is! Our newest addition! John Shrader, sports media. Welcome to the. best department on campus, Professor. Grab a coffee, the stories are flowing!",
            choices: [
                { text: "Great to meet you, Professor Shrader! You certainly bring the energy!", affection: { character: "shrader", points: 1 }, nextScene: "waite_observes" },
                { text: "Thanks. I'm more of a quiet observer myself.", affection: { character: "shrader", points: -1 }, nextScene: "waite_observes" }
            ]
        },
        "waite_observes": {
            character: "waite",
            background: "cafe_patio",
            dialogue: "(Waite looks up, slightly annoyed by Shrader's volume) Matt Waite, new media. Welcome. Just trying to finalize my syllabus. Deadlines, you know.",
            choices: [
                { text: "I understand completely. Deadlines never end.", affection: { character: "waite", points: 1 }, nextScene: "fischer_tour_dean" },
                { text: "Relax, Professor Waite. It's your first day too, in a way.", affection: { character: "waite", points: -1 }, nextScene: "fischer_tour_dean" }
            ]
        },
        "meet_waite_prof": {
            character: "waite",
            background: "cafe_patio",
            dialogue: "(Waite adjusts his glasses) Ah, Professor [Your Name], I presume. Matt Waite, new media. Welcome. I'm just trying to make sense of the latest university policy update. It's a never-ending battle.",
            choices: [
                { text: "I'm sure I'll learn that quickly. Thanks for the heads up.", affection: { character: "waite", points: 1 }, nextScene: "shrader_observes" },
                { text: "Sounds... exciting.", affection: { character: "waite", points: -1 }, nextScene: "shrader_observes" }
            ]
        },
        "shrader_observes": {
            character: "shrader",
            background: "cafe_patio",
            dialogue: "(Shrader winks) Don't listen to Matt, Professor. It's not *all* paperwork. There's plenty of fun too!",
            choices: [
                { text: "I hope so!", nextScene: "fischer_tour_dean" }
            ]
        },
        "fischer_tour_dean": {
            character: "fischer",
            background: "cafe_patio",
            dialogue: "And finally, a most important stop. Dean Doleman's office. He's eager to meet you.",
            choices: [
                { text: "The Dean? Okay, deep breaths.", nextScene: "dean_office_intro" }
            ]
        },
        "dean_office_intro": {
            character: "narrator",
            background: "dean_office",
            dialogue: "You enter a spacious office with a view of campus. Dean Doleman rises from his desk with a warm smile.",
            choices: [
                { text: "Walk forward and shake his hand.", nextScene: "meet_doleman_dean" }
            ]
        },
        "meet_doleman_dean": {
            character: "doleman",
            background: "dean_office",
            dialogue: "Professor, welcome to the College! I'm Bill Doleman, the Dean. It's a genuine pleasure. We're incredibly excited about what you'll bring to our faculty.",
            choices: [
                { text: "Thank you, Dean Doleman. I'm truly honored and eager to contribute.", affection: { character: "doleman", points: 1 }, nextScene: "dean_farewell" },
                { text: "It's nice to be here. I hope I meet your expectations.", affection: { character: "doleman", points: -1 }, nextScene: "dean_farewell" }
            ]
        },
        "dean_farewell": {
            character: "doleman",
            background: "dean_office",
            dialogue: "I'm sure you will. Fischer, make sure Professor [Your Name] gets settled. I look forward to seeing your impact here.",
            choices: [
                { text: "Thank you, Dean.", nextScene: "fischer_office_final" }
            ]
        },
        "fischer_office_final": {
            character: "fischer",
            background: "dean_office",
            dialogue: "Right then, Professor. That's everyone! Your office is just down the hall. I'll let you get settled. My door's always open if you need anything at all.",
            choices: [
                { text: "Thanks again for the excellent tour, Professor Fischer!", nextScene: "day_1_your_office" }
            ]
        },
        "day_1_your_office": {
            character: "narrator",
            background: "your_office",
            dialogue: "You finally arrive at your own office. A blank canvas, ready for your academic journey. The first day is over, and a whole semester stretches before you.",
            choices: [
                { text: "End of Day 1. (Restart for now)", nextScene: "start" } // Loop back to start for continued testing
            ]
        }
    };

    // --- 5. START THE GAME ---
    showScene('start');
});