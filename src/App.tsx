import { useEffect, useState} from 'react'
import style from './App.module.css'
import {useForm} from "react-hook-form";
import useSound from "use-sound";

interface FormData {
    name: string,
    timer: number
}

function App() {
    const {handleSubmit, reset, register} = useForm<FormData>()
    const [name, setName] = useState<string>('')
    const [seconds, setSeconds] = useState<number>(0)
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [addButtonClicked, setAddButtonClicked] = useState<string>("Старт таймера");
    const [timerHistory, setTimerHistory] = useState<number>(0)
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const [play] = useSound('/cygan.mp3', {
        volume: 0.4,
    })



    const motivationalPhrases = [
        "Каждый день — новый шанс изменить свою жизнь.",
        "Не бойся делать ошибки — бойся ничего не делать.",
        "Сегодня ты можешь быть лучше, чем вчера.",
        "Большие достижения начинаются с маленьких шагов.",
        "Сила не в том, чтобы никогда не падать, а в том, чтобы подниматься каждый раз.",
        "Ты сильнее, чем думаешь.",
        "Начни сейчас — идеальный момент может никогда не наступить.",
        "Делай сегодня то, за что завтра скажешь себе спасибо.",
        "Мечтай, верь, действуй!",
        "Самое трудное — начать. Потом будет легче.",
        "Ты уже ближе к цели, чем был вчера.",
        "Каждый шаг вперёд — это победа.",
        "Не сдавайся. Великие дела требуют времени.",
        "Будь настойчив — даже медленный прогресс лучше, чем его отсутствие.",
        "Никто не сможет остановить того, кто не сдаётся."
    ];

        const inputTimerList: number[] = [
            10,
            20,
            30
        ]


    const randomPhrase = motivationalPhrases.sort(() => Math.random() - Math.random()).find(() => true);


    const addTimer = (value: any) => {
        if(!isActive && value.name.trim()) {
            setIsActive(true)
            setName(value.name.trim())
            setSeconds(value.timer.trim())
            setTimerHistory((prevState) => prevState + 1)
        }
    }

    const deleteTimer = (value: any) => {
        setName('')
        reset()
        setSeconds(value.timer.trim())
        setAddButtonClicked('Старт таймера')
    }

    useEffect(() => {
        let interval : number = 0;
        if (isActive && seconds > 0) {
            interval  = setInterval(() => {
                setSeconds((prevState) => prevState - 1)
            }, 1000)
            setIsDisabled(true)
        }
        else if(seconds === 0){
            setIsActive(false)
            setIsDisabled(false)
            setAddButtonClicked('Попробовать еще раз')
            play()
            setIsVisible(true)
        }
        return () => clearInterval(interval)
    }, [isActive,seconds]);


    const handleClose = () => {
        setIsVisible(false)
    }

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | null = null;

        if (isVisible) {
            intervalId = setInterval(() => {
                handleClose();
            }, 2000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isVisible]);


    return (
        <>
            <div className={style.appHolder}>
                <h2>Нажми кнопку и жди, ты сегодня {timerHistory} раз использовал таймер</h2>
                {seconds !== 0 && name && (
                    <h2>Дружок, {name}, у тебя есть {seconds} секунд</h2>
                )}

                <p>{randomPhrase}</p>
                <form className={style.formStyle} onSubmit={handleSubmit(addTimer)}>
                    <input
                        className={style.formtype}
                        type="text"
                        placeholder="Введите имя"
                        {...register("name", {required: true})}
                    />
                    <div className={style.TimerStyle}>
                        <label> Таймер на</label>
                        <input list='inputTimerList' {...register('timer', {required: true})}/>
                    </div>

                    <datalist id="inputTimerList">
                        {inputTimerList.map((word, index) => (
                            <option key={index} value={word}/>
                        ))}
                    </datalist>
                    <button disabled={isDisabled}>
                        {addButtonClicked}
                    </button>
                </form>

                {name && seconds === 0 && (
                    <div className={style.formHidden}>
                        <p>Ты справился, {name} 💪</p>
                        <button onClick={deleteTimer}>Сброс</button>
                    </div>
                )}
                {isVisible ? <ModalWin isVisible={isVisible} handleClose={handleClose} /> : null}

            </div>
        </>
    )
}
    debugger
const ModalWin:React.FC<{isVisible : boolean, handleClose : any}> = ({isVisible, handleClose}) => {
    return (
        <>
        <div className={`${style.modalwin} ${isVisible ? style.isVisible : ''}`} onClick={handleClose}>
            <div className={style.modalContent}>
                <img src="/big-fing.webp" alt=""/>
            </div>
        </div>
        </>
    )
}

export default App
