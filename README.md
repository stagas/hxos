<h1 align="center">ΗΧΟΣ<br>〜<br><small>/ɛ̂ː.kʰos/ → /ˈi.xos/ → /ˈi.xos/</small></h1>

<p align="center">
c-style dsl and runtime for audio dsp
</p>

```c#
kick(sp) = sine(40+150*exp(-t%sp)*exp(-t%sp*10)|lp(350)|tanh($*1.3) $> $*.8+$|reverb.warehouse(.3)

kick(1/4) $> out
```

<p align="center">[wip]</p>
