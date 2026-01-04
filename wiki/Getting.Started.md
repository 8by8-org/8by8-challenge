# Getting Started

## Overview

This section of the wiki aims to teach you how to set up your dev environment to run the 8by8 Challenge app locally. In this section, you will learn:

- What tools are required to run and modify the project locally.
- How to install these tools as well as project dependencies.
- How to set up your local development environment.
- How to run the project locally.

## Required Tools

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- [Docker](https://www.docker.com/)
- [Python 3](https://www.python.org/)
- A text editor. We like [Visual Studio Code](https://code.visualstudio.com/) (VS Code for short) because of the useful features it offers TypeScript developers, including IntelliSense, type-checking, and easy refactoring.

## Install the Tools

1. Visit the Git [downloads page](https://git-scm.com/downloads) to download and install Git.
2. Visit the Node.js [downloads page](https://nodejs.org/en/download) to download and install the latest version of Node.js.
3. Visit the Docker Desktop [downloads page](https://www.docker.com/products/docker-desktop/) to download and install Docker Desktop. From the dropdown menu, select your operating system to download the appropriate files. For detailed instructions, refer to the Docker Desktop [documentation](https://docs.docker.com/desktop/).

   Note that Windows users must enable [WSL](https://learn.microsoft.com/en-us/windows/wsl/) (v2.1.5 or later) in order to
   start Docker. For more information, see https://docs.docker.com/desktop/setup/install/windows-install/.

4. Visit the Python [downloads page](https://www.python.org/downloads/) to download and install the latest version of Python.
5. Visit the VS Code [downloads page](https://code.visualstudio.com/Download) to download and install VS Code.

## Fork and Clone the Repo

We use Git in conjunction with Github for version control. Each team member is expected to create their own fork of the project on Github. The team member will clone this fork and make changes locally. When they are finished making changes, they will push those changes to their fork. The team member will then make a pull request in order to have their changes reviewed and merged into the upstream repository.

To fork and clone the repository, follow these steps:

1.  If you do not have a Github account, [create one](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github).
2.  While logged in to your Github account, visit https://github.com/8by8-org/8by8-challenge.
3.  Create a fork of this repo. In the top right corner of the page, click "Fork," and follow the prompts to create a fork. For more information, see [Forking a Repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo#forking-a-repository).
4.  While still logged into your Github account, navigate to your newly created fork. You can find this fork at `https://github.com/<your-github-username>/8by8-challenge`.
5.  Clone your forked repo to your computer. For more information, see [Cloning a Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

## Install Dependencies

To install the [NPM](https://www.npmjs.com/) packages necessary to run the project, follow these steps:

1.  After cloning the repository, open the project folder in VS Code.
2.  From VS Code, open a new terminal.
3.  Execute the command `npm install` to download and install the project's dependencies.

## Create a .env File

When the project compiles, certain values are read from environment variables. These values typically consist of secrets, API keys, and other values that must not be committed to source control. If these values are not supplied at compile-time, compilation will fail. Next.js reads these environment variables from `.env` files, so one must be created by following these steps:

1. Open the project folder in VS Code.
2. Find the file named `.env.example` in the root directory of the project and open it.
3. Go to the top menu bar in VS Code and click on the **"File"** menu. From the dropdown, choose **"Save As..."** and enter `.env` as the filename. This will create a copy of the `.env.example` file named `.env`.

   Unlike `.env.example`, this file is included in our `.gitignore`, meaning that it is not tracked by Git and won't be added  
   to source control. This makes it a safe place to include secrets, API keys, etc.

Though we now have a `.env` file for our project to read, it's not very useful yet--it declares a lot of variables, but none of them are assigned any values. We can fix that by following these steps:

1.  Visit the Cloudflare Turnstile Testing page (https://developers.cloudflare.com/turnstile/troubleshooting/testing). In the table that lists **site keys**, copy the value of the site key whose description is "Always Passes". With the project still opened in VS Code, open the `.env` file, find the environment variable named `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and assign it the value you copied.
2.  Also on the Cloudflare Turnstile Testing page, scroll down to the table that lists **secret keys**. Copy the value of the secret key whose description is "Always Passes." In the `.env` file, find the environment variable named `TURNSTILE_SECRET_KEY` and assign it the value you copied.
3.  Start Docker Desktop. Then, from VS Code, open a new terminal and run `npm run supabase-dev:start`. This will download a lot of Docker images and may take some time to execute the first time you run it. Once the command is finished, it will print several values to the console that must be added to the `.env` file. In the output, find the values whose names are listed in the table below and assign them to the corresponding environment variables in the `.env` file.

    | Supabase CLI Output Value Name | Name of Corresponding Environment Variable |
    | ------------------------------ | ------------------------------------------ |
    | API URL                        | NEXT_PUBLIC_SUPABASE_URL                   |
    | anon key                       | NEXT_PUBLIC_SUPABASE_ANON_KEY              |
    | service_role key               | SUPABASE_SERVICE_ROLE_KEY                  |

    Once you have updated the `.env` file, execute the command `npm run supabase-dev:stop`.

4.  From the same terminal you opened in VS Code, execute the command `npm run create-cryptokey`. This will create a cryptographic key and copy its value to the clipboard. In the `.env` file, find the environment variable named `VOTER_REGISTRATION_REPO_ENCRYPTION_KEY` and assign it the value that was copied to the clipboard.
5.  Once again, from the same terminal, execute the command `npm run create-cryptokey`. In the `.env` file, find the environment variable named `CRYPTO_KEY_COOKIES` and assign it the value that was copied to the clipboard.
6.  In the `.env` file, find the environment variable named `APP_ENV` and assign it the value `"development"`.
7.  Finally, with Docker still running, from the same terminal in VS Code, execute the command `npm run kv:start`. Once the command is finished, it will print several values to the console that must be added to the `.env` file. In the output, find the values whose names are listed in the table below and assign them to the corresponding environment variables in the `.env` file.

    | kv:start Output Value Name | Name of Corresponding Environment Variable |
    | -------------------------- | ------------------------------------------ |
    | Rest API Url               | KV_REST_API_URL                            |
    | Rest API Token             | KV_REST_API_TOKEN                          |

    In the same terminal, run the command `npm run kv:stop`.

The other environment variables are optional for local development. Save and close the `.env` file.

### An Important Note about Environment Variables

Environment variables prefixed with `NEXT_PUBLIC_` are exposed to client-side code and should never contain sensitive information. All other environment variables can only be read from server-side code. When adding new environment variables, be sure that sensitive values are assigned to variables **_NOT_** prefixed with `NEXT_PUBLIC_`.

## Running the Project

Congratulations! You are now ready to run the project locally. With Docker running, from the same terminal you opened in VS Code, execute the following commands:

1. `npm run kv:start` to start a local [KV](https://vercel.com/changelog/vercel-kv) instance, which is used for rate limiting.
2. `npm run supabase-dev:start` to start the local Supabase instance.
3. `npm run dev` to start the Next.js application.

Open a web browser and navigate to https://localhost:3000 and you should see the project!

### Cleaning Up

To stop the dev server and clean up other resources, follow the steps below:

1.  Press `ctrl+c` in the terminal in which you executed `npm run dev`.
2.  From this terminal, execute the command `npm run supabase-dev:stop`.
3.  From this terminal, execute the command `npm run kv:stop`.
