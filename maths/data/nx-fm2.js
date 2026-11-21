/* Full topic notes for Further Mechanics 2 (Edexcel 9FM0). Overrides the short notes in notes.js. */
(function(){
const N={};

N.circ=String.raw`### Angular speed
A particle moving in a circle of radius $r$ turns through an angle $\theta$ (radians). Its **angular speed** is $\omega=\dfrac{d\theta}{dt}$ (rad s$^{-1}$). The linear speed along the circle is
$$v=r\omega$$
(since arc length $s=r\theta$). Convert revolutions per minute: multiply by $\dfrac{2\pi}{60}$.
### Acceleration towards the centre
Even at constant speed, a particle moving in a circle is **accelerating**, because the direction of its velocity keeps changing. The acceleration is towards the centre:
$$a=r\omega^2=\frac{v^2}r$$
By Newton's second law there must be a resultant force towards the centre (the **centripetal force**) of size $mr\omega^2=\dfrac{mv^2}r$. It is provided by real forces: tension, friction, a normal reaction, a component of weight.
### Horizontal circles
Resolve **vertically** (forces balance, no vertical acceleration) and **horizontally towards the centre** ($F=mr\omega^2$).
{{svg1}}
> **Worked example: conical pendulum.** A 0.2 kg particle on a string of length 0.5 m moves in a horizontal circle with the string at $\theta$ to the vertical, at $\omega=6$ rad s$^{-1}$. Radius $r=0.5\sin\theta$.
> Horizontally: $T\sin\theta=0.2(0.5\sin\theta)(36)$, so $T=3.6$ N.
> Vertically: $T\cos\theta=0.2g$, so $\cos\theta=0.544$, $\theta=57.0°$.
**Banked tracks**: on a track banked at angle $\alpha$, the normal reaction has a horizontal component towards the centre. With no friction, $R\cos\alpha=mg$ and $R\sin\alpha=\dfrac{mv^2}r$, so $\tan\alpha=\dfrac{v^2}{rg}$: the speed at which there is no tendency to slip. Faster: friction acts down the slope; slower: up the slope.
**Cars on level roads**: friction provides the centripetal force; maximum speed when $\mu mg=\dfrac{mv^2}r$.
### Vertical circles
In a vertical circle the speed changes (gravity does work), so use **energy conservation** to find the speed at any point, and $F=\dfrac{mv^2}r$ towards the centre for the forces there.
> **Worked example.** A particle on a light string of length $a$ is given speed $u$ at the bottom. At angle $\theta$ from the bottom, energy gives $v^2=u^2-2ga(1-\cos\theta)$. At the top ($\theta=\pi$): $v^2=u^2-4ga$.
> Towards the centre at the top: $T+mg=\dfrac{mv^2}a$.
Conditions for complete circles:
- **String** (can go slack): needs $T\ge0$ at the top, i.e. $v^2\ge ga$ there, so $u^2\ge5ga$.
- **Rod** or a bead on a wire (can push as well as pull): only needs $v\ge0$ at the top, so $u^2\ge4ga$.
- Particle on the **outside of a sphere**: it leaves the surface when the normal reaction becomes zero.
If a string goes slack, the particle then moves as a projectile.
### Watch out
- Find the speed with energy before resolving.
- Resolve **towards the centre**, taking components of weight where needed.`;

N.com1=String.raw`### Centre of mass of particles
For particles $m_1,m_2,\dots$ at positions $(x_i,y_i)$, the centre of mass is
$$\bar x=\frac{\sum m_ix_i}{\sum m_i}\qquad\bar y=\frac{\sum m_iy_i}{\sum m_i}$$
**Why**: the total moment of the separate weights about any axis equals the moment of the total weight acting at the centre of mass.
### Uniform laminas
A **lamina** is a flat object with negligible thickness. If it is uniform, its centre of mass is at its **centre of symmetry**, or on any axis of symmetry. Standard results (from the formula book):
- Rectangle: the centre.
- Triangle: the centroid, $\tfrac23$ of the way along each median from the vertex; coordinates $\left(\tfrac{x_1+x_2+x_3}3,\tfrac{y_1+y_2+y_3}3\right)$.
- Semicircle of radius $r$: on the axis of symmetry at $\dfrac{4r}{3\pi}$ from the straight edge.
- Sector of angle $2\alpha$: $\dfrac{2r\sin\alpha}{3\alpha}$ from the centre.
- Circular arc of angle $2\alpha$: $\dfrac{r\sin\alpha}{\alpha}$ from the centre.
### Composite laminas
Split the shape into standard parts, treat each as a particle of its mass (proportional to area for a uniform lamina) at its own centre of mass, and use the formula. Use a **table**: part, area (mass), $\bar x$, $\bar y$.
For a shape with a **hole** cut out, treat the hole as a **negative** mass.
> **Worked example.** A square of side 4 has a square of side 2 removed from one corner (the corner at the origin). Whole square: area 16, centre $(2,2)$. Hole: area 4, centre $(1,1)$.
> $\bar x=\dfrac{16(2)-4(1)}{12}=\dfrac{28}{12}=2.33$, and by symmetry $\bar y=2.33$.
### Frameworks
A framework made of uniform **rods** (or wire): each rod's mass is proportional to its **length**, acting at its midpoint. Combine as above.
### Laminas in equilibrium
- **Suspended** freely from a point: it hangs with its centre of mass **directly below** the point of suspension. Find the angle the edge makes with the vertical using trigonometry on the line from the suspension point to the centre of mass.
- **On an inclined plane**: a lamina on the point of **toppling** has its centre of mass directly above the lowest corner of its base. It topples if the vertical through the centre of mass falls outside the base. (Compare with sliding: it slides first if $\tan\alpha>\mu$ is reached at a smaller angle.)
### Watch out
- Measure all positions from the same origin and axes.
- Use area as mass only if the lamina is uniform.`;

N.com2=String.raw`### Centres of mass by integration
For a uniform lamina under $y=f(x)$ from $x=a$ to $x=b$, split it into thin vertical strips. Each strip has area $y\,\delta x$, centre at $\left(x,\tfrac y2\right)$. Summing moments and dividing by the total area $A=\int y\,dx$:
$$\bar x=\frac{\int xy\,dx}{\int y\,dx}\qquad\bar y=\frac{\tfrac12\int y^2\,dx}{\int y\,dx}$$
> **Worked example.** The region under $y=x^2$ from $0$ to $2$. $A=\tfrac83$. $\int xy\,dx=\int_0^2x^3dx=4$, so $\bar x=\tfrac32$. $\tfrac12\int y^2dx=\tfrac12\int_0^2x^4dx=\tfrac{16}5$, so $\bar y=\tfrac{16/5}{8/3}=\tfrac65$.
### Solids of revolution
For a uniform solid formed by rotating $y=f(x)$ about the $x$-axis, the centre of mass lies on the axis (by symmetry), and using discs of volume $\pi y^2\delta x$:
$$\bar x=\frac{\int\pi xy^2\,dx}{\int\pi y^2\,dx}=\frac{\int xy^2\,dx}{\int y^2\,dx}$$
Standard results: solid hemisphere $\tfrac38r$ from the flat face; solid cone $\tfrac14h$ from the base; hemispherical shell $\tfrac12r$; conical shell $\tfrac13h$ from the base.
### Composite solids
Combine standard solids exactly like composite laminas, using **volumes** (or masses) and positions along the axis. A hollow is a negative volume. Example: a cylinder with a hemisphere on top: mass of each, position of each centre of mass along the axis, then $\bar x=\dfrac{\sum m\bar x}{\sum m}$.
### Equilibrium of rigid bodies
- **Suspended** from a point: the centre of mass hangs vertically below it.
- **Resting on a plane**: toppling happens when the centre of mass passes outside the base. On the point of toppling, the centre of mass is vertically above the edge of the base.
- **Non-uniform** bodies, or bodies with particles attached: find the combined centre of mass first.
> **Worked example.** A solid cone (height $h$, base radius $r$) rests with its base on a rough plane inclined at $\alpha$. It is about to topple when the vertical through its centre of mass (at $\tfrac h4$ above the base) passes through the lowest point of the base: $\tan\alpha=\dfrac{r}{h/4}=\dfrac{4r}h$.
### Watch out
- In $\bar y$ for a lamina, remember the $\tfrac12$ and the $y^2$.
- For toppling and suspension, a clear diagram with the centre of mass marked is essential.`;

N.kin=String.raw`### Acceleration as a function of time (recap)
When $a$ depends on $t$, integrate: $v=\int a\,dt$, $x=\int v\,dt$, using initial conditions to find constants. This was covered in A level Mechanics; Further Mechanics adds acceleration depending on **displacement** or **velocity**.
### Acceleration as a function of displacement
If $a=f(x)$, use
$$a=v\frac{dv}{dx}$$
**Why**: by the chain rule, $\dfrac{dv}{dt}=\dfrac{dv}{dx}\cdot\dfrac{dx}{dt}=v\dfrac{dv}{dx}$. It is also $\dfrac d{dx}\left(\tfrac12v^2\right)$.
Then separate: $\int v\,dv=\int f(x)\,dx$, giving $\tfrac12v^2$ in terms of $x$.
> **Worked example.** A particle moves with $a=-4x$ and has $v=6$ when $x=0$. $\int v\,dv=\int-4x\,dx$: $\tfrac12v^2=-2x^2+c$; $c=18$. So $v^2=36-4x^2$: the particle is momentarily at rest when $x=\pm3$ (this is simple harmonic motion).
### Acceleration as a function of velocity
If $a=f(v)$:
- To find $v$ in terms of $t$: $\dfrac{dv}{dt}=f(v)$, so $\displaystyle\int\frac{dv}{f(v)}=\int dt$.
- To find $v$ in terms of $x$: $v\dfrac{dv}{dx}=f(v)$, so $\displaystyle\int\frac{v}{f(v)}dv=\int dx$.
> **Worked example.** A boat slows under resistance so that $a=-0.2v$ m s$^{-2}$, starting at 10 m s$^{-1}$.
> Time: $\int\dfrac{dv}v=\int-0.2\,dt\Rightarrow\ln v=-0.2t+\ln10\Rightarrow v=10e^{-0.2t}$.
> Distance: $v\dfrac{dv}{dx}=-0.2v\Rightarrow\dfrac{dv}{dx}=-0.2\Rightarrow v=10-0.2x$. It travels at most 50 m.
### Choosing the right form
- Given $a(t)$, want $v(t)$ or $x(t)$: integrate with respect to $t$.
- Given $a(x)$, or want $v$ in terms of $x$: use $v\dfrac{dv}{dx}$.
- Given $a(v)$: choose $\dfrac{dv}{dt}$ (for time) or $v\dfrac{dv}{dx}$ (for distance).
### Watch out
- Always find constants of integration from the initial conditions.
- Check signs: a resistance acts against the motion, so it is negative when $v$ is positive.`;

N.dyn=String.raw`### Newton's second law with variable forces
When the resultant force depends on time, displacement or velocity, write
$$F=ma=m\frac{dv}{dt}=mv\frac{dv}{dx}$$
and solve the resulting differential equation using the kinematics methods.
> **Worked example: resistance proportional to speed.** A 2 kg particle moves on a smooth horizontal surface against resistance $4v$ N, starting at 5 m s$^{-1}$.
> $2\dfrac{dv}{dt}=-4v\Rightarrow v=5e^{-2t}$. The speed decays exponentially and never quite reaches zero; the total distance is finite: $2v\dfrac{dv}{dx}=-4v\Rightarrow v=5-2x$, so it travels 2.5 m.
### Falling with air resistance
A body falling from rest against resistance $kv$: $m\dfrac{dv}{dt}=mg-kv$. Separating:
$$v=\frac{mg}k\left(1-e^{-kt/m}\right)$$
As $t\to\infty$, $v\to\dfrac{mg}k$, the **terminal speed** (where weight equals resistance). With resistance $kv^2$ the terminal speed is $\sqrt{\dfrac{mg}k}$.
### Forces depending on distance: gravitation
Newton's law of gravitation gives a force $\dfrac{GMm}{x^2}$, inversely proportional to the square of distance from the centre of the Earth. At the surface ($x=R$) it equals $mg$, so $GM=gR^2$ and the force is $\dfrac{mgR^2}{x^2}$.
> Using $v\dfrac{dv}{dx}=-\dfrac{gR^2}{x^2}$ for a particle projected upwards gives $v^2=u^2-2gR^2\left(\dfrac1R-\dfrac1x\right)$. For the particle to escape ($v^2\ge0$ for all $x$), $u^2\ge2gR$: the escape speed.
### Simple harmonic motion
A particle moves with **SHM** if its acceleration is directed towards a fixed point $O$ and proportional to its distance from $O$:
$$\ddot x=-\omega^2x$$
Key results:
- $x=a\sin(\omega t+\alpha)$, amplitude $a$, **period** $T=\dfrac{2\pi}\omega$ (independent of amplitude).
- $v^2=\omega^2(a^2-x^2)$ (from $v\dfrac{dv}{dx}=-\omega^2x$). Maximum speed $a\omega$ at $O$; zero at the ends.
- Maximum acceleration $a\omega^2$ at the ends.
- Choose $x=a\sin\omega t$ if timing starts at $O$, $x=a\cos\omega t$ if it starts at an end.
### SHM with springs and pendulums
- A particle on an elastic string or spring: measure $x$ from the **equilibrium position**, write $F=ma$ with the tension $\dfrac{\lambda(e+x)}l$, and show it reduces to $\ddot x=-\omega^2x$ with $\omega^2=\dfrac\lambda{ml}$.
- A **simple pendulum** of length $l$, for small oscillations: $\ddot\theta\approx-\dfrac gl\theta$, so $T=2\pi\sqrt{\dfrac lg}$.
If a string goes slack during the motion, the SHM only applies while it is taut; after that, the particle moves freely under gravity.
### Watch out
- To **prove** SHM, show the equation has the form $\ddot x=-\omega^2x$ with $x$ measured from the centre of oscillation.
- Time questions: use $x=a\sin\omega t$ or $a\cos\omega t$ and solve; check your calculator is in radians.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.fm2=N;
})();
