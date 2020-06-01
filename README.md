# Watch-Along
Watch Along is a synchronized video viewing platform. A platform where users can create a room and watch videos with their friends in sync. Every member of the room can control the video and the platform ensures that everyone is watching the same part of the video at the same time. It's just as if you were watching together on a laptop.
<br/>
The project is made using React.js frontend and an Express.js backend.

### Why I made this?
Back during Covid-19 lockdown, while I was talking to my friend, we realized how fun it was to watch standup comedy videos and laugh together. Unfortunately due to lockdown, this was no longer possible. We could screen share while video conferencing but that was laggy and ruining experience.

### How to use the platform?
The project is hosted on a Heroku free dyno. https://tranquil-stream-89718.herokuapp.com/ <br/>
It is still in the early stages so make sure to report any issues that you face. Also, you are welcome to contribute to the project.

### How to run the project locally?
After cloning the repo and moving into the repo directory, perform below steps:
* Install all npm dependencies `npm install` 
* Move to client folder and install npm dependencies for client-side as well `npm install` 
* Install concurrently to run react.js and server project together `npm i -g concurrently`
* Run the project using `npm run dev`

### Known Issues:
* Video sometimes pauses just after playing
* New joinees will not point to correct video in playlist

### Todo:
* Some extension support to minimise manual work of pasting URL