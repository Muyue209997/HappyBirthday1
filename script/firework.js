const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
let fireworks = [];

// 设置画布尺寸
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 粒子类
class Particle {
    constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.speed = speed;
        this.size = Math.random() * 3 + 2; // 手机端更清晰
        this.alpha = 1;
        this.gravity = 0.01;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.speed *= 0.97;
        this.alpha -= 0.012;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// 烟花类
class Firework {
    constructor(x, y, particleCount = 40) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.colors = ["#ff5733", "#ffbd33", "#33ff57", "#3357ff", "#f033ff"];

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1.2;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.particles.push(new Particle(this.x, this.y, color, angle, speed));
        }
    }

    update() {
        this.particles.forEach((p, index) => {
            p.update();
            if (p.alpha <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }

    draw() {
        this.particles.forEach(p => p.draw());
    }
}

// 动画循环
function animate() {
    // 不填充任何颜色，让 canvas 背景保持透明
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((fw, index) => {
        fw.update();
        fw.draw();
        if (fw.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

// 电脑点击事件
document.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    fireworks.push(new Firework(x, y, 45)); 
});

// 手机触摸事件
document.addEventListener('touchstart', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    fireworks.push(new Firework(x, y, 45));
});

animate();
