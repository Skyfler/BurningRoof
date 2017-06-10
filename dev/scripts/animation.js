"use strict";

function Animation(draw, duration, callback) {
    var start = performance.now();
    var self = this;

    this._requestId = requestAnimationFrame(function animate(time) {
        // определить, сколько прошло времени с начала анимации
        var timePassed = time - start;

        // возможно небольшое превышение времени, в этом случае зафиксировать конец
        if (timePassed > duration) timePassed = duration;

        // нарисовать состояние анимации в момент timePassed
        draw(timePassed);

        // если время анимации не закончилось - запланировать ещё кадр
        if (timePassed < duration) {
            self._requestId = requestAnimationFrame(animate);
        } else if (callback) {
            callback();
        }
    });
}

Animation.prototype.stop = function() {
    cancelAnimationFrame(this._requestId);
};

module.exports = Animation;
