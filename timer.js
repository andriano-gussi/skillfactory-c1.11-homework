//для удобства сохраняем в переменные необходимые элементы HTML
const countDown = document.querySelector('.countdown');
const inputMinutes = document.querySelector('.minutes');
const separator = document.querySelector('.separator');
const inputSeconds = document.querySelector('.seconds');

const btnPlusSecond = document.querySelector('.plus');
const btnMinusSecond = document.querySelector('.minus');

const btnStart = document.querySelector('.start');
const btnPause = document.querySelector('.pause');
const btnReset = document.querySelector('.reset');

const finalSound = document.querySelector('audio');
const finalMessage = document.querySelector('.message');

let time = 0;
let nIntervId = null;

//если число меньше 10 - приписывает 0 в начале
const numberConverter = (value) => {
  if (value < 10) {
    return `0${value}`;
  }
  return `${value}`;
}

//меняет на экране время в зависимости от time, в котором хранится общее время в секундах
const changeTimerTime = () => {
  
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  inputMinutes.value = numberConverter(minutes);
  inputSeconds.value = numberConverter(seconds);
}

//вспомагательная функция для setInterval()
const pauseTimer = () => {
  if (nIntervId) {
    clearInterval(nIntervId);
    nIntervId = null;
  }
}

//в зависимости от введенных данных в поля "минуты" и "секунды"
//вычисляет общее время 'time' в секундах,
//при этом делает необходимые проверки: чтобы числа не были больше 59ти,
//а также, не являлись строками, если пользователь опечатался
const getTime = () => {
  if (+inputMinutes.value >= 60 || !Number.isInteger(+inputMinutes.value)) {
    inputMinutes.value = '';
  };
  if (+inputSeconds.value >= 60 || !Number.isInteger(+inputSeconds.value)) {
    inputSeconds.value = '';
  };
  time = (+inputMinutes.value) * 60 + (+inputSeconds.value);
}

//при нажатии на 'Enter' в поле "минуты" - переходит в поле "секунды"
inputMinutes.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    getTime();
    inputSeconds.focus();
  };
});

//при нажатии на 'Enter' в поле "секунды" - запускает таймер
inputSeconds.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    getTime();
    btnStart.focus();
  };
});

//увеличивает время на 1 секунду
btnPlusSecond.addEventListener('click', () => {
  pauseTimer();
  getTime();
  if (time >= 3599) {
    time = 0;
  } else {
     time = time + 1;
  };
  changeTimerTime();
});

//уменьшает время на 1 секунду
btnMinusSecond.addEventListener('click', () => {
  pauseTimer();
  getTime();
  if (time <= 0) {
    time = 0;
  } else {
    time = time - 1;
  };
  changeTimerTime();
});

//сбрасывает все необходимые параметры и приводит таймер в изначальное состояние
btnReset.addEventListener('click', () => {
  finalSound.pause();
  finalMessage.innerHTML = '';
  countDown.style.display = 'flex';
  inputMinutes.value = '';
  inputSeconds.value = '';
  pauseTimer();
  time = 0;
});

//запусает таймер
btnStart.addEventListener('click', () => {
  getTime();
  if (!nIntervId && time > 0) {
    nIntervId = setInterval(() => {
      if (time > 0) {
        //если до конца работы таймера осталось несколько секунд - включает звуковой сигнал
        if (time < 7) {
          finalSound.play();
        };
        //включает мигание двоеточия между минутами и секундами
        separator.classList.toggle('separator-disabled');
        time = time - 1;
        //останавливает звуковой сигнал в конце работы таймера
        if (time === 0) {
          finalSound.pause();
        }
        changeTimerTime();
      } else {
        clearInterval(nIntervId);
        nIntervId = null;
        //убирает с экрана поля минут и секунд
        countDown.style.display = 'none';
        //выводит сообщение об окончании работы таймера
        finalMessage.style.display = 'block';
      }
    }, 1000); 
  }
});

//обработка паузы
btnPause.addEventListener('click', () => {
  finalSound.pause();
  pauseTimer();
});
