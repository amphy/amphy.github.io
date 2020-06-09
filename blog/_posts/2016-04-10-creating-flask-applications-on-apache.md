---
layout: post
title:  "Creating Flask Applications with Apache"
date:   2016-04-10 15:43:26 -0400
tags: apache flask python
---
When I was first learning to create web applications, the world was a very large place. There are so many technologies out there that it can be hard to select just one. At the time, I knew little about web development; my server had an Apache server set up and the only way I had heard of using Apache before was with PHP. However, when working on an API challenge with a friend, whose specialty was Python, we had to find some way to use Python on the web which lead us to the discovery of two popular Python frameworks: Django and Flask. We ended up going with Flask.

However, the setup with Flask was very difficult. Since my webserver was an Apache server (and because I didn't realize Flask itself could serve pages), I had to scour the web to find some way to configure my Flask setup to work with Apache. It was very difficult to find any documentation and ended with me having to work for hours before Flask was finally working with Apache. To help others avoid that, I wanted to create a tutorial that walked you step by step through creating a Flask application and serving it through Apache (if you chose that route). An alternative to this is to serve the Flask application through something like Heroku.

All of these instructions are for a Unix based system.

Installing Flask
------------------
The first step is to install Flask from the [official site][flask-site]. The documentation walks you through installing Flask. The docs recommend that you use a virtual environment when working with Flask on your system. If virtualenv is not installed on your system, you can use

{% highlight ruby %}
$ sudo easy_install virtualenv
$ sudo pip install virtualenv
$ sudo apt-get install python-virtualenv
{% endhighlight %}

One of the three above options should work for installing virtualenv. Once that is done, we then make sure we are in the directory where our project will be and create a virtual environment

{% highlight ruby %}
$ cd myApplication
$ virtualenv venv
{% endhighlight %}

This will create a virtual environment called venv in our myApplication directory. To activate your virtual environment, you can use

{% highlight ruby %}
$ . venv/bin/activate
{% endhighlight %}

The next step is to then install Flask using pip. If you already have pip on your system, you can simply use

{% highlight ruby %}
$ pip install Flask
{% endhighlight %}

Be sure to do this in the directory your application will be (for example, if your application is in a directory called "MyApplication", be sure to install Flask within the "MyApplication" directory). You can find more information about pip [here][pip-site]. After you have successfully installed Flask, it's on to the next step.

Configuring Apache
-------------------

Because Flask can actually serve pages itself, there is some configuration that needs to be done in order to actually use Flask with Apache. In order to use Flask with Apache, you will first need to create a Web Server Gateway Interfact (WSGI) file. More information about WSGI can be found in its [documentation][wsgi-site].

The way I like to set up my projects is to have my main python script, my project folder, and my wsgi file to all have the same name. Within my WSGI file (in this example, called sampleapp.wsgi), I put the following

{% highlight ruby %}
#!/usr/bin/python

import os
os.environ['PYTHON_EGG_CACHE'] = '/var/www/sampleapp/python-eggs'

activate_this = '/var/www/sampleapp/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys
sys.path.insert(0, '/var/www/sampleapp')
sys.path.append('/var/www/sampleapp')

from sampleapp import app as application
{% endhighlight %}

This file must be located within the same directory as the rest of your project.
As a tip, if you are using a factory function to generate applications instead of a singleton, you will want to replace

{% highlight ruby %}
from sampleapp import app as application
{% endhighlight %}

with something like

{% highlight ruby %}
from [folder with __init__.py] import [function that creates apps]
application = [function that creates apps]
{% endhighlight %}

After setting up your WSGI file, the next step is to create a virtual host for Flask applications on your Apache server. Each time you create a new Flask application and want to serve it through Apache, you can edit this virtual host to include the new application.

For Apache, the virtual hosts are usually located in /etc/apache2/sites-available. You will want to create a new file named flask and within that file you'll want the following

{% highlight ruby %}
WSGIPythonPath /var/www/sampleapp/venv/python2.7/site-packages

<VirtualHost *:80>
  ServerName your-domain.com
  ServerAdmin your-email@email.com

  WSGIScriptAlias /sampleapp /var/www/sampleapp/sampleapp.wsgi
  WSGIScriptAlias /sampleapp2 /var/www/sampleapp2/sampleapp2.wsgi

  DocumentRoot /var/www/ #document root for your websites

  <Directory /var/www/sampleapp/>
    Order allow,deny
    Allow from all
  </Directory>

  <Directory /var/www/sampleapp2/>
    Order allow,deny
    Allow from all
  </Directory>

  Alias /static /var/www/sampleapp/static
  Alias /sampleapp2/static /var/www/sampleapp2/static
  <Directory /var/www/sampleapp/static/>
    Order allow,deny
    Allow from all
  </Directory>
  <Directory /var/www/sampleapp2/static/>
    Order allow,deny
    Allow from all
  </Directory>

  ErrorLog ${APACHE_LOG_DIR}/error.log
  LogLevel info
  CustomLog ${APACHE_LOG_DIR}/access.log combined

RewriteEngine on
RewriteCond %{SERVER_NAME} = your-domain-name.com
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [L,QSA,R=permanent]
</VirtualHost>
{% endhighlight %}

Be sure to replace the information with your own information (for example, wherever it requests a domain name).

After creating this file, the virtual host needs to be enabled. You can do this using

{% highlight ruby %}
$ a2ensite flask
$ service apache2 restart
{% endhighlight %}

replacing flask with the name of your virtual host file. This should activate your new virtual host so that when you go to your-domain.com/sampleapp, the default Flask application should show (it displays Hello World). If you've implemented all of the above and a Hello World appears when you go to the proper URL, congratulations! You have successfully served a Flask application through an Apache server.

[flask-site]: http://flask.pocoo.org/
[pip-site]: http://flask.pocoo.org/
[wsgi-site]: https://wsgi.readthedocs.org/en/latest/
