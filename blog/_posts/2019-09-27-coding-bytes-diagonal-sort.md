---
layout: post
title:  "Coding Bytes: Diagonal Sort"
date:   2019-09-27 11:45:26 -0400
tags: interviews algorithms
---

_The other day I was taking a coding challenge and ran into a problem where I needed to sort along the diagonals of a matrix in ascending order. Upon looking around online after the challenge, I saw there weren't many solutions for approaching the problem, so this is my take on a possible solution._

**Problem Statement:** Given a matrix of arbitrary width and height, sort along each diagonal in ascending order. Consider the diagonals parallel to the main diagonal which follows along `[0][0], [1][1], ..., [n][n]`.

To start with this problem, let's consider two test cases. We will create two matrices `test1` and `test2`.

{% highlight python %}
test1 = [[2, 2], [1, 1]]
test2 = [[9, 3, 1], [4, 5, 6], [8, 2, 5]]
{% endhighlight %}

We want to sort both of these along the diagonals in ascending order. 

{% highlight python %}
test1 = [[2, 2], [1, 1]] # solution: [[1, 2], [1, 2]]
test2 = [[9, 3, 1], [4, 5, 6], [8, 2, 5]] # solution: [[5, 3, 1], [2, 5, 6], [8, 4, 9]]
{% endhighlight %}

To arrive at the first solution, we can start at the top-right corner and iterate through the diagonals until we reach the bottom-left corner. This means we should iterate through in the following order:

{% highlight python %}
[2]
[2, 1]
[1]
{% endhighlight %}

Before we can sort this array, we need to figure out how to iterate through the array by the diagonals. If we want to start at the top-right corner, we could have a loop that counts backwards from that element on the first row. We can view this element as our "starting" element for the diagonal. To get the rest of the diagonal, we can continue to check the element that is `i+1` and `j+1` away from our start point i, j until we are out of bounds. However, this will only get us the first two diagonals of our first example. How can we get the bottom half?

We can apply something similar to what we did for the top half of the matrix, but to the bottom half. We want to have our start elements be along the left-most edge of the matrix, starting from the second row of the matrix (i=1). Then, we can apply the same logic from the top half where we check the diagonal until we are out of range. This can be formalized into code below:

{% highlight python %}
def iterateDiagonally(grid):
	# the top diagonals until the main diag
	for j in range(len(grid[0]) - 1, -1, -1):
		i = 0
		k = j
		diag = [grid[i][k]]
		while i + 1 < len(grid) and k + 1 < len(grid[0]):
			i += 1
			k += 1
			diag.append(grid[i][k])
		print(diag)
	# all the diags under the main diag
	for i in range(1, len(grid)):
		k = i
		j = 0
		diag = [grid[k][j]]
		while k + 1 < len(grid) and j + 1 < len(grid[0]):
			k += 1
			j += 1
			diag.append(grid[k][j])
		print(diag)
{% endhighlight %}

Each for loop finds the current "start" position for the diagonal. In the first loop, we keep `i` at 0 because we want to iterate only along the first row. For the second one, we keep `j` at 0 because we want to iterate only along the first column. In both, we have a list called `diag` that keeps track of the elements we have already seen. We start by inserting our start element into `diag`. The inner while loop then iterates through the diagonal until we move out of the matrix. The above code simply prints the diagonals of a given grid.

The next step is to actually sort each diagonal. We cannot sort all of the diagonal until we've seen all the elements, so we will still build up a diag list. Then, we can use the built-in `sort()` function in Python to sort the elements of the diagonal. However, once we've sorted the elements, we will need to put them back into the matrix the same way we retrieved them since we can't just `append` or `extend` in a special way to re-insert. 

If we build off the iteration above:

{% highlight python %}
def sortDiagonally(grid):
	# the top diagonals until the main diag
        for j in range(len(grid[0]) - 1, -1, -1):
                i = 0
                k = j
                diag = [grid[i][k]]
                while i + 1 < len(grid) and k + 1 < len(grid[0]):
                        i += 1
                        k += 1
                        diag.append(grid[i][k])
                print(diag)
		# now that we have diag, let's sort
		diag.sort() # use the built-in sort function
		i = 0
		k = j
		grid[i][k] = diag[i]
		while i + 1 < len(grid) and k + 1 < len(grid[0]):
			i += 1
			k += 1
			grid[i][k] = diag[i]
        # all the diags under the main diag
        for i in range(1, len(grid)):
                k = i
                j = 0
                diag = [grid[k][j]]
                while k + 1 < len(grid) and j + 1 < len(grid[0]):
                        k += 1
                        j += 1
                        diag.append(grid[k][j])
                print(diag)
		diag.sort()
		k = i
		j = 0
		grid[k][j] = diag[j]
		while k + 1 < len(grid) and j + 1 < len(grid[0]):
			k += 1
			j += 1
			grid[k][j] = diag[j]
	print(grid)
{% endhighlight %}

Now, our above function will sort along the diagonals in ascending order, print out each of the diagonals, and will print the final sorted matrix. While this is not the only solution for this problem, I think it's one of the more straight forward ones. We also don't make an assumption that the width and height are the same, so this code handles the case when the matrix is not square as well.

If you're interested in running the code, you can try it [here][repl]. 

[repl]: https://repl.it/repls/OldlaceLawngreenApi
