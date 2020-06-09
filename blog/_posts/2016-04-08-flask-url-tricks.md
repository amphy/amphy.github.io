---
layout: post
title:  "Flask URL Tricks"
date:   2016-04-08 15:43:26 -0400
tags: flask python
---

Flask is my go-to framework for any Python web application that I want to built. This is due to its relative ease of setup as well as its file structure being easy to navigate. Once Flask has been set up, it is simple to create a new Flask app and get started.

One of the best things about Flask are the cool tricks you can do with URLs. Generally, a URL route will be created using:

{% highlight python %}
@app.route('/')
def index():
    return 'This is the homepage'
@app.route('/login')
def login():
    return 'Login page'
{% endhighlight %}

This is the basic way to create a URL route. However, these URL routes can also take in parameters which makes them very flexible. For example, if you want a page that shows results for individual user profiles:

{% highlight python %}
@app.route('/users/<username>')
def user():
    #Code for getting data from database based on username
    return username
{% endhighlight %}

This makes it quick and easy to generate links for pages without having to make each one. Instead of having to have separate pages for each user, instead you can have a template for user pages which gets filled with a specific user’s information. It’s easy to redirect to generated pages like this as well using url_for():

{% highlight python %}
return redirect(url_for('user', username='admin'))
{% endhighlight %}

This will redirect someone to a user page for a username called ‘admin’. By combining these two tips, you can create applications that accept information and process it from a form before redirecting the user to a page that displays the information based on what was passed in. There are many applications for this like submitting something to a database and then redirecting to a page that pulls the data from the database to display using a <key> in the generated URL. Hopefully this will help you create more powerful Flask applications that can better utilize built-in URL functions!

_This was crossposted from my blog at [Medium.com][medium-post]_

[medium-post]: https://medium.com/@amphykins/flask-url-tricks-fffd6c583c2a
