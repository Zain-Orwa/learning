"""Test scene for the animation setup, and the starting pattern for new scenes.
Render: tools/animate/render.sh tools/animate/example.py Pipeline l"""
from manim import *

# The study page's colors (dark "screen" look)
BG = "#0f1317"
INK = "#e3e7ea"
MUTED = "#9aa4ad"
IP = "#f2c230"  # the yellow instruction pointer


class Pipeline(Scene):
    def construct(self):
        self.camera.background_color = BG
        title = Text("From text to a running program", font_size=36, color=INK).to_edge(UP)
        names = ["test.cpp", "test.obj", "test.exe", "running"]
        boxes = VGroup(*[
            VGroup(RoundedRectangle(corner_radius=0.15, width=2.0, height=1.0, color=INK),
                   Text(n, font_size=26, color=INK))
            for n in names
        ]).arrange(RIGHT, buff=1.6)
        steps = ["compile", "link", "load"]
        arrows = VGroup(*[
            Arrow(boxes[i].get_right(), boxes[i + 1].get_left(), buff=0.1, color=MUTED)
            for i in range(3)
        ])
        labels = VGroup(*[
            Text(s, font_size=22, color=MUTED).next_to(arrows[i], UP, buff=0.15)
            for i, s in enumerate(steps)
        ])

        self.play(Write(title))
        self.play(FadeIn(boxes[0]))
        for i in range(3):
            self.play(GrowArrow(arrows[i]), FadeIn(labels[i]))
            self.play(FadeIn(boxes[i + 1]))
        self.wait(0.5)

        ip = Triangle(color=IP, fill_opacity=1).scale(0.18).next_to(boxes[0], DOWN, buff=0.3)
        self.play(FadeIn(ip))
        for i in range(1, 4):
            self.play(ip.animate.next_to(boxes[i], DOWN, buff=0.3), run_time=0.8)
        self.wait(1)
