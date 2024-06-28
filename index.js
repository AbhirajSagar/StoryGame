class Slide {
    constructor(id, text, media, actions) {
        this.id = id;
        this.text = text;
        this.media = media; // Array of media objects (e.g., { type: 'image', src: 'path/to/image.jpg' })
        this.actions = actions; // Array of Action objects
    }
}

class Action {
    constructor(text, nextSlideId) {
        this.text = text;
        this.nextSlideId = nextSlideId;
    }
}

// Example JSON data (you can replace this with your own JSON data)
const storyJson = `{
    "slides": [
      {
        "id": 1,
        "text": "You wake up in a forest...",
        "media": [{ "type": "image", "src": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2041&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }],
        "actions": [
          { "text": "Look around", "nextSlideId": 2 },
          { "text": "Go back to sleep", "nextSlideId": 3 }
        ]
      },
      {
        "id": 2,
        "text": "You see a path leading to a village...",
        "media": [{ "type": "image", "src": "https://images.unsplash.com/photo-1698745479613-02b6e53c6795?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }],
        "actions": [
          { "text": "Follow the path", "nextSlideId": 4 },
          { "text": "Go back", "nextSlideId": 1 },
          { "text": "Climb a tree", "nextSlideId": 5 }
        ]
      },
      {
        "id": 3,
        "text": "You fall back to sleep...",
        "media": [{ "type": "audio", "src": "snoring.mp3" }],
        "actions": [{ "text": "Wake up again", "nextSlideId": 1 }]
      }
    ]
  }`;

// Parse JSON data
const storyData = JSON.parse(storyJson);

// Initialize slides from JSON data
const slides = storyData.slides.map(slideData => new Slide(
    slideData.id,
    slideData.text,
    slideData.media,
    slideData.actions.map(actionData => new Action(actionData.text, actionData.nextSlideId))
));

function renderSlide(slideId)
{
    const slide = slides.find(s => {return s.id === slideId});
    if (!slide)
    {
        console.error('Slide not found!');
        return;
    }

    //Displaying Story Narration/Text
    document.getElementById('slide-text').textContent = slide.text;


    //Displaying Media -- Audio,Video and Images Supported
    const slideMediaContainer = document.getElementById('slide-media');
    slideMediaContainer.innerHTML = '';
    slide.media.forEach(media => {
        let mediaElement;
        if (media.type === 'image') {
            mediaElement = document.createElement('img');
            mediaElement.style.borderRadius = "8px";
            mediaElement.src = media.src;
        } else if (media.type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.src = media.src;
            mediaElement.controls = true;
        } else if (media.type === 'audio') {
            mediaElement = document.createElement('audio');
            mediaElement.src = media.src;
            mediaElement.controls = true;
        }
        slideMediaContainer.appendChild(mediaElement);
    });

    //Displaying Actions
    const actionsContainer = document.getElementById('actions-container');
    actionsContainer.innerHTML = '';
    slide.actions.forEach((action, index) => {
        const actionButton = document.createElement('button');
        actionButton.textContent = action.text;
        actionButton.onclick = () => handleAction(slide.id, index);
        actionsContainer.appendChild(actionButton);
    });
}

function handleAction(slideId, actionIndex)
{
    const slide = slides.find(s => {return s.id === slideId});
    if (!slide || !slide.actions[actionIndex]) {
        console.error('Invalid action!');
        return;
    }

    const nextSlideId = slide.actions[actionIndex].nextSlideId;
    renderSlide(nextSlideId);
}

renderSlide(1);
