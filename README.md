<div align="center">
  <h1>Welcome to SocialSplit 👋💻</h1>
</div>

## About SocialSplit

This is a real-time chat application created with NodeJS, Express, and SOCKET.IO on the backend and React on the frontend.   

Users have the option of joining groups and instant messaging one another. 
## Features

- To be Added
## Tech Stacks

![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)![Nodejs](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![Expressjs](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
## Workflow Setup
### Node

-   #### Node installation on Windows

    Just go on [official Node.js website](https://nodejs.org/) and download the installer.
    Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

-   #### Node installation on Ubuntu

    You can install nodejs and npm easily with apt install, just run the following commands.

        $ sudo apt install nodejs
        $ sudo apt install npm

-   #### Other Operating Systems
    You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

## See SocialSpit in action

Firstly, we need to install all the dependencies in the backend and frontend folders

**For Frontend**   
```
cd frontend
yarn
```   
**For Backend**   
```
cd backend
yarn
```    
> Since npm gives some errors in this project, I recommend using yarn as the package manager.

Secondly, we need add `.env` file in `backend` folder in below format
```
MONGO_URI="<Your_MongoDB_URI>"
FRONTEND_ORIGIN="http://localhost:3000"
JWT_TOKEN="<your_jwt_token>"
```
Thirdly, run in local environment

**For Frontend**   
```
yarn start
```   
**For Backend**   
```
yarn start
``` 
Runs the app in the development mode.\
- Open [http://localhost:3000](http://localhost:3000) to view it in your browser.   
- Backend running at [http://localhost:4000](http://localhost:4000) to test Login and Register API.

The page will reload when you make changes.\
You may also see any lint errors in the console.

**OR**, 

This [video](https://github.com/thisiskushal31/SocialSplit) shows this project live.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/thisiskushal31/SocialSplit/blob/main/LICENSE) file for details.

## About Me

I am a passionate programmer with a keen interest in Full Stack Web Development, Cloud and DevOps Emerging Technologies, and attempting to solve problems with software.

## Let's Connect
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/thisiskushalgupta/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/thisis_kushal)
[![github](https://img.shields.io/badge/github-3d4653?style=for-the-badge&logo=github&logoColor=white)](https://github.com/thisiskushal31/)