
## Overview
This section of the wiki aims to teach you how to set up your dev environment to run the 8by8 Challenge app locally. In this section, you will learn:
1.  What text editor to use
2.  What packages you need to download to make the project work
3.  How to install the packages through git commands and run the project on your machine.
## Tools
You will need a text editor of some kind. VSCode, Vim/NeoVim, Notepad++, etc. will all work, however, our dev team uses [VSCode](https://code.visualstudio.com/), so the instructions will assume you are using that. You will also need the latest version of [NodeJs]([https://nodejs.org/en/download](https://nodejs.org/en/download)) (V18.0.0 or later)
## Installation instructions
1.  Download and install VSCode.
2.  Download and install NodeJs.
3.  Install NextJS. To do this, you need to fork the repo from our [github page](https://github.com/8by8-org), then clone/download it. Once cloned, navigate into the project repo through the terminal with cd, "filepath-to-your-repo", then run npm install.
4.  Once complete, open the package.json file in your project and add the following:
```{
	"scripts":
		{
			"dev": "next dev",
			"build": "next build",
			"start": "next start",
			"lint": "next lint"
		}
}
```
6.  Next, go install [Docker]([https://www.docker.com/](https://www.docker.com/)). If you have a Windows or Mac, you’ll need to install Docker Desktop. If you have a Linux machine, you can just install Docker CE. We will be using Docker Desktop for this guide.
7.  Go into your code editor of choice and open a new terminal window. In this window, write: $ "Docker Desktop Installer.exe" install.
8.  To run the development environment, open the terminal window, type npm run dev. Then, open your internet browser of choice and in the web address bar, write [https://localhost:3000.](https://localhost:3000)
To fetch changes from the upstream repo, enter git fetch into the terminal.



<!--stackedit_data:
eyJoaXN0b3J5IjpbMTU2NDI0OTk0MywtNTI3Njk2NjMzXX0=
-->