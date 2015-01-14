Battle for the Net.
-------------------

* **This is the source code for [battleforthenet.com][1]!**

Don't let the FCC kill net neutrality! The Battle for the Net is a
collaboration between [Fight for the Future][4], [Demand Progress][5] and a
coalition of people and companies who care about keeping the Internet free.
If you have a web site, you can get involved by embedding our FCC Contact
Form. Or, if you have technical skills and time to volunteer, you can help us
win one of the biggest fights for Internet freedom EVER!


### Embed our FCC Contact Form

We've created a form that lets people directly contact the FCC to comment on
their ["14-28 Protecting and Promoting the Open Internet"][2] proposal,
which could actually _destroy_ the Internet by allowing ISPs to extort money
from web sites and startups.

If you want to embed our contact form, use the following code: (See it in
action at **[netneutrality.com][6]!**)

    <iframe src="https://www.battleforthenet.com/embed.html"
        frameborder="0"
        scrolling="no"
        allowTransparency="true"
        style="width: 100%; height: 480px;"></iframe>


### Contributing to our code

We are looking for skilled web developers to help us build the front page on
our [battleforthenet.com][1] site. You can see our code right in this Github
repo by switching to the _gh_pages_ branch, and you can see the work we need
done on our **[Battle for the Net Trello board][3]!**

If you're interested in volunteering, contact <jeff@rubbingalcoholic.com> or
check out https://fightforthefuture.github.io/volunteers for more information
about volunteering.

### A note about Less for CSS

Our styles are written in **[Less][7]**, a pre-processor language that gets
compiled to CSS. All of the styles for the site live in
 
    ./less/css/battleforthenet.less

    => WHICH COMPILES TO =>

    ./css/battleforthenet.css

So to do this, via the command line, you would use the `lessc` command with the
`-x` option (to minify). Example:

    lessc ./less/css/battleforthenet.less -x > ./css/battleforthenet.css

There are also GUI utilities, such as [WinLess][8] that will monitor your less
files for changes and automatically compile to the location of your choice.
This is useful if you make a lot of style edits or don't want to manually
recompile after each one.

Two more things to note about our Less implementation:

1. Only the `less/css/battleforthenet.less` file needs to be edited. The other
   .less files in the project are automatically included during compilation.

2. The compiled, minified `css/battleforthenet.css` **WILL CONFLICT** each time
   a git pull comes down with style changes from another commit. Don't worry.
   Just compile what's in the latest `less/css/battleforthenet.less` file and
   commit the resulting .css file to resolve the conflict.

### Grunt: an easy way of compiling Less to CSS

If you're having trouble compiling the Less code (seems to be an issue for
developers on OS X), consider using Grunt. This will always be the most reliable
way, but requires using terminal. Like the WinLess tool, Grunt can watch for
changes to the battleforthenet.less file and automatically minify and compile.

**Installing Grunt**

1. You must already have Node.js and npm installed.
   [**See this post**][9] for OS X installation instructions.
2. Open a terminal and `cd` to your project directory
3. Enter `npm install` and wait. That's it!

**Using Grunt**

1. Open a terminal and `cd` to your project directory
2. Enter `grunt`
3. Grunt will watch for file changes to battleforthenet.less and auto-compile.



[1]: https://www.battleforthenet.com
[2]: http://www.fcc.gov/comments
[3]: https://trello.com/b/sAJITt1g/battle-for-the-net
[4]: https://www.fightforthefuture.org
[5]: http://www.demandprogress.org
[6]: http://www.netneutrality.com
[7]: http://lesscss.org/
[8]: http://winless.org/
[9]: http://coolestguidesontheplanet.com/installing-node-js-osx-10-9-mavericks/
