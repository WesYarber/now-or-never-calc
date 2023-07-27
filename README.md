# now-or-never-calc
A calculator for the board game Now or Never. This will show you the maximum money yield from selling your combination of resources.

I wrote this in Python and used ChatGPT to convert it to HTML+CSS+Javascript.
A version of it is hosted on my website at [wesyarber.net/now-or-never-calc](https://wesyarber.net/now_or_never_calc.html)
for you to use at your next gaming session. 

It runs very snappy for cumulative resource totals under 4×8 and above that it slows down pretty quickly. I'm able to get
it to run for resource values of cumulative resource totals of 4x10 but it's pretty slow. This shouldn't be relevant though
since you will likely not end up with that many resources of production at the end of the game anyways.
Because of this, I didn't find it necessary to further and improve the algorithm. If you would like to improve the algorithm
beyond what is practical for the game, though, be my guest. Please share your improved code here if you do.

One additional note: I'm aware of at least one card that adds an additional trade or changes the amount of money you get for
a certain trade. If you are using the python version, it is simple to add this functionality manually, but I did not add it to
my web version on account of being a total noob with front end web stuff. If you would like to add this functionality as well,
be my guest.
