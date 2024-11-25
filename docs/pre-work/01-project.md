
# Creating the Project

If you'd like to play along and review and extend your Angular knowledge, make sure you have the prerequisites for Angular installed. [You can see these here.](https://angular.dev/installation#prerequisites)

> [!TIP]
> No need to install the Angular CLI for this lab.

Open your terminal of choice and find a nice spot on your hard drive somewhere to create the project.

We will use the [degit](https://github.com/Rich-Harris/degit) tool with `npx` to scaffold a starter project from [HypertheoryTraining/angular-starter](https://github.com/HypertheoryTraining/angular-starter). 

By running the following command in your terminal, a new directory will be created called `learn-angular` with the most recent version of my Angular project template. This is a basic Angular project like you've created with the `ng new` command in the past, with an additional few things installed. You can read the `README.md` file in the project or [Project Setup](../../guides/angular-setup.md) for more details.

```sh
npx degit hypertheorytraining/angular-starter learn-angular
```

After the project is created, run the following command in your shell to install the node packages and open Visual Studio Code.

```sh
cd learn-angular && npm i && code .
```
The project is set to automatically compile and serve the Angular application in your default web browser.

## Video Walkthrough

<div style="padding:64.71% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1033179644?h=77edf0b966&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="01 - Create Project"></iframe></div>
