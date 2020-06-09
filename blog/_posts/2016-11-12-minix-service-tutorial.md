---
layout: post
title:  "Creating a Service in MINIX"
date:   2016-11-13 01:43:26 -0400
tags: minix service
---

Creating a service in MINIX can be a hard and arduous process, especially with all the updates to the MINIX source code over time. This tutorial will guide you through creating a new service in MINIX, including implementing system calls to go with it.

The hardest part about creating a new service is knowing which files to change. For this tutorial, we will first create a new service, then incorporate it into the boot sequence. After, we will add system calls to MINIX that make use of our new server. This tutorial is for **MINIX 3.2.1**.

## Creating the new server and incorporating into boot sequence

It is easier to start with something that has already been done than to create an entirely new service from scratch. The first step is to copy a simple server in **/usr/src/servers**. For this tutorial, we will copy ds which is located in **/usr/src/servers/ds**. This can be done using:

{% highlight ruby %}
cp -r ds myserver
{% endhighlight %}

Be sure to replace myserver with whatever you want to call your server. For the purpose of this tutorial, we will just refer to our new server as myserver.

The next step is to edit files within the myserver folder. The first one that needs to be edited is the Makefile (**/usr/src/servers/myserver/Makefile**). You want to change it to make myserver instead of ds.

After editing the Makefile, make any changes you need to main.c and store.c. You might also look in some of the header files. Remove any unnecessary functions from store.c. You might also consider changing the name of store.c to something that fits your server (such as myserver.c).

You also need to edit the Makefile within **/usr/src/servers/Makefile**. Simply add myserver into both lists of servers already being made (there are two places to add it within this file).

Next, we want to add the service to the MINIX system. We do this by adding in a line within **/usr/src/include/minix/com.h**. In the com.h file, look for the following area:

{% highlight ruby %}
/* User-space processes, that is, device drivers, servers, and INIT. */
#define PM_PROC_NR   ((endpoint_t) 0) /* process manager */
#define VFS_PROC_NR  ((endpoint_t) 1) /* file system */
#define RS_PROC_NR   ((endpoint_t) 2)   /* reincarnation server */
#define MEM_PROC_NR  ((endpoint_t) 3)   /* memory driver (RAM disk, null, etc.) */
#define LOG_PROC_NR  ((endpoint_t) 4) /* log device driver */
#define TTY_PROC_NR  ((endpoint_t) 5) /* terminal (TTY) driver */
#define DS_PROC_NR   ((endpoint_t) 6)   /* data store server */
#define MFS_PROC_NR  ((endpoint_t) 7)   /* minix root filesystem */
#define VM_PROC_NR   ((endpoint_t) 8)   /* memory server */
#define PFS_PROC_NR  ((endpoint_t) 9)  /* pipe filesystem */
#define SCHED_PROC_NR ((endpoint_t) 10) /* scheduler */
#define LAST_SPECIAL_PROC_NR  11  /* An untyped version for
                                           computation in macros.*/
#define INIT_PROC_NR ((endpoint_t) LAST_SPECIAL_PROC_NR)  /* init
                                                        -- goes multiuser */
#define NR_BOOT_MODULES (INIT_PROC_NR+1)
{% endhighlight %}

In between the lines for SCHED_PROC_NR and LAST_SPECIAL_PROC_NR, you'll want to add the following:

{% highlight ruby %}
#define MYSERVER_PROC_NR ((endpoint_t) 11) /* my server */
{% endhighlight %}

And change the number for LAST_SPECIAL_PROC_NR from 11 to 12. This assigns a number to the new MINIX server. The next step is to add it to the boot sequence.

To add this to the boot sequence, two files need to be edited: **/usr/src/kernel/table.c** and **/usr/src/servers/rs/table.c**. In **/usr/src/kernel/table.c**, you'll want to add the following line to the bottom of the list:

{% highlight ruby %}
{MYSERVER_PROC_NR, "myserver" },
{% endhighlight %}

The order of the new server is important in this file, so be sure to add it to the end. For **/usr/src/servers/rs/table.c**, you'll want to add the new server twice. For this one, I added it under wherever the PFS_PROC_NR line was in the first two blocks of servers, being sure to copy the format of the lines above it. You do not need to add it to the last set of servers under the "Definition of the boot image dev table" comment.

The final step to adding the new server to the boot sequence is to add it to **/usr/src/etc/system.conf**. This gives the proper permissions to the service. What you want to add is:

{% highlight ruby %}
service myserver
{
  uid 0;
  ipc ALL_SYS;
  system  ALL:
  vm  BASIC;
  io  NONE;
  irq NONE;
  sigmgr    rs;
  scheduler KERNEL;
  priority  4;
  quantum   500;
};
{% endhighlight %}

This block can go anywhere in the file, but I put mine between service vm and service pm. You will want to test that this new server works by compiling the kernel again. While you can normally do this through _make hdboot_ in **/usr/src/releasetools**, you will also need to make clean and then make within **/usr/src/servers/myserver**, **/usr/src/etc/system.conf**, **/usr/src/kernel/table.c**, and **/usr/src/servers/rs/table.c**. If you're still getting errors, check below in the **Possible Errors** section to try and solve it. You'll also want to add the server into **/usr/src/releasetools/Makefile** and then recompile the kernel. What should be added to **/usr/src/releasetools/Makefile** is below:

{% highlight ruby %}
PROGRAMS+= ${PROGROOT}/servers/myserver/myserver
{% endhighlight %}

I added this at the end of the PROGRAMS list after init.

## Incorporating system calls

The next part of this tutorial focuses on incorporating your new server into system calls! This part requires that you've confirmed that you can compile and use your new server that you created above. You'll want to make sure your server has whatever code it needs to implement the function it needs to have (for example, maybe handling semaphores). The first step is to incorporate the system call(s) into the system by adding them to **/usr/src/include/minix/callnr.h**. Find an empty number slot and add in your system call like the others already in the system.

Within **/usr/src/include/minix/com.h**, you might also want to include an area for defining any memory that your server will need for your system calls.

Your system calls can now be added into **/usr/src/include/unistd.h**. In this file, you'll only want the prototypes of the system calls.

The implementation of your system calls should go into **/usr/src/lib/libc/sys-minix/mysystemcalls.c** where mysystemcalls.c is a file containing the implementations of your system calls. After adding in this implementation, be sure to modify Makefile.inc within **/usr/src/include/sys-minix**.

To test your system calls, you will want to create your own user programs that call your system calls. If they compile and run correctly, then you know you've implemented everything correctly!

If you encounter any errors, look below at the **Possible Errors** section.

## Possible Errors

#### Error: kernel panic expecting 12 boot processes found 13

This error means that the kernel is not picking up your changes to its number of boot processes. There are a few things you can try to solve this:

* Make sure that your server is added into all necessary files listed above in part 1

* Try make build inside /usr/src

* Try make clean install in /usr/src/releasetools

#### Error: ipc mask denied SENDREC from number X to the server

This error means the user process does not have the proper permissions to send messages to the new server. To get around this, you will want to comment out a portion of code within **/usr/src/kernel/proc.c**:

{% highlight ruby %}
if (call_nr != RECEIVE)
  {
    if (!may_send_to(caller_ptr, src_dst_p)) {
#if DEBUG_ENABLE_IPC_WARNINGS
      printf(
      "sys_call: ipc mask denied %s from %d to %d\n",
        callname,
        caller_ptr->p_endpoint, src_dst_e);
#endif
      return(ECALLDENIED);  
    }
  }
{% endhighlight %}

If you have some trouble finding it, it is under the comment: 

{% highlight ruby %}
  /* If the call is to send to a process, i.e., for SEND, SENDNB,
   * SENDREC or NOTIFY, verify that the caller is allowed to send to
   * the given destination. 
   */
{% endhighlight %}

#### Error: undefined reference to 'mysystemcall'

This error is caused by a linking error and usually occurs when you are trying to compile a user program using your system call. One way to solve this is to add the necessary file with the system call in it to your compile command. For example, if your file is called mysystemcall.c and is in **/usr/src/lib/libc**:

{% highlight ruby %}
cc -o myprogram myprogram.c /usr/src/lib/libc/mysystemcall.c
{% endhighlight %}

#### Error: Losing Internet on Virtual Machine after recompiling kernel

The only way to solve this that I've found is to create the VM from scratch again. This happens due to the DHCP and Lance services not being made properly when recompiling the kernel. 

#### Other Errors

My advice for other errors is to refer to one of the resources listed below or just start from scratch again. Often times, it will be faster to just start from scratch. Be sure to keep backups of your code. Version control will be your friend.

_This post was created with help from the following resources:_

* [BerkeleyRC Tutorial for MINIX 3.1.6][berkeley]
* [MINIX3 Google Group][minix-group]

[berkeley]: http://berkeleyrc.blogspot.com/2010/05/adding-new-server-to-minix-316-kernel.html
[minix-group]: https://groups.google.com/forum/#!forum/minix3
