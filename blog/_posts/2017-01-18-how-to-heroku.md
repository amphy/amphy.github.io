---
layout: post
title:  "Deploying Your First Heroku Application"
date:   2017-01-18 11:45:26 -0400
tags: heroku deployment
---

Heroku is a really great way to host a simple application on the web for free. It can easily scale if needed by shifting to a
paid plan if you start getting more traffic/need more resources, but also works well if you want to do something small like
[Is It a Cat?][cat]. Something that was hard for me when I first started using Heroku was figuring out how to deploy. 

Requirements:

* Install [Heroku Toolbelt][toolbelt]

As a side note, if you are on a Windows system, be sure to install Heroku Toolbelt with the Git Bash Shell. The Git Bash Shell
 will be needed to run the commands to deploy. This tutorial will assume you are familiar with shell commands to navigate to 
different folders in your particular shell (whether that is the Git Bash Shell or the Terminal). Generally this will just be 
the cd command. 

After installing the Heroku Toolbelt, be sure to login to Heroku (using either the shell/terminal or the Git Bash Shell) with the command

{% highlight ruby %}
$ heroku login
{% endhighlight %}

Now you're ready to start deploying. I'll walk through two ways to deploy to Heroku to help you get started. 

Existing Local Repository on Server/Computer
-----------------------------------

This method is for when you have an existing repository/project on your computer that you're ready to deploy.

The first step is to go to the folder you have your project in. If this folder is not already a Git repository, we will need 
to make it into one. We can do this by going into the folder and typing 

{% highlight ruby %}
$ git init
{% endhighlight %}

This will start the process of creating a Git repository. The next step is to execute the following:

{% highlight ruby %}
$ git add .
$ git commit -am "first commit"
{% endhighlight %}

This will add all the files currently in the directory to the repository (putting them under version control) and then will 
commit the changes to the repository. Now that this directory is a Git repository, we need to create the Heroku app that will 
hold the code we want to host. Sign into Heroku and create a new application. Pay attention to the name given to your app 
(this refers to the part that you would type when going to your Heroku app. For example, isitacat.herokuapp.com means that my 
app is named isitacat). We can then run

{% highlight ruby %}
$ heroku git:remote -a [heroku app name]
$ git push heroku master
{% endhighlight %}

This will create a remote called heroku for your Git repository that you can use to deploy your application. This should push your code to Heroku and you should be able to see it there.

No Existing Folder
------------------

This method is for when you haven't yet created your project, but want to set up the infrastructure to deploy it. It is very 
similar to the first method.

The first step is to create a Git repository. This is done using

{% highlight ruby %}
$ mkdir project
$ cd project
$ git init
$ heroku git:remote -a [heroku app name]
{% endhighlight %}

Keep in mind that [heroku app name] is the first part of the URL you type to access your application. For example, pure-plains-4889.herokuapp.com
 would have an app name of pure-plains-4889. Also note that mkdir is for Linux/UNIX based shells. Use the creation command for 
your particular shell.

Next, create whatever you want in this directory. When you've finished coding some of your application and want to preview what 
you have so far, use

{% highlight ruby %}
$ git add .
$ git commit -am "my great commit message"
$ git push heroku master
{% endhighlight %}

This will deploy your current progress to Heroku. Note that you can commit without pushing to save your current changes in Git, but not change anything on your currently deployed application.

[cat]: https://isitacat.herokuapp.com
[toolbelt]: https://devcenter.heroku.com/articles/heroku-cli
