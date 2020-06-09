---
layout: post
title:  "Using the getsysinfo call in MINIX"
date:   2016-11-29 02:45:26 -0400
tagline: "Tips for using the getsysinfo call in MINIX"
tags: minix getsysinfo
---

While there are a few StackOverflow questions about this, none of them really give
a great tutorial for using the getsysinfo call in MINIX programs.

The first thing to understand is the structure of the getsysinfo call. The 
getsysinfo call takes in three arguments. These are:

{% highlight ruby %}
endpoint_t who //from whom to request info
int what //what info is requested
void * where //where to put it
{% endhighlight %}

Most places include an additional size_t size, but it is not required in the call.

For "who", it's pretty easy enough. In most MINIX programss, you will probably
 want PM to handle this so you would use PM_PROC_NR. I think the other one you 
can use besides PM is DS (you can find this by looking through the source code 
and seeing who actually implements getsysinfo).

The "what" is slightly more complex. If we take a look in /usr/src/servers/pm/misc.c, we can see 
what exactly getsysinfo will support. Your choices for "what" you want are:

* SI_KINFO //gives kernel information
* SI_PROC_ADDR //gives address of PM process table
* SI_PROC_TAB //copies entire process table
* SI_MEM_ALLOC //gives information on holes for mem allocation

The "what" you pick is important because depending on what you pick, the type of 
your storage variable will change. For example, using SI_KINFO means you will have 
a struct kinfo. The associations are below:

* what: SI_KINFO // where: struct kinfo
* what: SI_PROC_ADDR or SI_PROC_TAB // where: struct mproc
* what: SI_MEM_ALLOC // where: struct pm_mem_info

The final piece is knowing what file imports the getsysinfo function. A search through 
the MINIX source code shows the prototype for the getsysinfo function in 
unistd.h on line 166. Thus, we need to include unistd.h in our program for this 
to run successfully. In the past, I've also had to include "/usr/src/servers/is/inc.h" and "/usr/src/servers/pm/mproc.h".

As an example, say I wanted to get information about holes for memory allocation in my program.

{% highlight ruby %}
#include <unistd.h>
#include "/usr/src/servers/is/inc.h"
#include "/usr/src/servers/pm/mproc.h"

int main(int argc, char * argv[]) {
  struct pm_mem_info pmi;
  int i;

  getsysinfo(PM_PROC_NNR, SI_MEM_ALLOC, &pmi);
  
  for(i = 0; i < _NR_HOLES; i++) {
    printf("Hole size: %d", pmi.pmi_holes[i].h_len);
  }
  return 0;
}
{% endhighlight %} 

The above code hasn't been tested, but it follows a program that I wrote that did successfully compile. If you still have trouble compiling because it can't find getsysinfo, you could also try importing <sys/types.h>.

_This post was created with help from the following resources:_

* [MINIX 3.1.1 Source Code][src]
* [Quora: How does function getsysinfo() work in minix?][quora]

[src]: http://fxr.watson.org/fxr/search?v=minix-3-1-1&im=3&string=getsysinfo
[quora]: https://www.quora.com/How-does-function-getsysinfo-work-in-minix
