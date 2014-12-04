Thwip!
======

**You:** Oh no, it's another task runner..

**Thwip!:** No, that's not it..

**You:** These build tools just keep on coming..

**Thwip!:** No, I'm not really..

**You:** When will this stop?

**Thwip!:** Listen!


## Impress me

Ok here you go, it's nothing fancy really. You just

    thwip

and it spins a web.

**You:** Witty. Get real.

## For real

Thwip! does these:

- run a nodemon to monitor your scripts and restarts your server (nothing new)
- run some classic preprocessors and postprocessors commonly used in web development (nothing new)
  - less, stylus, browserify (for now)
- has build in livereload you can drop in your express app (nothing new, thanks to BrowserSync)
- monitors if your config script changes, reloads the

Thwip! my do these in the future:

- run your gulp/grunt and monitor their respective config files and restart if they changed (that's kinda new)
- run an arbitrary command and optionally watch some file and re-run that command (kinda new too)

What's really new, is that it all comes in one package.
Oh yes, I know the debate monolithic vs. thousand-modules.
I know it very well. So this tool is opinionated and specific.
It's not extensible, there will be no ecosystem, no plugin repository, nothing you can get lost in.
<insert grumpy cat here> (good)

## Licence

MIT run with it