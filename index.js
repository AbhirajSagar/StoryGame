let storyData;
let slides;

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


fetch('./Story.json')
  .then(response => response.json())
  .then(story => prepareStory(story))
  .catch(error => console.log(error));

function prepareStory(storyData)
{
    slides = storyData.slides.map(slideData => new Slide(
        slideData.id,
        slideData.text,
        slideData.media,
        slideData.actions.map(actionData => new Action(actionData.text, actionData.nextSlideId))
    ));
    renderSlide(1);
}


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


