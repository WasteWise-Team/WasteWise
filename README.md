<h1 align="center">WasteWise</h1>

<p align="center">
    <img src="assets/logo3.png" width="300" height="300" alt="Profile Picture">
</p>

<p align="center">
    A React Native app that utilizes computer vision and navigation to make proper waste disposal easier.
</p>

## Features

### Item Classification
To dispose of an item, users can take a picture of it and receive instructions on how to dispose of it. Then, the app will redirect them to the proper disposal bin (recycling, e-waste, regular garbage).

<p align="center">
    <img src="/assets/gifs/scanning.gif" alt="Scanning GIF" width="206" height="444">
</p>



### Crowdsource Bin
Users can add a new bin to the map by taking a photo. Using computer vision, the app will make sure it's an actual bin before adding it.

<p align="center">
    <img src="/assets/gifs/addBin.gif" alt="Scanning GIF" width="206" height="444">
</p>



The app prevents users from adding bins that already exist. 

<p align="center">
    <img src="/assets/gifs/binExists.gif" alt="Scanning GIF" width="206" height="444">
</p>

### User Profile + Customization
In the profile screen, users can see their scan history: a list of the items they have scanned. Users can customize their profile picture, bio, and enable dark/light mode. 

<p align="center">
    <img src="/assets/gifs/profilepic.gif" alt="Scanning GIF" width="206" height="444">
</p>




## Technologies
- <b><a href="https://expo.dev/" target="_blank">Expo</a></b> - An open-source platform for making universal native apps for Android, iOS, and the web with JavaScript and React. 
- <b><a href="https://firebase.google.com/" target="_blank">Google Firebase</a></b> - Google's mobile application development platform. Used for user authentication and real-time database storage.
- <b><a href="https://platform.openai.com/docs/overview" target="_blank">OpenAI API</a></b> - OpenAI's API to interact with its large-language models. Used for object classification and computer vision.


## Authors
Sponsor: Mudd Entrepreneurship Studio 2024 

Advisors: 
* [Zachary Dodds](https://www.cs.hmc.edu/~dodds/): Professor of Computer Science at Harvey Mudd College
* [Michael Izbicki](https://izbicki.me/): Assistant Professor of Computer Science

Made with 🌎 by:
* [My Nguyen](https://mynguyen.vercel.app/): Project Manager
* [Terence Chen](https://github.com/TCHEN621130): UI/UX Lead
* [William Koh](https://kohdingjourney.netlify.app/): Lead Developer
