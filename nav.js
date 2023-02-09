/**
 * 네비게이션 위치 결정
 * @example
 * Label 포지션을 결정합니다.
 * 1. 초기 Label 태그 CSS설정을 position: absolute, width/height 100%, 100%으로 설정하여 부모 태그와 겹치게 제작
 * 2. 회전점을 50%, 0으로 설정하여 중심점에서 회전하게 설정 transform-origin: 50%, 0
 * 3. 부모 X, Y좌표와 자식 라벨들이 회전 후 X, Y 좌표를 구해 상대적 위치를 구합니다.
 * 4. 각 100% 크기로 설정되있는 크기를 원하는 영역의 크기로 변경합니다.
 * 5. 상대적 위치를 top, left 속성에 적용하여 기존 자리잡았던 영역에 위치시킵니다.
 */
const setNavPosition = () => {
    const labels = $('#labels');
    const label = labels[0].children;
    labels[0].style.transform = '';

    const len = label.length;
    const rotate = Math.floor(360 / len);
    const parentXPos = $('#labels')[0].getBoundingClientRect().left;
    const parentYPos = $('#labels')[0].getBoundingClientRect().top;

    for (let i = 0; i < len; i++) {
        const pos = {};

        label[i].style.transform = `rotate(+${rotate * i}deg) translate(0, -50%)`
        label[i].children[0].style.transform = `rotate(${-(rotate * i)}deg)`

        pos.x = label[i].children[0].getBoundingClientRect().left - parentXPos;
        pos.y = label[i].children[0].getBoundingClientRect().top - parentYPos + 25;

        label[i].style.width = '110px';
        label[i].style.height = '100px';
        label[i].style.top = pos.y + 'px';
        label[i].style.left = pos.x + 'px';
    }
}

$(() => {
    $('#navClose').click(() => {
        $('#body').removeClass('nonTouch');
        $('.ring-wrapper').fadeOut(250);
        $('#navClose').hide();
        $('#navToggle').show();
    })
    $('#navToggle').click(() => {
        $('#body').addClass('nonTouch');
        $('.ring-wrapper').fadeIn(500);
        $('#navClose').show();
        $('#navToggle').hide();

        setNavPosition();
        rotationNav('layer-1');
    })
});


/**
 * 페이지에 접근한 디바이스가 모바일 기기인지 확인
 * @returns 모바일 기기의 경우 true, 아니라면 false
 */
function isMobile() {
    const UserAgent = navigator.userAgent;
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        return true;
    } else {
        return false;
    }
}

function rotationNav(id) {
    const isMobileBool = isMobile();
    const el = document.getElementById(id);
    const target = el.children[0].children;
    const elDisplay = el.children[0];


    let offsetRad = null;
    let targetRad = 0;
    let previousRad;

    if (isMobileBool) {
        elDisplay.addEventListener('touchstart', down);
    } else {
        elDisplay.addEventListener('mousedown', down);
    }

    function down(event) {
        offsetRad = getRotation(event);
        previousRad = offsetRad;
        if (isMobileBool) {
            window.addEventListener('touchmove', move, { passive: false });
            window.addEventListener('touchend', up);
        } else {

            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
        }
    }
    function move(event) {
        var newRad = getRotation(event);
        targetRad += (newRad - previousRad);
        previousRad = newRad;
        const rotate = targetRad / Math.PI * 180;
        elDisplay.style.transform = 'rotate(' + rotate + 'deg)';
        for (let i = 0, limit = target.length; i < limit; i++) {
            target[i].children[0].style.transform = 'rotate(' + (-rotate - 360 / limit * i) + 'deg)';
        }
    }
    function up() {
        if (isMobileBool) {
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', up);
        } else {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
        }
    }

    function getRotation(event) {
        var pos = mousePos(event, elDisplay);
        var x = pos.x - elDisplay.clientWidth * 0.5;
        var y = pos.y - elDisplay.clientHeight * 0.5;
        return Math.atan2(y, x);
    }

    function mousePos(event, currentElement) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        do {
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while (currentElement = currentElement.offsetParent)

        if (isMobileBool) {
            canvasX = event.changedTouches[0].pageX - totalOffsetX;
            canvasY = event.changedTouches[0].pageY - totalOffsetY;
        } else {
            canvasX = event.pageX - totalOffsetX;
            canvasY = event.pageY - totalOffsetY;
        }
        return {
            x: canvasX,
            y: canvasY
        };
    }
}
